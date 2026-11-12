import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { api } from '@/api';
import { authClient } from '@/auth-client';
import { profilePayload } from '@/profile';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Card, CheckRow, OnboardingShell, PrimaryButton, Sans, Spacer, Title, ToggleRow } from '@/ui';

export default function Ready() {
  const { s, set, flash, load } = useStore();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [consent, setConsent] = useState(s.hasConsent);
  const [busy, setBusy] = useState(false);

  const next = async () => {
    if (!consent) return flash('Para continuar, autorize a guarda dos seus dados.');
    if (!session) return router.push('/signup');
    if (busy) return;
    setBusy(true);
    try {
      await api('/profile', 'PUT', profilePayload(s, true));
      await load();
      if (router.canDismiss()) router.dismissAll();
      router.replace('/hoje');
    } catch {
      flash('Não foi possível salvar. Verifique sua conexão.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <OnboardingShell step={4}>
      <View>
        <Title s={28}>Tudo pronto, {s.name || 'você'}.</Title>
        <Sans s={14} lh={1.5} c={colors.muted} style={{ marginTop: 8 }}>Falta só combinar duas coisas com você.</Sans>
      </View>
      <Card style={{ paddingVertical: 6, paddingHorizontal: 18 }}>
        <ToggleRow label="Lembrete de consultas" sub="Por e-mail, um dia antes, sem detalhes de saúde" on={s.notifyAppointments} last onToggle={() => set({ notifyAppointments: !s.notifyAppointments })} />
      </Card>
      <Card style={{ paddingVertical: 4, paddingHorizontal: 18 }}>
        <CheckRow label="Autorizo o Bornly a guardar os dados de saúde que eu registrar, para mostrar meu acompanhamento." on={consent} last plain onPress={() => setConsent(!consent)} />
      </Card>
      <Sans s={12} lh={1.5} c={colors.muted} style={{ paddingHorizontal: 4 }}>Você pode baixar uma cópia ou excluir sua conta e seus dados a qualquer momento, na tela Conta.</Sans>
      <Spacer />
      <PrimaryButton label={session ? 'Salvar' : 'Criar minha conta'} onPress={next} />
    </OnboardingShell>
  );
}
