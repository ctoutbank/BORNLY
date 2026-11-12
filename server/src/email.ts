const BRAND = { bg: '#F4ECE3', card: '#FBF7F2', ink: '#2A2522', muted: '#6F635B' };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const firstName = (name: string) => esc(name.trim().split(/\s+/)[0] || 'você');

function layout(title: string, body: string, action?: { label: string; url: string }) {
  const button = action
    ? `<p style="margin:28px 0 8px"><a href="${esc(action.url)}" style="display:inline-block;background:${BRAND.ink};color:${BRAND.bg};text-decoration:none;font-weight:600;font-size:15px;padding:15px 26px;border-radius:999px">${esc(action.label)}</a></p>
       <p style="margin:18px 0 0;font-size:12px;line-height:1.5;color:${BRAND.muted}">Se o botão não abrir, copie este endereço no navegador:<br>${esc(action.url)}</p>`
    : '';
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:${BRAND.bg};font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${BRAND.ink}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:520px" cellpadding="0" cellspacing="0">
<tr><td style="padding:0 8px 18px;font-family:Georgia,serif;font-size:24px">Bornly</td></tr>
<tr><td style="background:${BRAND.card};border-radius:24px;padding:30px 28px">
<h1 style="margin:0 0 14px;font-family:Georgia,serif;font-weight:400;font-size:25px;line-height:1.25">${esc(title)}</h1>
<div style="font-size:15px;line-height:1.6">${body}</div>${button}
</td></tr>
<tr><td style="padding:18px 8px;font-size:12px;line-height:1.5;color:${BRAND.muted}">Este é um e-mail automático do Bornly. O Bornly não substitui o pré-natal nem atendimento de emergência.</td></tr>
</table></td></tr></table></body></html>`;
}

const p = (s: string) => `<p style="margin:0 0 12px">${s}</p>`;

export const templates = {
  test: (name: string) => ({
    subject: 'Teste de envio do Bornly',
    html: layout('Os e-mails estão funcionando', p(`Oi, ${firstName(name)}. Este é um teste enviado pela administração do Bornly. Se chegou, as mensagens de boas-vindas, senha e lembretes também vão chegar.`)),
  }),
  welcome: (name: string) => ({
    subject: 'Boas-vindas ao Bornly',
    html: layout(`Que bom ter você aqui, ${firstName(name)}`, p('Sua conta está pronta. A partir de agora, o Bornly guarda seus registros e acompanha você semana a semana.') + p('Comece registrando como você está hoje e cadastrando sua próxima consulta. Em sinais de alerta, procure atendimento sem esperar pelo app.')),
  }),
  verify: (name: string, url: string) => ({
    subject: 'Confirme seu e-mail no Bornly',
    html: layout('Confirme seu e-mail', p(`Oi, ${firstName(name)}. Toque no botão para confirmar que este e-mail é seu. Assim você consegue recuperar sua conta se esquecer a senha.`), { label: 'Confirmar e-mail', url }),
  }),
  resetPassword: (name: string, url: string) => ({
    subject: 'Redefina sua senha do Bornly',
    html: layout('Redefinir senha', p(`Oi, ${firstName(name)}. Recebemos um pedido para trocar sua senha. O link vale por 1 hora.`) + p('Se não foi você, ignore este e-mail. Sua senha continua a mesma.'), { label: 'Criar nova senha', url }),
  }),
  passwordChanged: (name: string) => ({
    subject: 'Sua senha do Bornly foi alterada',
    html: layout('Senha alterada', p(`Oi, ${firstName(name)}. A senha da sua conta acabou de ser alterada e os outros aparelhos foram desconectados.`) + p('Se não foi você, use a opção Esqueci minha senha no app para criar uma nova agora.')),
  }),
  accountDeleted: (name: string) => ({
    subject: 'Sua conta do Bornly foi excluída',
    html: layout('Conta excluída', p(`Oi, ${firstName(name)}. Sua conta e os registros guardados nela foram excluídos.`) + p('Desejamos muito cuidado para você nessa caminhada.')),
  }),
  appointmentReminder: (name: string, when: string) => ({
    // Sem título nem local: e-mail pode aparecer em tela bloqueada e não deve expor dado de saúde.
    subject: 'Você tem um compromisso amanhã',
    html: layout('Lembrete para amanhã', p(`Oi, ${firstName(name)}. Você tem um compromisso marcado para ${esc(when)}.`) + p('Os detalhes estão no app.')),
  }),
};

type Domain = { name: string; status: string };

/** Domínios da conta do Resend (precisa de chave com acesso total; com chave só de envio, volta null). */
export async function resendDomains(): Promise<Domain[] | null> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  const res = await fetch('https://api.resend.com/domains', { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) return null;
  const body = (await res.json()) as { data?: Domain[] };
  return (body.data ?? []).map((d) => ({ name: d.name, status: d.status }));
}

// Remetente: EMAIL_FROM, se definido; senão o primeiro domínio verificado da conta; senão o endereço de testes do Resend.
let senderCache: Promise<string> | undefined;
export function sender() {
  if (process.env.EMAIL_FROM) return Promise.resolve(process.env.EMAIL_FROM);
  senderCache ??= resendDomains()
    .then((list) => list?.find((d) => d.status === 'verified'))
    .then((d) => (d ? `Bornly <nao-responda@${d.name}>` : 'Bornly <onboarding@resend.dev>'))
    .catch(() => 'Bornly <onboarding@resend.dev>');
  return senderCache;
}

export async function sendEmail(to: string, message: { subject: string; html: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(`E-mail não enviado (sem RESEND_API_KEY): ${message.subject}`);
    return false;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: await sender(), to, subject: message.subject, html: message.html, ...(process.env.EMAIL_REPLY_TO ? { reply_to: process.env.EMAIL_REPLY_TO } : {}) }),
  });
  if (!res.ok) {
    senderCache = undefined;
    console.error('Falha ao enviar e-mail', res.status, await res.text());
  }
  return res.ok;
}
