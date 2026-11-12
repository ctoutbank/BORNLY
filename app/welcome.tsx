import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { WelcomeArt } from '@/components/welcome-art';
import { colors } from '@/theme';
import { Press, Sans, Title, TextButton, useTopPad } from '@/ui';

export default function Welcome() {
  const router = useRouter();
  const top = useTopPad();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, marginTop: top, marginHorizontal: 14, borderRadius: 36, overflow: 'hidden', backgroundColor: colors.photo }}>
        <WelcomeArt />
        <View style={{ position: 'absolute', top: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title s={22} lh={1.05}>Bornly</Title>
          <View style={{ backgroundColor: 'rgba(251,247,242,.85)', borderRadius: 999, paddingVertical: 7, paddingHorizontal: 12 }}>
            <Sans s={11} w={600} c={colors.mutedStrong}>Da descoberta ao pós-parto</Sans>
          </View>
        </View>
      </View>
      <View style={{ paddingTop: 28, paddingHorizontal: 26, paddingBottom: Math.max(insets.bottom, 16) + 12, gap: 12 }}>
        <Title s={28}>Sua gravidez merece cuidado em cada etapa.</Title>
        <Sans s={15} lh={1.55} c={colors.mutedStrong}>Vamos acompanhar esse momento juntas?</Sans>
        <Press onPress={() => router.push('/moment')} style={{ marginTop: 10, height: 58, borderRadius: 999, backgroundColor: colors.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 26, paddingRight: 8 }}>
          <Sans s={15} w={600} c={colors.bg}>Começar</Sans>
          <View style={{ width: 42, height: 42, borderRadius: 20, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={18} height={14} viewBox="0 0 16 12"><Path d="M1 6h13M9.5 1.5L14 6l-4.5 4.5" stroke={colors.ink} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg>
          </View>
        </Press>
        <TextButton label="Já tenho uma conta" onPress={() => router.push('/login')} />
      </View>
    </View>
  );
}
