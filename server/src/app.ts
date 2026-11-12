import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';

import { adminPage } from './admin-page.js';
import { auth } from './auth.js';
import { COLLECTION_IDS, COLLECTIONS, type Field } from './content-schema.js';
import { pool, q } from './db.js';
import { resendDomains, sendEmail, sender, templates } from './email.js';

type Env = { Variables: { userId: string } };

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const shortText = z.string().trim().min(1).max(200);
const optionalText = z.string().trim().max(200).default('');

const profileSchema = z
  .object({
    moment: z.enum(['descobri', 'tentante', 'gravida']),
    method: z.enum(['dum', 'dpp', 'ig']),
    dum: day.nullable(),
    igWeeks: z.number().int().min(4).max(41).nullable(),
    igDays: z.number().int().min(0).max(6).nullable(),
    igSetOn: day.nullable(),
    firstPregnancy: z.boolean().nullable(),
    commPref: z.string().max(40).nullable(),
    notifyAppointments: z.boolean(),
    notifyMedications: z.boolean(),
    notifyDiary: z.boolean(),
    showWeight: z.boolean(),
    companionSharing: z.boolean(),
    maternityName: z.string().trim().max(120).nullable(),
    maternityPhone: z.string().trim().max(30).nullable(),
    healthConsent: z.boolean(),
  })
  .partial();

const COLUMNS: Record<string, string> = {
  moment: 'moment', method: 'method', dum: 'dum', igWeeks: 'ig_weeks', igDays: 'ig_days', igSetOn: 'ig_set_on',
  firstPregnancy: 'first_pregnancy', commPref: 'comm_pref', notifyAppointments: 'notify_appointments',
  notifyMedications: 'notify_medications', notifyDiary: 'notify_diary', showWeight: 'show_weight',
  companionSharing: 'companion_sharing', maternityName: 'maternity_name', maternityPhone: 'maternity_phone',
};

async function loadState(userId: string) {
  const [user] = await q(`select name, email, "emailVerified" as "emailVerified" from "user" where id = $1`, [userId]);
  const [profile, diary, symptoms, appointments, questions, medications, doses, weights, checklist, plan, saved] = await Promise.all([
    q(`select moment, method, dum, ig_weeks as "igWeeks", ig_days as "igDays", ig_set_on as "igSetOn", first_pregnancy as "firstPregnancy", comm_pref as "commPref",
        notify_appointments as "notifyAppointments", notify_medications as "notifyMedications", notify_diary as "notifyDiary", show_weight as "showWeight",
        companion_sharing as "companionSharing", maternity_name as "maternityName", maternity_phone as "maternityPhone", health_consent_at as "healthConsentAt"
        from profiles where user_id = $1`, [userId]),
    q(`select day, feel, humor, sleep, note from diary_entries where user_id = $1 order by day desc limit 400`, [userId]),
    q(`select id, day, symptom, intensity, duration from symptom_logs where user_id = $1 order by day desc limit 1000`, [userId]),
    q(`select id, starts_at as "startsAt", title, who, place from appointments where user_id = $1 order by starts_at`, [userId]),
    q(`select id, text from questions where user_id = $1 order by created_at`, [userId]),
    q(`select id, name, dose, time_of_day as "timeOfDay" from medications where user_id = $1 order by time_of_day`, [userId]),
    q(`select d.medication_id as "medicationId", d.day from medication_doses d join medications m on m.id = d.medication_id where m.user_id = $1 and d.day >= current_date - 60`, [userId]),
    q(`select day, kg from weights where user_id = $1 order by day`, [userId]),
    q(`select list, label, category, custom, done from checklist_items where user_id = $1`, [userId]),
    q(`select topic, option from birth_plan_choices where user_id = $1`, [userId]),
    q(`select article_id as "articleId" from saved_articles where user_id = $1`, [userId]),
  ]);
  const [kicks, contractions] = await Promise.all([
    q(`select id, started_at as "startedAt", ended_at as "endedAt", kicks from kick_sessions where user_id = $1 order by started_at desc limit 60`, [userId]),
    q(`select id, started_at as "startedAt", ended_at as "endedAt" from contractions where user_id = $1 order by started_at desc limit 200`, [userId]),
  ]);
  return { user, profile: profile[0] ?? null, diary, symptoms, appointments, questions, medications, doses, weights, checklist, plan, saved, kicks, contractions };
}

