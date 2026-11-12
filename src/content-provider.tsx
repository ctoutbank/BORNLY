import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

import { API_URL } from '@/auth-client';
import snapshot from '@/content-snapshot.json';

// Conteúdo editável pela administração. O app abre com a cópia embutida e atualiza pelo servidor.

type Raw = Record<string, { key: string; data: Record<string, unknown> }[]>;

export type Week = { size: string; cm: number; grams: number; baby: string; body: string; guide: string };
export type Article = { id: string; title: string; category: string; summary: string; body: string; minutes?: number; weekFrom?: number; weekTo?: number; image?: string; imageCredit?: string; sourceName?: string; sourceUrl?: string };
export type FaqItem = { question: string; answer: string; source?: string; sourceUrl?: string };
export type ChecklistGroup = { group: string; range?: string; items: string[] };
export type Content = {
  weeks: Record<number, Week>;
  messages: string[];
  articles: Article[];
  faq: FaqItem[];
  alerts: string[];
  checklists: { enxoval: ChecklistGroup[]; mala: ChecklistGroup[]; nascimento: ChecklistGroup[] };
  birthPlan: { topic: string; options: string[] }[];
  tools: Record<string, { title: string; text: string }>;
};

function normalize(raw: Raw): Content {
  const list = (id: string) => raw[id] ?? [];
  const weeks: Content['weeks'] = {};
  for (const w of list('weeks')) weeks[Number(w.key)] = w.data as Week;
  const messages: string[] = [];
  for (const m of list('daily_messages')) messages[Number(m.key) - 1] = String(m.data.text ?? '');
  const groups = (name: string) => list('checklists').filter((c) => c.data.list === name).map((c) => c.data as unknown as ChecklistGroup);
  return {
    weeks,
    messages,
    articles: list('articles').map((a) => ({ id: a.key, ...(a.data as Omit<Article, 'id'>) })),
    faq: list('faq').map((f) => f.data as FaqItem),
    alerts: list('alerts').map((a) => String(a.data.text)),
    checklists: { enxoval: groups('enxoval'), mala: groups('mala'), nascimento: groups('nascimento') },
    birthPlan: list('birth_plan').map((p) => p.data as { topic: string; options: string[] }),
    tools: Object.fromEntries(list('tools').map((t) => [t.key, t.data as { title: string; text: string }])),
  };
}

const ContentContext = createContext<Content>(normalize(snapshot as Raw));

export function ContentProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<Raw>(snapshot as Raw);

  useEffect(() => {
    const refresh = () =>
      fetch(`${API_URL}/api/content`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data: Raw | null) => {
          if (data && Object.keys(data).length) setRaw(data);
        })
        .catch(() => undefined);
    refresh();
    const sub = AppState.addEventListener('change', (state) => state === 'active' && refresh());
    return () => sub.remove();
  }, []);

  const value = useMemo(() => normalize(raw), [raw]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext);

export function babyFor(week: number, weeks: Content['weeks']) {
  const keys = Object.keys(weeks).map(Number);
  const key = keys.reduce((a, b) => (Math.abs(b - week) < Math.abs(a - week) ? b : a), keys[0]);
  const w = weeks[key];
  return {
    size: w.size,
    dev: w.baby,
    you: w.body,
    guide: w.guide,
    cm: String(w.cm).replace('.', ',') + ' cm',
    kg: w.grams >= 1000 ? (w.grams / 1000).toFixed(1).replace('.', ',') + ' kg' : w.grams >= 1 ? `${w.grams} g` : 'menos de 1 g',
  };
}

export const dailyMessage = (messages: string[], totalDays: number) => messages[Math.max(0, Math.min(messages.length - 1, totalDays - 1))] ?? '';

export const articlesForWeek = (articles: Article[], week: number) => articles.filter((a) => (a.weekFrom ?? 0) <= week && week <= (a.weekTo ?? 99));
