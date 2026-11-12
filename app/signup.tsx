import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { api } from '@/api';
import { API_URL, authClient, authErrorMessage, isExistingAccount } from '@/auth-client';
import { profilePayload } from '@/profile';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Card, CheckRow, Field, OnboardingShell, PrimaryButton, Sans, Spacer, TextButton, Title, ToggleRow } from '@/ui';

// Última etapa do cadastro: combina o lembrete, pede a autorização e cria a conta.
export default function Signup() {
  const { s, set, load } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [existing, setExisting] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    if (!s.hasConsent) return setError('Para criar a conta, autorize a guarda dos seus dados.');
    if (password.length < 8) return setError('A senha precisa ter pelo menos 8 caracteres.');
    setBusy(true);
    setError('');
    setExisting(false);
    const { error: failure } = await authClient.signUp.email({ name: s.name.trim(), email: email.trim().toLowerCase(), password, callbackURL: `${API_URL}/email-confirmado` });
    if (failure) {
      setBusy(false);
      setExisting(isExistingAccount(failure));
      return setError(authErrorMessage(failure));
    }
    try {
      await api('/profile', 'PUT', profilePayload(s, true));
    } catch {
      // A conta existe; ao entrar sem perfil, o app volta ao cadastro inicial.
    }
    await load();
    if (router.canDismiss()) router.dismissAll();
    router.replace('/hoje');
  };

  return (
    <OnboardingShell step={4} gap={18}>
      <View>
        <Title s={28}>Tudo pronto, {s.name.trim() || 'você'}.</Title>
        <Sans s={14} lh={1.5} c={colors.muted} style={{ marginTop: 8 }}>Crie sua conta para guardar seus registros, mesmo se trocar de celular.</Sans>
      </View>
      <Field label="E-mail" value={email} onChangeText={(v) => { setEmail(v); setExisting(false); }} autoCapitalize="none" autoComplete="email" keyboardType="email-address" textContentType="emailAddress" />
      <Field label="Senha" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" textContentType="newPassword" placeholder="Pelo menos 8 caracteres" returnKeyType="go" onSubmitEditing={submit} />
      <Card style={{ paddingVertical: 4, paddingHorizontal: 18 }}>
        <ToggleRow label="Lembrete de consultas" sub="Por e-mail, um dia antes, sem detalhes de saúde" on={s.notifyAppointments} last={false} onToggle={() => set({ notifyAppointments: !s.notifyAppointments })} />
        <CheckRow label="Autorizo o Bornly a guardar os dados de saúde que eu registrar, para mostrar meu acompanhamento." on={s.hasConsent} last plain onPress={() => set({ hasConsent: !s.hasConsent })} />
      </Card>
      <Sans s={12} lh={1.5} c={colors.muted} style={{ paddingHorizontal: 4 }}>Você pode baixar uma cópia ou excluir sua conta e seus dados a qualquer momento, na tela Conta.</Sans>
      {error ? (
        <View style={{ backgroundColor: colors.peach, borderRadius: 18, padding: 14, gap: 4 }}>
          <Sans s={13} lh={1.45} c={colors.terraDark}>{error}</Sans>
          {existing ? <TextButton label="Entrar com este e-mail" c={colors.terraDark} w={600} onPress={() => router.push({ pathname: '/login', params: { email: email.trim().toLowerCase(), from: 'cadastro' } })} /> : null}
        </View>
      ) : null}
      <Spacer />
      <PrimaryButton label={busy ? 'Criando...' : 'Criar minha conta'} onPress={submit} />
    </OnboardingShell>
  );
}