const app = new Hono<Env>();

app.use('/api/*', cors({ origin: ['http://localhost:8097', 'http://localhost:8081'], credentials: true, allowHeaders: ['Content-Type', 'Authorization', 'Cookie', 'expo-origin'], allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));

app.get('/health', async (c) => {
  await q('select 1');
  return c.json({ ok: true });
});

app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw));

const data = new Hono<Env>();

data.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: 'nao_autenticado' }, 401);
  c.set('userId', session.user.id);
  await next();
});

data.onError((err, c) => {
  if (err instanceof z.ZodError || err instanceof InvalidData) return c.json({ error: 'dados_invalidos' }, 400);
  console.error(err);
  return c.json({ error: 'erro_interno' }, 500);
});

data.get('/state', async (c) => c.json(await loadState(c.get('userId'))));

// Cópia dos dados (LGPD): a própria pessoa baixa tudo o que está guardado.
data.get('/export', async (c) => c.json({ exportedAt: new Date().toISOString(), ...(await loadState(c.get('userId'))) }));

data.put('/profile', async (c) => {
  const { healthConsent, ...fields } = profileSchema.parse(await c.req.json());
  const entries = Object.entries(fields).filter(([, v]) => v !== undefined);
  const cols = entries.map(([k]) => COLUMNS[k]);
  const vals = entries.map(([, v]) => v);
  if (healthConsent) {
    cols.push('health_consent_at');
    vals.push(new Date().toISOString());
  }
  const insertCols = ['user_id', ...cols];
  const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(', ');
  const updates = [...cols.map((col) => `${col} = excluded.${col}`), 'updated_at = now()'].join(', ');
  await q(`insert into profiles (${insertCols.join(', ')}) values (${placeholders}) on conflict (user_id) do update set ${updates}`, [c.get('userId'), ...vals]);
  return c.json({ ok: true });
});

data.put('/diary/:day', async (c) => {
  const d = day.parse(c.req.param('day'));
  const b = z.object({ feel: z.number().int().min(0).max(4), humor: z.array(z.string().max(60)).max(20), sleep: z.string().max(30).nullable(), note: z.string().max(5000) }).parse(await c.req.json());
  await q(
    `insert into diary_entries (user_id, day, feel, humor, sleep, note) values ($1, $2, $3, $4, $5, $6)
     on conflict (user_id, day) do update set feel = excluded.feel, humor = excluded.humor, sleep = excluded.sleep, note = excluded.note, updated_at = now()`,
    [c.get('userId'), d, b.feel, b.humor, b.sleep, b.note],
  );
  return c.json({ ok: true });
});

data.post('/symptoms', async (c) => {
  const b = z.object({ day, symptom: shortText, intensity: shortText, duration: shortText }).parse(await c.req.json());
  const [row] = await q(
    `insert into symptom_logs (user_id, day, symptom, intensity, duration) values ($1, $2, $3, $4, $5)
     on conflict (user_id, day, symptom) do update set intensity = excluded.intensity, duration = excluded.duration returning id`,
    [c.get('userId'), b.day, b.symptom, b.intensity, b.duration],
  );
  return c.json(row);
});

data.post('/appointments', async (c) => {
  const b = z.object({ startsAt: z.string().datetime(), title: shortText, who: optionalText, place: optionalText }).parse(await c.req.json());
  const [row] = await q(`insert into appointments (user_id, starts_at, title, who, place) values ($1, $2, $3, $4, $5) returning id`, [c.get('userId'), b.startsAt, b.title, b.who, b.place]);
  return c.json(row);
});

