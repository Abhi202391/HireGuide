import React from 'react';
import {
  AlertCircle,
  Archive,
  CalendarClock,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react';
import { ApplicationStage } from '../types/career';
import { FollowUpUrgency } from '../utils/formatters';

interface StatusBadgeProps {
  stage: ApplicationStage;
  compact?: boolean;
}

const STAGE_STYLES: Record<
  ApplicationStage,
  {
    label: string;
    shortLabel: string;
    classes: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  offer: {
    label: 'Offer Received',
    shortLabel: 'Offer',
    classes: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
    Icon: CheckCircle2,
  },
  interview: {
    label: 'Interview Scheduled',
    shortLabel: 'Interview',
    classes: 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
    Icon: CalendarClock,
  },
  applied: {
    label: 'Applied / Screening',
    shortLabel: 'Applied',
    classes: 'bg-[#EEF2FF] text-[#3730A3] border-[#C7D2FE]',
    Icon: Send,
  },
  archived: {
    label: 'Archived',
    shortLabel: 'Archived',
    classes: 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]',
    Icon: Archive,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  stage,
  compact = false,
}) => {
  const { label, shortLabel, classes, Icon } = STAGE_STYLES[stage];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.01em] whitespace-nowrap shrink-0 ${classes}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{compact ? shortLabel : label}</span>
    </span>
  );
};

interface FollowUpBadgeProps {
  urgency: FollowUpUrgency;
}

export const FollowUpBadge: React.FC<FollowUpBadgeProps> = ({ urgency }) => {
  if (urgency !== 'overdue' && urgency !== 'due_today') return null;

  if (urgency === 'overdue') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[#FEE2E2] bg-[#FEF2F2] px-2.5 py-0.5 text-[11px] font-semibold text-[#DC2626] whitespace-nowrap shrink-0">
        <AlertCircle className="w-3 h-3 shrink-0" />
        <span>Overdue</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-0.5 text-[11px] font-semibold text-[#92400E] whitespace-nowrap shrink-0">
      <Clock className="w-3 h-3 shrink-0" />
      <span>Due Today</span>
    </span>
  );
};
