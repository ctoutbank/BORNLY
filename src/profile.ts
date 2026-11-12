import type { AppState } from '@/store';

export const profilePayload = (s: AppState, healthConsent: boolean) => ({
  moment: s.moment,
  method: s.method,
  dum: s.method === 'ig' ? null : s.dum,
  igWeeks: s.method === 'ig' ? s.igW : null,
  igDays: s.method === 'ig' ? s.igD : null,
  igSetOn: s.method === 'ig' ? s.igSetOn : null,
  firstPregnancy: s.first === 'Sim',
  commPref: s.comm,
  notifyAppointments: s.notifyAppointments,
  ...(healthConsent ? { healthConsent: true } : {}),
});
