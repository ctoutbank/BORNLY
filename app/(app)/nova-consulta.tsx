import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { DateField } from '@/components/date-field';
import { capitalize, DAY, fmt, fromIso, iso, startOfToday, todayIso, useStore } from '@/store';
import { colors } from '@/theme';
import { Card, Field, Overline, PageHeader, Press, PrimaryButton, Sans, Screen, TextButton, Title } from '@/ui';

const stroke = (c: string) => ({ stroke: c, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });
const KINDS: { id: string; label?: string; icon: (c: string) => React.ReactNode }[] = [
  { id: 'Consulta pré-natal', label: 'Pré-natal', icon: (c) => <Svg width={22} height={22} viewBox="0 0 24 24"><Path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" {...stroke(c)} /></Svg> },
  { id: 'Exame', icon: (c) => <Svg width={22} height={22} viewBox="0 0 24 24"><Rect x="5" y="4" width="14" height="17" rx="3" {...stroke(c)} /><Path d="M9 4.5V3.5h6v1M8.5 11l1.5 1.5 3-3M8.5 16.5h7" {...stroke(c)} /></Svg> },
  { id: 'Ultrassom', icon: (c) => <Svg width={22} height={22} viewBox="0 0 24 24"><Path d="M4 13c2-6 6-6 8 0s6 6 8 0" {...stroke(c)} /><Circle cx="12" cy="13" r="1.4" fill={c} /></Svg> },
  { id: 'Vacina', icon: (c) => <Svg width={22} height={22} viewBox="0 0 24 24"><Path d="M12 3c2.6 1.6 4.7 2 6.5 2v6c0 4.4-3 7.4-6.5 9-3.5-1.6-6.5-4.6-6.5-9V5C7.3 5 9.4 4.6 12 3z" {...stroke(c)} /><Path d="M9.2 12l2 2 3.6-3.6" {...stroke(c)} /></Svg> },
];
const TIMES = Array.from({ length: 25 }, (_, i) => `${String(7 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`);

export default function NovaConsulta() {
  const { s, save, load, flash } = useStore();
  const router = useRouter();
  const [title, setTitle] = useState(KINDS[0].id);
  const [day, setDay] = useState(todayIso());
  const [otherDate, setOtherDate] = useState(false);
  const [time, setTime] = useState('');
  const [otherTime, setOtherTime] = useState(false);
  const [who, setWho] = useState('');
  const [place, setPlace] = useState('');
  const [busy, setBusy] = useState(false);

  // próximos 60 dias para a faixa de datas
  const days = useMemo(() => Array.from({ length: 60 }, (_, i) => new Date(startOfToday().getTime() + i * DAY)), []);

  const parsed = (() => {
    const match = time.trim().match(/^(\d{1,2})[:hH]?(\d{2})?$/);
    const h = match ? Number(match[1]) : NaN;
    const m = match?.[2] ? Number(match[2]) : 0;
    return h >= 0 && h < 24 && m < 60 ? { h, m } : null;
  })();
  const when = parsed ? `${capitalize(fmt(fromIso(day), { weekday: 'long', day: 'numeric', month: 'long' }))}, às ${parsed.h}h${parsed.m ? String(parsed.m).padStart(2, '0') : ''}` : null;

  const submit = async () => {
    if (busy) return;
    if (!parsed) return flash('Escolha o horário.');
    const start = fromIso(day);
    start.setHours(parsed.h, parsed.m, 0, 0);
    setBusy(true);
    const created = await save('/appointments', 'POST', { startsAt: start.toISOString(), title, who: who.trim(), place: place.trim() });
    setBusy(false);
    if (created) {
      await load();
      flash('Consulta salva');
      if (router.canGoBack()) router.back();
      else router.replace('/consultas');
    }
  };

  return (
    <Screen gap={22}>
      <PageHeader title="Nova consulta" sub="Fica no seu calendário de consultas" fallback="/saude" />

      <View style={{ gap: 10 }}>
        <Overline>O que é</Overline>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {KINDS.map((k) => {
            const on = title === k.id;
            return (
              <Press key={k.id} accessibilityLabel={k.id} accessibilityState={{ selected: on }} onPress={() => setTitle(k.id)} style={{ flexBasis: '48%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 56, paddingHorizontal: 14, borderRadius: 18, backgroundColor: on ? colors.terra : colors.card, borderWidth: 1.5, borderColor: on ? colors.terra : colors.line }}>
                {k.icon(on ? colors.bg : colors.terra)}
                <Sans s={13} w={600} c={on ? colors.bg : colors.ink} style={{ flex: 1 }} numberOfLines={1}>{k.label ?? k.id}</Sans>
              </Press>
            );
          })}
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Overline>Dia</Overline>
          <TextButton label={otherDate ? 'Ver próximos dias' : 'Outra data'} s={12} w={600} c={colors.terra} onPress={() => setOtherDate(!otherDate)} />
        </View>
        {otherDate ? (
          <DateField value={day} onChange={setDay} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
            {days.map((d) => {
              const id = iso(d);
              const on = id === day;
              return (
                <Press key={id} accessibilityLabel={fmt(d, { weekday: 'long', day: 'numeric', month: 'long' })} accessibilityState={{ selected: on }} onPress={() => setDay(id)} style={{ width: 58, paddingVertical: 10, borderRadius: 18, alignItems: 'center', gap: 2, backgroundColor: on ? colors.terra : colors.card }}>
                  <Sans s={11} w={600} c={on ? colors.onInkMid : colors.muted}>{fmt(d, { weekday: 'short' }).replace(/\./g, '').toUpperCase()}</Sans>
                  <Title s={20} lh={1.15} c={on ? colors.bg : colors.ink}>{d.getDate()}</Title>
                  <Sans s={11} c={on ? colors.onInkMid : colors.muted}>{fmt(d, { month: 'short' }).replace(/\./g, '')}</Sans>
                </Press>
              );
            })}
          </ScrollView>
        )}
      </View>

      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Overline>Horário</Overline>
          <TextButton label={otherTime ? 'Ver horários' : 'Outro horário'} s={12} w={600} c={colors.terra} onPress={() => setOtherTime(!otherTime)} />
        </View>
        {otherTime ? (
          <Field value={time} onChangeText={setTime} placeholder="Ex.: 14:15" keyboardType="numbers-and-punctuation" accessibilityLabel="Horário" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
            {TIMES.map((t) => {
              const on = t === time;
              return (
                <Press key={t} accessibilityLabel={`Às ${t}`} accessibilityState={{ selected: on }} onPress={() => setTime(t)} style={{ minWidth: 66, height: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, backgroundColor: on ? colors.terra : colors.card, borderWidth: 1.5, borderColor: on ? colors.terra : colors.line }}>
                  <Sans s={13} w={600} c={on ? colors.bg : colors.ink}>{t}</Sans>
                </Press>
              );
            })}
          </ScrollView>
        )}
      </View>

      <Field label="Com quem" value={who} onChangeText={setWho} placeholder="Profissional, unidade ou laboratório" />
      <Field label="Onde" value={place} onChangeText={setPlace} placeholder="Endereço ou nome do local (opcional)" />

      <Card bg={colors.peach} style={{ padding: 18, gap: 4 }}>
        <Sans s={11} w={600} c={colors.terra}>RESUMO</Sans>
        <Title s={18} lh={1.3}>{title}</Title>
        <Sans s={14} lh={1.45} c={colors.body}>{when ?? 'Escolha o dia e o horário'}</Sans>
        {who.trim() ? <Sans s={13} c={colors.mutedStrong}>{who.trim()}</Sans> : null}
        {s.notifyAppointments ? <Sans s={12} lh={1.45} c={colors.mutedStrong} style={{ marginTop: 6 }}>Você recebe um lembrete por e-mail um dia antes.</Sans> : null}
      </Card>

      <PrimaryButton label={busy ? 'Salvando...' : 'Salvar consulta'} onPress={submit} />
    </Screen>
  );
}
