import { StyleSheet } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme';

// Elementos visuais do padrão "perfil": corações, ícones de traço e fundos com mistura de cores.
export const HEART = 'M12 21s-7.5-4.7-7.5-10.6A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.8C19.5 16.3 12 21 12 21z';
export const line = (c: string, w = 1.8) => ({ stroke: c, strokeWidth: w, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

export const Heart = ({ color, size = 18, filled = false }: { color: string; size?: number; filled?: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d={HEART} {...line(color)} fill={filled ? color : 'none'} /></Svg>
);

// Corações soltos no canto do cartão
export function HeartsBackdrop({ color = colors.terra, low = false }: { color?: string; low?: boolean }) {
  const spots = low ? [
    { x: 262, y: 120, s: 24, o: 0.22 },
    { x: 312, y: 96, s: 14, o: 0.18 },
    { x: 226, y: 150, s: 12, o: 0.16 },
  ] : [
    { x: 250, y: 18, s: 26, o: 0.32 },
    { x: 300, y: 70, s: 16, o: 0.26 },
    { x: 214, y: 92, s: 12, o: 0.22 },
    { x: 290, y: 132, s: 20, o: 0.26 },
  ];
  return (
    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 340 200" preserveAspectRatio="xMaxYMin slice" pointerEvents="none">
      {spots.map((p, i) => <Path key={i} d={HEART} fill={color} opacity={p.o} transform={`translate(${p.x} ${p.y}) scale(${p.s / 24})`} />)}
    </Svg>
  );
}

// Tipos de compromisso: ícone e cores de cada um (mesmos da Nova consulta)
export const KIND_LOOK: Record<string, { short: string; bg: string; ink: string; icon: (c: string, size?: number) => React.ReactNode }> = {
  'Consulta pré-natal': { short: 'Pré-natal', bg: colors.peach, ink: colors.terra, icon: (c, s = 20) => <Svg width={s} height={s} viewBox="0 0 24 24"><Path d={HEART} {...line(c)} /></Svg> },
  Exame: { short: 'Exame', bg: colors.sage, ink: colors.sageInk, icon: (c, s = 20) => <Svg width={s} height={s} viewBox="0 0 24 24"><Rect x="5" y="4" width="14" height="17" rx="3" {...line(c)} /><Path d="M9 4.5V3.5h6v1M8.5 11l1.5 1.5 3-3M8.5 16.5h7" {...line(c)} /></Svg> },
  Ultrassom: { short: 'Ultrassom', bg: colors.sand, ink: colors.mutedStrong, icon: (c, s = 20) => <Svg width={s} height={s} viewBox="0 0 24 24"><Path d="M4 13c2-6 6-6 8 0s6 6 8 0" {...line(c)} /><Circle cx="12" cy="13" r="1.4" fill={c} /></Svg> },
  Vacina: { short: 'Vacina', bg: colors.avatar, ink: colors.terraDark, icon: (c, s = 20) => <Svg width={s} height={s} viewBox="0 0 24 24"><Path d="M12 3c2.6 1.6 4.7 2 6.5 2v6c0 4.4-3 7.4-6.5 9-3.5-1.6-6.5-4.6-6.5-9V5C7.3 5 9.4 4.6 12 3z" {...line(c)} /><Path d="M9.2 12l2 2 3.6-3.6" {...line(c)} /></Svg> },
};
export const kindLook = (title: string) => KIND_LOOK[title] ?? KIND_LOOK['Consulta pré-natal'];

export const ChatHeart = ({ color, size = 20 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3.5V17H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" {...line(color)} /><Path d="M12 13.6s-2.4-1.5-2.4-3a1.3 1.3 0 0 1 2.4-.7 1.3 1.3 0 0 1 2.4.7c0 1.5-2.4 3-2.4 3z" fill={color} /></Svg>
);
export const CheckCircle = ({ color, size = 18 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Circle cx="12" cy="12" r="9" {...line(color)} /><Path d="M8.5 12.2l2.4 2.4 4.6-4.8" {...line(color)} /></Svg>
);
export const Close = ({ color, size = 14 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M6 6l12 12M18 6L6 18" {...line(color, 2)} /></Svg>
);

// Ícones de seções (Minha saúde e telas relacionadas)
export const DiaryIcon = ({ color, size = 20 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M6 3.5h10a2 2 0 0 1 2 2v15H8a2 2 0 0 1-2-2z" {...line(color)} /><Path d="M6 18.5a2 2 0 0 1 2-2h10" {...line(color)} /><Path d="M12 12.6s-2.4-1.5-2.4-3a1.3 1.3 0 0 1 2.4-.7 1.3 1.3 0 0 1 2.4.7c0 1.5-2.4 3-2.4 3z" fill={color} /></Svg>
);
export const PulseIcon = ({ color, size = 20 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M3 12h4l2-5 4 10 2-5h6" {...line(color)} /></Svg>
);
export const CalendarHeart = ({ color, size = 20 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Rect x="4" y="5" width="16" height="15" rx="3" {...line(color)} /><Path d="M4 10h16M9 3v4M15 3v4" {...line(color)} /><Path d="M12 17.6s-2.6-1.6-2.6-3.3a1.4 1.4 0 0 1 2.6-.8 1.4 1.4 0 0 1 2.6.8c0 1.7-2.6 3.3-2.6 3.3z" fill={color} /></Svg>
);
export const ChartIcon = ({ color, size = 20 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M4 19h16" {...line(color)} /><Path d="M5 15l4-4 3 3 6-7" {...line(color)} /><Circle cx="18" cy="7" r="1.6" fill={color} /></Svg>
);
export const PillIcon = ({ color, size = 20 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G transform="rotate(-40 12 12)">
      <Path d="M12 7.5H8.5a4.5 4.5 0 0 0 0 9H12z" fill={color} />
      <Rect x="4" y="7.5" width="16" height="9" rx="4.5" {...line(color)} />
    </G>
  </Svg>
);
