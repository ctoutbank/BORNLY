import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useContent } from '@/content-provider';
import { BagIcon, DocHeartIcon, HouseHeartIcon, OnesieIcon } from '@/components/love';
import { gestation, useStore } from '@/store';
import { colors } from '@/theme';
import { ArrowRight, Press, Sans, Screen, Title, TabTitle } from '@/ui';

export default function Preparar() {
  const { s } = useStore();
  const router = useRouter();
  const { week } = gestation(s);
  const c = useContent();
  const ENX = Object.fromEntries(c.checklists.enxoval.map((g) => [g.group, g.items]));
  const MALA = Object.fromEntries(c.checklists.mala.map((g) => [g.group, g.items]));
  const BIRTH = c.checklists.nascimento.map((g) => [g.group, g.range, g.items] as const);
  const PLAN = c.birthPlan.map((p) => [p.topic, p.options] as const);
  const enxAll = [...Object.values(ENX).flat(), ...s.customItems.filter((c) => c.list === 'enxoval').map((c) => c.label)];
  const malaAll = Object.values(MALA).flat();
  const birthAll = BIRTH.flatMap((b) => b[2]);
  const enxDone = enxAll.filter((l) => s.enx[l]).length;
  const malaDone = malaAll.filter((l) => s.mala[l]).length;
  const planDone = PLAN.filter(([t]) => (s.plan[t] || []).length).length;
  const birthDone = birthAll.filter((l) => s.birth[l]).length;
  const total = Math.round(((enxDone + malaDone + planDone + birthDone) / (enxAll.length + malaAll.length + PLAN.length + birthAll.length)) * 100);
  const rows = [
    { icon: OnesieIcon, bg: colors.peach, ink: colors.terra, label: 'Enxoval', sub: `${enxDone} de ${enxAll.length} itens`, pct: enxDone / enxAll.length, href: '/enxoval' },
    { icon: BagIcon, bg: colors.sage, ink: colors.sageInk, label: 'Mala da maternidade', sub: `${malaDone} de ${malaAll.length} itens separados`, pct: malaDone / malaAll.length, href: '/mala' },
    { icon: DocHeartIcon, bg: colors.avatar, ink: colors.terraDark, label: 'Plano de parto', sub: `${planDone} de ${PLAN.length} tópicos`, pct: planDone / PLAN.length, href: '/plano' },
    { icon: HouseHeartIcon, bg: colors.sand, ink: colors.mutedStrong, label: 'Para o nascimento', sub: `${birthDone} de ${birthAll.length} passos`, pct: birthDone / birthAll.length, href: '/nascimento' },
  ] as const;

  return (
    <Screen gap={20}>
      <TabTitle title="Preparar" sub={`Faltam cerca de ${Math.max(0, 40 - week)} semanas para a DPP.`} />
      <View style={{ backgroundColor: colors.peach, borderRadius: 28, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 18, overflow: 'hidden' }}>
        <View style={{ width: 96, height: 96, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={96} height={96} viewBox="0 0 96 96" style={StyleSheet.absoluteFill}>
            <Circle cx="48" cy="48" r="40" stroke={colors.card} strokeWidth={10} fill="none" />
            {total > 0 ? <Circle cx="48" cy="48" r="40" stroke={colors.terra} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={`${(2 * Math.PI * 40 * total) / 100} ${2 * Math.PI * 40}`} transform="rotate(-90 48 48)" /> : null}
          </Svg>
          <Title s={24}>{total}%</Title>
        </View>
        <View style={{ flex: 1 }}>
          <Title s={18} lh={1.25}>{total >= 100 ? 'Tudo pronto' : total ? 'Seu preparo está andando' : 'Vamos começar o preparo'}</Title>
          <Sans s={13} lh={1.45} c={colors.mutedStrong} style={{ marginTop: 4 }}>Enxoval, mala, plano de parto e os passos para o nascimento.</Sans>
        </View>
      </View>
      <View style={{ gap: 10 }}>
        {rows.map((r) => (
          <Press key={r.label} onPress={() => router.push(r.href)} style={{ backgroundColor: colors.card, borderRadius: 24, padding: 18, gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: r.bg, alignItems: 'center', justifyContent: 'center' }}><r.icon color={r.ink} /></View>
              <View style={{ flex: 1 }}>
                <Title s={16}>{r.label}</Title>
                <Sans s={12} lh={1.35} c={colors.muted} style={{ marginTop: 3 }}>{r.sub}</Sans>
              </View>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.peach, alignItems: 'center', justifyContent: 'center' }}><ArrowRight color={colors.terra} w={10} h={17} /></View>
            </View>
            <View style={{ height: 6, borderRadius: 999, backgroundColor: colors.sand, overflow: 'hidden' }}>
              <View style={{ height: '100%', borderRadius: 999, backgroundColor: colors.terra, width: `${Math.round(r.pct * 100)}%` }} />
            </View>
          </Press>
        ))}
      </View>
    </Screen>
  );
}
