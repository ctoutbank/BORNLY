import { useRouter } from 'expo-router';
import { Switch, View } from 'react-native';

import { NOTIFS } from '@/content';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Card, OnboardingShell, Press, PrimaryButton, Sans, Serif, Spacer, TextButton } from '@/ui';

export default function Ready() {
  const { s, set } = useStore();
  const router = useRouter();
  const enter = () => {
    router.dismissAll();
    router.replace('/hoje');
  };
  return (
    <OnboardingShell step={4}>
      <View>
        <Serif s={28}>Tudo pronto, {s.name || 'você'}.</Serif>
        <Sans s={14} lh={1.5} c={colors.muted} style={{ marginTop: 8 }}>Quer que o Bornly lembre você de algumas coisas? Só ativamos o que você escolher.</Sans>
      </View>
      <Card style={{ paddingVertical: 6, paddingHorizontal: 18 }}>
        {NOTIFS.map(([k, label, sub], i) => {
          const toggle = () => set((st) => ({ notif: { ...st.notif, [k]: !st.notif[k] } }));
          return (
            <Press key={k} accessibilityRole="switch" accessibilityState={{ checked: s.notif[k] }} onPress={toggle} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, minHeight: 64, borderBottomWidth: i === 2 ? 0 : 1, borderBottomColor: colors.lineSoft }}>
              <View style={{ flex: 1 }}>
                <Sans s={15} w={600}>{label}</Sans>
                <Sans s={12.5} c={colors.muted} style={{ marginTop: 3 }}>{sub}</Sans>
              </View>
              <Switch value={s.notif[k]} onValueChange={toggle} trackColor={{ true: colors.sageDot, false: colors.track }} thumbColor={colors.card} ios_backgroundColor={colors.track} />
            </Press>
          );
        })}
      </Card>
      <Sans s={12.5} lh={1.5} c={colors.muted} style={{ paddingHorizontal: 4 }}>Você pode mudar isso a qualquer momento no seu perfil. Seus dados de saúde são protegidos conforme a LGPD.</Sans>
      <Spacer />
      <View style={{ gap: 4 }}>
        <PrimaryButton label="Entrar no Bornly" onPress={enter} />
        <TextButton label="Agora não" onPress={enter} />
      </View>
    </OnboardingShell>
  );
}
