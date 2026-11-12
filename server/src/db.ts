import { AsyncLocalStorage } from 'node:async_hooks';

import pg from 'pg';

// Datas continuam como texto 'AAAA-MM-DD' (sem fuso) e números decimais voltam como number.
pg.types.setTypeParser(1082, (v) => v);
pg.types.setTypeParser(1700, (v) => parseFloat(v));

// No Node (dev local e scripts) há um pool só para o processo.
// No Worker da Cloudflare uma conexão não pode passar de um pedido para outro:
// cada pedido roda dentro de withRequestPool, que cria um pool próprio e o fecha no fim.
const requestPool = new AsyncLocalStorage<pg.Pool>();
let processPool: pg.Pool | undefined;

const current = () => requestPool.getStore() ?? (processPool ??= new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 3, idleTimeoutMillis: 10_000 }));

export async function withRequestPool<T>(connectionString: string, run: () => Promise<T>, defer: (p: Promise<unknown>) => void) {
  const p = new pg.Pool({ connectionString, max: 4 });
  try {
    return await requestPool.run(p, run);
  } finally {
    defer(p.end().catch(() => undefined));
  }
}

// O Better Auth recebe este objeto como se fosse um pg.Pool; cada chamada vai para o pool do pedido atual.
export const pool = {
  connect: () => current().connect(),
  query: (...args: Parameters<pg.Pool['query']>) => (current().query as (...a: unknown[]) => unknown)(...args),
  end: () => current().end(),
  on: () => pool,
} as unknown as pg.Pool;

export async function q<T extends pg.QueryResultRow = pg.QueryResultRow>(text: string, params: unknown[] = []) {
  const { rows } = await current().query<T>(text, params);
  return rows;
}
