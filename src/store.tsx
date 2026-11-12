import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { api, SessionExpired } from '@/api';
import { authClient } from '@/auth-client';

export const DAY = 864e5;

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
export const todayIso = () => iso(startOfToday());
export const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('pt-BR', o);
export const capitalize = (s: string) => s.replace(/^./, (c) => c.toUpperCase());

export type DiaryEntry = { feel: number; humor: string[]; sleep: string | null; note: string };
export type SymptomLog = { id?: string; day: string; symptom: string; intensity: string; duration: string };
export type Appointment = { id: string; startsAt: string; title: string; who: string; place: string };
export type Question = { id: string; text: string };
export type KickSession = { id: string; startedAt: string; endedAt: string; kicks: number };
export type Contraction = { id: string; startedAt: string; endedAt: string };
export type Medication = { id: string; name: string; dose: string; timeOfDay: string };
export type CustomItem = { list: ChecklistName; label: string; category: string | null };
export type ChecklistName = 'enxoval' | 'mala' | 'nascimento';

function initialState() {
  return {
    // Cadastro inicial e perfil
    moment: 'gravida',
    method: 'dum' as 'dum' | 'dpp' | 'ig',
    dum: iso(new Date(startOfToday().getTime() - 56 * DAY)),
    igW: 8,
    igD: 0,
    igSetOn: todayIso(),
    name: '',
    email: '',
    emailVerified: false,
    first: 'Sim',
    comm: 'Direta e curta',
    notifyAppointments: true,
    showWeight: true,
    maternityName: '',
    maternityPhone: '',
    hasConsent: false,
    hasProfile: false,
    loaded: false,
    // Dados gravados
    diary: {} as Record<string, DiaryEntry>,
    symptoms: [] as SymptomLog[],
    appointments: [] as Appointment[],
    questions: [] as Question[],
    medications: [] as Medication[],
    doses: {} as Record<string, Record<string, boolean>>,
    weights: [] as { day: string; kg: number }[],
    enx: {} as Record<string, boolean>,
    mala: {} as Record<string, boolean>,
    birth: {} as Record<string, boolean>,
    customItems: [] as CustomItem[],
    plan: {} as Record<string, string[]>,
    saved: {} as Record<string, boolean>,
    kicks: [] as KickSession[],
    contractions: [] as Contraction[],
    // Estado só da interface
    weekView: null as number | null,
    sheet: false,
    symSel: 'Azia',
    symInt: 'Moderada',
    symDur: 'Horas',
    calSel: 0,
    qDraft: '',
    enxCat: 'Roupas',
    malaTab: 'Mamãe',
    faqOpen: 0,
    toast: null as string | null,
  };
}

export type AppState = ReturnType<typeof initialState>;
type Update = Partial<AppState> | ((s: AppState) => Partial<AppState>);

type RemoteState = {
  user: { name: string; email: string; emailVerified: boolean };
  profile: null | { moment: string; method: AppState['method']; dum: string | null; igWeeks: number | null; igDays: number | null; igSetOn: string | null; firstPregnancy: boolean | null; commPref: string | null; notifyAppointments: boolean; showWeight: boolean; maternityName: string | null; maternityPhone: string | null; healthConsentAt: string | null };
  diary: (DiaryEntry & { day: string })[];
  symptoms: SymptomLog[];
  appointments: Appointment[];
  questions: Question[];
  medications: Medication[];
  doses: { medicationId: string; day: string }[];
  weights: { day: string; kg: number }[];
  checklist: { list: ChecklistName; label: string; category: string | null; custom: boolean; done: boolean }[];
  plan: { topic: string; option: string }[];
  saved: { articleId: string }[];
  kicks: KickSession[];
  contractions: Contraction[];
};

function fromRemote(r: RemoteState): Partial<AppState> {
  const p = r.profile;
  const checks = (list: ChecklistName) => Object.fromEntries(r.checklist.filter((c) => c.list === list).map((c) => [c.label, c.done]));
  const doses: AppState['doses'] = {};
  for (const d of r.doses) (doses[d.medicationId] ??= {})[d.day] = true;
  const plan: AppState['plan'] = {};
  for (const c of r.plan) (plan[c.topic] ??= []).push(c.option);
  return {
    name: r.user.name,
    email: r.user.email,
    emailVerified: r.user.emailVerified,
    hasProfile: !!p,
    hasConsent: !!p?.healthConsentAt,
    ...(p
      ? {
          moment: p.moment,
          method: p.method,
          ...(p.dum ? { dum: p.dum } : {}),
          ...(p.igWeeks != null ? { igW: p.igWeeks, igD: p.igDays ?? 0, igSetOn: p.igSetOn ?? todayIso() } : {}),
          first: p.firstPregnancy === false ? 'Não' : 'Sim',
          comm: p.commPref ?? 'Direta e curta',
          notifyAppointments: p.notifyAppointments,
          showWeight: p.showWeight,
          maternityName: p.maternityName ?? '',
          maternityPhone: p.maternityPhone ?? '',
        }
      : {}),
    diary: Object.fromEntries(r.diary.map(({ day, ...e }) => [day, e])),
    symptoms: r.symptoms,
    appointments: r.appointments,
    questions: r.questions,
    medications: r.medications,
    doses,
    weights: r.weights,
    enx: checks('enxoval'),
    mala: checks('mala'),
    birth: checks('nascimento'),
    customItems: r.checklist.filter((c) => c.custom).map(({ list, label, category }) => ({ list, label, category })),
    plan,
    saved: Object.fromEntries(r.saved.map((a) => [a.articleId, true])),
    kicks: r.kicks ?? [],
    contractions: r.contractions ?? [],
    loaded: true,
  };
}

