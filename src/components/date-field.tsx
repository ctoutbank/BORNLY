import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, View } from 'react-native';

import { fmt, fromIso, iso } from '@/store';
import { colors } from '@/theme';
import { Press, Sans } from '@/ui';

export function DateField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const date = fromIso(value);

  if (Platform.OS === 'ios') {
    return (
      <View style={{ minHeight: 58, borderRadius: 20, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.card, paddingHorizontal: 12, alignItems: 'flex-start', justifyContent: 'center' }}>
        <DateTimePicker value={date} mode="date" display="compact" locale="pt-BR" onValueChange={(_, d) => onChange(iso(d))} />
      </View>
    );
  }

  return (
    <>
      <Press onPress={() => setOpen(true)} style={{ height: 58, borderRadius: 20, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.card, paddingHorizontal: 18, justifyContent: 'center' }}>
        <Sans s={16}>{fmt(date, { day: 'numeric', month: 'long', year: 'numeric' })}</Sans>
      </Press>
      {open ? (
        <DateTimePicker
          value={date}
          mode="date"
          onValueChange={(_, d) => {
            setOpen(false);
            onChange(iso(d));
          }}
          onDismiss={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
