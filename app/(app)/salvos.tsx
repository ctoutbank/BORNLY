import { View } from 'react-native';

import { ArticleRow } from '@/components/article-row';
import { ART } from '@/content';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Card, PageHeader, Sans, Screen } from '@/ui';

export default function Salvos() {
  const { s } = useStore();
  const list = ART.filter((a) => s.saved[a.id]);
  return (
    <Screen gap={20}>
      <PageHeader title="Salvos" sub={`${list.length} conteúdos para ler depois`} fallback="/aprender" />
      {list.length ? (
        <View style={{ gap: 8 }}>
          {list.map((a) => <ArticleRow key={a.id} article={a} />)}
        </View>
      ) : (
        <Card style={{ paddingVertical: 28, paddingHorizontal: 22 }}>
          <Sans s={14} lh={1.5} c={colors.muted} style={{ textAlign: 'center' }}>Nada salvo ainda. Toque no marcador de um conteúdo para guardar aqui.</Sans>
        </Card>
      )}
    </Screen>
  );
}
