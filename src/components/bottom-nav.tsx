import { usePathname, useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme';
import { BookIcon, Press, Sans } from '@/ui';

type TabId = 'hoje' | 'saude' | 'preparar' | 'aprender';

const TAB_OF: Record<string, TabId> = {
  hoje: 'hoje', bebe: 'hoje', conta: 'hoje',
  saude: 'saude', diario: 'saude', sintomas: 'saude', consultas: 'saude', meds: 'saude', historico: 'saude', 'nova-consulta': 'saude',
  preparar: 'preparar', enxoval: 'preparar', mala: 'preparar', plano: 'preparar', nascimento: 'preparar',
  aprender: 'aprender', semana: 'aprender', duvidas: 'aprender', salvos: 'aprender', artigo: 'aprender',
  chutes: 'hoje', contracoes: 'hoje',
};

const TABS: { id: TabId; label: string; icon: (c: string) => React.ReactNode }[] = [
  {
    id: 'hoje',
    label: 'Hoje',
    icon: (c) => (
      <Svg width={20} height={20} viewBox="0 0 18 18">
        <Circle cx={9} cy={9} r={7} stroke={c} strokeWidth={1.6} fill="none" />
        <Circle cx={9} cy={9} r={2.5} fill={c} />
      </Svg>
    ),
  },
  {
    id: 'saude',
    label: 'Minha saúde',
    icon: (c) => (
      <Svg width={20} height={20} viewBox="0 0 18 18">
        <Circle cx={9} cy={9} r={7.2} stroke={c} strokeWidth={1.6} fill="none" />
        <Path d="M9 5.5v7M5.5 9h7" stroke={c} strokeWidth={1.6} strokeLinecap="round" />
      </Svg>
    ),
  },
  {
    id: 'preparar',
    label: 'Preparar',
    icon: (c) => (
      <Svg width={20} height={20} viewBox="0 0 18 18">
        <Rect x={2.5} y={6} width={13} height={10} rx={3} stroke={c} strokeWidth={1.6} fill="none" />
        <Path d="M6.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke={c} strokeWidth={1.6} fill="none" />
      </Svg>
    ),
  },
  { id: 'aprender', label: 'Aprender', icon: (c) => <BookIcon color={c} size={20} /> },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const active = TAB_OF[pathname.replace(/^\//, '')];

  return (
    <View style={{ position: 'absolute', left: 14, right: 14, bottom: Math.max(insets.bottom - 10, 16), backgroundColor: 'rgba(237,226,214,.96)', borderRadius: 32, padding: 6, flexDirection: 'row', shadowColor: colors.ink, shadowOpacity: 0.1, shadowRadius: 15, shadowOffset: { width: 0, height: 10 }, elevation: 6 }}>
      {TABS.map((t) => {
        const on = t.id === active;
        return (
          <Press key={t.id} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={t.label} onPress={() => router.dismissTo(`/${t.id}`)} style={{ flex: 1, alignItems: 'center', gap: 4, paddingTop: 4, paddingBottom: 6 }}>
            <View style={{ width: 42, height: 42, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? colors.terra : 'transparent' }}>
              {t.icon(on ? colors.bg : colors.mutedStrong)}
            </View>
            <Sans s={11} lh={1.3} w={600} c={on ? colors.terraDark : colors.muted}>{t.label}</Sans>
          </Press>
        );
      })}
    </View>
  );
}
