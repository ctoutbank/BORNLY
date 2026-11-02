import { Stack } from 'expo-router';
import { View } from 'react-native';

import { BottomNav } from '@/components/bottom-nav';
import { MoodSheet } from '@/components/mood-sheet';
import { colors } from '@/theme';

const TAB_ROOTS = ['hoje', 'saude', 'preparar', 'aprender'] as const;

export default function AppLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        {TAB_ROOTS.map((name) => (
          <Stack.Screen key={name} name={name} options={{ animation: 'none', gestureEnabled: false }} />
        ))}
      </Stack>
      <BottomNav />
      <MoodSheet />
    </View>
  );
}
