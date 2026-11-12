// Cria uma conta de administração direto no banco, sem passar pelo app.
// Uso: npm run create-admin [-- email "Nome"]   (o que faltar é perguntado; a senha não aparece)
import { createInterface } from 'node:readline';

import { auth } from '../src/auth.js';
import { pool } from '../src/db.js';

// Uma leitura só do terminal; na senha, o que é digitado não aparece.
const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: !!process.stdin.isTTY });
const lines = rl[Symbol.asyncIterator]();
const raw = rl as unknown as { _writeToOutput: (s: string) => void; output: NodeJS.WriteStream };
const write = raw._writeToOutput.bind(rl);
let muted = false;
raw._writeToOutput = (s: string) => {
  if (!muted || s === '\r\n' || s === '\n') write(s);
};
async function ask(question: string, hidden = false) {
  process.stdout.write(question);
  muted = hidden;
  const { value } = await lines.next();
  muted = false;
  if (hidden) process.stdout.write('\n');
  return String(value ?? '').trim();
}

const [argEmail, ...argName] = process.argv.slice(2);
const email = (argEmail ?? (await ask('E-mail da administração: '))).trim().toLowerCase();
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('E-mail inválido.');
const existing = await pool.query(`select id from "user" where lower(email) = $1`, [email]);
let userId: string = existing.rows[0]?.id;

if (userId) {
  console.log('Essa conta já existe; só vou garantir o acesso de administração.');
} else {
  const name = argName.join(' ').trim() || (await ask('Nome: ')) || 'Administração';
  const password = await ask('Senha (mínimo 8 caracteres): ', true);
  const again = await ask('Repita a senha: ', true);
  if (password.length < 8) throw new Error('A senha precisa ter pelo menos 8 caracteres.');
  if (password !== again) throw new Error('As senhas não conferem.');
  const res = await auth.api.signUpEmail({ body: { email, password, name } });
  userId = res.user.id;
  await pool.query(`update "user" set "emailVerified" = true where id = $1`, [userId]);
}

await pool.query(`insert into admins (user_id) values ($1) on conflict do nothing`, [userId]);
console.log('\nPronto. Entre em https://bornly-api.wt-pedagogia.workers.dev/admin com esse e-mail e senha.');
rl.close();
await pool.end();
process.exit(0);