data.delete('/appointments/:id', async (c) => {
  await q(`delete from appointments where id = $1 and user_id = $2`, [z.string().uuid().parse(c.req.param('id')), c.get('userId')]);
  return c.json({ ok: true });
});

data.post('/questions', async (c) => {
  const b = z.object({ text: z.string().trim().min(1).max(500) }).parse(await c.req.json());
  const [row] = await q(`insert into questions (user_id, text) values ($1, $2) returning id`, [c.get('userId'), b.text]);
  return c.json(row);
});

data.delete('/questions/:id', async (c) => {
  await q(`delete from questions where id = $1 and user_id = $2`, [z.string().uuid().parse(c.req.param('id')), c.get('userId')]);
  return c.json({ ok: true });
});

data.post('/medications', async (c) => {
  const b = z.object({ name: shortText, dose: optionalText, timeOfDay: z.string().regex(/^\d{2}:\d{2}$/) }).parse(await c.req.json());
  const [row] = await q(`insert into medications (user_id, name, dose, time_of_day) values ($1, $2, $3, $4) returning id`, [c.get('userId'), b.name, b.dose, b.timeOfDay]);
  return c.json(row);
});

data.delete('/medications/:id', async (c) => {
  await q(`delete from medications where id = $1 and user_id = $2`, [z.string().uuid().parse(c.req.param('id')), c.get('userId')]);
  return c.json({ ok: true });
});

data.put('/medications/:id/doses/:day', async (c) => {
  const id = z.string().uuid().parse(c.req.param('id'));
  const d = day.parse(c.req.param('day'));
  const { taken } = z.object({ taken: z.boolean() }).parse(await c.req.json());
  const owned = await q(`select 1 from medications where id = $1 and user_id = $2`, [id, c.get('userId')]);
  if (!owned.length) return c.json({ error: 'nao_encontrado' }, 404);
  if (taken) await q(`insert into medication_doses (medication_id, day) values ($1, $2) on conflict do nothing`, [id, d]);
  else await q(`delete from medication_doses where medication_id = $1 and day = $2`, [id, d]);
  return c.json({ ok: true });
});

data.put('/weights/:day', async (c) => {
  const d = day.parse(c.req.param('day'));
  const { kg } = z.object({ kg: z.number().gt(20).lt(300) }).parse(await c.req.json());
  await q(`insert into weights (user_id, day, kg) values ($1, $2, $3) on conflict (user_id, day) do update set kg = excluded.kg`, [c.get('userId'), d, kg]);
  return c.json({ ok: true });
});

data.delete('/weights/:day', async (c) => {
  await q(`delete from weights where user_id = $1 and day = $2`, [c.get('userId'), day.parse(c.req.param('day'))]);
  return c.json({ ok: true });
});

data.put('/checklist', async (c) => {
  const b = z.object({ list: z.enum(['enxoval', 'mala', 'nascimento']), label: shortText, category: z.string().max(60).nullable(), custom: z.boolean(), done: z.boolean() }).parse(await c.req.json());
  await q(
    `insert into checklist_items (user_id, list, label, category, custom, done) values ($1, $2, $3, $4, $5, $6)
     on conflict (user_id, list, label) do update set done = excluded.done`,
    [c.get('userId'), b.list, b.label, b.category, b.custom, b.done],
  );
  return c.json({ ok: true });
});

data.put('/birth-plan', async (c) => {
  const b = z.object({ topic: shortText, options: z.array(shortText).max(20) }).parse(await c.req.json());
  const client = await pool.connect();
  try {
    await client.query('begin');
    await client.query(`delete from birth_plan_choices where user_id = $1 and topic = $2`, [c.get('userId'), b.topic]);
    for (const option of b.options) await client.query(`insert into birth_plan_choices (user_id, topic, option) values ($1, $2, $3)`, [c.get('userId'), b.topic, option]);
    await client.query('commit');
  } catch (err) {
    await client.query('rollback');
    throw err;
  } finally {
    client.release();
  }
  return c.json({ ok: true });
});

