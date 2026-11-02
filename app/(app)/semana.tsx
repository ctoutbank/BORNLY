import { View } from 'react-native';

import { ArticleRow } from '@/components/article-row';
import { ART, GUIDE } from '@/content';
import { gestation, useStore } from '@/store';
import { colors } from '@/theme';
import { Card, ImageSlot, PageHeader, Sans, Screen, Serif } from '@/ui';

export default function Semana() {
  const { s } = useStore();
  return (
    <Screen gap={20}>
      <PageHeader title={`Semana ${gestation(s).week}`} sub="Cuidados desta fase" fallback="/aprender" />
      <Card radius={30} style={{ padding: 8 }}>
        <ImageSlot label="foto · orientação da semana" style={{ height: 180, borderRadius: 24 }} />
        <View style={{ paddingTop: 16, paddingHorizontal: 12, paddingBottom: 12 }}>
          <Serif s={20} lh={1.25}>Orientação desta semana</Serif>
          <Sans s={14} lh={1.55} c={colors.body} style={{ marginTop: 8 }}>{GUIDE}</Sans>
          <Sans s={11.5} c={colors.muted} style={{ marginTop: 12 }}>Revisado por Dra. Helena Prado, obstetra · atualizado em out 2026</Sans>
        </View>
      </Card>
      <View style={{ gap: 8 }}>
        {ART.map((a) => <ArticleRow key={a.id} article={a} />)}
      </View>
    </Screen>
  );
}
