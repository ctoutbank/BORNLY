import { View } from 'react-native';

import { ArticleRow } from '@/components/article-row';
import { articlesForWeek, babyFor, useContent } from '@/content-provider';
import { gestation, useStore } from '@/store';
import { colors } from '@/theme';
import { Card, ImageSlot, PageHeader, Sans, Screen, Title } from '@/ui';

export default function Semana() {
  const { s } = useStore();
  const { week } = gestation(s);
  const content = useContent();
  const list = articlesForWeek(content.articles, week);
  return (
    <Screen gap={20}>
      <PageHeader title={`Semana ${week}`} sub="Cuidados desta fase" fallback="/aprender" />
      <Card radius={28} style={{ padding: 8 }}>
        <ImageSlot label="foto · orientação da semana" style={{ height: 180, borderRadius: 24 }} />
        <View style={{ paddingTop: 16, paddingHorizontal: 12, paddingBottom: 12 }}>
          <Title s={18} lh={1.25}>Orientação desta semana</Title>
          <Sans s={14} lh={1.55} c={colors.body} style={{ marginTop: 8 }}>{babyFor(week, content.weeks).guide}</Sans>
          <Sans s={11} c={colors.muted} style={{ marginTop: 12 }}>Conteúdo informativo. Não substitui o seu pré-natal.</Sans>
        </View>
      </Card>
      <View style={{ gap: 8 }}>
        {(list.length ? list : content.articles).map((a) => <ArticleRow key={a.id} article={a} />)}
      </View>
    </Screen>
  );
}