data.put('/saved/:article', async (c) => {
  const article = shortText.parse(c.req.param('article'));
  const { saved } = z.object({ saved: z.boolean() }).parse(await c.req.json());
  if (saved) await q(`insert into saved_articles (user_id, article_id) values ($1, $2) on conflict do nothing`, [c.get('userId'), article]);
  else await q(`delete from saved_articles where user_id = $1 and article_id = $2`, [c.get('userId'), article]);
  return c.json({ ok: true });
});

data.post('/kicks', async (c) => {
  const b = z.object({ startedAt: z.string().datetime(), endedAt: z.string().datetime(), kicks: z.number().int().min(0).max(500) }).parse(await c.req.json());
  const [row] = await q(`insert into kick_sessions (user_id, started_at, ended_at, kicks) values ($1, $2, $3, $4) returning id`, [c.get('userId'), b.startedAt, b.endedAt, b.kicks]);
  return c.json(row);
});

data.delete('/kicks/:id', async (c) => {
  await q(`delete from kick_sessions where id = $1 and user_id = $2`, [z.string().uuid().parse(c.req.param('id')), c.get('userId')]);
  return c.json({ ok: true });
});

data.post('/contractions', async (c) => {
  const b = z.object({ startedAt: z.string().datetime(), endedAt: z.string().datetime() }).parse(await c.req.json());
  const [row] = await q(`insert into contractions (user_id, started_at, ended_at) values ($1, $2, $3) returning id`, [c.get('userId'), b.startedAt, b.endedAt]);
  return c.json(row);
});

data.delete('/contractions', async (c) => {
  await q(`delete from contractions where user_id = $1`, [c.get('userId')]);
  return c.json({ ok: true });
});

app.route('/api/data', data);

// Conteúdo público do app. Cache curto para que edições da administração apareçam em minutos.
app.get('/api/content', async (c) => {
  const rows = await q<{ collection: string; key: string; position: number; data: Record<string, unknown> }>(`select collection, key, position, data from content_items order by collection, position, key`);
  const out: Record<string, { key: string; data: Record<string, unknown> }[]> = {};
  for (const r of rows) (out[r.collection] ??= []).push({ key: r.key, data: r.data });
  c.header('Cache-Control', 'public, max-age=60, s-maxage=60');
  return c.json(out);
});

class InvalidData extends Error {}

function cleanItem(fields: Field[], raw: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const v = raw[f.name];
    if (f.type === 'number') {
      const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() ? Number(v.replace(',', '.')) : null;
      if (n !== null && !Number.isFinite(n)) throw new InvalidData();
      if (n !== null) out[f.name] = n;
    } else if (f.type === 'list') {
      const list = (Array.isArray(v) ? v : typeof v === 'string' ? v.split('\n') : []).map((x) => String(x).trim()).filter(Boolean);
      if (list.length) out[f.name] = list;
    } else if (f.type === 'select') {
      if (typeof v === 'string' && v.trim()) {
        if (!f.options?.includes(v.trim())) throw new InvalidData();
        out[f.name] = v.trim();
      }
    } else if (typeof v === 'string' && v.trim()) {
      out[f.name] = v.trim().slice(0, 20000);
    }
    if (f.required && out[f.name] === undefined) throw new InvalidData();
  }
  return out;
}

const admin = new Hono<Env>();

admin.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: 'nao_autenticado' }, 401);
  const rows = await q(`select 1 from admins where user_id = $1`, [session.user.id]);
  if (!rows.length) return c.json({ error: 'sem_permissao' }, 403);
  c.set('userId', session.user.id);
  await next();
});

admin.onError((err, c) => {
  if (err instanceof z.ZodError || err instanceof InvalidData) return c.json({ error: 'dados_invalidos' }, 400);
  console.error(err);
  return c.json({ error: 'erro_interno' }, 500);
});

admin.get('/schema', (c) => c.json(COLLECTIONS));

