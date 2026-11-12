import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { authClient } from '@/auth-client';
import { BottomNav } from '@/components/bottom-nav';
import { MoodSheet } from '@/components/mood-sheet';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { PrimaryButton, Sans } from '@/ui';

const TAB_ROOTS = ['hoje', 'saude', 'preparar', 'aprender'] as const;

export default function AppLayout() {
  const { data: session, isPending } = authClient.useSession();
  const { s, load } = useStore();
  const [failed, setFailed] = useState(false);
  const userId = session?.user.id;

  useEffect(() => {
    if (userId && !s.loaded) load().then((ok) => setFailed(!ok));
  }, [userId, s.loaded, load]);

  // Logo após o login a sessão ainda pode estar atualizando; os dados já carregados confirmam a entrada.
  if (!isPending && !session && !s.loaded) return <Redirect href="/welcome" />;

  if (!s.loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        {failed ? (
          <>
            <Sans s={14} lh={1.5} c={colors.mutedStrong} style={{ textAlign: 'center' }}>Não foi possível carregar seus dados. Verifique sua conexão.</Sans>
            <View style={{ alignSelf: 'stretch' }}><PrimaryButton label="Tentar de novo" onPress={() => load().then((ok) => setFailed(!ok))} /></View>
          </>
        ) : (
          <ActivityIndicator color={colors.ink} />
        )}
      </View>
    );
  }

  // Conta criada sem terminar o cadastro inicial.
  if (!s.hasProfile) return <Redirect href="/moment" />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        {TAB_ROOTS.map((name) => (
          <Stack.Screen key={name} name={name} options={{ animation: 'none', gestureEnabled: false }} />
        ))}
      </Stack>
      <BottomNav />
      <MoodSheet />
    </View>
  );
}
