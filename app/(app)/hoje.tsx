import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View, type ScrollViewInstance } from 'react-native';

import { FEELINGS } from '@/content';
import { babyFor, dailyMessage, useContent } from '@/content-provider';
import { fmt, gestation, nextAppointment, todayIso, trimester, useStore } from '@/store';
import { BabyArt } from '@/components/baby-art';
import { colors, fonts } from '@/theme';
import { BookIcon, CalendarIcon, Card, Overline, Plus, Press, RowButton, Sans, Screen, Title } from '@/ui';

// Faixa rolável com todas as semanas (4 a 41). Abre centrada na semana atual; tocar escolhe a semana mostrada abaixo.
const DOT = 44;
const GAP = 6;
function Ruler({ current, selected, onPick }: { current: number; selected: number; onPick: (n: number) => void }) {
  const ref = useRef<ScrollViewInstance>(null);
  const [w, setW] = useState(0);
  const offsetFor = useCallback((n: number) => Math.max(0, (n - 4) * (DOT + GAP) - (w - DOT) / 2), [w]);
  const [contentW, setContentW] = useState(0);
  const first = useRef(true);
  // rola só quando a faixa e as semanas já foram medidas; na primeira vez, sem animação
  useEffect(() => {
    if (!w || !contentW) return;
    ref.current?.scrollTo({ x: offsetFor(selected), animated: !first.current });
    first.current = false;
  }, [w, contentW, selected, offsetFor]);
  const weeks = Array.from({ length: 38 }, (_, i) => i + 4);
  return (
    <ScrollView ref={ref} horizontal showsHorizontalScrollIndicator={false} onLayout={(e) => setW(e.nativeEvent.layout.width)} onContentSizeChange={(cw) => setContentW(cw)} contentContainerStyle={{ paddingHorizontal: 20, gap: GAP, alignItems: 'center' }} snapToInterval={DOT + GAP} decelerationRate="fast">
      {weeks.map((n) => {
        const on = n === selected;
        const isNow = n === current;
        return (
          <Press key={n} accessibilityLabel={`Semana ${n}${isNow ? ', semana atual' : ''}`} accessibilityState={{ selected: on }} onPress={() => onPick(n)} style={{ width: DOT, height: DOT, borderRadius: DOT / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? colors.terra : isNow ? colors.peach : 'transparent' }}>
            <Sans s={on ? 16 : 13} w={600} c={on ? colors.bg : isNow ? colors.terra : n < current ? colors.mutedStrong : '#B3A397'}>{n}</Sans>
          </Press>
        );
      })}
    </ScrollView>
  );
}

