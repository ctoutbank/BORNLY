import { useState } from 'react';
import { View } from 'react-native';

import { CheckCircle, Heart, HeartsBackdrop, PillIcon } from '@/components/love';
import { formatTime, timeSlot, todayIso, useStore } from '@/store';
import { colors } from '@/theme';
import { Card, CircleButton, Field, PageHeader, Plus, Press, PrimaryButton, Sans, Screen, Title } from '@/ui';

export default function Meds() {
  const { s, save, load, flash } = useStore();
  const today = todayIso();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('');
  const taken = (id: string) => !!s.doses[id]?.[today];

  const add = async () => {
    const match = time.trim().match(/^(\d{1,2})[:hH]?(\d{2})?$/);
    const h = match ? Number(match[1]) : NaN;
    const m = match?.[2] ? Number(match[2]) : 0;
    if (!name.trim()) return flash('Informe o nome.');
    if (!(h >= 0 && h < 24 && m < 60)) return flash('Informe o horário, por exemplo 08:00.');
    const created = await save('/medications', 'POST', { name, dose, timeOfDay: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` });
    if (created) {
      await load();
      setName('');
      setDose('');
      setTime('');
      setAdding(false);
    }
  };

  const toggle = (id: string) => {
    const on = taken(id);
    save(`/medications/${id}/doses/${today}`, 'PUT', { taken: !on }, (st) => ({ doses: { ...st.doses, [id]: { ...st.doses[id], [today]: !on } } }));
  };
  const remove = (id: string) => save(`/medications/${id}`, 'DELETE', undefined, (st) => ({ medications: st.medications.filter((m) => m.id !== id) }));

  return (
    <Screen>
      <PageHeader title="Medicamentos" sub="Remédios e vitaminas, conforme sua prescrição" fallback="/saude" right={<CircleButton label="Adicionar medicamento" bg={colors.peach} onPress={() => setAdding(!adding)}><Plus color={colors.terra} /></CircleButton>} />
      {adding ? (
        <Card style={{ padding: 18, gap: 14 }}>
          <Field label="Nome" value={name} onChangeText={setName} placeholder="Como está na receita" />
          <Field label="Dose" value={dose} onChangeText={setDose} placeholder="1 cápsula" />
          <Field label="Horário" value={time} onChangeText={setTime} placeholder="08:00" keyboardType="numbers-and-punctuation" />
          <PrimaryButton label="Salvar" onPress={add} />
        </Card>
      ) : null}
      {s.medications.length ? (
        <>
          <View style={{ backgroundColor: colors.peach, borderRadius: 28, padding: 20, overflow: 'hidden' }}>
            <HeartsBackdrop />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' }}><PillIcon color={colors.terra} size={18} /></View>
              <Title s={18} style={{ flex: 1 }}>Hoje</Title>
              <View style={{ backgroundColor: colors.card, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10 }}>
                <Sans s={11} w={700} c={colors.terraDark}>{s.medications.filter((m) => taken(m.id)).length} de {s.medications.length} tomadas</Sans>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 4, marginTop: 14 }}>
              {s.medications.map((m) => <View key={m.id} style={{ flex: 1, height: 6, borderRadius: 9, backgroundColor: taken(m.id) ? colors.terra : colors.card }} />)}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, rowGap: 14 }}>
              {s.medications.map((m) => (
                <View key={m.id} style={{ width: '33.3%', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: taken(m.id) ? colors.sageDot : colors.card }}>
                    <Sans s={12} w={600} c={taken(m.id) ? colors.card : colors.mutedStrong}>{formatTime(m.timeOfDay)}</Sans>
                  </View>
                  <Sans s={12} c={colors.mutedStrong}>{timeSlot(m.timeOfDay)}</Sans>
                </View>
              ))}
            </View>
          </View>
          <View style={{ gap: 10 }}>
            {s.medications.map((m) => {
              const on = taken(m.id);
              return (
                <Card key={m.id} radius={24} style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' }}><PillIcon color={colors.sageInk} /></View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Sans s={15} w={600}>{m.name}</Sans>
                    <Sans s={12} c={colors.muted} style={{ marginTop: 3 }}>{[m.dose, `às ${formatTime(m.timeOfDay)}`].filter(Boolean).join(' · ')}</Sans>
                    <Press accessibilityLabel={`Remover ${m.name}`} hitSlop={8} onPress={() => remove(m.id)} style={{ marginTop: 8, alignSelf: 'flex-start' }}>
                      <Sans s={12} c={colors.muted}>Remover</Sans>
                    </Press>
                  </View>
                  <Press accessibilityLabel={on ? `${m.name}: tomado` : `Marcar ${m.name} como tomado`} accessibilityState={{ selected: on }} onPress={() => toggle(m.id)} style={{ borderRadius: 999, paddingHorizontal: 14, height: 44, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: on ? colors.sage : colors.peach }}>
                    {on ? <CheckCircle color={colors.sageInk} size={16} /> : <Heart color={colors.terra} size={14} />}
                    <Sans s={13} w={600} c={on ? colors.sageInk : colors.terraDark}>{on ? 'Tomado' : 'Marcar'}</Sans>
                  </Press>
                </Card>
              );
            })}
          </View>
        </>
      ) : adding ? null : (
        <Card style={{ padding: 20, gap: 14 }}>
          <Sans s={14} lh={1.5} c={colors.mutedStrong}>Nada cadastrado ainda. Adicione o que foi prescrito para marcar a cada dia.</Sans>
          <PrimaryButton label="Adicionar" onPress={() => setAdding(true)} />
        </Card>
      )}
      <Card radius={24} style={{ paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Heart color={colors.terra} size={18} filled />
        <Sans s={13} lh={1.5} c={colors.mutedStrong} style={{ flex: 1 }}>O Bornly organiza o que foi prescrito. Não recomenda medicamentos nem altera doses; qualquer mudança é com sua equipe de saúde.</Sans>
      </Card>
    </Screen>
  );
}
