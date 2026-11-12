import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { ClockIcon, HeartsBackdrop, InfoHeart, NoteCard, PulseIcon } from '@/components/love';
import { useContent } from '@/content-provider';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Card, PageHeader, Press, Sans, Screen, TextButton, Title } from '@/ui';

const span = (ms: number) => {
  const t = Math.max(0, Math.round(ms / 1000));
  if (t < 60) return `${t}s`;
  if (t < 3600) return `${Math.floor(t / 60)}min ${String(t % 60).padStart(2, '0')}s`;
  if (t < 86400) return `${Math.floor(t / 3600)}h ${String(Math.floor((t % 3600) / 60)).padStart(2, '0')}min`;
  return `${Math.floor(t / 86400)} ${Math.floor(t / 86400) === 1 ? 'dia' : 'dias'}`;
};
const hour = (d: string) => new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export default function Contracoes() {
  const { s, set, save, flash } = useStore();
  const tool = useContent().tools.contractions;
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const tick = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    tick.current = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick.current);
  }, []);

  const list = s.contractions; // mais recente primeiro
  const recent = list.filter((c) => now - new Date(c.startedAt).getTime() < 60 * 60 * 1000);
  const intervals = recent.slice(0, -1).map((c, i) => new Date(c.startedAt).getTime() - new Date(recent[i + 1].startedAt).getTime());
  const avgInterval = intervals.length ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 0;
  const avgDuration = recent.length ? recent.reduce((a, c) => a + new Date(c.endedAt).getTime() - new Date(c.startedAt).getTime(), 0) / recent.length : 0;

  const toggle = async () => {
    if (!startedAt) {
      setStartedAt(Date.now());
      setNow(Date.now());
      return;
    }
    const item = { startedAt: new Date(startedAt).toISOString(), endedAt: new Date().toISOString() };
    setStartedAt(null);
    const res = await save<{ id: string }>('/contractions', 'POST', item);
    if (res) set((st) => ({ contractions: [{ id: res.id, ...item }, ...st.contractions] }));
  };

  return (
    <Screen gap={20}>
      <PageHeader title="Contrações" sub="Cronômetro de duração e intervalo" fallback="/hoje" />
      <View style={{ backgroundColor: colors.peach, borderRadius: 28, padding: 22, alignItems: 'center', gap: 6, overflow: 'hidden' }}>
        <HeartsBackdrop low />
        <Sans s={12} c={colors.mutedStrong}>{startedAt ? 'Contração em andamento' : list[0] ? `Última há ${span(now - new Date(list[0].startedAt).getTime())}` : 'Toque quando a contração começar'}</Sans>
        <Title s={52} lh={1.1}>{startedAt ? span(now - startedAt) : '0s'}</Title>
        <Press accessibilityLabel={startedAt ? 'Terminou' : 'Começou'} onPress={toggle} style={{ marginTop: 14, width: 184, height: 184, borderRadius: 92, backgroundColor: 'rgba(163,96,78,.14)', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 156, height: 156, borderRadius: 78, backgroundColor: startedAt ? colors.terraDark : colors.terra, alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <PulseIcon color={colors.card} size={28} />
            <Title s={22} c={colors.card}>{startedAt ? 'Terminou' : 'Começou'}</Title>
          </View>
        </Press>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Card style={{ flex: 1, padding: 16 }}>
          <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.peach, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}><ClockIcon color={colors.terra} size={16} /></View>
          <Sans s={11} c={colors.muted}>Duração média (1h)</Sans>
          <Title s={20} style={{ marginTop: 4 }}>{recent.length ? span(avgDuration) : '–'}</Title>
        </Card>
        <Card style={{ flex: 1, padding: 16 }}>
          <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}><PulseIcon color={colors.sageInk} size={16} /></View>
          <Sans s={11} c={colors.muted}>Intervalo médio (1h)</Sans>
          <Title s={20} style={{ marginTop: 4 }}>{intervals.length ? span(avgInterval) : '–'}</Title>
        </Card>
      </View>
      {tool?.text ? (
        <Card style={{ padding: 20, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' }}><InfoHeart color={colors.sageInk} size={18} /></View>
            <Title s={17}>Como usar</Title>
          </View>
          <Sans s={14} lh={1.55} c={colors.body}>{tool.text}</Sans>
        </Card>
      ) : null}
      {list.length ? (
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Title s={18}>Registros</Title>
            <TextButton label="Limpar" onPress={() => save('/contractions', 'DELETE', undefined, { contractions: [] }).then((ok) => ok && flash('Registros apagados'))} />
          </View>
          <Card style={{ paddingVertical: 4, paddingHorizontal: 18 }}>
            {list.slice(0, 30).map((c, i, all) => (
              <View key={c.id} style={{ flexDirection: 'row', paddingVertical: 13, borderBottomWidth: i === all.length - 1 ? 0 : 1, borderBottomColor: colors.lineSoft }}>
                <Sans s={14} w={600} style={{ flex: 1 }}>{hour(c.startedAt)}</Sans>
                <Sans s={13} c={colors.mutedStrong} style={{ width: 96 }}>{span(new Date(c.endedAt).getTime() - new Date(c.startedAt).getTime())}</Sans>
                <Sans s={13} c={colors.muted} style={{ width: 96, textAlign: 'right' }}>{all[i + 1] ? 'a cada ' + span(new Date(c.startedAt).getTime() - new Date(all[i + 1].startedAt).getTime()) : ''}</Sans>
              </View>
            ))}
          </Card>
        </View>
      ) : null}
      <NoteCard>Perda de líquido, sangramento, febre ou diminuição dos movimentos do bebê: procure a maternidade, independentemente das contrações.</NoteCard>
    </Screen>
  );
}
