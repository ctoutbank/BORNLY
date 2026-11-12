// Testa os links dos e-mails (confirmação e troca de senha) sem abrir caixa de entrada.
// Uso: TEST_BASE=http://localhost:8787 npx tsx --env-file=.env.local scripts/email-flow-test.ts
import { createEmailVerificationToken } from 'better-auth/api';

import { withVerifiedPage } from '../src/auth.js';
import { pool } from '../src/db.js';

const BASE = process.env.TEST_BASE ?? 'http://localhost:8787';
let failures = 0;
const check = (name: string, ok: boolean, extra?: unknown) => {
  console.log(`${ok ? 'ok  ' : 'FALHA'} ${name}${ok ? '' : ' ' + JSON.stringify(extra)}`);
  if (!ok) failures++;
};
const post = (path: string, body: unknown) => fetch(BASE + path, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:8097' }, body: JSON.stringify(body) });

const stamp = Date.now();
const email = `delivered+bornly-mail-${stamp}@resend.dev`;
const oldPass = `Antiga-${stamp}`;
const newPass = `Nova-${stamp}-x`;

try {
  check('link sem destino ganha a página de confirmação', withVerifiedPage(`${BASE}/api/auth/verify-email?token=t&callbackURL=/`).includes('callbackURL=' + encodeURIComponent(`${process.env.BETTER_AUTH_URL}/email-confirmado`)));
  check('link com destino continua igual', withVerifiedPage(`${BASE}/api/auth/verify-email?token=t&callbackURL=bornly%3A%2F%2Fx`).includes('callbackURL=bornly'));

  check('cadastro', (await post('/api/auth/sign-up/email', { name: 'Teste e-mail', email, password: oldPass })).status === 200);

  // Confirmação de e-mail
  const token = await createEmailVerificationToken(process.env.BETTER_AUTH_SECRET!, email);
  const link = withVerifiedPage(`${BASE}/api/auth/verify-email?token=${token}&callbackURL=/`);
  const v = await fetch(link, { redirect: 'manual' });
  const to = v.headers.get('location') ?? '';
  check('link de confirmação redireciona para /email-confirmado', [301, 302, 303, 307].includes(v.status) && to.includes('/email-confirmado'), { status: v.status, to });
  check('página de confirmação abre', (await fetch(to.startsWith('http') ? to : BASE + to)).status === 200);
  const [u] = (await pool.query(`select "emailVerified" from "user" where email = $1`, [email])).rows;
  check('e-mail marcado como confirmado', u?.emailVerified === true, u);

  // Troca de senha
  check('pedido de nova senha', (await post('/api/auth/request-password-reset', { email, redirectTo: `${BASE}/redefinir-senha` })).status === 200);
  const [row] = (await pool.query(`select identifier from verification where identifier like 'reset-password:%' order by "createdAt" desc limit 1`)).rows;
  const resetToken = String(row?.identifier ?? '').replace('reset-password:', '');
  check('token de troca gravado', resetToken.length > 10);
  const r = await fetch(`${BASE}/api/auth/reset-password/${resetToken}?callbackURL=${encodeURIComponent(`${BASE}/redefinir-senha`)}`, { redirect: 'manual' });
  const rto = r.headers.get('location') ?? '';
  check('link do e-mail leva à página de nova senha', rto.includes('/redefinir-senha') && rto.includes(resetToken), { status: r.status, rto });
  const pageRes = await fetch(rto);
  check('página de nova senha abre', pageRes.status === 200 && (await pageRes.text()).includes('senha'));
  check('troca a senha', (await post('/api/auth/reset-password', { newPassword: newPass, token: resetToken })).status === 200);
  check('senha nova entra', (await post('/api/auth/sign-in/email', { email, password: newPass })).status === 200);
  check('senha antiga não entra', (await post('/api/auth/sign-in/email', { email, password: oldPass })).status !== 200);
  check('token não serve de novo', (await post('/api/auth/reset-password', { newPassword: oldPass + 'y', token: resetToken })).status !== 200);
  check('raiz do servidor abre', (await fetch(BASE + '/')).status === 200);
} finally {
  await pool.query(`delete from "user" where email = $1`, [email]);
  await pool.end();
}
console.log(failures ? `\n${failures} falha(s)` : '\nTudo certo');
process.exit(failures ? 1 : 0);
