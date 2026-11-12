// Dá acesso à administração para uma conta já criada: npm run make-admin -- email@exemplo.com
import { pool } from '../src/db.js';

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error('Informe o e-mail: npm run make-admin -- email@exemplo.com');
  process.exit(1);
}
const { rows } = await pool.query(`insert into admins (user_id) select id from "user" where lower(email) = $1 on conflict do nothing returning user_id`, [email]);
const exists = await pool.query(`select 1 from "user" where lower(email) = $1`, [email]);
console.log(!exists.rowCount ? 'Conta não encontrada. Crie a conta pelo app primeiro.' : rows.length ? 'Acesso de administração concedido.' : 'Esta conta já é administradora.');
await pool.end();
