import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { MOMENTS } from '@/content';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { OnboardingShell, Press, PrimaryButton, Sans, Spacer, Title } from '@/ui';

const line = (c: string) => ({ stroke: c, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });
// Cada momento tem sua cor de fundo e um ícone; o escolhido fica em terracota.
const LOOK: Record<string, { bg: string; ink: string; icon: (c: string) => React.ReactNode }> = {
  descobri: { bg: colors.peach, ink: colors.terra, icon: (c) => <Svg width={24} height={24} viewBox="0 0 24 24"><Rect x="8" y="3" width="8" height="18" rx="3" {...line(c)} /><Path d="M10.5 9v3M13.5 9v3" {...line(c)} /></Svg> },
  tentante: { bg: colors.sage, ink: colors.sageInk, icon: (c) => <Svg width={24} height={24} viewBox="0 0 24 24"><Rect x="4" y="5" width="16" height="15" rx="3" {...line(c)} /><Path d="M4 10h16M9 3v4M15 3v4" {...line(c)} /><Path d="M12 17.5s-2.6-1.6-2.6-3.3a1.4 1.4 0 0 1 2.6-.8 1.4 1.4 0 0 1 2.6.8c0 1.7-2.6 3.3-2.6 3.3z" fill={c} /></Svg> },
  gravida: { bg: colors.sand, ink: colors.mutedStrong, icon: (c) => <Svg width={24} height={24} viewBox="0 0 24 24"><Circle cx="11" cy="5" r="2.2" {...line(c)} /><Path d="M9.5 8.5C8 11 8 14 9 16.5L8 21M12 8.5c3.5.8 5.5 3.5 5 6.5-.4 2.2-2.4 3-4.5 2.5L13 21" {...line(c)} /></Svg> },
};

export default function Moment() {
  const { s, set } = useStore();
  const router = useRouter();
  return (
    <OnboardingShell step={1} gap={24}>
      <View>
        <Title s={28}>Em que momento você está?</Title>
        <Sans s={14} lh={1.5} c={colors.muted} style={{ marginTop: 8 }}>Assim o Bornly mostra o que faz sentido para você agora.</Sans>
      </View>
      <View style={{ gap: 10 }}>
        {MOMENTS.map(([id, label, sub]) => {
          const on = s.moment === id;
          const look = LOOK[id];
          return (
            <Press key={id} accessibilityRole="radio" accessibilityLabel={`${label}. ${sub}`} accessibilityState={{ selected: on }} onPress={() => set({ moment: id })} style={{ padding: 18, borderRadius: 26, backgroundColor: on ? colors.terra : look.bg, minHeight: 104, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: on ? 'rgba(251,247,242,.18)' : colors.card, alignItems: 'center', justifyContent: 'center' }}>{look.icon(on ? colors.card : look.ink)}</View>
                {on ? <Sans s={11} w={700} c={colors.card}>ESCOLHIDO</Sans> : null}
              </View>
              <View style={{ marginTop: 12 }}>
                <Title s={18} c={on ? colors.card : colors.ink}>{label}</Title>
                <Sans s={12} c={on ? 'rgba(251,247,242,.82)' : colors.mutedStrong} style={{ marginTop: 2 }}>{sub}</Sans>
              </View>
            </Press>
          );
        })}
      </View>
      {s.moment === 'tentante' ? (
        <View style={{ backgroundColor: colors.sage, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16 }}>
          <Sans s={13} lh={1.5} c={colors.sageInk}>Vamos acompanhar seu ciclo e sua saúde. Nada sobre gestação aparece até você nos contar que confirmou.</Sans>
        </View>
      ) : null}
      <Spacer />
      <PrimaryButton label="Continuar" onPress={() => router.push('/date')} />
    </OnboardingShell>
  );
}
