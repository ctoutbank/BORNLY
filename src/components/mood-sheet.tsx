import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FEELINGS } from '@/content';
import { useStore } from '@/store';
import { colors } from '@/theme';
import { Press, Sans, Serif, TextButton, Wrap } from '@/ui';

export function MoodSheet() {
  const { s, set, flash } = useStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  if (!s.sheet) return null;

  return (
    <>
      <Pressable accessibilityLabel="Fechar" onPress={() => set({ sheet: false })} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(42,37,34,.35)' }} />
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 14, paddingHorizontal: 22, paddingBottom: Math.max(insets.bottom, 16) + 10 }}>
        <View style={{ width: 40, height: 4, borderRadius: 999, backgroundColor: colors.line, alignSelf: 'center', marginBottom: 18 }} />
        <Serif s={24}>Como você está hoje?</Serif>
        <Sans s={13} c={colors.muted} style={{ marginTop: 6, marginBottom: 18 }}>Escolha o que mais combina com o seu dia.</Sans>
        <Wrap>
          {FEELINGS.map((label, i) => (
            <Press
              key={label}
              onPress={() => {
                set({ mood: label, feel: i, sheet: false, diaryDone: true });
                flash('Registrado. Obrigada por contar.');
              }}
              style={{ borderWidth: 1.5, borderColor: colors.line, borderRadius: 999, paddingHorizontal: 18, minHeight: 46, justifyContent: 'center' }}>
              <Sans s={14} w={500}>{label}</Sans>
            </Press>
          ))}
        </Wrap>
        <View style={{ alignItems: 'flex-start', marginTop: 18 }}>
          <TextButton
            label="Abrir diário completo"
            w={600}
            c={colors.terra}
            onPress={() => {
              set({ sheet: false });
              router.push('/diario');
            }}
          />
        </View>
        <Sans s={12} lh={1.5} c={colors.muted} style={{ marginTop: 6 }}>Seus registros ficam só com você e ajudam a conversar com sua equipe de saúde. O Bornly não faz diagnósticos.</Sans>
      </View>
    </>
  );
}
