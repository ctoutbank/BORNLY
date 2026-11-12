import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Easing, Image, Pressable } from 'react-native';

import { authClient } from '@/auth-client';

// Continuação da abertura nativa: mesma imagem, mesmo fundo e mesma posição (configurados no app.json),
// para não parecer uma segunda tela. Segue assim que souber se há sessão.
const SPLASH_BG = '#F3E1D8';
const SPLASH_SIZE = 200;
const MIN_MS = 350;

export default function Splash() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [ready, setReady] = useState(false);
  const [pulse] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    const t = setTimeout(() => setReady(true), MIN_MS);
    return () => {
      loop.stop();
      clearTimeout(t);
    };
  }, [pulse]);

  // Quem já entrou vai direto para o app; a sessão fica guardada no aparelho.
  useEffect(() => {
    if (ready && !isPending) router.replace(session ? '/hoje' : '/welcome');
  }, [ready, isPending, router, session]);

  return (
    <Pressable accessibilityLabel="Abrir o Bornly" onPress={() => !isPending && router.replace(session ? '/hoje' : '/welcome')} style={{ flex: 1, backgroundColor: SPLASH_BG, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] }) }] }}>
        <Image source={require('../assets/splash-icon.png')} style={{ width: SPLASH_SIZE, height: SPLASH_SIZE }} accessibilityIgnoresInvertColors />
      </Animated.View>
    </Pressable>
  );
}
