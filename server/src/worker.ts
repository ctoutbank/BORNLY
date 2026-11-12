// Entrada do Worker da Cloudflare. O dev local continua em src/dev.ts.
import { withRequestPool } from './db.js';

type Env = Record<string, string | undefined> & { DATABASE_URL: string; CRON_SECRET: string };
type Ctx = { waitUntil(p: Promise<unknown>): void };
type App = typeof import('./app.js').default;

// O Better Auth e o e-mail leem process.env ao carregar, então o env é copiado antes de importar o app.
// A preparação do Better Auth consulta o banco: ela precisa terminar dentro do mesmo pedido,
// senão a promessa fica presa quando o pedido acaba e todo login seguinte espera para sempre.
let appPromise: Promise<App> | undefined;
function loadApp(env: Env) {
  for (const [k, v] of Object.entries(env)) if (typeof v === 'string') process.env[k] = v;
  appPromise ??= (async () => {
    const [{ default: app }, { auth }] = await Promise.all([import('./app.js'), import('./auth.js')]);
    await auth.$context;
    return app;
  })().catch((err) => {
    appPromise = undefined;
    throw err;
  });
  return appPromise;
}

const handle = (req: Request, env: Env, ctx: Ctx) =>
  withRequestPool(env.DATABASE_URL, async () => (await loadApp(env)).fetch(req, env, ctx as never), (p) => ctx.waitUntil(p));

export default {
  fetch: handle,
  // Lembrete de consulta, uma vez por dia (agendado no wrangler.toml).
  async scheduled(_event: unknown, env: Env, ctx: Ctx) {
    const req = new Request('https://cron.local/cron/lembretes', { headers: { authorization: `Bearer ${env.CRON_SECRET}` } });
    ctx.waitUntil(handle(req, env, ctx).then((r) => r.text()).then((t) => console.log('lembretes', t)));
  },
};
