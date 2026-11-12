import { Linking, View } from 'react-native';

import { ChatHeart, CheckCircle } from '@/components/love';
import { useContent } from '@/content-provider';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { PageHeader, Plus, Press, Sans, Screen } from '@/ui';

export default function Duvidas() {
  const { s, set } = useStore();
  const FAQ = useContent().faq;
  return (
    <Screen gap={20}>
      <PageHeader title="Guia de dúvidas" sub="Respostas curtas, fontes identificadas" fallback="/aprender" />
      <View style={{ gap: 8 }}>
        {FAQ.map(({ question: q, answer: a, source: src, sourceUrl }, i) => {
          const open = s.faqOpen === i;
          return (
            <View key={q} style={{ backgroundColor: open ? colors.card : colors.sandSoft, borderRadius: 24, overflow: 'hidden', borderWidth: 1.5, borderColor: open ? colors.peach : 'transparent' }}>
              <Press accessibilityState={{ expanded: open }} onPress={() => set({ faqOpen: open ? -1 : i })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, minHeight: 60 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: open ? colors.peach : colors.card, alignItems: 'center', justifyContent: 'center' }}><ChatHeart color={colors.terra} size={16} /></View>
                <Sans s={15} w={600} lh={1.35} style={{ flex: 1 }}>{q}</Sans>
                <View style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: open ? colors.peach : colors.card, transform: [{ rotate: open ? '45deg' : '0deg' }] }}>
                  <Plus color={colors.terra} size={14} strokeWidth={2} />
                </View>
              </Press>
              {open ? (
                <View style={{ paddingHorizontal: 18, paddingBottom: 18 }}>
                  <Sans s={14} lh={1.55} c={colors.body}>{a}</Sans>
                  {src ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 }}>
                      <CheckCircle color={colors.sageDot} size={14} />
                      <Sans s={11} c={colors.sageInk} style={{ flex: 1 }} onPress={sourceUrl ? () => Linking.openURL(sourceUrl) : undefined}>Fonte: {src}{sourceUrl ? ' ↗' : ''}</Sans>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </Screen>
  );
}
