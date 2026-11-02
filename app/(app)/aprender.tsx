import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { ART, LIB } from '@/content';
import { gestation, useStore } from '@/store';
import { colors } from '@/theme';
import { ArrowRight, Bookmark, Card, Chevron, CircleButton, ImageSlot, Press, Sans, Screen, SearchIcon, Serif, TabTitle } from '@/ui';

export default function Aprender() {
  const { s } = useStore();
  const router = useRouter();
  const { week } = gestation(s);
  return (
    <Screen>
      <TabTitle title="Aprender" sub="Conteúdo revisado por profissionais." right={<CircleButton label="Salvos" onPress={() => router.push('/salvos')}><Bookmark stroke={colors.ink} w={13} h={16} /></CircleButton>} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, borderRadius: 999, backgroundColor: colors.card, paddingHorizontal: 18 }}>
        <SearchIcon color={colors.muted} />
        <Sans s={14} c={colors.muted}>Buscar um assunto</Sans>
      </View>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Serif s={19}>Para sua semana {week}</Serif>
          <Press onPress={() => router.push('/semana')} style={{ minHeight: 32, justifyContent: 'center' }}><Sans s={12.5} w={600} c={colors.terra}>Ver tudo</Sans></Press>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}>
          {ART.map((a) => (
            <Press key={a.id} onPress={() => router.push('/semana')} style={{ width: 168, backgroundColor: colors.card, borderRadius: 26, paddingTop: 8, paddingHorizontal: 8, paddingBottom: 14, gap: 10 }}>
              <ImageSlot label="foto" style={{ width: 152, height: 150, borderRadius: 20 }} />
              <View style={{ paddingHorizontal: 6 }}>
                <Sans s={11} c={colors.muted}>{a.min} min de leitura</Sans>
                <Sans s={14} w={600} lh={1.3} style={{ marginTop: 4 }}>{a.title}</Sans>
              </View>
            </Press>
          ))}
        </ScrollView>
      </View>
      <View>
        <Serif s={19} style={{ marginBottom: 12 }}>Biblioteca</Serif>
        <Card style={{ paddingVertical: 4, paddingHorizontal: 18 }}>
          {LIB.map(([label, n], i) => (
            <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15, borderBottomWidth: i === LIB.length - 1 ? 0 : 1, borderBottomColor: colors.lineSoft }}>
              <Sans s={14.5} w={500} style={{ flex: 1 }}>{label}</Sans>
              <Sans s={12.5} c={colors.muted}>{n} conteúdos</Sans>
              <Chevron w={7} h={12} />
            </View>
          ))}
        </Card>
      </View>
      <Press onPress={() => router.push('/duvidas')} style={{ borderRadius: 28, backgroundColor: colors.sage, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ flex: 1 }}>
          <Serif s={18}>Guia de dúvidas</Serif>
          <Sans s={12.5} c={colors.sageInk} style={{ marginTop: 4 }}>Respostas curtas, com fonte identificada</Sans>
        </View>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}><ArrowRight color={colors.bg} w={8} h={13} /></View>
      </Press>
    </Screen>
  );
}
