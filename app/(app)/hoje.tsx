import { useRouter } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { babyFor, fmt, gestation, nextAppointment, trimester, useStore } from '@/store';
import { colors } from '@/theme';
import { BookIcon, CalendarIcon, Card, ImageSlot, Overline, Plus, Press, RowButton, Sans, Screen, Serif, SerifItalic } from '@/ui';

function Ruler({ center, onPick }: { center: number; onPick: (n: number) => void }) {
  const { width } = useWindowDimensions();
  const reach = width < 380 ? 4 : 5;
  const items = [];
  for (let n = center - reach; n <= center + reach; n++) {
    const d = Math.abs(n - center);
    const ok = n >= 4 && n <= 41;
    const size = d === 0 ? 44 : d === 1 ? 30 : 26;
    items.push(
      <Press key={n} disabled={!ok} accessibilityLabel={ok ? `Semana ${n}` : undefined} onPress={() => onPick(n)} style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: d === 0 ? colors.ink : 'transparent' }}>
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
  const baby = babyFor(g.week);
  const next = nextAppointment(g.today);
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
          <Serif s={26} lh={1.15}>{h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'}, {name}</Serif>
          <Sans s={13} c={colors.muted} style={{ marginTop: 4 }}>Hoje é um novo dia da sua gravidez.</Sans>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.sand, borderRadius: 999, padding: 4 }}>
          <Press accessibilityLabel="Notificações" style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={16} height={17} viewBox="0 0 16 17">
              <Path d="M3 12.5V7.5a5 5 0 0 1 10 0v5l1.2 1.5H1.8z" stroke={colors.mutedStrong} strokeWidth={1.5} fill="none" strokeLinejoin="round" />
              <Path d="M6.3 15.5a1.8 1.8 0 0 0 3.4 0" stroke={colors.mutedStrong} strokeWidth={1.5} fill="none" strokeLinecap="round" />
            </Svg>
          </Press>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.avatar, alignItems: 'center', justifyContent: 'center' }}>
            <Serif s={16} c={colors.terraDark}>{(s.name || 'M').trim().charAt(0).toUpperCase()}</Serif>
          </View>
        </View>
      </View>

      <Card radius={30} style={{ paddingTop: 22, paddingHorizontal: 20, paddingBottom: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Overline style={{ fontSize: 11.5 }}>Sua gravidez hoje</Overline>
          <View style={{ backgroundColor: colors.peach, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 11 }}>
            <Sans s={11.5} w={600} c={colors.terra}>{trimester(g.week)}</Sans>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
          <Serif s={52} lh={1.05}>{g.week}</Serif>
          <Serif s={20} lh={1.05}>semanas</Serif>
          <Sans s={15} c={colors.muted}>+ {g.day} dias</Sans>
        </View>
        <View style={{ marginHorizontal: -20, marginTop: 20, paddingTop: 14, paddingBottom: 12, backgroundColor: 'rgba(237,226,214,.45)' }}>
          <Ruler center={g.week} onPick={openBaby} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, gap: 8 }}>
          <Sans s={12.5} c={colors.muted} style={{ flexShrink: 1 }}>{g.pct}% do tempo de gestação</Sans>
          <Sans s={12.5} c={colors.muted}>DPP <Sans s={12.5} w={600}>{fmt(g.due, { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '')}</Sans></Sans>
        </View>
      </Card>

      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Serif s={19}>Seu bebê nesta semana</Serif>
          <Press onPress={() => openBaby(g.week)} style={{ minHeight: 32, justifyContent: 'center' }}><Sans s={12.5} w={600} c={colors.terra}>Ver mais</Sans></Press>
        </View>
        <Press onPress={() => openBaby(g.week)} style={{ backgroundColor: colors.card, borderRadius: 28, padding: 14, flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <ImageSlot label="ilustração do bebê" style={{ width: 112, height: 112, borderRadius: 20 }} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Sans s={12} c={colors.muted}>Do tamanho de</Sans>
            <Serif s={20} style={{ marginTop: 2 }}>{baby.size}</Serif>
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 10 }}>
              <View><Sans s={11} c={colors.muted}>Comprimento</Sans><Sans s={15} w={600}>{baby.cm}</Sans></View>
              <View><Sans s={11} c={colors.muted}>Peso</Sans><Sans s={15} w={600}>{baby.kg}</Sans></View>
            </View>
          </View>
        </Press>
        <Sans s={14} lh={1.55} c={colors.body} style={{ marginTop: 12, marginHorizontal: 4 }}>{baby.dev}</Sans>
      </View>

      <Card bg={colors.sand} style={{ paddingVertical: 20, paddingHorizontal: 22 }}>
        <Serif s={18}>O que muda no seu corpo</Serif>
        <Sans s={14} lh={1.55} c={colors.body} style={{ marginTop: 8 }}>{baby.you}</Sans>
      </Card>

      <View>
        <Serif s={19} style={{ marginBottom: 12 }}>Seu dia</Serif>
        <View style={{ gap: 8 }}>
          <RowButton title={s.mood ? 'Hoje: ' + s.mood : 'Registrar como você está'} sub={s.mood ? 'Toque para ajustar' : 'Leva menos de um minuto'} iconBg={colors.ink} icon={<Plus color={colors.bg} />} onPress={() => set({ sheet: true })} />
          <RowButton title="Próxima consulta" sub={`${next.when} · ${next.who}`} iconBg={colors.sage} icon={<CalendarIcon color={colors.sageInk} />} onPress={() => router.push('/consultas')} />
          <RowButton title="Orientação desta semana" sub="Cuidados desta fase" iconBg={colors.peach} icon={<BookIcon color={colors.terra} />} onPress={() => router.push('/semana')} />
        </View>
      </View>

      <View style={{ paddingTop: 4, paddingHorizontal: 8 }}>
        <Overline style={{ fontSize: 11.5 }}>Uma mensagem para hoje</Overline>
        <SerifItalic c={colors.sageInk} style={{ marginTop: 8 }}>Você não precisa resolver tudo hoje. Um passo de cada vez também é cuidar.</SerifItalic>
      </View>
    </Screen>
  );
}
