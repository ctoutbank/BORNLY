// Testa a API de ponta a ponta contra o servidor local, com contas descartáveis que são apagadas no fim.
const BASE = process.env.TEST_BASE ?? 'http://localhost:3000';
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
    return { status: res.status, json };
  };
}

const stamp = Date.now();
const password = `Teste-${stamp}-senha`;
const a = client();
const b = client();
const anon = client();

check('sem login é recusado', (await anon('/api/data/state')).status === 401);
const r1 = await a('/api/auth/sign-up/email', 'POST', { name: 'Teste A', email: `bornly-teste-a-${stamp}@example.com`, password });
check('cadastro A', r1.status === 200, r1);
const r2 = await b('/api/auth/sign-up/email', 'POST', { name: 'Teste B', email: `bornly-teste-b-${stamp}@example.com`, password });
check('cadastro B', r2.status === 200, r2);

check('perfil', (await a('/api/data/profile', 'PUT', { moment: 'gravida', method: 'dum', dum: '2026-04-20', healthConsent: true, maternityName: 'Maternidade X' })).status === 200);
check('perfil parcial mantém o resto', (await a('/api/data/profile', 'PUT', { showWeight: false })).status === 200);
check('diário', (await a('/api/data/diary/2026-11-04', 'PUT', { feel: 2, humor: ['Calma'], sleep: 'Bom', note: 'nota' })).status === 200);
check('diário atualiza no mesmo dia', (await a('/api/data/diary/2026-11-04', 'PUT', { feel: 3, humor: [], sleep: null, note: 'nova' })).status === 200);
check('sintoma', (await a('/api/data/symptoms', 'POST', { day: '2026-11-04', symptom: 'Azia', intensity: 'Leve', duration: 'Horas' })).status === 200);
const appt = await a('/api/data/appointments', 'POST', { startsAt: '2026-11-10T17:30:00.000Z', title: 'Pré-natal', who: 'Dra. X', place: 'Clínica' });
check('consulta', appt.status === 200 && !!appt.json.id, appt);
const q1 = await a('/api/data/questions', 'POST', { text: 'Pergunta?' });
check('pergunta', q1.status === 200);
const med = await a('/api/data/medications', 'POST', { name: 'Vitamina', dose: '1 cápsula', timeOfDay: '08:00' });
check('medicamento', med.status === 200, med);
check('dose', (await a(`/api/data/medications/${med.json.id}/doses/2026-11-04`, 'PUT', { taken: true })).status === 200);
check('peso', (await a('/api/data/weights/2026-11-04', 'PUT', { kg: 65.8 })).status === 200);
check('checklist', (await a('/api/data/checklist', 'PUT', { list: 'enxoval', label: 'Banheira', category: 'Higiene', custom: false, done: true })).status === 200);
check('plano de parto', (await a('/api/data/birth-plan', 'PUT', { topic: 'Ambiente', options: ['Música', 'Silêncio'] })).status === 200);
check('plano substitui', (await a('/api/data/birth-plan', 'PUT', { topic: 'Ambiente', options: ['Música'] })).status === 200);
check('salvo', (await a('/api/data/saved/a2', 'PUT', { saved: true })).status === 200);
check('dado inválido é recusado', (await a('/api/data/weights/2026-11-04', 'PUT', { kg: 5 })).status === 400);

const state = (await a('/api/data/state')).json;
check('estado: perfil gravado', state.profile?.dum === '2026-04-20' && state.profile.showWeight === false && state.profile.maternityName === 'Maternidade X' && !!state.profile.healthConsentAt, state.profile);
check('estado: diário atualizado', state.diary.length === 1 && state.diary[0].feel === 3 && state.diary[0].note === 'nova', state.diary);
check('estado: sintoma', state.symptoms.length === 1);
check('estado: consulta', state.appointments.length === 1);
check('estado: medicamento e dose', state.medications.length === 1 && state.doses.length === 1 && state.doses[0].day === '2026-11-04', state.doses);
check('estado: peso numérico', state.weights[0]?.kg === 65.8, state.weights);
check('estado: checklist', state.checklist[0]?.done === true);
check('estado: plano', state.plan.length === 1 && state.plan[0].option === 'Música');
check('estado: salvo', state.saved[0]?.articleId === 'a2');

// Isolamento: B não vê nem altera os dados de A.
const sb = (await b('/api/data/state')).json;
check('isolamento: B começa vazio', !sb.profile && sb.diary.length === 0 && sb.appointments.length === 0 && sb.medications.length === 0, sb);
await b(`/api/data/appointments/${appt.json.id}`, 'DELETE');
check('isolamento: B não apaga consulta de A', (await a('/api/data/state')).json.appointments.length === 1);
check('isolamento: B não marca dose de A', (await b(`/api/data/medications/${med.json.id}/doses/2026-11-05`, 'PUT', { taken: true })).status === 404);

check('exportar dados', (await a('/api/data/export')).json?.user?.name === 'Teste A');
check('cron sem segredo é recusado', (await anon('/cron/lembretes')).status === 401);

const del = await a('/api/auth/delete-user', 'POST', { password });
check('excluir conta A', del.status === 200, del);
check('sessão de A encerrada', (await a('/api/data/state')).status === 401);
await b('/api/auth/delete-user', 'POST', { password });

process.exit(failures ? 1 : 0);
