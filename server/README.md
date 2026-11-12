# API do Bornly

Hono + Better Auth + Postgres (Neon, região São Paulo), publicada no Vercel. Os segredos ficam em `.env.local` (fora do Git).

```bash
npm install
npm run migrate   # cria ou atualiza as tabelas
npm run dev       # API em http://localhost:3000
npm test          # testes de ponta a ponta, com a API local rodando
```

Variáveis em produção: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (endereço público da API), `CRON_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`.

Sem `RESEND_API_KEY` a API funciona, mas nenhum e-mail é enviado. O app lê o endereço da API em `EXPO_PUBLIC_API_URL`.
