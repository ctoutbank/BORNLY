import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { api } from '@/api';
import { authClient, authErrorMessage } from '@/auth-client';
import { profilePayload } from '@/profile';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { BackButton, Field, PrimaryButton, Sans, Screen, Spacer, TextButton, Title, useGoBack } from '@/ui';

export default function Login() {
  const { s, set, load, flash } = useStore();
  const router = useRouter();
  const back = useGoBack('/welcome');
  // from=cadastro: veio do meio do cadastro, com as respostas já preenchidas.
  const params = useLocalSearchParams<{ email?: string; from?: string }>();
  const fromSignup = params.from === 'cadastro';
  const [email, setEmail] = useState(params.email ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    const { error: failure } = await authClient.signIn.email({ email: email.trim().toLowerCase(), password });
    if (failure) {
      setBusy(false);
      return setError(authErrorMessage(failure));
    }
    const loaded = await load();
    // Conta sem perfil: aproveita o que ela acabou de responder no cadastro, em vez de perguntar de novo.
    if (loaded && !loaded.hasProfile && fromSignup && s.name.trim()) {
      const name = s.name.trim();
      await authClient.updateUser({ name }).catch(() => undefined);
      if (!s.hasConsent) {
        // Ainda falta a autorização de dados: a tela Pronto pede e salva o perfil com as respostas do cadastro.
        set({ name });
        if (router.canDismiss()) router.dismissAll();
        router.replace('/ready');
        return;
      }
      try {
        await api('/profile', 'PUT', profilePayload(s, true));
        await load();
      } catch {
        // Sem perfil, o app leva de volta ao cadastro inicial.
      }
    } else if (loaded && loaded.hasProfile && fromSignup) {
      flash('Você entrou na sua conta. Seus dados guardados foram mantidos.');
    }
    if (router.canDismiss()) router.dismissAll();
    router.replace('/hoje');
  };

  return (
    <Screen gap={24} bottom={32}>
      <View style={{ alignItems: 'flex-start' }}><BackButton onPress={back} light /></View>
      <View>
        <Title s={28}>Entrar</Title>
        <Sans s={14} lh={1.5} c={colors.muted} style={{ marginTop: 8 }}>Que bom ter você de volta.</Sans>
      </View>
      <Field label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address" textContentType="emailAddress" />
      <Field label="Senha" value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" textContentType="password" returnKeyType="go" onSubmitEditing={submit} autoFocus={!!params.email} />
      {error ? <Sans s={13} lh={1.45} c={colors.terraDark}>{error}</Sans> : null}
      <Spacer />
      <View style={{ gap: 4 }}>
        <PrimaryButton label={busy ? 'Entrando...' : 'Entrar'} onPress={submit} />
        <TextButton label="Esqueci minha senha" onPress={() => router.push({ pathname: '/forgot', params: { email: email.trim() } })} />
        <TextButton label="Ainda não tenho conta" onPress={() => (fromSignup ? back() : router.push('/moment'))} />
      </View>
    </Screen>
  );
}