export default function Hoje() {
  const { s, set } = useStore();
  const router = useRouter();
  const g = gestation(s);
  const content = useContent();
  // semana mostrada no cartão do bebê: a atual, ou a escolhida na faixa de semanas
  const [shown, setShown] = useState(g.week);
  const baby = babyFor(shown, content.weeks);
  const next = nextAppointment(s);
  const todayEntry = s.diary[todayIso()];
  const mood = todayEntry ? FEELINGS[todayEntry.feel] : null;
  const name = s.name || 'você';
  const h = new Date().getHours();
  const openBaby = (week: number) => {
    set({ weekView: week });
    router.push('/bebe');
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Title s={27} lh={1.15}>{h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'}, {name}</Title>
          <Sans s={13} c={colors.muted} style={{ marginTop: 4 }}>Hoje é um novo dia da sua gravidez.</Sans>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.sand, borderRadius: 999, padding: 4 }}>
          <Press accessibilityLabel="Conta" onPress={() => router.push('/conta')} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.avatar, alignItems: 'center', justifyContent: 'center' }}>
            <Title s={16} c={colors.terraDark}>{(s.name || 'M').trim().charAt(0).toUpperCase()}</Title>
          </Press>
        </View>
      </View>

      <Card radius={28} style={{ paddingTop: 22, paddingHorizontal: 20, paddingBottom: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Overline style={{ fontSize: 11.5 }}>Sua gravidez hoje</Overline>
          <View style={{ backgroundColor: colors.peach, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 11 }}>
            <Sans s={11} w={600} c={colors.terra}>{trimester(g.week)}</Sans>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
          <Title s={52} lh={1.05}>{g.week}</Title>
          <Title s={18} lh={1.05}>semanas</Title>
          <Sans s={15} c={colors.muted}>+ {g.day} dias</Sans>
        </View>
        <View style={{ marginHorizontal: -20, marginTop: 20, paddingTop: 14, paddingBottom: 12, backgroundColor: 'rgba(237,226,214,.45)' }}>
          <Ruler current={g.week} selected={shown} onPick={setShown} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, gap: 8 }}>
          <Sans s={12} c={colors.muted} style={{ flexShrink: 1 }}>{g.pct}% da gestação</Sans>
          <Sans s={12} c={colors.muted}>DPP <Sans s={12} w={600}>{fmt(g.due, { day: 'numeric', month: 'short', year: 'numeric' }).replace(/\./g, '')}</Sans></Sans>
        </View>
      </Card>

      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Title s={18}>{shown === g.week ? 'Seu bebê nesta semana' : `Seu bebê na semana ${shown}`}</Title>
          {shown === g.week ? (
            <Press onPress={() => openBaby(shown)} hitSlop={8} style={{ minHeight: 44, justifyContent: 'center' }}><Sans s={12} w={600} c={colors.terra}>Ver mais</Sans></Press>
          ) : (
            <Press onPress={() => setShown(g.week)} hitSlop={8} style={{ minHeight: 44, justifyContent: 'center' }}><Sans s={12} w={600} c={colors.terra}>Voltar para hoje</Sans></Press>
          )}
        </View>
        <Press onPress={() => openBaby(shown)} style={{ backgroundColor: colors.card, borderRadius: 24, padding: 14, flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <BabyArt week={shown} style={{ width: 112, height: 112, borderRadius: 20 }} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Sans s={12} c={colors.muted}>Do tamanho de</Sans>
            <Title s={18} style={{ marginTop: 2 }}>{baby.size}</Title>
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 10 }}>
              <View><Sans s={11} c={colors.muted}>Comprimento</Sans><Sans s={15} w={600}>{baby.cm}</Sans></View>
              <View><Sans s={11} c={colors.muted}>Peso</Sans><Sans s={15} w={600}>{baby.kg}</Sans></View>
            </View>
          </View>
        </Press>
        <Sans s={14} lh={1.55} c={colors.body} style={{ marginTop: 12, marginHorizontal: 4 }}>{baby.dev}</Sans>
      </View>

      <Card bg={colors.sand} style={{ paddingVertical: 20, paddingHorizontal: 22 }}>
        <Title s={18}>O que muda no seu corpo</Title>
        <Sans s={14} lh={1.55} c={colors.body} style={{ marginTop: 8 }}>{baby.you}</Sans>
      </Card>

      <View>
        <Title s={18} style={{ marginBottom: 12 }}>Seu dia</Title>
        <View style={{ gap: 8 }}>
          <RowButton title={mood ? 'Hoje: ' + mood : 'Registrar como você está'} sub={mood ? 'Toque para ajustar' : 'Leva menos de um minuto'} iconBg={colors.terra} icon={<Plus color={colors.card} size={18} />} onPress={() => set({ sheet: true })} />
          <RowButton title="Próxima consulta" sub={next ? [next.when, next.who].filter(Boolean).join(' · ') : 'Nenhuma marcada. Toque para adicionar'} iconBg={colors.sage} icon={<CalendarIcon color={colors.sageInk} />} onPress={() => router.push(next ? '/consultas' : '/nova-consulta')} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              { title: 'Orientação', sub: 'desta semana', bg: colors.peach, icon: <BookIcon color={colors.terra} />, href: '/semana' as const },
              { title: 'Movimentos', sub: s.kicks[0] ? `última: ${s.kicks[0].kicks}` : 'contar agora', bg: colors.sage, icon: <Plus color={colors.sageInk} size={18} />, href: '/chutes' as const },
              { title: 'Contrações', sub: 'cronômetro', bg: colors.sand, icon: <CalendarIcon color={colors.mutedStrong} />, href: '/contracoes' as const },
            ].map((tile) => (
              <Press key={tile.href} accessibilityLabel={`${tile.title}, ${tile.sub}`} onPress={() => router.push(tile.href)} style={{ flex: 1, backgroundColor: colors.card, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 10, gap: 12, minHeight: 112 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: tile.bg, alignItems: 'center', justifyContent: 'center' }}>{tile.icon}</View>
                <View>
                  <Sans s={13} w={600} numberOfLines={1}>{tile.title}</Sans>
                  <Sans s={11} c={colors.muted} style={{ marginTop: 2 }} numberOfLines={1}>{tile.sub}</Sans>
                </View>
              </Press>
            ))}
          </View>
        </View>
      </View>

      <View style={{ paddingTop: 4, paddingHorizontal: 8 }}>
        <Overline style={{ fontSize: 11.5 }}>Uma mensagem para hoje</Overline>
        <Title s={16} lh={1.45} c={colors.sageInk} style={{ marginTop: 8, fontFamily: fonts.titleItalic }}>{dailyMessage(content.messages, g.total)}</Title>
      </View>
    </Screen>
  );
}
