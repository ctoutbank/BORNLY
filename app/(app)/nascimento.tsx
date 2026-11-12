import { useState } from 'react';
import { Linking, View } from 'react-native';

import { useContent } from '@/content-provider';
import { HeartsBackdrop, HouseHeartIcon } from '@/components/love';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Card, Checklist, CircleButton, Field, PageHeader, PhoneIcon, PrimaryButton, Sans, Screen, TextButton, Title } from '@/ui';

export default function Nascimento() {
  const { s, save, flash } = useStore();
  const BIRTH = useContent().checklists.nascimento.map((g) => [g.group, g.range ?? '', g.items] as const);
  const [editing, setEditing] = useState(!s.maternityName);
  const [name, setName] = useState(s.maternityName);
  const [phone, setPhone] = useState(s.maternityPhone);

  const saveMaternity = async () => {
    const ok = await save('/profile', 'PUT', { maternityName: name.trim() || null, maternityPhone: phone.trim() || null }, { maternityName: name.trim(), maternityPhone: phone.trim() });
    if (ok) {
      flash('Maternidade salva');
      setEditing(false);
    }
  };

  return (
    <Screen gap={20}>
      <PageHeader title="Para o nascimento" sub="Organizado pela proximidade da DPP" fallback="/preparar" />
      {editing ? (
        <Card style={{ padding: 18, gap: 14 }}>
          <Title s={18}>Sua maternidade</Title>
          <Field label="Nome" value={name} onChangeText={setName} placeholder="Hospital ou maternidade" />
          <Field label="Telefone" value={phone} onChangeText={setPhone} placeholder="(11) 0000-0000" keyboardType="phone-pad" />
          <PrimaryButton label="Salvar" onPress={saveMaternity} />
        </Card>
      ) : (
        <View style={{ backgroundColor: colors.peach, borderRadius: 26, paddingVertical: 18, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 14, overflow: 'hidden' }}>
          <HeartsBackdrop />
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' }}><HouseHeartIcon color={colors.terra} size={22} /></View>
          <View style={{ flex: 1 }}>
            <Sans s={11} w={700} c={colors.terra} style={{ letterSpacing: 0.6 }}>MATERNIDADE ESCOLHIDA</Sans>
            <Title s={18} lh={1.25} style={{ marginTop: 2 }}>{s.maternityName}</Title>
            <View style={{ alignItems: 'flex-start' }}><TextButton label="Alterar" c={colors.terraDark} s={12} onPress={() => setEditing(true)} /></View>
          </View>
          {s.maternityPhone ? <CircleButton label="Ligar para a maternidade" bg={colors.card} onPress={() => Linking.openURL(`tel:${s.maternityPhone.replace(/[^\d+]/g, '')}`)}><PhoneIcon color={colors.terra} /></CircleButton> : null}
        </View>
      )}
      {BIRTH.map(([label, range, items], i) => (
        <View key={label}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Title s={18}>{label}</Title>
            <View style={{ backgroundColor: i === 0 ? colors.peach : colors.sand, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10 }}>
              <Sans s={11} w={600} c={i === 0 ? colors.terraDark : colors.mutedStrong}>{range}</Sans>
            </View>
          </View>
          <Checklist
            labels={items}
            map={s.birth}
            onToggle={(l) => {
              const done = !s.birth[l];
              save('/checklist', 'PUT', { list: 'nascimento', label: l, category: label, custom: false, done }, (st) => ({ birth: { ...st.birth, [l]: done } }));
            }}
          />
        </View>
      ))}
    </Screen>
  );
}
