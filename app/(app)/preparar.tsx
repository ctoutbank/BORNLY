import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BIRTH, ENX, MALA, PLAN } from '@/content';
import { gestation, useStore } from '@/store';
import { colors } from '@/theme';
import { ArrowRight, ImageSlot, Press, Sans, Screen, Serif, TabTitle } from '@/ui';

export default function Preparar() {
  const { s } = useStore();
  const router = useRouter();
  const { week } = gestation(s);
  const enxAll = Object.values(ENX).flat();
  const malaAll = Object.values(MALA).flat();
  const birthAll = BIRTH.flatMap((b) => b[2]);
  const enxDone = enxAll.filter((l) => s.enx[l]).length;
  const malaDone = malaAll.filter((l) => s.mala[l]).length;
  const planDone = PLAN.filter(([t]) => (s.plan[t] || []).length).length;
  const birthDone = birthAll.filter((l) => s.birth[l]).length;
  const total = Math.round(((enxDone + malaDone + planDone + birthDone) / (enxAll.length + malaAll.length + PLAN.length + birthAll.length)) * 100);
  const rows = [
    { label: 'Enxoval', sub: `${enxDone} de ${enxAll.length} itens`, pct: enxDone / enxAll.length, href: '/enxoval' },
    { label: 'Mala da maternidade', sub: `${malaDone} de ${malaAll.length} itens separados`, pct: malaDone / malaAll.length, href: '/mala' },
    { label: 'Plano de parto', sub: `${planDone} de ${PLAN.length} tópicos`, pct: planDone / PLAN.length, href: '/plano' },
    { label: 'Para o nascimento', sub: `${birthDone} de ${birthAll.length} passos`, pct: birthDone / birthAll.length, href: '/nascimento' },
  ] as const;

  return (
    <Screen gap={20}>
      <TabTitle title="Preparar" sub={`Faltam cerca de ${Math.max(0, 40 - week)} semanas para a DPP.`} />
      <View style={{ height: 180, borderRadius: 30, overflow: 'hidden' }}>
        <ImageSlot label="foto · quarto do bebê ou mala pronta" style={StyleSheet.absoluteFill} />
        <View style={{ position: 'absolute', left: 14, bottom: 14, backgroundColor: 'rgba(251,247,242,.92)', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 }}>
          <Sans s={12.5} w={600}>{total}% de tudo pronto</Sans>
        </View>
      </View>
      <View style={{ gap: 10 }}>
        {rows.map((r) => (
          <Press key={r.label} onPress={() => router.push(r.href)} style={{ backgroundColor: colors.card, borderRadius: 26, padding: 18, gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Serif s={18}>{r.label}</Serif>
                <Sans s={12.5} c={colors.muted} style={{ marginTop: 3 }}>{r.sub}</Sans>
              </View>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}><ArrowRight color={colors.bg} w={8} h={13} /></View>
            </View>
            <View style={{ height: 6, borderRadius: 999, backgroundColor: colors.sand, overflow: 'hidden' }}>
              <View style={{ height: '100%', borderRadius: 999, backgroundColor: colors.caramel, width: `${Math.round(r.pct * 100)}%` }} />
            </View>
          </Press>
        ))}
      </View>
    </Screen>
  );
}
