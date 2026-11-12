// Gera a cópia do conteúdo embutida no app (usada sem internet e na primeira abertura).
import { writeFileSync } from 'node:fs';

import { pool } from '../src/db.js';

const { rows } = await pool.query('select collection, key, data from content_items order by collection, position, key');
const out: Record<string, { key: string; data: unknown }[]> = {};
for (const r of rows) (out[r.collection] ??= []).push({ key: r.key, data: r.data });
writeFileSync(new URL('../../src/content-snapshot.json', import.meta.url), JSON.stringify(out));
console.log(Object.entries(out).map(([k, v]) => `${k}: ${v.length}`).join(' · '));
await pool.end();