admin.get('/items/:collection', async (c) => {
  const col = c.req.param('collection');
  if (!COLLECTION_IDS.has(col)) return c.json({ error: 'colecao_invalida' }, 404);
  return c.json(await q(`select key, position, data, updated_at as "updatedAt" from content_items where collection = $1 order by position, key`, [col]));
});

admin.put('/items/:collection/:key', async (c) => {
  const def = COLLECTIONS.find((x) => x.id === c.req.param('collection'));
  if (!def) return c.json({ error: 'colecao_invalida' }, 404);
  const key = z.string().trim().min(1).max(80).regex(/^[\w.-]+$/).parse(c.req.param('key'));
  const b = z.object({ data: z.record(z.string(), z.unknown()), position: z.number().int().optional() }).parse(await c.req.json());
  const data = cleanItem(def.fields, b.data);
  await q(
    `insert into content_items (collection, key, position, data, updated_by) values ($1, $2, $3, $4, $5)
     on conflict (collection, key) do update set data = excluded.data, position = coalesce($6, content_items.position), updated_at = now(), updated_by = excluded.updated_by`,
    [def.id, key, b.position ?? 0, JSON.stringify(data), c.get('userId'), b.position ?? null],
  );
  return c.json({ ok: true });
});

admin.delete('/items/:collection/:key', async (c) => {
  await q(`delete from content_items where collection = $1 and key = $2`, [c.req.param('collection'), c.req.param('key')]);
  return c.json({ ok: true });
});

// Visão geral sem dados de saúde individuais: só contagens e lista de contas.
admin.get('/stats', async (c) => {
  const [r] = await q(`select
      (select count(*) from "user")::int as users,
      (select count(*) from "user" where "createdAt" > now() - interval '7 days')::int as "usersWeek",
      (select count(distinct "userId") from session where "updatedAt" > now() - interval '7 days')::int as "activeWeek",
      (select count(*) from diary_entries)::int as diary,
      (select count(*) from appointments)::int as appointments,
      (select count(*) from kick_sessions)::int as kicks,
      (select count(*) from content_items)::int as content`);
  return c.json(r);
});

admin.get('/users', async (c) => {
  return c.json(await q(`select u.id, u.name, u.email, u."emailVerified" as "emailVerified", u."createdAt" as "createdAt", (a.user_id is not null) as admin
    from "user" u left join admins a on a.user_id = u.id order by u."createdAt" desc limit 500`));
});

admin.put('/users/:id/admin', async (c) => {
  const { admin: makeAdmin } = z.object({ admin: z.boolean() }).parse(await c.req.json());
  const id = c.req.param('id');
  if (!makeAdmin && id === c.get('userId')) return c.json({ error: 'nao_pode_remover_a_si_mesmo' }, 400);
  if (makeAdmin) await q(`insert into admins (user_id) values ($1) on conflict do nothing`, [id]);
  else await q(`delete from admins where user_id = $1`, [id]);
  return c.json({ ok: true });
});

// Cria uma conta já com acesso à administração (e-mail marcado como confirmado).
admin.post('/users', async (c) => {
  const b = z.object({ name: z.string().trim().min(1).max(120), email: z.string().trim().toLowerCase().email(), password: z.string().min(8).max(128) }).parse(await c.req.json());
  const exists = await q<{ id: string }>(`select id from "user" where lower(email) = $1`, [b.email]);
  let id = exists[0]?.id;
  if (!id) {
    const res = await auth.api.signUpEmail({ body: { name: b.name, email: b.email, password: b.password } });
    id = res.user.id;
    await q(`update "user" set "emailVerified" = true where id = $1`, [id]);
  }
  await q(`insert into admins (user_id) values ($1) on conflict do nothing`, [id]);
  return c.json({ ok: true, existed: !!exists.length });
});

admin.get('/email', async (c) => {
  const configured = !!process.env.RESEND_API_KEY;
  return c.json({ configured, from: configured ? await sender() : null, domains: configured ? await resendDomains() : null });
});

