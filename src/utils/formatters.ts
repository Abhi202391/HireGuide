import { ApplicationStage, JobApplication, OfferDetails } from '../types/career';

export function formatSalaryShort(amount: number): string {
  return `$${Math.round(amount / 1000)}k`;
}

export function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSalaryBand(min: number, max: number): string {
  return `${formatSalaryShort(min)}–${formatSalaryShort(max)}`;
}

export function computeYearOneComp(offer: OfferDetails): number {
  const bonus = Math.round(offer.baseSalary * (offer.annualBonusPct / 100));
  return offer.baseSalary + bonus + offer.equityAnnual + offer.signOnBonus;
}

export function computeRecurringComp(offer: OfferDetails): number {
  const bonus = Math.round(offer.baseSalary * (offer.annualBonusPct / 100));
  return offer.baseSalary + bonus + offer.equityAnnual;
}

export function getTodayLocalISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDaysISO(baseIso: string, days: number): string {
  const parts = baseIso.slice(0, 10).split('-').map(Number);
  const date =
    parts.length === 3 && !parts.some(Number.isNaN)
      ? new Date(parts[0], parts[1] - 1, parts[2])
      : new Date();
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatShortDate(isoDate?: string): string {
  if (!isoDate) return 'TBD';
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  const date = dateOnlyMatch
    ? new Date(
        Number(dateOnlyMatch[1]),
        Number(dateOnlyMatch[2]) - 1,
        Number(dateOnlyMatch[3])
      )
    : new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(isoDate?: string): string {
  if (!isoDate) return 'Not scheduled';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatCountdown(isoDate?: string): string {
  if (!isoDate) return '';
  const target = new Date(isoDate);
  if (Number.isNaN(target.getTime())) return '';
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return `${Math.abs(diffDays)}d ago`;
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return `In ${diffDays}d`;
}

export type FollowUpUrgency = 'overdue' | 'due_today' | 'upcoming' | null;

export function getFollowUpUrgency(
  followUpDate?: string,
  stage?: ApplicationStage
): FollowUpUrgency {
  if (!followUpDate || stage === 'archived') return null;
  const targetDateStr = followUpDate.slice(0, 10);
  const todayStr = getTodayLocalISO();
  if (targetDateStr < todayStr) return 'overdue';
  if (targetDateStr === todayStr) return 'due_today';
  return 'upcoming';
}

export function getIdleDays(app: JobApplication): number {
  const referenceIso = (app.lastActivityDate || app.appliedDate).slice(0, 10);
  const parts = referenceIso.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return 0;
  const refDate = new Date(parts[0], parts[1] - 1, parts[2]);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = today.getTime() - refDate.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export const IDLE_THRESHOLD_DAYS = 7;

export function isIdleApplication(app: JobApplication): boolean {
  if (app.stage === 'archived') return false;
  return getIdleDays(app) >= IDLE_THRESHOLD_DAYS;
}

export const STAGE_META: Record<
  ApplicationStage,
  { label: string; shortLabel: string; description: string }
> = {
  applied: {
    label: 'Applied / Screening',
    shortLabel: 'Applied',
    description: 'Initial outreach & recruiter screens',
  },
  interview: {
    label: 'Interview Scheduled',
    shortLabel: 'Interview',
    description: 'Active technical & executive loops',
  },
  offer: {
    label: 'Offer Received',
    shortLabel: 'Offer',
    description: 'Compensation evaluation & negotiation',
  },
  archived: {
    label: 'Archived / Inactive',
    shortLabel: 'Archived',
    description: 'Closed, declined, or paused roles',
  },
};
