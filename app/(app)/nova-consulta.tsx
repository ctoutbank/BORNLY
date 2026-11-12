import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { DateField } from '@/components/date-field';
import { fromIso, todayIso, useStore } from '@/store';
import { Chip, Field, Overline, PageHeader, PrimaryButton, Screen, Wrap } from '@/ui';

const KINDS = ['Consulta pré-natal', 'Exame', 'Ultrassom', 'Vacina'];

export default function NovaConsulta() {
  const { save, load, flash } = useStore();
  const router = useRouter();
  const [title, setTitle] = useState(KINDS[0]);
  const [day, setDay] = useState(todayIso());
  const [time, setTime] = useState('');
  const [who, setWho] = useState('');
  const [place, setPlace] = useState('');

  const submit = async () => {
    const match = time.trim().match(/^(\d{1,2})[:hH]?(\d{2})?$/);
    const h = match ? Number(match[1]) : NaN;
    const m = match?.[2] ? Number(match[2]) : 0;
    if (!(h >= 0 && h < 24 && m < 60)) return flash('Informe o horário, por exemplo 14:30.');
    const start = fromIso(day);
    start.setHours(h, m, 0, 0);
    const created = await save('/appointments', 'POST', { startsAt: start.toISOString(), title, who, place });
    if (created) {
      await load();
      flash('Consulta salva');
      if (router.canGoBack()) router.back();
      else router.replace('/consultas');
    }
  };

  return (
    <Screen gap={20}>
      <PageHeader title="Nova consulta" fallback="/saude" />
      <View style={{ gap: 10 }}>
        <Overline>O que é</Overline>
        <Wrap>{KINDS.map((k) => <Chip key={k} label={k} on={title === k} onPress={() => setTitle(k)} />)}</Wrap>
      </View>
      <View style={{ gap: 8 }}>
        <Overline>Dia</Overline>
        <DateField value={day} onChange={setDay} />
      </View>
      <Field label="Horário" value={time} onChangeText={setTime} placeholder="14:30" keyboardType="numbers-and-punctuation" />
      <Field label="Com quem" value={who} onChangeText={setWho} placeholder="Nome do profissional ou laboratório" />
      <Field label="Onde" value={place} onChangeText={setPlace} placeholder="Clínica ou endereço" />
      <PrimaryButton label="Salvar" onPress={submit} />
    </Screen>
  );
}