// Envia um e-mail de teste para quem está usando a administração.
admin.post('/email/test', async (c) => {
  const [u] = await q<{ email: string; name: string }>(`select email, name from "user" where id = $1`, [c.get('userId')]);
  const ok = await sendEmail(u.email, templates.test(u.name));
  return c.json({ ok, to: u.email }, ok ? 200 : 502);
});

admin.get('/me', (c) => c.json({ ok: true }));

app.route('/api/admin', admin);

// Os sub-roteadores montados com app.route repassam os erros para cá.
app.onError((err, c) => {
  if (err instanceof z.ZodError || err instanceof InvalidData) return c.json({ error: 'dados_invalidos' }, 400);
  console.error(err);
  return c.json({ error: 'erro_interno' }, 500);
});

app.get('/admin', (c) => c.html(adminPage));

// Lembrete enviado um dia antes. O Worker chama esta rota uma vez por dia (cron do wrangler.toml).
app.get('/cron/lembretes', async (c) => {
  if (!process.env.CRON_SECRET || c.req.header('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return c.json({ error: 'nao_autorizado' }, 401);
  const due = await q<{ id: string; email: string; name: string; when_label: string }>(
    `select a.id, u.email, u.name, to_char(a.starts_at at time zone 'America/Sao_Paulo', 'DD/MM "às" HH24"h"MI') as when_label
     from appointments a join "user" u on u.id = a.user_id join profiles p on p.user_id = a.user_id
     where a.reminded_at is null and p.notify_appointments
       and (a.starts_at at time zone 'America/Sao_Paulo')::date = ((now() at time zone 'America/Sao_Paulo')::date + 1)`,
  );
  let sent = 0;
  for (const row of due) {
    if (await sendEmail(row.email, templates.appointmentReminder(row.name, row.when_label))) {
      await q(`update appointments set reminded_at = now() where id = $1`, [row.id]);
      sent++;
    }
  }
  return c.json({ due: due.length, sent });
});

const page = (title: string, body: string) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;background:#F4ECE3;color:#2A2522;font:16px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif"><main style="max-width:420px;margin:0 auto;padding:48px 20px"><div style="font:24px Georgia,serif;margin-bottom:22px">Bornly</div><div style="background:#FBF7F2;border-radius:24px;padding:26px">${body}</div></main></body></html>`;

app.get('/', (c) => c.html(page('Bornly', '<h1 style="font:400 24px Georgia,serif;margin:0 0 10px">Bornly</h1><p style="margin:0">Este é o servidor do app Bornly. Baixe o app para acompanhar sua gravidez.</p>')));

app.get('/email-confirmado', (c) => c.html(page('E-mail confirmado', '<h1 style="font:400 24px Georgia,serif;margin:0 0 10px">E-mail confirmado</h1><p style="margin:0">Pronto. Você já pode voltar para o app.</p>')));

app.get('/redefinir-senha', (c) =>
  c.html(
    page(
      'Redefinir senha',
      `<h1 style="font:400 24px Georgia,serif;margin:0 0 14px">Criar nova senha</h1>
<form id="f"><input id="p" type="password" minlength="8" required placeholder="Nova senha (mínimo 8 caracteres)" autocomplete="new-password" style="box-sizing:border-box;width:100%;height:52px;border:1.5px solid #E4D7CA;border-radius:16px;padding:0 16px;font-size:16px;background:#fff">
<button style="margin-top:14px;width:100%;height:52px;border:0;border-radius:999px;background:#2A2522;color:#F4ECE3;font-size:15px;font-weight:600">Salvar senha</button></form><p id="m" style="margin:14px 0 0"></p>
<script>const t=new URLSearchParams(location.search).get('token');const m=document.getElementById('m');if(!t){m.textContent='Link inválido. Peça um novo no app.';}
document.getElementById('f').onsubmit=async e=>{e.preventDefault();const r=await fetch('/api/auth/reset-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({newPassword:document.getElementById('p').value,token:t})});m.textContent=r.ok?'Senha alterada. Você já pode entrar no app.':'Este link expirou. Peça um novo no app.';if(r.ok)e.target.remove();};</script>`,
    ),
  ),
);

export default app;
