import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { ClockIcon, FootIcon, HeartsBackdrop, InfoHeart, NoteCard } from '@/components/love';
import { useContent } from '@/content-provider';
import { fmt, useStore } from '@/store';
import { colors } from '@/theme';
import { Card, PageHeader, Press, PrimaryButton, Sans, Screen, TextButton, Title } from '@/ui';

const clock = (ms: number) => {
  const t = Math.floor(ms / 1000);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

export default function Chutes() {
  const { s, set, save, flash } = useStore();
  const tool = useContent().tools.kicks;
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const tick = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (startedAt) tick.current = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick.current);
  }, [startedAt]);

  const finish = async () => {
    if (!startedAt) return;
    const session = { startedAt: new Date(startedAt).toISOString(), endedAt: new Date().toISOString(), kicks: count };
    setStartedAt(null);
    setCount(0);
    const res = await save<{ id: string }>('/kicks', 'POST', session);
    if (res) {
      set((st) => ({ kicks: [{ id: res.id, ...session }, ...st.kicks] }));
      flash(`${session.kicks} movimentos registrados`);
    }
  };

  return (
    <Screen gap={20}>
      <PageHeader title="Movimentos" sub="Contador de movimentos do bebê" fallback="/hoje" />
      <View style={{ backgroundColor: colors.peach, borderRadius: 28, padding: 22, alignItems: 'center', gap: 6, overflow: 'hidden' }}>
        <HeartsBackdrop low />
        <Sans s={12} c={colors.mutedStrong}>{startedAt ? `Contando há ${clock(now - startedAt)}` : 'Escolha um momento tranquilo, deitada de lado'}</Sans>
        <Title s={72} lh={1.1}>{count}</Title>
        <Sans s={13} c={colors.mutedStrong}>movimentos</Sans>
        <Press
          accessibilityLabel="Registrar movimento"
          onPress={() => {
            if (!startedAt) {
              setStartedAt(Date.now());
              setNow(Date.now());
            }
            setCount((c) => c + 1);
          }}
          style={{ marginTop: 16, width: 184, height: 184, borderRadius: 92, backgroundColor: 'rgba(163,96,78,.14)', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 156, height: 156, borderRadius: 78, backgroundColor: colors.terra, alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <FootIcon color={colors.card} size={42} filled />
            <Title s={22} c={colors.card}>{startedAt ? 'Mexeu' : 'Começar'}</Title>
          </View>
        </Press>
        {startedAt ? (
          <View style={{ alignSelf: 'stretch', marginTop: 18, gap: 4 }}>
            <PrimaryButton label="Encerrar e salvar" onPress={finish} />
            <TextButton label="Descartar" onPress={() => { setStartedAt(null); setCount(0); }} />
          </View>
        ) : null}
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
      <View>
        <Title s={18} style={{ marginBottom: 12 }}>Registros</Title>
        {s.kicks.length ? (
          <Card style={{ paddingVertical: 4, paddingHorizontal: 18 }}>
            {s.kicks.slice(0, 20).map((k, i, all) => (
              <View key={k.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: i === all.length - 1 ? 0 : 1, borderBottomColor: colors.lineSoft }}>
                <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: colors.peach, alignItems: 'center', justifyContent: 'center' }}><FootIcon color={colors.terra} size={20} /></View>
                <View style={{ flex: 1 }}>
                  <Sans s={14} w={600}>{k.kicks} movimentos</Sans>
                  <Sans s={12} c={colors.muted}>{fmt(new Date(k.startedAt), { day: 'numeric', month: 'short' }).replace(/\./g, '')} · {new Date(k.startedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Sans>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><ClockIcon color={colors.muted} size={14} /><Sans s={12} c={colors.mutedStrong}>{clock(new Date(k.endedAt).getTime() - new Date(k.startedAt).getTime())}</Sans></View>
              </View>
            ))}
          </Card>
        ) : (
          <Sans s={13} c={colors.muted}>Nenhum registro ainda.</Sans>
        )}
      </View>
      <NoteCard>Se você notar que o bebê está se mexendo bem menos que o habitual, procure seu serviço de saúde ou a maternidade.</NoteCard>
    </Screen>
  );
}
