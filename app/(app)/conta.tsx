import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Share, View } from 'react-native';

import { api } from '@/api';
import { API_URL, authClient, authErrorMessage } from '@/auth-client';
import { fmt, gestation, useStore } from '@/store';
import { colors } from '@/theme';
import { Card, Chevron, Field, PageHeader, Press, PrimaryButton, Sans, Screen, TextButton, Title, ToggleRow } from '@/ui';

export default function Conta() {
  const { s, save, flash, reset } = useStore();
  const router = useRouter();
  const g = gestation(s);
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const leave = () => {
    reset();
    if (router.canDismiss()) router.dismissAll();
    router.replace('/welcome');
  };

  const signOut = async () => {
    await authClient.signOut();
    leave();
  };

  const exportData = async () => {
    try {
      const data = await api('/export');
      await Share.share({ title: 'Meus dados do Bornly', message: JSON.stringify(data, null, 2) });
    } catch {
      flash('Não foi possível gerar a cópia. Verifique sua conexão.');
    }
  };

  const confirmDelete = async () => {
    setError('');
    const { error: failure } = await authClient.deleteUser({ password });
    if (failure) return setError(authErrorMessage(failure));
    await authClient.signOut().catch(() => undefined);
    leave();
  };

  const resend = async () => {
    const { error: failure } = await authClient.sendVerificationEmail({ email: s.email, callbackURL: `${API_URL}/email-confirmado` });
    flash(failure ? 'Não foi possível enviar agora.' : 'Enviamos o link para o seu e-mail.');
  };

  const rows = [
    { label: 'Dados da gravidez', sub: 'Corrigir DUM, DPP ou idade gestacional', go: () => router.push('/date') },
    { label: 'Maternidade', sub: s.maternityName || 'Cadastrar nome e telefone', go: () => router.push('/nascimento') },
    { label: 'Baixar uma cópia dos meus dados', sub: 'Compartilha um arquivo de texto com tudo', go: exportData },
  ];

  return (
    <Screen gap={20}>
      <PageHeader title="Conta" fallback="/hoje" />
      <View style={{ paddingHorizontal: 4 }}>
        <Title s={22}>{s.name}</Title>
        <Sans s={13} c={colors.muted} style={{ marginTop: 4 }}>{s.email}</Sans>
        <Sans s={13} c={colors.muted} style={{ marginTop: 2 }}>{g.week} semanas · DPP {fmt(g.due, { day: 'numeric', month: 'short', year: 'numeric' }).replace(/\./g, '')}</Sans>
      </View>
      {s.emailVerified ? null : (
        <Card bg={colors.peach} radius={20} style={{ padding: 16, gap: 4 }}>
          <Sans s={13} lh={1.45} c={colors.terraText}>Confirme seu e-mail para conseguir recuperar a conta.</Sans>
          <View style={{ alignItems: 'flex-start' }}><TextButton label="Reenviar confirmação" w={600} c={colors.terraDark} onPress={resend} /></View>
        </Card>
      )}
      <Card style={{ paddingVertical: 4, paddingHorizontal: 16 }}>
        {rows.map((r, i) => (
          <Press key={r.label} onPress={r.go} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, minHeight: 60, borderBottomWidth: i === rows.length - 1 ? 0 : 1, borderBottomColor: colors.lineSoft }}>
            <View style={{ flex: 1 }}>
              <Sans s={14} w={600}>{r.label}</Sans>
              <Sans s={12} c={colors.muted} style={{ marginTop: 2 }}>{r.sub}</Sans>
            </View>
            <Chevron />
          </Press>
        ))}
      </Card>
      <Card style={{ paddingVertical: 4, paddingHorizontal: 16 }}>
        <ToggleRow label="Lembrete de consultas" sub="Por e-mail, um dia antes" on={s.notifyAppointments} last onToggle={() => save('/profile', 'PUT', { notifyAppointments: !s.notifyAppointments }, { notifyAppointments: !s.notifyAppointments })} />
      </Card>
      <PrimaryButton label="Sair" onPress={signOut} />
      {deleting ? (
        <Card bg={colors.peach} radius={24} style={{ padding: 18, gap: 12 }}>
          <Title s={18} c={colors.terraDark}>Excluir conta e dados</Title>
          <Sans s={13} lh={1.5} c={colors.terraText}>Isso apaga sua conta e todos os seus registros, sem volta. Digite sua senha para confirmar.</Sans>
          <Field value={password} onChangeText={setPassword} secureTextEntry placeholder="Sua senha" autoComplete="current-password" />
          {error ? <Sans s={13} c={colors.terraDark}>{error}</Sans> : null}
          <PrimaryButton label="Excluir definitivamente" bg={colors.terraDark} onPress={confirmDelete} />
          <TextButton label="Cancelar" onPress={() => setDeleting(false)} />
        </Card>
      ) : (
        <TextButton label="Excluir minha conta" w={600} c={colors.terraDark} onPress={() => setDeleting(true)} />
      )}
      <Sans s={12} lh={1.5} c={colors.muted} style={{ paddingHorizontal: 4 }}>O Bornly organiza informações entre consultas. Não é serviço de emergência e não substitui o atendimento presencial nem o prontuário do seu médico.</Sans>
    </Screen>
  );
}
