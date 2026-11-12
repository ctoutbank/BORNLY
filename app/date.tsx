import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { DateField } from '@/components/date-field';
import { DAY, fmt, fromIso, gestation, iso, useStore } from '@/store';
import { colors } from '@/theme';
import { Card, OnboardingShell, Overline, Press, PrimaryButton, Sans, Segmented, Title, Spacer } from '@/ui';

function Stepper({ label, value, onDec, onInc }: { label: string; value: number; onDec: () => void; onInc: () => void }) {
  return (
    <Card radius={20} style={{ flex: 1, padding: 14 }}>
      <Sans s={12} c={colors.muted}>{label}</Sans>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        <Press accessibilityLabel={`Diminuir ${label}`} onPress={onDec} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.sand, alignItems: 'center', justifyContent: 'center' }}><Sans s={18}>−</Sans></Press>
        <Title s={28} lh={1.1}>{value}</Title>
        <Press accessibilityLabel={`Aumentar ${label}`} onPress={onInc} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}><Sans s={18} c={colors.bg}>+</Sans></Press>
      </View>
    </Card>
  );
}

export default function DateScreen() {
  const { s, set } = useStore();
  const router = useRouter();
  const g = gestation(s);
  const dppIso = iso(new Date(fromIso(s.dum).getTime() + 280 * DAY));

  return (
    <OnboardingShell step={2}>
      <View>
        <Title s={28}>{s.moment === 'tentante' ? 'Quando foi sua última menstruação?' : 'Vamos calcular sua gravidez'}</Title>
        <Sans s={14} lh={1.5} c={colors.muted} style={{ marginTop: 8 }}>Use o que você tiver em mãos. Dá para ajustar depois, conforme a avaliação do seu obstetra.</Sans>
      </View>
      <Segmented
        value={s.method}
        onChange={(id) => set({ method: id as typeof s.method })}
        options={[{ id: 'dum', label: 'DUM' }, { id: 'dpp', label: 'DPP' }, { id: 'ig', label: 'Idade gestacional' }]}
      />
      {s.method === 'ig' ? (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Stepper label="Semanas" value={s.igW} onDec={() => set({ igW: Math.max(4, s.igW - 1) })} onInc={() => set({ igW: Math.min(41, s.igW + 1) })} />
          <Stepper label="Dias" value={s.igD} onDec={() => set({ igD: Math.max(0, s.igD - 1) })} onInc={() => set({ igD: Math.min(6, s.igD + 1) })} />
        </View>
      ) : (
        <View style={{ gap: 8 }}>
          <Overline>{s.method === 'dpp' ? 'Data provável do parto' : 'Primeiro dia da última menstruação'}</Overline>
          <DateField
            value={s.method === 'dpp' ? dppIso : s.dum}
            onChange={(v) => set({ dum: s.method === 'dpp' ? iso(new Date(fromIso(v).getTime() - 280 * DAY)) : v })}
          />
        </View>
      )}
      <Card bg={colors.ink} style={{ padding: 22 }}>
        <Overline c={colors.onInkSoft}>Pelo que você informou</Overline>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
          <Title s={40} lh={1.05} c={colors.bg}>{g.week}</Title>
          <Title s={18} c={colors.bg}>semanas</Title>
          <Sans s={14} c={colors.onInkMid}>+ {g.day} dias</Sans>
        </View>
        <Sans s={13} c={colors.onInkMid} style={{ marginTop: 12 }}>
          DPP estimada: <Sans s={13} w={600} c={colors.bg}>{fmt(g.due, { day: 'numeric', month: 'long', year: 'numeric' })}</Sans>
        </Sans>
      </Card>
      <Spacer />
      <PrimaryButton label="Continuar" onPress={() => router.push('/about')} />
    </OnboardingShell>
  );
}
