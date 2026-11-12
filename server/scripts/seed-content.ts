// Carrega o conteúdo inicial. Não sobrescreve o que já foi editado na administração, a menos que use --force.
import { ARTICLES } from '../content/articles.js';
import { DAILY_MESSAGES } from '../content/messages.js';
import { ALERTS, BIRTH_PLAN, CHECKLISTS, FAQ, TOOLS } from '../content/misc.js';
import { WEEKS } from '../content/weeks.js';
import { pool } from '../src/db.js';

const force = process.argv.includes('--force');
const rows: [string, string, number, Record<string, unknown>][] = [];

WEEKS.forEach(([week, size, cm, grams, baby, body, guide], i) => rows.push(['weeks', String(week), i, { size, cm, grams, baby, body, guide }]));
DAILY_MESSAGES.forEach((text, i) => rows.push(['daily_messages', String(i + 1), i, { text }]));
ARTICLES.forEach(({ key, ...data }, i) => rows.push(['articles', key, i, data]));
FAQ.forEach(({ key, ...data }, i) => rows.push(['faq', key, i, Object.fromEntries(Object.entries(data).filter(([, v]) => v !== ''))]));
ALERTS.forEach((text, i) => rows.push(['alerts', `alerta-${i + 1}`, i, { text }]));
CHECKLISTS.forEach(({ key, ...data }, i) => rows.push(['checklists', key, i, data]));
BIRTH_PLAN.forEach(({ key, ...data }, i) => rows.push(['birth_plan', key, i, data]));
TOOLS.forEach(({ key, ...data }, i) => rows.push(['tools', key, i, data]));

let written = 0;
for (const [collection, key, position, data] of rows) {
  const res = await pool.query(
    `insert into content_items (collection, key, position, data) values ($1, $2, $3, $4)
     on conflict (collection, key) do ${force ? 'update set data = excluded.data, position = excluded.position, updated_at = now()' : 'nothing'}`,
    [collection, key, position, JSON.stringify(data)],
  );
  written += res.rowCount ?? 0;
}
console.log(`${rows.length} itens no conteúdo inicial, ${written} gravados.`);
await pool.end();
