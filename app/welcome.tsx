import { useRouter } from 'expo-router';
import { Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/theme';
import { Press, Sans, Serif, TextButton, useTopPad } from '@/ui';

export default function Welcome() {
  const router = useRouter();
  const top = useTopPad();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, marginTop: top, marginHorizontal: 14, borderRadius: 36, overflow: 'hidden', backgroundColor: colors.photo }}>
        <Image source={require('../assets/images/welcome.webp')} accessibilityLabel="Gestante em luz natural" resizeMode="cover" style={{ width: '100%', height: '100%' }} />
        <View style={{ position: 'absolute', top: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Serif s={22} lh={1.05}>Bornly</Serif>
          <View style={{ backgroundColor: 'rgba(251,247,242,.85)', borderRadius: 999, paddingVertical: 7, paddingHorizontal: 12 }}>
            <Sans s={11.5} w={600} c={colors.mutedStrong}>Da descoberta ao pós-parto</Sans>
          </View>
        </View>
      </View>
      <View style={{ paddingTop: 28, paddingHorizontal: 26, paddingBottom: Math.max(insets.bottom, 16) + 12, gap: 12 }}>
        <Serif s={29}>Sua gravidez merece cuidado em cada etapa.</Serif>
        <Sans s={15} lh={1.55} c={colors.mutedStrong}>Vamos acompanhar esse momento juntas?</Sans>
        <Press onPress={() => router.push('/moment')} style={{ marginTop: 10, height: 58, borderRadius: 999, backgroundColor: colors.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 26, paddingRight: 8 }}>
          <Sans s={15.5} w={600} c={colors.bg}>Começar</Sans>
          <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={16} height={12} viewBox="0 0 16 12"><Path d="M1 6h13M9.5 1.5L14 6l-4.5 4.5" stroke={colors.ink} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg>
          </View>
        </Press>
        <TextButton label="Já tenho uma conta" onPress={() => router.replace('/hoje')} />
      </View>
    </View>
  );
}
