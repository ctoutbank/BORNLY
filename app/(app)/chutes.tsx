import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

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
      <PageHeader title={tool?.title ?? 'Contador de movimentos'} sub="Movimentos do bebê" fallback="/hoje" />
      <Card radius={28} style={{ padding: 22, alignItems: 'center', gap: 6 }}>
        <Sans s={12} c={colors.muted}>{startedAt ? `Contando há ${clock(now - startedAt)}` : 'Escolha um momento tranquilo, deitada de lado'}</Sans>
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
          style={{ marginTop: 16, width: 168, height: 168, borderRadius: 84, backgroundColor: colors.terra, alignItems: 'center', justifyContent: 'center' }}>
          <Title s={22} c={colors.bg}>{startedAt ? 'Mexeu' : 'Começar'}</Title>
        </Press>
        {startedAt ? (
          <View style={{ alignSelf: 'stretch', marginTop: 18, gap: 4 }}>
            <PrimaryButton label="Encerrar e salvar" onPress={finish} />
            <TextButton label="Descartar" onPress={() => { setStartedAt(null); setCount(0); }} />
          </View>
        ) : null}
      </Card>
      {tool?.text ? (
        <Card bg={colors.sand} style={{ padding: 20 }}>
          <Sans s={14} lh={1.55} c={colors.body}>{tool.text}</Sans>
        </Card>
      ) : null}
      <View>
        <Title s={18} style={{ marginBottom: 12 }}>Registros</Title>
        {s.kicks.length ? (
          <Card style={{ paddingVertical: 4, paddingHorizontal: 18 }}>
            {s.kicks.slice(0, 20).map((k, i, all) => (
              <View key={k.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: i === all.length - 1 ? 0 : 1, borderBottomColor: colors.lineSoft }}>
                <View style={{ flex: 1 }}>
                  <Sans s={14} w={600}>{k.kicks} movimentos</Sans>
                  <Sans s={12} c={colors.muted}>{fmt(new Date(k.startedAt), { day: 'numeric', month: 'short' }).replace(/\./g, '')} · {new Date(k.startedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Sans>
                </View>
                <Sans s={12} c={colors.mutedStrong}>{clock(new Date(k.endedAt).getTime() - new Date(k.startedAt).getTime())}</Sans>
              </View>
            ))}
          </Card>
        ) : (
          <Sans s={13} c={colors.muted}>Nenhum registro ainda.</Sans>
        )}
      </View>
      <Sans s={11} lh={1.5} c={colors.muted}>Se você notar que o bebê está se mexendo bem menos que o habitual, procure seu serviço de saúde ou a maternidade.</Sans>
    </Screen>
  );
}
