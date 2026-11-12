import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { BulbIcon, CalendarHeart, ChartIcon, DiaryIcon, HeartsBackdrop, kindLook, PillIcon, PulseIcon, SmileIcon } from '@/components/love';
import { FEELINGS } from '@/content';
import { isUpcoming, nextAppointment, todayIso, useStore } from '@/store';
import { colors } from '@/theme';
import { Card, Chevron, CircleButton, Plus, Press, Sans, Screen, TabTitle, Title } from '@/ui';

export default function Saude() {
  const { s } = useStore();
  const router = useRouter();
  const today = todayIso();
  const next = nextAppointment(s);
  const entry = s.diary[today];
  const taken = s.medications.filter((m) => s.doses[m.id]?.[today]).length;
  const logged = s.symptoms.filter((x) => x.day === today).length;
  const upcoming = s.appointments.filter(isUpcoming).length;
  const rows = [
    { num: '07', icon: DiaryIcon, bg: colors.peach, ink: colors.terra, label: 'Meu diário', sub: entry ? 'Registrado hoje' : 'Como você está hoje?', href: '/diario' },
    { num: '08', icon: PulseIcon, bg: colors.sage, ink: colors.sageInk, label: 'Sintomas', sub: logged ? `${logged} registrados hoje` : 'Nenhum registrado hoje', href: '/sintomas' },
    { num: '09', icon: CalendarHeart, bg: colors.avatar, ink: colors.terraDark, label: 'Consultas e exames', sub: upcoming ? `${upcoming} ${upcoming === 1 ? "próximo compromisso" : "próximos compromissos"}` : 'Nenhum compromisso marcado', href: '/consultas' },
    { num: '11', icon: ChartIcon, bg: colors.sand, ink: colors.mutedStrong, label: 'Meu histórico', sub: 'Registros, peso e evolução', href: '/historico' },
  ] as const;

  return (
    <Screen gap={20}>
      <TabTitle
        title="Minha saúde"
        sub="Seus registros ficam na sua conta."
        right={<CircleButton label="Novo registro" bg={colors.peach} onPress={() => router.push('/diario')}><Plus color={colors.terra} /></CircleButton>}
      />
      <Press onPress={() => router.push(next ? '/consultas' : '/nova-consulta')} style={{ borderRadius: 28, backgroundColor: colors.peach, padding: 20, gap: 14, overflow: 'hidden' }}>
        <HeartsBackdrop />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Sans s={11} w={700} c={colors.terra} style={{ letterSpacing: 0.7, textTransform: 'uppercase' }}>Próxima consulta</Sans>
          {next ? <View style={{ backgroundColor: colors.card, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10 }}><Sans s={11} w={700} c={colors.terraDark}>{next.inDays === 0 ? 'hoje' : next.inDays === 1 ? 'amanhã' : `em ${next.inDays} dias`}</Sans></View> : null}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' }}>
            {next ? kindLook(next.title).icon(colors.terra, 24) : <CalendarHeart color={colors.terra} size={24} />}
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Title s={21}>{next ? next.when : 'Nenhuma marcada'}</Title>
            <Sans s={13} w={600} c={colors.terraDark} style={{ marginTop: 2 }}>{next ? next.title : 'Toque para adicionar'}</Sans>
            {next && (next.who || next.place) ? <Sans s={12} c={colors.mutedStrong} numberOfLines={1}>{[next.who, next.place].filter(Boolean).join(' · ')}</Sans> : null}
          </View>
        </View>
      </Press>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Press onPress={() => router.push('/diario')} style={{ flex: 1, borderRadius: 24, backgroundColor: colors.card, padding: 16, minHeight: 120, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Sans s={12} c={colors.muted}>Diário de hoje</Sans>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.peach, alignItems: 'center', justifyContent: 'center' }}><SmileIcon color={colors.terra} size={17} /></View>
          </View>
          <View>
            <Title s={18}>{entry ? 'Registrado' : 'Pendente'}</Title>
            <Sans s={12} c={colors.muted} style={{ marginTop: 4 }}>{entry ? FEELINGS[entry.feel] : 'Leva menos de um minuto'}</Sans>
          </View>
        </Press>
        <Press onPress={() => router.push('/meds')} style={{ flex: 1, borderRadius: 24, backgroundColor: colors.sage, padding: 16, minHeight: 120, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Sans s={12} c={colors.sageInk}>Vitaminas hoje</Sans>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' }}><PillIcon color={colors.sageInk} size={18} /></View>
          </View>
          <View>
            <Title s={18}>{s.medications.length ? `${taken} de ${s.medications.length}` : 'Nenhuma'}</Title>
            <Sans s={12} c={colors.sageInk} style={{ marginTop: 4 }}>{s.medications.length ? 'tomadas' : 'Toque para cadastrar'}</Sans>
          </View>
        </Press>
      </View>
      <Card style={{ paddingVertical: 4, paddingHorizontal: 16 }}>
        {rows.map((r, i) => (
          <Press key={r.num} onPress={() => router.push(r.href)} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, minHeight: 64, borderBottomWidth: i === rows.length - 1 ? 0 : 1, borderBottomColor: colors.lineSoft }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: r.bg, alignItems: 'center', justifyContent: 'center' }}><r.icon color={r.ink} /></View>
            <View style={{ flex: 1 }}>
              <Sans s={14} w={600}>{r.label}</Sans>
              <Sans s={12} c={colors.muted} style={{ marginTop: 2 }}>{r.sub}</Sans>
            </View>
            <Chevron />
          </Press>
        ))}
      </Card>
      <Press onPress={() => router.push('/conta')} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderRadius: 24, paddingVertical: 14, paddingHorizontal: 16, minHeight: 64 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.avatar, alignItems: 'center', justifyContent: 'center' }}><Title s={16} c={colors.terraDark}>{(s.name || 'M').trim().charAt(0).toUpperCase()}</Title></View>
        <View style={{ flex: 1 }}>
          <Sans s={14} w={600}>Meu perfil</Sans>
          <Sans s={12} c={colors.muted} style={{ marginTop: 2 }}>Gravidez, lembretes e privacidade</Sans>
        </View>
        <Chevron />
      </Press>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: 20, padding: 14 }}>
        <BulbIcon color={colors.terra} size={18} />
        <Sans s={12} lh={1.45} c={colors.mutedStrong} style={{ flex: 1 }}>Registrar como você se sente ajuda a conversar com sua equipe nas consultas.</Sans>
      </View>
    </Screen>
  );
}
