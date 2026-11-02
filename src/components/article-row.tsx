import { View } from 'react-native';

import { ART } from '@/content';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Bookmark, CircleButton, ImageSlot, Sans } from '@/ui';

export function ArticleRow({ article }: { article: (typeof ART)[number] }) {
  const { s, set, flash } = useStore();
  const on = !!s.saved[article.id];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderRadius: 22, padding: 10 }}>
      <ImageSlot style={{ width: 64, height: 64, borderRadius: 16 }} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Sans s={11} c={colors.muted}>{article.cat} · {article.min} min</Sans>
        <Sans s={14} w={600} lh={1.3} style={{ marginTop: 3 }}>{article.title}</Sans>
      </View>
      <CircleButton
        label={on ? 'Remover dos salvos' : 'Salvar'}
        bg={on ? colors.ink : colors.sand}
        onPress={() => {
          set((st) => ({ saved: { ...st.saved, [article.id]: !on } }));
          flash(on ? 'Removido dos salvos' : 'Salvo para ler depois');
        }}>
        <Bookmark stroke={on ? colors.bg : colors.ink} fill={on ? colors.bg : 'none'} />
      </CircleButton>
    </View>
  );
}
