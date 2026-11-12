import { View } from 'react-native';

import { ArticleRow } from '@/components/article-row';
import { BookmarkHeart } from '@/components/love';
import { useContent } from '@/content-provider';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Card, PageHeader, Sans, Screen } from '@/ui';

export default function Salvos() {
  const { s } = useStore();
  const list = useContent().articles.filter((a) => s.saved[a.id]);
  return (
    <Screen gap={20}>
      <PageHeader title="Salvos" sub={`${list.length} ${list.length === 1 ? 'conteúdo' : 'conteúdos'} para ler depois`} fallback="/aprender" />
      {list.length ? (
        <View style={{ gap: 8 }}>
          {list.map((a) => <ArticleRow key={a.id} article={a} />)}
        </View>
      ) : (
        <Card bg={colors.peach} style={{ paddingVertical: 28, paddingHorizontal: 22, alignItems: 'center', gap: 12 }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' }}><BookmarkHeart color={colors.terra} /></View>
          <Sans s={14} lh={1.5} c={colors.terraText} style={{ textAlign: 'center' }}>Nada salvo ainda. Toque no marcador de um conteúdo para guardar aqui.</Sans>
        </Card>
      )}
    </Screen>
  );
}
