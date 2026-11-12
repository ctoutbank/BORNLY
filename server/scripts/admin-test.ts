// Testa a administração de ponta a ponta com contas descartáveis (apagadas no fim).
// Uso: TEST_BASE=http://localhost:8787 npx tsx --env-file=.env.local scripts/admin-test.ts
//      (o DATABASE_URL do arquivo de env precisa ser o mesmo banco do servidor testado)
import { COLLECTIONS } from '../src/content-schema.js';
import { pool } from '../src/db.js';

const BASE = process.env.TEST_BASE ?? 'http://localhost:8787';
const ORIGIN = 'http://localhost:8097';
let failures = 0;
const check = (name: string, ok: boolean, extra?: unknown) => {
  console.log(`${ok ? 'ok  ' : 'FALHA'} ${name}${ok ? '' : ' ' + JSON.stringify(extra)}`);
  if (!ok) failures++;
};

function client() {
  let cookie = '';
  return async (path: string, method = 'GET', body?: unknown) => {
    const res = await fetch(BASE + path, { method, headers: { 'Content-Type': 'application/json', Origin: ORIGIN, Cookie: cookie }, body: body === undefined ? undefined : JSON.stringify(body) });
    const set = res.headers.getSetCookie();
    if (set.length) cookie = set.map((c) => c.split(';')[0]).join('; ');
    const text = await res.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch {}
    return { status: res.status, json, text };
  };
}

const stamp = Date.now();
const password = `Adm-${stamp}-senha`;
const emailA = `delivered+bornly-adm-a-${stamp}@resend.dev`;
const emailB = `delivered+bornly-adm-b-${stamp}@resend.dev`;
const emailC = `delivered+bornly-adm-c-${stamp}@resend.dev`;
const a = client();
const b = client();
const anon = client();
const created: string[] = [emailA, emailB, emailC];

