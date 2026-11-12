import { useRouter } from 'expo-router';
import { Image, StyleProp, View, ViewStyle } from 'react-native';

import type { Article } from '@/content-provider';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Bookmark, CircleButton, ImageSlot, Press, Sans } from '@/ui';

export function ArticleThumb({ article, style }: { article: Article; style: StyleProp<ViewStyle> }) {
  if (!article.image) return <ImageSlot style={style} />;
  return <Image source={{ uri: article.image }} style={[{ backgroundColor: colors.photo }, style as object]} resizeMode="cover" accessibilityIgnoresInvertColors />;
}

export function ArticleRow({ article }: { article: Article }) {
  const { s, save, flash } = useStore();
  const router = useRouter();
  const on = !!s.saved[article.id];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: 20, padding: 10 }}>
      <Press accessibilityLabel={`Ler: ${article.title}`} onPress={() => router.push({ pathname: '/artigo', params: { id: article.id } })} style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <ArticleThumb article={article} style={{ width: 64, height: 64, borderRadius: 16 }} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Sans s={11} c={colors.muted}>{article.category}{article.minutes ? ` · ${article.minutes} min` : ''}</Sans>
          <Sans s={14} w={600} lh={1.3} style={{ marginTop: 3 }}>{article.title}</Sans>
        </View>
      </Press>
      <CircleButton
        label={on ? 'Remover dos salvos' : 'Salvar'}
        bg={on ? colors.peach : colors.sand}
        onPress={() => {
          save(`/saved/${article.id}`, 'PUT', { saved: !on }, (st) => ({ saved: { ...st.saved, [article.id]: !on } })).then((ok) => {
            if (ok) flash(on ? 'Removido dos salvos' : 'Salvo para ler depois');
          });
        }}>
        <Bookmark stroke={on ? colors.terra : colors.ink} fill={on ? colors.terra : 'none'} />
      </CircleButton>
    </View>
  );
}
