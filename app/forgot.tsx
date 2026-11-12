import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { API_URL, authClient } from '@/auth-client';
import { HeartsBackdrop, MailIcon } from '@/components/love';
import { colors } from '@/theme';
import { BackButton, Field, PrimaryButton, Sans, Screen, Spacer, TextButton, Title, useGoBack } from '@/ui';

export default function Forgot() {
  const back = useGoBack('/welcome');
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email ?? '');
  const [state, setState] = useState<'idle' | 'busy' | 'sent' | 'error'>('idle');

  const submit = async () => {
    if (state === 'busy') return;
    setState('busy');
    const { error } = await authClient.requestPasswordReset({ email: email.trim().toLowerCase(), redirectTo: `${API_URL}/redefinir-senha` });
    setState(error ? 'error' : 'sent');
  };

  return (
    <Screen gap={24} bottom={32}>
      <View style={{ alignItems: 'flex-start' }}><BackButton onPress={back} light /></View>
      <View style={{ backgroundColor: colors.peach, borderRadius: 28, padding: 20, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <HeartsBackdrop />
        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' }}><MailIcon color={colors.terra} /></View>
        <View style={{ flex: 1 }}>
          <Title s={28}>Redefinir senha</Title>
          <Sans s={14} lh={1.4} c={colors.mutedStrong} style={{ marginTop: 2 }}>Enviaremos um link para o seu e-mail.</Sans>
        </View>
      </View>
      <Field label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address" returnKeyType="go" onSubmitEditing={submit} />
      {state === 'sent' ? <Sans s={13} lh={1.45} c={colors.sageInk}>Se houver uma conta com este e-mail, o link chega em alguns minutos.</Sans> : null}
      {state === 'error' ? <Sans s={13} lh={1.45} c={colors.terraDark}>Não foi possível enviar. Verifique sua conexão e tente de novo.</Sans> : null}
      <Spacer />
      {state === 'sent' ? (
        <PrimaryButton label="Voltar para entrar" onPress={() => router.replace({ pathname: '/login', params: { email: email.trim().toLowerCase() } })} />
      ) : (
        <PrimaryButton label={state === 'busy' ? 'Enviando...' : 'Enviar link'} onPress={submit} />
      )}
      {state === 'sent' ? <TextButton label="Reenviar o link" onPress={submit} /> : null}
    </Screen>
  );
}
