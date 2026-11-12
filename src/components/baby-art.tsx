import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { colors } from '@/theme';

// Bebê encolhido de perfil, em silhueta. Cresce por fase e fica de cabeça para baixo perto do nascimento.
const BODY = 'M54 24 C40 24 31 35 32 48 C33 57 39 63 46 64 C48 66 49 69 48 72 C43 76 40 84 44 91 C49 99 62 103 73 99 C87 93 93 78 89 63 C86 51 79 42 73 36 C68 28 61 24 54 24 Z';
const detail = { stroke: colors.card, strokeWidth: 2.4, fill: 'none', strokeLinecap: 'round' as const };

function Fetus({ scale, rotate = 0 }: { scale: number; rotate?: number }) {
  return (
    <G transform={`translate(62 64) rotate(${rotate}) scale(${scale}) translate(-62 -64)`}>
      <Path d={BODY} fill={colors.terra} />
      <Path d="M48 72 C54 70 60 72 62 78" {...detail} />
      <Path d="M46 64 C52 62 56 64 58 68" {...detail} />
      <Path d="M44 91 C52 92 60 88 64 82" {...detail} />
      <Circle cx="42" cy="44" r="1.8" fill={colors.card} />
    </G>
  );
}

export function BabyArt({ week, style }: { week: number; style?: StyleProp<ViewStyle> }) {
  const art =
    week < 10 ? (
      <G>
        <Path d="M58 50 C72 46 80 58 76 70 C72 80 58 82 52 74 C48 68 52 62 58 64" fill="none" stroke={colors.terra} strokeWidth={7} strokeLinecap="round" />
        <Circle cx="66" cy="60" r="3.5" fill={colors.card} />
      </G>
    ) : week < 20 ? (
      <Fetus scale={0.62} />
    ) : week < 30 ? (
      <Fetus scale={0.85} />
    ) : (
      <Fetus scale={1.02} rotate={180} />
    );
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={`Ilustração do bebê na semana ${week}`} style={[{ backgroundColor: colors.peach, overflow: 'hidden' }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 120 120">
        <Circle cx="100" cy="12" r="34" fill={colors.photo} />
        <Circle cx="14" cy="112" r="30" fill={colors.sage} />
        <Circle cx="60" cy="62" r="42" fill={colors.card} />
        {art}
      </Svg>
    </View>
  );
}
