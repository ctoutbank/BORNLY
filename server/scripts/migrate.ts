import { readFileSync } from 'node:fs';

import { getMigrations } from 'better-auth/db/migration';

import { auth } from '../src/auth.js';
import { pool } from '../src/db.js';

const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(auth.options);
console.log('login: tabelas novas', toBeCreated.map((t) => t.table).join(', ') || 'nenhuma', '| colunas novas', toBeAdded.length);
await runMigrations();
await pool.query(readFileSync(new URL('../schema.sql', import.meta.url), 'utf8'));
const { rows } = await pool.query(`select table_name from information_schema.tables where table_schema = 'public' order by 1`);
console.log('tabelas:', rows.map((r) => r.table_name).join(', '));
await pool.end();
