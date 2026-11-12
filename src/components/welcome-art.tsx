import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/theme';

const WEEKS = 40;
const CX = 180;
const CY = 244;
const RING = 122;

// Símbolo do Bornly cercado pelas 40 semanas da gestação.
export function WelcomeArt() {
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 360 480" preserveAspectRatio="xMidYMid slice" accessibilityLabel="Símbolo do Bornly cercado por um círculo de 40 pontos, um para cada semana">
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F7EFE7" />
          <Stop offset="1" stopColor="#EBD3C5" />
        </LinearGradient>
      </Defs>
      <Rect width="360" height="480" fill="url(#sky)" />
      <Circle cx={CX} cy={CY} r={176} fill="#FBF7F2" opacity={0.3} />
      <Circle cx={CX} cy={CY} r={96} fill="#FBF7F2" opacity={0.7} />

      {Array.from({ length: WEEKS }, (_, i) => {
        const angle = (i / WEEKS) * Math.PI * 2 - Math.PI / 2;
        const past = i < 13;
        return <Circle key={i} cx={CX + RING * Math.cos(angle)} cy={CY + RING * Math.sin(angle)} r={i === 13 ? 7 : past ? 3.4 : 2.6} fill={i === 13 ? colors.ink : past ? colors.terra : '#D6BFAE'} />;
      })}

      <Circle cx={CX} cy={CY} r={44} fill={colors.ink} />
      <Circle cx={CX} cy={CY} r={20} fill={colors.bg} />
      <Circle cx={CX + 11} cy={CY + 10} r={9.5} fill="#E2B9A6" />
    </Svg>
  );
}
