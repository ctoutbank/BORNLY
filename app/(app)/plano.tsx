import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useContent } from '@/content-provider';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Card, Chip, PageHeader, PrimaryButton, Sans, Screen, Title, Wrap } from '@/ui';

const esc = (t: string) => t.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);

export default function Plano() {
  const { s, save, flash } = useStore();
  const PLAN = useContent().birthPlan.map((p) => [p.topic, p.options] as const);
  const done = PLAN.filter(([t]) => (s.plan[t] || []).length).length;

  const exportPdf = async () => {
    const rows = PLAN.map(([topic]) => `<h2>${esc(topic)}</h2><p>${esc((s.plan[topic] || []).join(', ') || 'Sem preferência registrada')}</p>`).join('');
    const html = `<html lang="pt-BR"><head><meta charset="utf-8"><style>body{font-family:Georgia,serif;color:#2A2522;padding:40px}h1{font-weight:400;font-size:30px;margin:0 0 6px}h2{font-size:16px;margin:24px 0 4px}p{font:14px/1.5 Helvetica,Arial,sans-serif;margin:0}small{font:12px Helvetica,Arial,sans-serif;color:#6F635B}</style></head><body><h1>Plano de parto</h1><small>${esc(s.name)}</small>${rows}<p style="margin-top:32px;color:#6F635B;font-size:12px">Este documento registra preferências e não substitui a avaliação clínica da equipe do parto.</p></body></html>`;
    try {
      if (Platform.OS === 'web') return await Print.printAsync({ html });
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: 'Plano de parto' });
    } catch {
      flash('Não foi possível gerar o PDF.');
    }
  };

  return (
    <Screen gap={18}>
      <PageHeader title="Plano de parto" sub={`${done} de ${PLAN.length} tópicos preenchidos`} fallback="/preparar" />
      <Sans s={13} lh={1.5} c={colors.body} style={{ paddingHorizontal: 2 }}>Suas preferências para conversar com a equipe do parto. O documento registra desejos e não substitui a avaliação clínica.</Sans>
      {PLAN.map(([topic, opts]) => {
        const cur = s.plan[topic] || [];
        return (
          <Card key={topic} radius={24} style={{ padding: 18 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Title s={16}>{topic}</Title>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: cur.length ? colors.sageDot : colors.track }} />
            </View>
            <Wrap gap={6}>
              {opts.map((o) => {
                const on = cur.includes(o);
                const options = on ? cur.filter((x) => x !== o) : [...cur, o];
                return <Chip key={o} compact label={o} on={on} offBg={colors.bg} offBorder={colors.bg} onPress={() => save('/birth-plan', 'PUT', { topic, options }, (st) => ({ plan: { ...st.plan, [topic]: options } }))} />;
              })}
            </Wrap>
          </Card>
        );
      })}
      <PrimaryButton
        label="Exportar em PDF"
        onPress={exportPdf}
        icon={<Svg width={14} height={16} viewBox="0 0 14 16"><Path d="M7 1v10M3 7l4 4 4-4M1 15h12" stroke={colors.bg} strokeWidth={1.7} fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg>}
      />
    </Screen>
  );
}
