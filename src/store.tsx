import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { APPOINTMENTS, BABY, GUIDE } from '@/content';

export const DAY = 864e5;
const BABY_KEYS = Object.keys(BABY).map(Number);

export const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
export const fromIso = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};
export const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('pt-BR', o);
export const capitalize = (s: string) => s.replace(/^./, (c) => c.toUpperCase());

function initialState() {
  return {
    moment: 'gravida',
    method: 'dum' as 'dum' | 'dpp' | 'ig',
    dum: iso(new Date(startOfToday().getTime() - 199 * DAY)),
    igW: 28,
    igD: 3,
    name: 'Maria',
    first: 'Sim',
    comm: 'Direta e curta',
    notif: { c: true, m: true, r: false } as Record<string, boolean>,
    weekView: null as number | null,
    sheet: false,
    mood: null as string | null,
    feel: 1,
    humor: ['Calma'],
    sleep: 'Regular',
    note: '',
    diaryDone: false,
    symSel: 'Azia',
    symInt: 'Moderada',
    symDur: 'Horas',
    symLogged: ['Azia', 'Cansaço'],
    calSel: 0,
    questions: ['A curva glicêmica precisa de jejum?', 'Quando começo a contar os movimentos?'],
    qDraft: '',
    taken: { m1: true } as Record<string, boolean>,
    showWeight: true,
    enxCat: 'Roupas',
    enx: { 'Bodies RN (6)': true, 'Bodies P (6)': true, 'Macacões (4)': true, Banheira: true, 'Fraldas RN': true, 'Berço com colchão': true, 'Bebê conforto': true, 'Almofada de amamentação': true, 'Mantas (2)': true, 'Toalhas com capuz (3)': true, 'Lençóis (3)': true, Carrinho: true } as Record<string, boolean>,
    malaTab: 'Mamãe',
    mala: { 'Documentos e cartão do pré-natal': true, Chinelo: true, 'Bodies (4)': true, 'Fraldas RN': true, 'Documento com foto': true } as Record<string, boolean>,
    plan: { Acompanhante: ['Parceiro(a)'], Ambiente: ['Luz baixa', 'Liberdade para me movimentar'], 'Contato pele a pele': ['Imediato, se possível'] } as Record<string, string[]>,
    birth: { 'Escolher a maternidade': true, 'Montar a rede de apoio': true } as Record<string, boolean>,
    saved: { a2: true } as Record<string, boolean>,
    faqOpen: 0,
    toast: null as string | null,
  };
}

export type AppState = ReturnType<typeof initialState>;
type Update = Partial<AppState> | ((s: AppState) => Partial<AppState>);

type Store = { s: AppState; set: (u: Update) => void; flash: (msg: string) => void };
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setState] = useState(initialState);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const set = useCallback((u: Update) => setState((prev) => ({ ...prev, ...(typeof u === 'function' ? u(prev) : u) })), []);
  const flash = useCallback(
    (msg: string) => {
      clearTimeout(timer.current);
      set({ toast: msg });
      timer.current = setTimeout(() => set({ toast: null }), 1800);
    },
    [set],
  );
  useEffect(() => () => clearTimeout(timer.current), []);

  const value = useMemo(() => ({ s, set, flash }), [s, set, flash]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore precisa de StoreProvider');
  return store;
}

export function gestation(s: AppState) {
  const today = startOfToday();
  const raw = s.method === 'ig' ? s.igW * 7 + s.igD : Math.round((today.getTime() - fromIso(s.dum).getTime()) / DAY);
  const total = Math.max(14, Math.min(294, raw));
  const due = new Date(today.getTime() + (280 - total) * DAY);
  return { total, week: Math.floor(total / 7), day: total % 7, due, today, pct: Math.min(100, Math.round((total / 280) * 100)) };
}

export function babyFor(week: number) {
  const key = BABY_KEYS.reduce((a, b) => (Math.abs(b - week) < Math.abs(a - week) ? b : a));
  const [size, dev, you, cm, grams] = BABY[key];
  return {
    size,
    dev,
    you,
    cm: String(cm).replace('.', ',') + ' cm',
    kg: grams >= 1000 ? (grams / 1000).toFixed(1).replace('.', ',') + ' kg' : grams + ' g',
    guide: GUIDE,
  };
}

export const trimester = (week: number) => (week < 14 ? 1 : week < 28 ? 2 : 3) + 'º trimestre';

export function nextAppointment(today: Date) {
  const a = APPOINTMENTS[0];
  const d = new Date(today.getTime() + a.off * DAY);
  return { ...a, inDays: a.off, when: fmt(d, { weekday: 'short', day: 'numeric', month: 'short' }).replace('.', '') + ' · 14h30' };
}
