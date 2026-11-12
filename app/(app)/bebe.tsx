import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { babyFor, useContent } from '@/content-provider';
import { gestation, trimester, useStore } from '@/store';
import { colors } from '@/theme';
import { ArrowLeft, ArrowRight, BackButton, Card, Press, Sans, Screen, Title, useGoBack, useTopPad } from '@/ui';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(251,247,242,.94)', borderRadius: 24, paddingVertical: 14, paddingHorizontal: 16, shadowColor: colors.ink, shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } }}>
      <Sans s={11} c={colors.muted}>{label}</Sans>
      <Title s={22} lh={1.1} style={{ marginTop: 4 }} numberOfLines={1} adjustsFontSizeToFit>{value}</Title>
    </View>
  );
}

export default function Bebe() {
  const { s, set } = useStore();
  const router = useRouter();
  const back = useGoBack('/hoje');
  const top = useTopPad();
  const week = s.weekView ?? gestation(s).week;
  const baby = babyFor(week, useContent().weeks);
  const stepBtn = { width: 44, height: 44, borderRadius: 20, alignItems: 'center', justifyContent: 'center' } as const;

  return (
    <Screen padded={false}>
      <View style={{ height: 440, zIndex: 1 }}>
        <LinearGradient colors={['#EADBCD', colors.avatar]} style={StyleSheet.absoluteFill} />
        <Pressable accessibilityRole="button" accessibilityLabel="Abrir o bebê em 3D" onPress={() => router.push('/bebe-3d')} style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
          <View style={{ backgroundColor: colors.ink, borderRadius: 999, paddingVertical: 14, paddingHorizontal: 24 }}>
            <Sans s={14} w={600} c={colors.bg}>Ver o bebê em 3D</Sans>
          </View>
          <Sans s={12} c={colors.mutedStrong} style={{ marginTop: 10 }}>Gire e descubra o que já está se formando</Sans>
        </Pressable>
        <View style={{ position: 'absolute', top, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <BackButton onPress={back} />
          <View>
            <Title s={28} lh={1.15}>Semana {week}</Title>
            <Sans s={12} c={colors.mutedStrong} style={{ marginTop: 2 }}>{trimester(week)}</Sans>
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
          <Sans s={12} c={colors.muted}>Do tamanho de</Sans>
          <Title s={28} style={{ marginTop: 2 }}>{baby.size}</Title>
        </View>
        <View>
          <Title s={18}>Como seu bebê está crescendo</Title>
          <Sans s={14} lh={1.6} c={colors.body} style={{ marginTop: 8 }}>{baby.dev}</Sans>
        </View>
        <Card bg={colors.sand} style={{ paddingVertical: 20, paddingHorizontal: 22 }}>
          <Title s={18}>O que muda em você</Title>
          <Sans s={14} lh={1.55} c={colors.body} style={{ marginTop: 8 }}>{baby.you}</Sans>
        </Card>
        <Sans s={12} lh={1.5} c={colors.muted}>Medidas aproximadas. Cada bebê cresce no próprio ritmo; o acompanhamento oficial é o do seu pré-natal.</Sans>
      </View>
    </Screen>
  );
}
