import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { babyFor, gestation, trimester, useStore } from '@/store';
import { colors } from '@/theme';
import { ArrowLeft, ArrowRight, BackButton, Card, ImageSlot, Press, Sans, Screen, Serif, useGoBack, useTopPad } from '@/ui';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(251,247,242,.94)', borderRadius: 24, paddingVertical: 14, paddingHorizontal: 16, shadowColor: colors.ink, shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } }}>
      <Sans s={11.5} c={colors.muted}>{label}</Sans>
      <Serif s={24} lh={1.1} style={{ marginTop: 4 }} numberOfLines={1} adjustsFontSizeToFit>{value}</Serif>
    </View>
  );
}

export default function Bebe() {
  const { s, set } = useStore();
  const back = useGoBack('/hoje');
  const top = useTopPad();
  const week = s.weekView ?? gestation(s).week;
  const baby = babyFor(week);
  const stepBtn = { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' } as const;

  return (
    <Screen padded={false}>
      <View style={{ height: 440, zIndex: 1 }}>
        <LinearGradient colors={['#EADBCD', colors.avatar]} style={StyleSheet.absoluteFill} />
        <ImageSlot label="ilustração do bebê · semana atual" style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]} />
        <View style={{ position: 'absolute', top, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <BackButton onPress={back} />
          <View>
            <Serif s={22} lh={1.15}>Semana {week}</Serif>
            <Sans s={12.5} c={colors.mutedStrong} style={{ marginTop: 2 }}>{trimester(week)}</Sans>
          </View>
        </View>
        <View style={{ position: 'absolute', left: 20, right: 20, bottom: -40, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Press accessibilityLabel="Semana anterior" onPress={() => set({ weekView: Math.max(4, week - 1) })} style={[stepBtn, { backgroundColor: colors.card }]}><ArrowLeft color={colors.ink} /></Press>
          <Stat label="Comprimento" value={baby.cm} />
          <Stat label="Peso" value={baby.kg} />
          <Press accessibilityLabel="Próxima semana" onPress={() => set({ weekView: Math.min(41, week + 1) })} style={[stepBtn, { backgroundColor: colors.ink }]}><ArrowRight color={colors.bg} /></Press>
        </View>
      </View>
      <View style={{ paddingTop: 64, paddingHorizontal: 22, gap: 20 }}>
        <View>
          <Sans s={12.5} c={colors.muted}>Do tamanho de</Sans>
          <Serif s={26} style={{ marginTop: 2 }}>{baby.size}</Serif>
        </View>
        <View>
          <Serif s={18}>Como seu bebê está crescendo</Serif>
          <Sans s={14.5} lh={1.6} c={colors.body} style={{ marginTop: 8 }}>{baby.dev}</Sans>
        </View>
        <Card bg={colors.sand} style={{ paddingVertical: 20, paddingHorizontal: 22 }}>
          <Serif s={18}>O que muda em você</Serif>
          <Sans s={14} lh={1.55} c={colors.body} style={{ marginTop: 8 }}>{baby.you}</Sans>
        </Card>
        <Sans s={12} lh={1.5} c={colors.muted}>Medidas aproximadas. Cada bebê cresce no próprio ritmo; o acompanhamento oficial é o do seu pré-natal.</Sans>
      </View>
    </Screen>
  );
}