type Store = {
  s: AppState;
  set: (u: Update) => void;
  flash: (msg: string) => void;
  load: () => Promise<boolean>;
  /** Mostra a mudança na hora e grava no servidor. Se falhar, avisa e volta ao que está gravado. */
  save: <T = unknown>(path: string, method: string, body?: unknown, optimistic?: Update) => Promise<T | null>;
  reset: () => void;
};
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setState] = useState(initialState);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const set = useCallback((u: Update) => setState((prev) => ({ ...prev, ...(typeof u === 'function' ? u(prev) : u) })), []);
  const flash = useCallback(
    (msg: string) => {
      clearTimeout(timer.current);
      set({ toast: msg });
      timer.current = setTimeout(() => set({ toast: null }), 2200);
    },
    [set],
  );
  useEffect(() => () => clearTimeout(timer.current), []);

  const load = useCallback(async () => {
    try {
      set(fromRemote(await api<RemoteState>('/state')));
      return true;
    } catch (err) {
      // Sessão vencida ou revogada: volta para a tela de entrada em vez de mostrar dados antigos.
      if (err instanceof SessionExpired) {
        await authClient.signOut().catch(() => undefined);
        setState(initialState());
      }
      return false;
    }
  }, [set]);

  const save = useCallback(
    async <T,>(path: string, method: string, body?: unknown, optimistic?: Update) => {
      if (optimistic) set(optimistic);
      try {
        return await api<T>(path, method, body);
      } catch {
        flash('Não foi possível salvar. Verifique sua conexão.');
        await load();
        return null;
      }
    },
    [flash, load, set],
  );

  const reset = useCallback(() => setState(initialState()), []);

  const value = useMemo(() => ({ s, set, flash, load, save, reset }), [s, set, flash, load, save, reset]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore precisa de StoreProvider');
  return store;
}

export function gestation(s: AppState) {
  const today = startOfToday();
  // Pela idade gestacional informada, o tempo continua contando a partir do dia em que foi informada.
  const raw = s.method === 'ig' ? s.igW * 7 + s.igD + Math.round((today.getTime() - fromIso(s.igSetOn).getTime()) / DAY) : Math.round((today.getTime() - fromIso(s.dum).getTime()) / DAY);
  const total = Math.max(14, Math.min(294, raw));
  const due = new Date(today.getTime() + (280 - total) * DAY);
  return { total, week: Math.floor(total / 7), day: total % 7, due, today, pct: Math.min(100, Math.round((total / 280) * 100)) };
}

export const trimester = (week: number) => (week < 14 ? 1 : week < 28 ? 2 : 3) + 'º trimestre';

export const formatAppointment = (startsAt: string) => {
  const d = new Date(startsAt);
  const minutes = d.getMinutes();
  return `${fmt(d, { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, '')} · ${d.getHours()}h${minutes ? String(minutes).padStart(2, '0') : ''}`;
};

export const isUpcoming = (a: Appointment) => new Date(a.startsAt).getTime() >= Date.now();

export function nextAppointment(s: AppState) {
  const a = s.appointments.find(isUpcoming);
  if (!a) return null;
  const inDays = Math.round((new Date(a.startsAt).setHours(0, 0, 0, 0) - startOfToday().getTime()) / DAY);
  return { ...a, inDays, when: formatAppointment(a.startsAt) };
}

export const formatTime = (t: string) => {
  const [h, m] = t.split(':');
  return `${Number(h)}h${m === '00' ? '' : m}`;
};
export const timeSlot = (t: string) => {
  const h = Number(t.split(':')[0]);
  return h < 12 ? 'Manhã' : h < 18 ? 'Tarde' : 'Noite';
};

export const checklistLabels = (base: string[] = [], s: AppState, list: ChecklistName, category: string | null) => [...base, ...s.customItems.filter((c) => c.list === list && c.category === category).map((c) => c.label)];
