import React, { useMemo } from 'react';
import { ArrowRight, CalendarClock } from 'lucide-react';
import { JobApplication } from '../types/career';
import { CompanyAvatar } from './CompanyAvatar';
import { formatCountdown, formatDateTime } from '../utils/formatters';

interface UpcomingInterviewsStripProps {
  applications: JobApplication[];
  onSelectApplication: (app: JobApplication) => void;
  onPracticeCompany?: (company: string) => void;
}

export const UpcomingInterviewsStrip: React.FC<
  UpcomingInterviewsStripProps
> = ({ applications, onSelectApplication, onPracticeCompany }) => {
  const upcomingRounds = useMemo(() => {
    return applications
      .filter((a) => a.stage !== 'archived')
      .flatMap((app) =>
        app.rounds
          .filter((r) => !r.completed)
          .map((round) => ({ app, round }))
      )
      .sort(
        (a, b) =>
          new Date(a.round.scheduledAt).getTime() -
          new Date(b.round.scheduledAt).getTime()
      );
  }, [applications]);

  return (
    <section
      aria-label="Upcoming interviews summary"
      className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3.5 sm:px-5 shadow-[0_1px_3px_rgba(30,41,59,0.05),0_1px_2px_rgba(30,41,59,0.03)]"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <CalendarClock className="w-4 h-4 text-[#4F46E5] shrink-0" />
          <h2 className="font-display text-sm font-semibold text-[#0b1c30] truncate">
            Upcoming Interviews
          </h2>
          <span className="text-xs font-semibold text-[#64748B] tabular-nums whitespace-nowrap">
            · {upcomingRounds.length} scheduled
          </span>
        </div>

        {upcomingRounds[0] && onPracticeCompany && (
          <button
            type="button"
            onClick={() => onPracticeCompany(upcomingRounds[0].app.company)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#4F46E5] hover:text-[#3525cd] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Prep Next ({upcomingRounds[0].app.company})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {upcomingRounds.length === 0 ? (
        <p className="text-xs text-[#64748B]">
          No upcoming interview rounds scheduled. Open any role to add your next
          session.
        </p>
      ) : (
        <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-0.5">
          {upcomingRounds.slice(0, 4).map(({ app, round }) => (
            <button
              key={round.id}
              type="button"
              onClick={() => onSelectApplication(app)}
              className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-[#f8f9ff] px-3.5 py-2.5 text-left hover:border-[#CBD5E1] hover:bg-white transition-colors min-w-[235px] sm:min-w-[250px] shrink-0 cursor-pointer"
            >
              <CompanyAvatar
                company={app.company}
                brandColor={app.brandColor}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#0b1c30] truncate">
                    {app.company}
                  </span>
                  <span className="text-[11px] font-semibold text-[#92400E] tabular-nums whitespace-nowrap">
                    {formatCountdown(round.scheduledAt)}
                  </span>
                </div>
                <p className="text-xs text-[#464555] truncate mt-0.5">
                  {round.title}
                </p>
                <p className="text-[11px] text-[#64748B] tabular-nums truncate mt-0.5">
                  {formatDateTime(round.scheduledAt)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
