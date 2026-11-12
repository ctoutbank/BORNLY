import { useLocalSearchParams } from 'expo-router';
import { Image, Linking, View } from 'react-native';

import { useContent } from '@/content-provider';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Bookmark, Card, CircleButton, ImageSlot, PageHeader, Press, Sans, Screen, Title } from '@/ui';

export default function Artigo() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const a = useContent().articles.find((x) => x.id === id);
  const { s, save, flash } = useStore();
  if (!a) {
    return (
      <Screen>
        <PageHeader title="Conteúdo" fallback="/aprender" />
        <Sans s={14} c={colors.muted}>Este conteúdo não está mais disponível.</Sans>
      </Screen>
    );
  }
  const on = !!s.saved[a.id];
  return (
    <Screen gap={18}>
      <PageHeader
        title={a.category}
        sub={a.minutes ? `${a.minutes} min de leitura` : undefined}
        fallback="/aprender"
        right={
          <CircleButton label={on ? 'Remover dos salvos' : 'Salvar'} bg={on ? colors.ink : colors.card} onPress={() => save(`/saved/${a.id}`, 'PUT', { saved: !on }, (st) => ({ saved: { ...st.saved, [a.id]: !on } })).then((ok) => ok && flash(on ? 'Removido dos salvos' : 'Salvo para ler depois'))}>
            <Bookmark stroke={on ? colors.bg : colors.ink} fill={on ? colors.bg : 'none'} />
          </CircleButton>
        }
      />
      {a.image ? (
        <View>
          <Image source={{ uri: a.image }} style={{ height: 200, borderRadius: 24, backgroundColor: colors.photo }} resizeMode="cover" accessibilityIgnoresInvertColors />
          {a.imageCredit ? <Sans s={11} c={colors.muted} style={{ marginTop: 6 }}>{a.imageCredit}</Sans> : null}
        </View>
      ) : (
        <ImageSlot label="ilustração" style={{ height: 160, borderRadius: 24 }} />
      )}
      <Title s={24} lh={1.25}>{a.title}</Title>
      {a.summary ? <Sans s={15} lh={1.55} w={500} c={colors.mutedStrong}>{a.summary}</Sans> : null}
      {a.body.split(/\n\s*\n/).map((p, i) => (
        <Sans key={i} s={15} lh={1.6} c={colors.body}>{p.trim()}</Sans>
      ))}
      {a.sourceName || a.sourceUrl ? (
        <Card bg={colors.sage} style={{ padding: 18, gap: 6 }}>
          <Sans s={11} w={600} c={colors.sageInk}>FONTE</Sans>
          <Sans s={14} lh={1.45} c={colors.ink}>{a.sourceName || a.sourceUrl}</Sans>
          {a.sourceUrl ? (
            <Press onPress={() => Linking.openURL(a.sourceUrl!)} hitSlop={8} style={{ minHeight: 36, justifyContent: 'center' }}>
              <Sans s={13} w={600} c={colors.terra}>Abrir a página oficial</Sans>
            </Press>
          ) : null}
        </Card>
      ) : null}
      <Sans s={11} lh={1.5} c={colors.muted}>Conteúdo informativo, escrito com base em materiais públicos do Ministério da Saúde. Não substitui o acompanhamento do seu pré-natal.</Sans>
    </Screen>
  );
}
