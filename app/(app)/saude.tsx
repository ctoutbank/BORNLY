import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { FEELINGS, MEDS } from '@/content';
import { gestation, nextAppointment, useStore } from '@/store';
import { colors } from '@/theme';
import { Card, Chevron, CircleButton, Plus, Press, Sans, Screen, Serif, TabTitle } from '@/ui';

export default function Saude() {
  const { s } = useStore();
  const router = useRouter();
  const next = nextAppointment(gestation(s).today);
  const taken = MEDS.filter((m) => s.taken[m.id]).length;
  const rows = [
    { num: '07', label: 'Meu diário', sub: s.diaryDone ? 'Registrado hoje' : 'Como você está hoje?', href: '/diario' },
    { num: '08', label: 'Sintomas', sub: s.symLogged.length + ' registrados hoje', href: '/sintomas' },
    { num: '09', label: 'Consultas e exames', sub: '3 próximos compromissos', href: '/consultas' },
    { num: '11', label: 'Meu histórico', sub: 'Registros, peso e evolução', href: '/historico' },
  ] as const;

  return (
    <Screen gap={20}>
      <TabTitle
        title="Minha saúde"
        sub="Seus registros ficam só com você."
        right={<CircleButton label="Novo registro" bg={colors.ink} onPress={() => router.push('/diario')}><Plus color={colors.bg} /></CircleButton>}
      />
      <Press onPress={() => router.push('/consultas')} style={{ borderRadius: 30, backgroundColor: colors.ink, padding: 20, gap: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Sans s={11.5} w={600} c={colors.onInkSoft} style={{ letterSpacing: 0.7, textTransform: 'uppercase' }}>Próxima consulta</Sans>
          <Sans s={12} c={colors.onInkMid}>em {next.inDays} dias</Sans>
        </View>
        <Serif s={22} c={colors.bg}>{next.when}</Serif>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.photo, alignItems: 'center', justifyContent: 'center' }}><Serif s={13} c={colors.terraDark}>HP</Serif></View>
          <View>
            <Sans s={13.5} w={600} c={colors.bg}>{next.who}</Sans>
            <Sans s={12} c={colors.onInkMid}>{next.what}</Sans>
          </View>
        </View>
      </Press>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Press onPress={() => router.push('/diario')} style={{ flex: 1, borderRadius: 26, backgroundColor: colors.card, padding: 16, minHeight: 120, justifyContent: 'space-between' }}>
          <Sans s={12} c={colors.muted}>Diário de hoje</Sans>
          <View>
            <Serif s={20}>{s.diaryDone ? 'Registrado' : 'Pendente'}</Serif>
            <Sans s={12} c={colors.muted} style={{ marginTop: 4 }}>{s.diaryDone ? s.mood || FEELINGS[s.feel] : 'Leva menos de um minuto'}</Sans>
          </View>
        </Press>
        <Press onPress={() => router.push('/meds')} style={{ flex: 1, borderRadius: 26, backgroundColor: colors.sage, padding: 16, minHeight: 120, justifyContent: 'space-between' }}>
          <Sans s={12} c={colors.sageInk}>Vitaminas hoje</Sans>
          <View>
            <Serif s={20}>{taken} de {MEDS.length}</Serif>
            <Sans s={12} c={colors.sageInk} style={{ marginTop: 4 }}>tomadas</Sans>
          </View>
        </Press>
      </View>
      <Card style={{ paddingVertical: 4, paddingHorizontal: 16 }}>
        {rows.map((r, i) => (
          <Press key={r.num} onPress={() => router.push(r.href)} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, minHeight: 64, borderBottomWidth: i === rows.length - 1 ? 0 : 1, borderBottomColor: colors.lineSoft }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.sand, alignItems: 'center', justifyContent: 'center' }}><Serif s={15} c={colors.terra}>{r.num}</Serif></View>
            <View style={{ flex: 1 }}>
              <Sans s={14.5} w={600}>{r.label}</Sans>
              <Sans s={12.5} c={colors.muted} style={{ marginTop: 2 }}>{r.sub}</Sans>
            </View>
            <Chevron />
          </Press>
        ))}
      </Card>
    </Screen>
  );
}
