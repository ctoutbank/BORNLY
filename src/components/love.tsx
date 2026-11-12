import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

import { colors, fonts } from '@/theme';

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
export const SmileIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Circle cx="12" cy="12" r="9" {...line(color)} /><Path d="M8.5 14c1 1.4 2.2 2 3.5 2s2.5-.6 3.5-2" {...line(color)} /><Circle cx="9" cy="10" r="1.1" fill={color} /><Circle cx="15" cy="10" r="1.1" fill={color} /></Svg>
);
export const MoonIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" {...line(color)} /></Svg>
);
export const PencilIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M4 20h4L19 9l-4-4L4 16z" {...line(color)} /><Path d="M13.5 6.5l4 4" {...line(color)} /></Svg>
);
export const AlertIcon = ({ color, size = 20 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M12 4l9 16H3z" {...line(color)} /><Path d="M12 10v4" {...line(color)} /><Circle cx="12" cy="17" r="1" fill={color} /></Svg>
);
export const PhoneIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" {...line(color)} /></Svg>
);

// Título de seção com ícone num círculo colorido
export function SectionLabel({ icon, label, bg }: { icon: React.ReactNode; label: string; bg: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>{icon}</View>
      <Text style={{ fontFamily: fonts.sans600, fontSize: 12, letterSpacing: 0.6, color: colors.muted, textTransform: 'uppercase' }}>{label}</Text>
    </View>
  );
}
export const ClockIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Circle cx="12" cy="12" r="9" {...line(color)} /><Path d="M12 7.5V12l3 2" {...line(color)} /></Svg>
);

// Ícones de Preparar
export const OnesieIcon = ({ color, size = 20 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M9 3.5c.6 1.4 1.7 2 3 2s2.4-.6 3-2l4 2.2-1.6 3.6-2-.8V18l-2 2.5h-2.8L8.6 18V8.5l-2 .8L5 5.7z" {...line(color)} /></Svg>
);
export const BagIcon = ({ color, size = 20 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Rect x="4" y="7.5" width="16" height="12.5" rx="3" {...line(color)} /><Path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" {...line(color)} /><Path d="M12 16.6s-2.4-1.5-2.4-3a1.3 1.3 0 0 1 2.4-.7 1.3 1.3 0 0 1 2.4.7c0 1.5-2.4 3-2.4 3z" fill={color} /></Svg>
);
export const DocHeartIcon = ({ color, size = 20 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M6 3.5h8l4 4v13H6z" {...line(color)} /><Path d="M14 3.5v4h4" {...line(color)} /><Path d="M12 17s-2.4-1.5-2.4-3a1.3 1.3 0 0 1 2.4-.7 1.3 1.3 0 0 1 2.4.7c0 1.5-2.4 3-2.4 3z" fill={color} /></Svg>
);
export const HouseHeartIcon = ({ color, size = 20 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M4 20V10l8-5 8 5v10z" {...line(color)} /><Path d="M12 16.6s-2.6-1.6-2.6-3.3a1.4 1.4 0 0 1 2.6-.8 1.4 1.4 0 0 1 2.6.8c0 1.7-2.6 3.3-2.6 3.3z" fill={color} /></Svg>
);
export const BabyIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Circle cx="12" cy="10" r="6" {...line(color)} /><Path d="M9.5 10.5h.01M14.5 10.5h.01" {...line(color, 2.4)} /><Path d="M10 13c.6.6 1.3.9 2 .9s1.4-.3 2-.9M8 20c1-1.6 2.4-2.4 4-2.4s3 .8 4 2.4" {...line(color)} /></Svg>
);
export const PeopleIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Circle cx="9" cy="8" r="3" {...line(color)} /><Circle cx="16.5" cy="9" r="2.5" {...line(color)} /><Path d="M3.5 19c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8M14.5 14.6c2.8-.4 5 1.2 5.8 4.4" {...line(color)} /></Svg>
);
