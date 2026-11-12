import { View } from 'react-native';

import { useStore } from '@/store';
import { colors } from '@/theme';
import { Sans, useTopPad } from '@/ui';

export function Toast() {
  const { s } = useStore();
  const top = useTopPad();
  if (!s.toast) return null;
  return (
    <View pointerEvents="none" accessibilityLiveRegion="polite" style={{ position: 'absolute', top, left: 16, right: 16, alignItems: 'center' }}>
      <View style={{ backgroundColor: colors.terraDark, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 20 }}>
        <Sans s={13} w={600} c={colors.bg}>{s.toast}</Sans>
      </View>
    </View>
  );
}
