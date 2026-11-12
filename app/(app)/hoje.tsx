import { useRouter } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';

import { FEELINGS } from '@/content';
import { babyFor, dailyMessage, useContent } from '@/content-provider';
import { fmt, gestation, nextAppointment, todayIso, trimester, useStore } from '@/store';
import { colors, fonts } from '@/theme';
import { BookIcon, CalendarIcon, Card, ImageSlot, Overline, Plus, Press, RowButton, Sans, Screen, Title } from '@/ui';

function Ruler({ center, onPick }: { center: number; onPick: (n: number) => void }) {
  const { width } = useWindowDimensions();
  const reach = width < 380 ? 4 : 5;
  const items = [];
  for (let n = center - reach; n <= center + reach; n++) {
    const d = Math.abs(n - center);
    const ok = n >= 4 && n <= 41;
    const size = d === 0 ? 44 : d === 1 ? 30 : 26;
    items.push(
      <Press key={n} disabled={!ok} hitSlop={{ top: 10, bottom: 10, left: 2, right: 2 }} accessibilityLabel={ok ? `Semana ${n}` : undefined} onPress={() => onPick(n)} style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: d === 0 ? colors.ink : 'transparent' }}>
        <Sans s={d === 0 ? 16 : d === 1 ? 12 : 11} w={600} c={d === 0 ? colors.bg : d <= 2 ? colors.mutedStrong : '#B3A397'}>{ok ? n : ''}</Sans>
      </Press>,
    );
  }
  return <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2 }}>{items}</View>;
}

export default function Hoje() {
  const { s, set } = useStore();
  const router = useRouter();
  const g = gestation(s);
  const content = useContent();
  const baby = babyFor(g.week, content.weeks);
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
          <Title s={28} lh={1.15}>{h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'}, {name}</Title>
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
          <Ruler center={g.week} onPick={openBaby} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, gap: 8 }}>
          <Sans s={12} c={colors.muted} style={{ flexShrink: 1 }}>{g.pct}% do tempo de gestação</Sans>
          <Sans s={12} c={colors.muted}>DPP <Sans s={12} w={600}>{fmt(g.due, { day: 'numeric', month: 'short', year: 'numeric' }).replace(/\./g, '')}</Sans></Sans>
        </View>
      </Card>

      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Title s={18}>Seu bebê nesta semana</Title>
          <Press onPress={() => openBaby(g.week)} hitSlop={8} style={{ minHeight: 44, justifyContent: 'center' }}><Sans s={12} w={600} c={colors.terra}>Ver mais</Sans></Press>
        </View>
        <Press onPress={() => openBaby(g.week)} style={{ backgroundColor: colors.card, borderRadius: 24, padding: 14, flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <ImageSlot label="ilustração do bebê" style={{ width: 112, height: 112, borderRadius: 20 }} />
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
          <RowButton title={mood ? 'Hoje: ' + mood : 'Registrar como você está'} sub={mood ? 'Toque para ajustar' : 'Leva menos de um minuto'} iconBg={colors.ink} icon={<Plus color={colors.bg} size={18} />} onPress={() => set({ sheet: true })} />
          <RowButton title="Próxima consulta" sub={next ? [next.when, next.who].filter(Boolean).join(' · ') : 'Nenhuma marcada. Toque para adicionar'} iconBg={colors.sage} icon={<CalendarIcon color={colors.sageInk} />} onPress={() => router.push(next ? '/consultas' : '/nova-consulta')} />
          <RowButton title="Orientação desta semana" sub="Cuidados desta fase" iconBg={colors.peach} icon={<BookIcon color={colors.terra} />} onPress={() => router.push('/semana')} />
          <RowButton title="Contar movimentos" sub={s.kicks[0] ? `Última: ${s.kicks[0].kicks} movimentos` : 'Registre os movimentos do bebê'} iconBg={colors.sage} icon={<Plus color={colors.sageInk} size={18} />} onPress={() => router.push('/chutes')} />
          <RowButton title="Cronômetro de contrações" sub="Duração e intervalo" iconBg={colors.sand} icon={<CalendarIcon color={colors.mutedStrong} />} onPress={() => router.push('/contracoes')} />
        </View>
      </View>

      <View style={{ paddingTop: 4, paddingHorizontal: 8 }}>
        <Overline style={{ fontSize: 11.5 }}>Uma mensagem para hoje</Overline>
        <Title s={16} lh={1.45} c={colors.sageInk} style={{ marginTop: 8, fontFamily: fonts.titleItalic }}>{dailyMessage(content.messages, g.total)}</Title>
      </View>
    </Screen>
  );
}
