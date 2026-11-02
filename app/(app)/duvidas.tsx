import { View } from 'react-native';

import { FAQ } from '@/content';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { PageHeader, Plus, Press, Sans, Screen } from '@/ui';

export default function Duvidas() {
  const { s, set } = useStore();
  return (
    <Screen gap={20}>
      <PageHeader title="Guia de dúvidas" sub="Respostas curtas, fontes identificadas" fallback="/aprender" />
      <View style={{ gap: 8 }}>
        {FAQ.map(([q, a, src], i) => {
          const open = s.faqOpen === i;
          return (
            <View key={q} style={{ backgroundColor: open ? colors.card : colors.sandSoft, borderRadius: 24, overflow: 'hidden' }}>
              <Press accessibilityState={{ expanded: open }} onPress={() => set({ faqOpen: open ? -1 : i })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, minHeight: 60 }}>
                <Sans s={15} w={600} lh={1.35} style={{ flex: 1 }}>{q}</Sans>
                <View style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: open ? colors.ink : colors.card, transform: [{ rotate: open ? '45deg' : '0deg' }] }}>
                  <Plus color={open ? colors.bg : colors.ink} size={12} strokeWidth={2} />
                </View>
              </Press>
              {open ? (
                <View style={{ paddingHorizontal: 18, paddingBottom: 18 }}>
                  <Sans s={14} lh={1.55} c={colors.body}>{a}</Sans>
                  <Sans s={11.5} c={colors.muted} style={{ marginTop: 10 }}>Fonte: {src}</Sans>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </Screen>
  );
}
