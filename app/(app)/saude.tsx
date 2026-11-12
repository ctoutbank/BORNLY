import { useRouter } from 'expo-router';
import { View } from 'react-native';

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
    { num: '07', label: 'Meu diário', sub: entry ? 'Registrado hoje' : 'Como você está hoje?', href: '/diario' },
    { num: '08', label: 'Sintomas', sub: logged ? `${logged} registrados hoje` : 'Nenhum registrado hoje', href: '/sintomas' },
    { num: '09', label: 'Consultas e exames', sub: upcoming ? `${upcoming} próximos compromissos` : 'Nenhum compromisso marcado', href: '/consultas' },
    { num: '11', label: 'Meu histórico', sub: 'Registros, peso e evolução', href: '/historico' },
  ] as const;

  return (
    <Screen gap={20}>
      <TabTitle
        title="Minha saúde"
        sub="Seus registros ficam na sua conta."
        right={<CircleButton label="Novo registro" bg={colors.ink} onPress={() => router.push('/diario')}><Plus color={colors.bg} /></CircleButton>}
      />
      <Press onPress={() => router.push(next ? '/consultas' : '/nova-consulta')} style={{ borderRadius: 28, backgroundColor: colors.ink, padding: 20, gap: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Sans s={11} w={600} c={colors.onInkSoft} style={{ letterSpacing: 0.7, textTransform: 'uppercase' }}>Próxima consulta</Sans>
          {next ? <Sans s={12} c={colors.onInkMid}>{next.inDays === 0 ? 'hoje' : next.inDays === 1 ? 'amanhã' : `em ${next.inDays} dias`}</Sans> : null}
        </View>
        <Title s={22} c={colors.bg}>{next ? next.when : 'Nenhuma marcada'}</Title>
        <View>
          <Sans s={13} w={600} c={colors.bg}>{next ? next.title : 'Toque para adicionar'}</Sans>
          {next && (next.who || next.place) ? <Sans s={12} c={colors.onInkMid}>{[next.who, next.place].filter(Boolean).join(' · ')}</Sans> : null}
        </View>
      </Press>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Press onPress={() => router.push('/diario')} style={{ flex: 1, borderRadius: 24, backgroundColor: colors.card, padding: 16, minHeight: 120, justifyContent: 'space-between' }}>
          <Sans s={12} c={colors.muted}>Diário de hoje</Sans>
          <View>
            <Title s={18}>{entry ? 'Registrado' : 'Pendente'}</Title>
            <Sans s={12} c={colors.muted} style={{ marginTop: 4 }}>{entry ? FEELINGS[entry.feel] : 'Leva menos de um minuto'}</Sans>
          </View>
        </Press>
        <Press onPress={() => router.push('/meds')} style={{ flex: 1, borderRadius: 24, backgroundColor: colors.sage, padding: 16, minHeight: 120, justifyContent: 'space-between' }}>
          <Sans s={12} c={colors.sageInk}>Vitaminas hoje</Sans>
          <View>
            <Title s={18}>{s.medications.length ? `${taken} de ${s.medications.length}` : 'Nenhuma'}</Title>
            <Sans s={12} c={colors.sageInk} style={{ marginTop: 4 }}>{s.medications.length ? 'tomadas' : 'Toque para cadastrar'}</Sans>
          </View>
        </Press>
      </View>
      <Card style={{ paddingVertical: 4, paddingHorizontal: 16 }}>
        {rows.map((r, i) => (
          <Press key={r.num} onPress={() => router.push(r.href)} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, minHeight: 64, borderBottomWidth: i === rows.length - 1 ? 0 : 1, borderBottomColor: colors.lineSoft }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.sand, alignItems: 'center', justifyContent: 'center' }}><Title s={15} c={colors.terra}>{r.num}</Title></View>
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
    </Screen>
  );
}
