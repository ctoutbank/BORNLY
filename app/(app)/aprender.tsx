import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { ArticleRow, ArticleThumb } from '@/components/article-row';

import { articlesForWeek, useContent } from '@/content-provider';
import { gestation, useStore } from '@/store';
import { colors, fonts } from '@/theme';
import { ArrowRight, Bookmark, Card, Chevron, CircleButton, Press, Sans, Screen, SearchIcon, Title, TabTitle } from '@/ui';

export default function Aprender() {
  const { s } = useStore();
  const router = useRouter();
  const { week } = gestation(s);
  const all = useContent().articles;
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string | null>(null);
  const forWeek = articlesForWeek(all, week);
  const featured = forWeek.length ? forWeek : all;
  const cats = [...new Set(all.map((a) => a.category))].map((c) => [c, all.filter((a) => a.category === c).length] as const);
  const norm = (x: string) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const q = norm(query.trim());
  const results = q ? all.filter((a) => norm([a.title, a.summary, a.category, a.body].join(' ')).includes(q)) : cat ? all.filter((a) => a.category === cat) : null;
  return (
    <Screen>
      <TabTitle title="Aprender" sub="Conteúdo informativo sobre cada fase." right={<CircleButton label="Salvos" onPress={() => router.push('/salvos')}><Bookmark stroke={colors.ink} /></CircleButton>} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, borderRadius: 999, backgroundColor: colors.card, paddingHorizontal: 18 }}>
        <SearchIcon color={colors.muted} />
        <TextInput value={query} onChangeText={(v) => { setQuery(v); setCat(null); }} placeholder="Buscar um assunto" placeholderTextColor={colors.muted} returnKeyType="search" style={{ flex: 1, height: 50, fontFamily: fonts.sans400, fontSize: 14, color: colors.ink }} />
      </View>
      {results ? (
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title s={18}>{q ? `${results.length} resultado${results.length === 1 ? '' : 's'}` : cat}</Title>
            <Press onPress={() => { setQuery(''); setCat(null); }} hitSlop={8} style={{ minHeight: 44, justifyContent: 'center' }}><Sans s={12} w={600} c={colors.terra}>Limpar</Sans></Press>
          </View>
          {results.length ? results.map((a) => <ArticleRow key={a.id} article={a} />) : <Sans s={13} c={colors.muted}>Nada encontrado. Tente outra palavra.</Sans>}
        </View>
      ) : (
      <>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Title s={18}>Para sua semana {week}</Title>
          <Press onPress={() => router.push('/semana')} hitSlop={8} style={{ minHeight: 44, justifyContent: 'center' }}><Sans s={12} w={600} c={colors.terra}>Ver tudo</Sans></Press>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}>
          {featured.map((a) => (
            <Press key={a.id} onPress={() => router.push({ pathname: '/artigo', params: { id: a.id } })} style={{ width: 176, backgroundColor: colors.card, borderRadius: 24, paddingTop: 8, paddingHorizontal: 8, paddingBottom: 14, gap: 10 }}>
              <ArticleThumb article={a} style={{ width: 160, height: 150, borderRadius: 20 }} />
              <View style={{ paddingHorizontal: 6 }}>
                <Sans s={11} c={colors.muted}>{a.minutes ? `${a.minutes} min de leitura` : a.category}</Sans>
                <Sans s={14} w={600} lh={1.3} numberOfLines={2} style={{ marginTop: 4, height: 36 }}>{a.title}</Sans>
              </View>
            </Press>
          ))}
        </ScrollView>
      </View>
      <View>
        <Title s={18} style={{ marginBottom: 12 }}>Biblioteca</Title>
        <Card style={{ paddingVertical: 4, paddingHorizontal: 18 }}>
          {cats.map(([label, n], i) => (
            <Press key={label} onPress={() => setCat(label)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15, borderBottomWidth: i === cats.length - 1 ? 0 : 1, borderBottomColor: colors.lineSoft }}>
              <Sans s={14} w={500} style={{ flex: 1 }}>{label}</Sans>
              <Sans s={12} c={colors.muted}>{n} {n === 1 ? 'conteúdo' : 'conteúdos'}</Sans>
              <Chevron />
            </Press>
          ))}
        </Card>
      </View>
      </>
      )}
      <Press onPress={() => router.push('/duvidas')} style={{ borderRadius: 24, backgroundColor: colors.sage, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ flex: 1 }}>
          <Title s={18}>Guia de dúvidas</Title>
          <Sans s={12} c={colors.sageInk} style={{ marginTop: 4 }}>Respostas curtas, com fonte identificada</Sans>
        </View>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}><ArrowRight color={colors.bg} w={10} h={17} /></View>
      </Press>
    </Screen>
  );
}