try {
  check('página /admin abre', (await anon('/admin')).status === 200);
  check('sem login: 401', (await anon('/api/admin/schema')).status === 401);

  check('cadastro A', (await a('/api/auth/sign-up/email', 'POST', { name: 'Adm A', email: emailA, password })).status === 200);
  check('cadastro B', (await b('/api/auth/sign-up/email', 'POST', { name: 'Adm B', email: emailB, password })).status === 200);
  check('conta comum: 403', (await a('/api/admin/schema')).status === 403);

  await pool.query(`insert into admins (user_id) select id from "user" where email = $1`, [emailA]);
  check('admin: /me', (await a('/api/admin/me')).status === 200);

  const schema = await a('/api/admin/schema');
  check('schema traz as 8 coleções', schema.status === 200 && schema.json.length === COLLECTIONS.length, schema.json?.length);

  for (const col of COLLECTIONS) {
    const list = await a(`/api/admin/items/${col.id}`);
    check(`${col.id}: lista`, list.status === 200 && Array.isArray(list.json) && list.json.length > 0, list.status);
  }
  check('coleção inexistente: 404', (await a('/api/admin/items/nada')).status === 404);

  // Cria, edita, valida e exclui um item em cada coleção.
  const sample: Record<string, Record<string, unknown>> = {
    weeks: { size: 'teste', cm: 1, grams: 1, baby: 'b', body: 'c', guide: 'g' },
    daily_messages: { text: 'mensagem de teste' },
    articles: { title: 'Artigo teste', category: 'Teste', summary: 's', body: 'corpo', minutes: 1 },
    faq: { question: 'P?', answer: 'R.' },
    alerts: { text: 'alerta teste' },
    checklists: { list: 'mala', group: 'Grupo teste', items: ['um', 'dois'] },
    birth_plan: { topic: 'Tópico teste', options: ['a', 'b'] },
    tools: { title: 'Ferramenta', text: 'texto' },
  };
  const keyFor = (id: string) => (id === 'weeks' ? '99' : id === 'daily_messages' ? '999' : `teste-${stamp}`);
  for (const col of COLLECTIONS) {
    const key = keyFor(col.id);
    const put = await a(`/api/admin/items/${col.id}/${key}`, 'PUT', { data: sample[col.id], position: 999 });
    check(`${col.id}: cria item`, put.status === 200, put.text);
    const req = col.fields.find((f) => f.required);
    if (req) {
      const bad = await a(`/api/admin/items/${col.id}/${key}`, 'PUT', { data: { ...sample[col.id], [req.name]: '' } });
      check(`${col.id}: recusa sem "${req.name}" (400)`, bad.status === 400, bad.status);
    }
    const pub = await anon('/api/content');
    check(`${col.id}: aparece no conteúdo público`, !!pub.json?.[col.id]?.some((i: { key: string }) => i.key === key));
    const del = await a(`/api/admin/items/${col.id}/${key}`, 'DELETE');
    check(`${col.id}: exclui`, del.status === 200);
    const pub2 = await anon('/api/content');
    check(`${col.id}: some do conteúdo público`, !pub2.json?.[col.id]?.some((i: { key: string }) => i.key === key));
  }
  check('lista com valor fora das opções (400)', (await a(`/api/admin/items/checklists/x-${stamp}`, 'PUT', { data: { ...sample.checklists, list: 'Malas' } })).status === 400);
  check('número inválido (400)', (await a(`/api/admin/items/weeks/98`, 'PUT', { data: { ...sample.weeks, cm: 'abc' } })).status === 400);
  check('identificador inválido (400/404)', [400, 404].includes((await a(`/api/admin/items/faq/${encodeURIComponent('com espaço')}`, 'PUT', { data: sample.faq })).status));

  const stats = await a('/api/admin/stats');
  check('painel: números', stats.status === 200 && typeof stats.json.users === 'number' && typeof stats.json.content === 'number');

  const users = await a('/api/admin/users');
  const userB = users.json?.find((u: { email: string }) => u.email === emailB);
  check('contas: lista', users.status === 200 && !!userB);
  check('dar acesso a B', (await a(`/api/admin/users/${userB.id}/admin`, 'PUT', { admin: true })).status === 200);
  check('B entra na administração', (await b('/api/admin/me')).status === 200);
  check('tirar acesso de B', (await a(`/api/admin/users/${userB.id}/admin`, 'PUT', { admin: false })).status === 200);
  check('B perde o acesso', (await b('/api/admin/me')).status === 403);
  const me = users.json?.find((u: { email: string }) => u.email === emailA);
  check('não remove o próprio acesso', (await a(`/api/admin/users/${me.id}/admin`, 'PUT', { admin: false })).status === 400);

  const createC = await a('/api/admin/users', 'POST', { name: 'Adm C', email: emailC, password });
  check('cria conta de administração', createC.status === 200 && createC.json.existed === false, createC.text);
  const c = client();
  check('conta criada entra', (await c('/api/auth/sign-in/email', 'POST', { email: emailC, password })).status === 200);
  check('conta criada é admin', (await c('/api/admin/me')).status === 200);
  check('senha curta recusada (400)', (await a('/api/admin/users', 'POST', { name: 'X', email: `x-${stamp}@resend.dev`, password: '123' })).status === 400);
  check('sessão de A continua a mesma', (await a('/api/auth/get-session')).json?.user?.email === emailA);

  const email = await a('/api/admin/email');
  check('e-mails: estado', email.status === 200 && typeof email.json.configured === 'boolean', email.json);
  if (email.json?.configured) {
    const t = await a('/api/admin/email/test', 'POST', {});
    check('e-mails: envio de teste', t.status === 200, t.text);
  }

  check('sair', (await a('/api/auth/sign-out', 'POST', {})).status === 200);
  check('depois de sair: 401', (await a('/api/admin/me')).status === 401);
} finally {
  await pool.query(`delete from "user" where email = any($1)`, [created]);
  await pool.query(
    `delete from content_items where (collection = 'weeks' and key in ('98', '99')) or (collection = 'daily_messages' and key = '999') or key like $1`,
    [`%-${stamp}`],
  );
  await pool.end();
}

console.log(failures ? `\n${failures} falha(s)` : '\nTudo certo');
process.exit(failures ? 1 : 0);
