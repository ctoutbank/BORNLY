import { colors, fonts } from '@/theme';

export function DateField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => e.target.value && onChange(e.target.value)}
      style={{ height: 58, boxSizing: 'border-box', width: '100%', borderRadius: 20, border: `1.5px solid ${colors.line}`, background: colors.card, padding: '0 18px', fontSize: 16, color: colors.ink, outline: 'none', fontFamily: fonts.sans400 }}
    />
  );
}
