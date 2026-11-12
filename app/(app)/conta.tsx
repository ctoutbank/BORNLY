import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { api } from '@/api';
import { API_URL, authClient, authErrorMessage } from '@/auth-client';
import { fmt, gestation, useStore } from '@/store';
import { colors } from '@/theme';
import { Card, Chevron, Field, PageHeader, Press, PrimaryButton, Sans, Screen, TextButton, Title, ToggleRow } from '@/ui';

const HEART = 'M12 21s-7.5-4.7-7.5-10.6A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.8C19.5 16.3 12 21 12 21z';
const line = (c: string) => ({ stroke: c, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

const Heart = ({ color, size = 18, filled = false }: { color: string; size?: number; filled?: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d={HEART} {...line(color)} fill={filled ? color : 'none'} /></Svg>
);
const ICONS = {
  gravidez: (c: string) => <Svg width={20} height={20} viewBox="0 0 24 24"><Rect x="4" y="5" width="16" height="15" rx="3" {...line(c)} /><Path d="M4 10h16M9 3v4M15 3v4" {...line(c)} /><Path d="M12 17.6s-2.6-1.6-2.6-3.3a1.4 1.4 0 0 1 2.6-.8 1.4 1.4 0 0 1 2.6.8c0 1.7-2.6 3.3-2.6 3.3z" fill={c} /></Svg>,
  maternidade: (c: string) => <Svg width={20} height={20} viewBox="0 0 24 24"><Path d="M4 20V10l8-5 8 5v10z" {...line(c)} /><Path d="M12 16.6s-2.6-1.6-2.6-3.3a1.4 1.4 0 0 1 2.6-.8 1.4 1.4 0 0 1 2.6.8c0 1.7-2.6 3.3-2.6 3.3z" fill={c} /></Svg>,
  copia: (c: string) => <Svg width={20} height={20} viewBox="0 0 24 24"><Path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19h14" {...line(c)} /></Svg>,
};

// Corações soltos no fundo do cartão principal
function HeartsBackdrop() {
  const spots = [
    { x: 250, y: 18, s: 26, o: 0.35 },
    { x: 300, y: 70, s: 16, o: 0.28 },
    { x: 214, y: 92, s: 12, o: 0.25 },
    { x: 286, y: 132, s: 22, o: 0.3 },
  ];
  return (
    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 340 200" preserveAspectRatio="xMaxYMin slice" pointerEvents="none">
      {spots.map((p, i) => (
        <Path key={i} d={HEART} fill={colors.terra} opacity={p.o} transform={`translate(${p.x} ${p.y}) scale(${p.s / 24})`} />
      ))}
    </Svg>
  );
}

export default function Conta() {
  const { s, save, flash, reset } = useStore();
  const router = useRouter();
  const g = gestation(s);
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const left = Math.max(0, 40 - g.week);

  const leave = () => {
    reset();
    if (router.canDismiss()) router.dismissAll();
    router.replace('/welcome');
  };

  const signOut = async () => {
    await authClient.signOut();
    leave();
  };

  const exportData = async () => {
    try {
      const data = await api('/export');
      await Share.share({ title: 'Meus dados do Bornly', message: JSON.stringify(data, null, 2) });
    } catch {
      flash('Não foi possível gerar a cópia. Verifique sua conexão.');
    }
  };

  const confirmDelete = async () => {
    setError('');
    const { error: failure } = await authClient.deleteUser({ password });
    if (failure) return setError(authErrorMessage(failure));
    await authClient.signOut().catch(() => undefined);
    leave();
  };

  const resend = async () => {
    const { error: failure } = await authClient.sendVerificationEmail({ email: s.email, callbackURL: `${API_URL}/email-confirmado` });
    flash(failure ? 'Não foi possível enviar agora.' : 'Enviamos o link para o seu e-mail.');
  };

  const rows = [
    { key: 'gravidez', label: 'Dados da gravidez', sub: 'DUM, data provável ou idade gestacional', bg: colors.peach, ink: colors.terra, go: () => router.push('/date') },
    { key: 'maternidade', label: 'Minha maternidade', sub: s.maternityName || 'Onde seu bebê vai nascer', bg: colors.sage, ink: colors.sageInk, go: () => router.push('/nascimento') },
  ] as const;

  return (
    <Screen gap={18}>
      <PageHeader title="Meu perfil" fallback="/hoje" light />

      <View style={{ backgroundColor: colors.peach, borderRadius: 28, padding: 20, overflow: 'hidden' }}>
        <HeartsBackdrop />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.avatar, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.card }}>
            <Title s={26} c={colors.terraDark}>{(s.name || 'M').trim().charAt(0).toUpperCase()}</Title>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Title s={24} lh={1.15} numberOfLines={1}>{s.name || 'Você'}</Title>
            <Sans s={12} c={colors.mutedStrong} numberOfLines={1} style={{ marginTop: 2 }}>{s.email}</Sans>
          </View>
        </View>
        <View style={{ marginTop: 18, backgroundColor: 'rgba(251,247,242,.7)', borderRadius: 20, padding: 14, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Heart color={colors.terra} size={16} filled />
            <Sans s={14} w={600} c={colors.terraDark}>{g.week} semanas de amor</Sans>
          </View>
          <View style={{ height: 6, borderRadius: 9, backgroundColor: colors.card, overflow: 'hidden' }}>
            <View style={{ width: `${g.pct}%`, height: '100%', borderRadius: 9, backgroundColor: colors.terra }} />
          </View>
          <Sans s={12} c={colors.mutedStrong}>
            {left ? `Faltam cerca de ${left} semanas para o encontro` : 'O encontro está chegando'} · DPP {fmt(g.due, { day: 'numeric', month: 'short', year: 'numeric' }).replace(/\./g, '')}
          </Sans>
        </View>
      </View>

      {s.emailVerified ? null : (
        <Card bg={colors.sage} radius={22} style={{ padding: 16, gap: 2 }}>
          <Sans s={13} lh={1.45} c={colors.sageInk}>Confirme seu e-mail para conseguir recuperar a conta, se precisar.</Sans>
          <View style={{ alignItems: 'flex-start' }}><TextButton label="Reenviar confirmação" w={600} c={colors.sageInk} onPress={resend} /></View>
        </Card>
      )}

      <View style={{ gap: 10 }}>
        <Sans s={12} w={600} c={colors.muted} style={{ paddingHorizontal: 4 }}>SUA GRAVIDEZ</Sans>
        <Card style={{ paddingVertical: 4, paddingHorizontal: 16 }}>
          {rows.map((r, i) => (
            <Press key={r.key} onPress={r.go} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, minHeight: 64, borderBottomWidth: i === rows.length - 1 ? 0 : 1, borderBottomColor: colors.lineSoft }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: r.bg, alignItems: 'center', justifyContent: 'center' }}>{ICONS[r.key](r.ink)}</View>
              <View style={{ flex: 1 }}>
                <Sans s={14} w={600}>{r.label}</Sans>
                <Sans s={12} c={colors.muted} style={{ marginTop: 2 }}>{r.sub}</Sans>
              </View>
              <Chevron />
            </Press>
          ))}
        </Card>
      </View>

      <View style={{ gap: 10 }}>
        <Sans s={12} w={600} c={colors.muted} style={{ paddingHorizontal: 4 }}>CUIDADOS E PRIVACIDADE</Sans>
        <Card style={{ paddingVertical: 4, paddingHorizontal: 16 }}>
          <ToggleRow label="Lembrete de consultas" sub="Um e-mail carinhoso um dia antes" on={s.notifyAppointments} last={false} onToggle={() => save('/profile', 'PUT', { notifyAppointments: !s.notifyAppointments }, { notifyAppointments: !s.notifyAppointments })} />
          <Press onPress={exportData} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, minHeight: 64 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.sand, alignItems: 'center', justifyContent: 'center' }}>{ICONS.copia(colors.mutedStrong)}</View>
            <View style={{ flex: 1 }}>
              <Sans s={14} w={600}>Baixar uma cópia dos meus dados</Sans>
              <Sans s={12} c={colors.muted} style={{ marginTop: 2 }}>Seus registros são seus, sempre</Sans>
            </View>
            <Chevron />
          </Press>
        </Card>
      </View>

      <Press accessibilityLabel="Sair" onPress={signOut} style={{ height: 56, borderRadius: 999, backgroundColor: colors.peach, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Heart color={colors.terraDark} size={16} />
        <Sans s={15} w={600} c={colors.terraDark}>Sair da conta</Sans>
      </Press>

      {deleting ? (
        <Card bg={colors.card} radius={24} style={{ padding: 18, gap: 12, borderWidth: 1.5, borderColor: colors.peach }}>
          <Title s={18} c={colors.terraDark}>Excluir conta e dados</Title>
          <Sans s={13} lh={1.5} c={colors.terraText}>Isso apaga sua conta e todos os seus registros, sem volta. Digite sua senha para confirmar.</Sans>
          <Field value={password} onChangeText={setPassword} secureTextEntry placeholder="Sua senha" autoComplete="current-password" />
          {error ? <Sans s={13} c={colors.terraDark}>{error}</Sans> : null}
          <PrimaryButton label="Excluir definitivamente" bg={colors.terraDark} heart={false} onPress={confirmDelete} />
          <TextButton label="Cancelar" onPress={() => setDeleting(false)} />
        </Card>
      ) : (
        <TextButton label="Excluir minha conta" w={600} c={colors.terraDark} onPress={() => setDeleting(true)} />
      )}

      <View style={{ alignItems: 'center', gap: 6, paddingHorizontal: 8 }}>
        <Heart color={colors.terra} size={18} filled />
        <Sans s={12} lh={1.5} c={colors.muted} style={{ textAlign: 'center' }}>Feito com carinho para acompanhar você e seu bebê. O Bornly organiza informações entre consultas e não substitui o atendimento da sua equipe de saúde nem serviços de emergência.</Sans>
      </View>
    </Screen>
  );
}
