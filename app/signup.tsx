import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { api } from '@/api';
import { API_URL, authClient, authErrorMessage } from '@/auth-client';
import { profilePayload } from '@/profile';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Field, OnboardingShell, PrimaryButton, Sans, Spacer, Title } from '@/ui';

export default function Signup() {
  const { s, load } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    if (password.length < 8) return setError('A senha precisa ter pelo menos 8 caracteres.');
    setBusy(true);
    setError('');
    const { error: failure } = await authClient.signUp.email({ name: s.name.trim(), email: email.trim().toLowerCase(), password, callbackURL: `${API_URL}/email-confirmado` });
    if (failure) {
      setBusy(false);
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
    <OnboardingShell step={4}>
      <View>
        <Title s={28}>Crie sua conta</Title>
        <Sans s={14} lh={1.5} c={colors.muted} style={{ marginTop: 8 }}>Assim seus registros ficam guardados, mesmo se você trocar de celular.</Sans>
      </View>
      <Field label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address" textContentType="emailAddress" />
      <Field label="Senha" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" textContentType="newPassword" placeholder="Pelo menos 8 caracteres" returnKeyType="go" onSubmitEditing={submit} />
      {error ? <Sans s={13} lh={1.45} c={colors.terraDark}>{error}</Sans> : null}
      <Spacer />
      <PrimaryButton label={busy ? 'Criando...' : 'Criar conta'} onPress={submit} />
    </OnboardingShell>
  );
}
