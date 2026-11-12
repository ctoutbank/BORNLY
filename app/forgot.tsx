import { useState } from 'react';
import { View } from 'react-native';

import { API_URL, authClient } from '@/auth-client';
import { colors } from '@/theme';
import { BackButton, Field, PrimaryButton, Sans, Screen, Spacer, Title, useGoBack } from '@/ui';

export default function Forgot() {
  const back = useGoBack('/welcome');
  const [email, setEmail] = useState('');
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
      <View>
        <Title s={28}>Redefinir senha</Title>
        <Sans s={14} lh={1.5} c={colors.muted} style={{ marginTop: 8 }}>Enviaremos um link para o seu e-mail.</Sans>
      </View>
      <Field label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address" />
      {state === 'sent' ? <Sans s={13} lh={1.45} c={colors.sageInk}>Se houver uma conta com este e-mail, o link chega em alguns minutos.</Sans> : null}
      {state === 'error' ? <Sans s={13} lh={1.45} c={colors.terraDark}>Não foi possível enviar. Verifique sua conexão e tente de novo.</Sans> : null}
      <Spacer />
      <PrimaryButton label={state === 'busy' ? 'Enviando...' : 'Enviar link'} onPress={submit} />
    </Screen>
  );
}
