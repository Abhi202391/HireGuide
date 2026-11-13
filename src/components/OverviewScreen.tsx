import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckSquare,
  Square,
  TrendingUp,
  Briefcase,
  Award,
  BookOpen,
  Clock,
} from 'lucide-react';
import {
  ActiveTab,
  CoachingDrill,
  JobApplication,
} from '../types/career';
import { CompanyAvatar } from './CompanyAvatar';
import { FollowUpBadge, StatusBadge } from './StatusBadge';
import { UpcomingInterviewsStrip } from './UpcomingInterviewsStrip';
import {
  computeYearOneComp,
  formatCountdown,
  formatCurrencyFull,
  formatDateTime,
  formatSalaryBand,
  formatShortDate,
  getFollowUpUrgency,
  getIdleDays,
  isIdleApplication,
} from '../utils/formatters';

interface OverviewScreenProps {
  applications: JobApplication[];
  drills: CoachingDrill[];
  onSelectApplication: (app: JobApplication) => void;
  onTogglePrepTask: (appId: string, taskId: string) => void;
  onLogFollowUp: (appId: string) => void;
  onNavigateTab: (tab: ActiveTab, companyFilter?: string) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  applications,
  drills,
  onSelectApplication,
  onTogglePrepTask,
  onLogFollowUp,
  onNavigateTab,
}) => {
  const activeApps = applications.filter((a) => a.stage !== 'archived');
  const interviewApps = applications.filter((a) => a.stage === 'interview');
  const offerApps = applications.filter((a) => a.stage === 'offer');
  const appliedApps = applications.filter((a) => a.stage === 'applied');
  const archivedApps = applications.filter((a) => a.stage === 'archived');

  const completedDrills = drills.filter((d) => d.completed).length;

  const highestOfferComp = offerApps.reduce((max, app) => {
    if (!app.offer) return max;
    const total = computeYearOneComp(app.offer);
    return total > max ? total : max;
  }, 0);

  // Upcoming interview rounds across active roles
  const upcomingRounds = activeApps
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

  // Idle applications (active and >= 7 days without activity)
  const idleApps = activeApps
    .filter((app) => isIdleApplication(app))
    .sort((a, b) => getIdleDays(b) - getIdleDays(a));

  // Follow-ups due today or overdue
  const urgentFollowUps = activeApps.filter((app) => {
    const urgency = getFollowUpUrgency(app.followUpDate, app.stage);
    return urgency === 'overdue' || urgency === 'due_today';
  });

  // Pending prep tasks across interview & offer roles
  const pendingPrepTasks = activeApps.flatMap((app) =>
    app.prepTasks
      .filter((t) => !t.completed)
      .map((task) => ({ app, task }))
  );

  const nextInterview = upcomingRounds[0];

  const funnelRows = [
    {
      key: 'applied',
      label: 'Applied & Screening',
      count: appliedApps.length,
      color: 'bg-[#4F46E5]',
    },
    {
      key: 'interview',
      label: 'Interview Scheduled',
      count: interviewApps.length,
      color: 'bg-[#F59E0B]',
    },
    {
      key: 'offer',
      label: 'Offer Received',
      count: offerApps.length,
      color: 'bg-[#10B981]',
    },
    {
      key: 'archived',
      label: 'Archived / Closed',
      count: archivedApps.length,
      color: 'bg-[#94A3B8]',
    },
  ];

  const maxCount = Math.max(...funnelRows.map((r) => r.count), 1);

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[28px] sm:text-[32px] font-bold tracking-[-0.02em] text-[#0b1c30] leading-tight text-balance">
            Executive Career Command
          </h1>
          <p className="mt-1 text-sm text-[#464555] max-w-2xl">
            {activeApps.length} active roles in motion, {upcomingRounds.length}{' '}
            upcoming interview sessions, and {urgentFollowUps.length}{' '}
            follow-ups needing attention.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateTab('pipeline')}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#1E293B] shadow-xs transition-colors hover:bg-[#eff4ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5] min-h-[44px] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>View Pipeline</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4-Column Executive KPI Strip */}
      <section
        aria-label="Key pipeline metrics"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        <button
          type="button"
          onClick={() => onNavigateTab('pipeline')}
          className="text-left rounded-lg border border-[#E2E8F0] bg-white p-4 sm:p-5 shadow-[0_1px_3px_rgba(30,41,59,0.05),0_1px_2px_rgba(30,41,59,0.03)] transition-colors hover:border-[#CBD5E1] focus-visible:outline-2 focus-visible:outline-[#4F46E5] cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <span>Active Pipeline</span>
            <Briefcase className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#0b1c30] tabular-nums">
              {activeApps.length}
            </span>
            <span className="text-xs text-[#64748B] tabular-nums">
              {appliedApps.length} screening
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('pipeline')}
          className="text-left rounded-lg border border-[#E2E8F0] bg-white p-4 sm:p-5 shadow-[0_1px_3px_rgba(30,41,59,0.05),0_1px_2px_rgba(30,41,59,0.03)] transition-colors hover:border-[#CBD5E1] focus-visible:outline-2 focus-visible:outline-[#4F46E5] cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <span>Upcoming Loops</span>
            <Calendar className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#0b1c30] tabular-nums">
              {upcomingRounds.length}
            </span>
            <span className="text-xs font-medium text-[#92400E] tabular-nums truncate">
              {nextInterview
                ? `Next ${formatCountdown(nextInterview.round.scheduledAt)}`
                : 'None queued'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('offers')}
          className="text-left rounded-lg border border-[#E2E8F0] bg-white p-4 sm:p-5 shadow-[0_1px_3px_rgba(30,41,59,0.05),0_1px_2px_rgba(30,41,59,0.03)] transition-colors hover:border-[#CBD5E1] focus-visible:outline-2 focus-visible:outline-[#4F46E5] cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <span>Offers Received</span>
            <Award className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#0b1c30] tabular-nums">
              {offerApps.length}
            </span>
            <span className="text-xs font-medium text-[#065F46] tabular-nums truncate">
              {highestOfferComp > 0
                ? `Top ${formatCurrencyFull(highestOfferComp)}`
                : 'Target phase'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('prep')}
          className="text-left rounded-lg border border-[#E2E8F0] bg-white p-4 sm:p-5 shadow-[0_1px_3px_rgba(30,41,59,0.05),0_1px_2px_rgba(30,41,59,0.03)] transition-colors hover:border-[#CBD5E1] focus-visible:outline-2 focus-visible:outline-[#4F46E5] cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <span>Prep Drills</span>
            <BookOpen className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#0b1c30] tabular-nums">
              {completedDrills}/{drills.length}
            </span>
            <span className="text-xs text-[#64748B] tabular-nums">
              {pendingPrepTasks.length} role tasks left
            </span>
          </div>
        </button>
      </section>

      {/* Upcoming Interviews Summary Strip */}
      <UpcomingInterviewsStrip
        applications={applications}
        onSelectApplication={onSelectApplication}
        onPracticeCompany={(company) => onNavigateTab('prep', company)}
      />

      {/* Idle Applications & Urgent Follow-Up Alerts */}
      {(idleApps.length > 0 || urgentFollowUps.length > 0) && (
        <section
          aria-label="Idle and follow-up alerts"
          className="rounded-lg border border-[#FDE68A] bg-[#FFFBEB]/70 p-4 sm:p-5 space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#92400E] shrink-0" />
              <h2 className="font-display text-sm font-semibold text-[#92400E]">
                Follow-Up & Idle Application Alerts
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#92400E] tabular-nums">
              {idleApps.length} idle (7d+) · {urgentFollowUps.length} due or
              overdue
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from(
              new Map(
                [...urgentFollowUps, ...idleApps].map((a) => [a.id, a])
              ).values()
            ).map((app) => {
              const urgency = getFollowUpUrgency(app.followUpDate, app.stage);
              const idle = isIdleApplication(app);
              const idleDays = getIdleDays(app);

              return (
                <div
                  key={app.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] bg-white p-3.5"
                >
                  <button
                    type="button"
                    onClick={() => onSelectApplication(app)}
                    className="flex items-start gap-3 text-left min-w-0 flex-1 cursor-pointer"
                  >
                    <CompanyAvatar
                      company={app.company}
                      brandColor={app.brandColor}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#0b1c30] truncate">
                          {app.company}
                        </span>
                        <FollowUpBadge urgency={urgency} />
                      </div>
                      <p className="text-xs text-[#464555] truncate mt-0.5">
                        {app.role}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[#64748B] tabular-nums mt-1">
                        {app.followUpDate && (
                          <span>
                            Follow-up {formatShortDate(app.followUpDate)}
                          </span>
                        )}
                        {app.followUpDate && idle && (
                          <span aria-hidden="true">·</span>
                        )}
                        {idle && (
                          <span className="font-semibold text-[#92400E]">
                            Idle {idleDays}d
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onLogFollowUp(app.id)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-semibold text-[#1E293B] hover:bg-[#eff4ff] min-h-[38px] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#4F46E5]" />
                    <span>Log Follow-Up</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Main 2-Column Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Upcoming Interview Cadence & Action Checklist */}
        <section className="lg:col-span-7 space-y-6">
          <div className="rounded-lg border border-[#E2E8F0] bg-white shadow-[0_1px_3px_rgba(30,41,59,0.05),0_1px_2px_rgba(30,41,59,0.03)]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div>
                <h2 className="font-display text-base font-semibold text-[#0b1c30]">
                  Upcoming Interview Schedule
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Chronological rounds requiring active readiness
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('prep')}
                className="text-xs font-semibold text-[#4F46E5] hover:text-[#3525cd] whitespace-nowrap shrink-0 cursor-pointer"
              >
                Open Prep Studio
              </button>
            </div>

            {upcomingRounds.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm font-medium text-[#0b1c30]">
                  No upcoming interviews scheduled
                </p>
                <p className="text-xs text-[#64748B] mt-1">
                  Advance an application or schedule a round from the Pipeline
                  board.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {upcomingRounds.map(({ app, round }) => {
                  const countdown = formatCountdown(round.scheduledAt);
                  return (
                    <div
                      key={round.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-[#f8f9ff]"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectApplication(app)}
                        className="flex items-start gap-3 text-left flex-1 min-w-0 cursor-pointer"
                      >
                        <CompanyAvatar
                          company={app.company}
                          brandColor={app.brandColor}
                          size="md"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-[#0b1c30] truncate">
                              {app.company} · {round.title}
                            </span>
                          </div>
                          <p className="text-xs text-[#464555] mt-0.5 truncate">
                            {app.role}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 text-xs text-[#64748B] tabular-nums">
                            <span>{formatDateTime(round.scheduledAt)}</span>
                            <span aria-hidden="true">·</span>
                            <span>{round.durationMins}m</span>
                            <span aria-hidden="true">·</span>
                            <span className="truncate">
                              {round.interviewer} ({round.interviewerRole})
                            </span>
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-2.5 shrink-0 sm:pl-3">
                        <span className="inline-flex items-center rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-1 text-xs font-semibold text-[#92400E] tabular-nums whitespace-nowrap">
                          {countdown}
                        </span>
                        <button
                          type="button"
                          onClick={() => onNavigateTab('prep', app.company)}
                          className="inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-semibold text-[#1E293B] hover:bg-[#eff4ff] min-h-[38px] whitespace-nowrap cursor-pointer"
                        >
                          Practice
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Priority Prep Action Queue */}
          <div className="rounded-lg border border-[#E2E8F0] bg-white shadow-[0_1px_3px_rgba(30,41,59,0.05),0_1px_2px_rgba(30,41,59,0.03)]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div>
                <h2 className="font-display text-base font-semibold text-[#0b1c30]">
                  Action Items & Follow-Ups
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  High-leverage deliverables before your next milestone
                </p>
              </div>
              <span className="text-xs font-semibold text-[#64748B] tabular-nums">
                {pendingPrepTasks.length} remaining
              </span>
            </div>

            {pendingPrepTasks.length === 0 ? (
              <div className="p-6 text-center text-sm text-[#065F46]">
                All role preparation tasks are complete.
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {pendingPrepTasks.slice(0, 6).map(({ app, task }) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-[#f8f9ff]"
                  >
                    <button
                      type="button"
                      onClick={() => onTogglePrepTask(app.id, task.id)}
                      className="flex items-center gap-3 text-left flex-1 min-w-0 min-h-[36px] cursor-pointer"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-4 h-4 text-[#10B981] shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-[#64748B] shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#0b1c30] truncate">
                          {task.label}
                        </p>
                        <p className="text-xs text-[#64748B] truncate">
                          {app.company} · {app.role}
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectApplication(app)}
                      className="text-xs font-semibold text-[#4F46E5] hover:text-[#3525cd] whitespace-nowrap shrink-0 cursor-pointer px-2 py-1"
                    >
                      Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right 5 Cols: Pipeline Funnel & High-Priority Roles */}
        <section className="lg:col-span-5 space-y-6">
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(30,41,59,0.05),0_1px_2px_rgba(30,41,59,0.03)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-base font-semibold text-[#0b1c30]">
                  Pipeline Distribution
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Current funnel across {applications.length} tracked roles
                </p>
              </div>
              <TrendingUp className="w-4 h-4 text-[#4F46E5]" />
            </div>

            <div className="space-y-4">
              {funnelRows.map((row) => {
                const widthPct = Math.round((row.count / maxCount) * 100);
                return (
                  <div key={row.key}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-[#1E293B]">
                        {row.label}
                      </span>
                      <span className="font-semibold text-[#0b1c30] tabular-nums">
                        {row.count}
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${row.color}`}
                        style={{ width: `${Math.max(widthPct, row.count > 0 ? 12 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Watchlist */}
          <div className="rounded-lg border border-[#E2E8F0] bg-white shadow-[0_1px_3px_rgba(30,41,59,0.05),0_1px_2px_rgba(30,41,59,0.03)]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="font-display text-base font-semibold text-[#0b1c30]">
                High-Priority Targets
              </h2>
              <span className="text-xs text-[#64748B] tabular-nums">
                {activeApps.filter((a) => a.priority === 'High').length} roles
              </span>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {activeApps
                .filter((a) => a.priority === 'High')
                .map((app) => {
                  const urgency = getFollowUpUrgency(
                    app.followUpDate,
                    app.stage
                  );
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => onSelectApplication(app)}
                      className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors hover:bg-[#f8f9ff] cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <CompanyAvatar
                          company={app.company}
                          brandColor={app.brandColor}
                          size="md"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-[#0b1c30] truncate">
                              {app.company}
                            </p>
                            <FollowUpBadge urgency={urgency} />
                          </div>
                          <p className="text-xs text-[#464555] truncate">
                            {app.role}
                          </p>
                          <p className="text-xs text-[#64748B] tabular-nums mt-0.5">
                            {formatSalaryBand(app.salaryMin, app.salaryMax)} ·{' '}
                            {app.workModel}
                            {app.followUpDate
                              ? ` · Follow-up ${formatShortDate(app.followUpDate)}`
                              : ''}
                          </p>
                        </div>
                      </div>
                      <StatusBadge stage={app.stage} compact />
                    </button>
                  );
                })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
