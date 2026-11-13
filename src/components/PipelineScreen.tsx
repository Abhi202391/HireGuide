import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRightLeft,
  Calendar,
  LayoutGrid,
  List,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { ApplicationStage, JobApplication } from '../types/career';
import { CompanyAvatar } from './CompanyAvatar';
import { FollowUpBadge, StatusBadge } from './StatusBadge';
import { UpcomingInterviewsStrip } from './UpcomingInterviewsStrip';
import {
  formatCountdown,
  formatSalaryBand,
  formatShortDate,
  getFollowUpUrgency,
  getIdleDays,
  isIdleApplication,
  STAGE_META,
} from '../utils/formatters';

interface PipelineScreenProps {
  applications: JobApplication[];
  onSelectApplication: (app: JobApplication) => void;
  onMoveStage: (appId: string, newStage: ApplicationStage) => void;
  onLogFollowUp: (appId: string) => void;
  onOpenAddModal: () => void;
  onPracticeCompany: (company: string) => void;
}

type FilterOption = 'all' | 'urgent' | 'idle' | 'high' | 'remote' | 'hybrid';

const STAGES: ApplicationStage[] = ['applied', 'interview', 'offer', 'archived'];

export const PipelineScreen: React.FC<PipelineScreenProps> = ({
  applications,
  onSelectApplication,
  onMoveStage,
  onLogFollowUp,
  onOpenAddModal,
  onPracticeCompany,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [mobileStage, setMobileStage] = useState<ApplicationStage>('interview');
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<ApplicationStage | null>(null);
  const [quickMoveId, setQuickMoveId] = useState<string | null>(null);

  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return applications.filter((app) => {
      if (filter === 'urgent') {
        const urgency = getFollowUpUrgency(app.followUpDate, app.stage);
        if (urgency !== 'overdue' && urgency !== 'due_today') return false;
      }
      if (filter === 'idle' && !isIdleApplication(app)) return false;
      if (filter === 'high' && app.priority !== 'High') return false;
      if (filter === 'remote' && app.workModel !== 'Remote') return false;
      if (filter === 'hybrid' && app.workModel !== 'Hybrid') return false;

      if (!q) return true;
      return (
        app.company.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q) ||
        app.location.toLowerCase().includes(q)
      );
    });
  }, [applications, searchQuery, filter]);

  const appsByStage = useMemo(() => {
    const map: Record<ApplicationStage, JobApplication[]> = {
      applied: [],
      interview: [],
      offer: [],
      archived: [],
    };
    for (const app of filteredApps) {
      map[app.stage].push(app);
    }
    return map;
  }, [filteredApps]);

  const idleCount = useMemo(
    () => applications.filter((a) => isIdleApplication(a)).length,
    [applications]
  );

  const handleDragStart = (e: React.DragEvent, appId: string) => {
    setDraggedAppId(appId);
    e.dataTransfer.setData('text/plain', appId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, stage: ApplicationStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedAppId;
    if (id) {
      onMoveStage(id, stage);
    }
    setDraggedAppId(null);
    setDragOverStage(null);
  };

  const renderCard = (app: JobApplication) => {
    const isDragging = draggedAppId === app.id;
    const isMoveOpen = quickMoveId === app.id;
    const countdown = app.nextMilestoneDate
      ? formatCountdown(app.nextMilestoneDate)
      : formatShortDate(app.appliedDate);
    const followUpUrgency = getFollowUpUrgency(app.followUpDate, app.stage);
    const idle = isIdleApplication(app);
    const idleDays = getIdleDays(app);

    return (
      <div
        key={app.id}
        draggable
        onDragStart={(e) => handleDragStart(e, app.id)}
        onDragEnd={() => {
          setDraggedAppId(null);
          setDragOverStage(null);
        }}
        className={`group relative rounded-lg border bg-white p-4 transition-all duration-150 ${
          isDragging
            ? 'border-[#CBD5E1] shadow-[0_4px_6px_-1px_rgba(30,41,59,0.08),0_2px_4px_-2px_rgba(30,41,59,0.04)] rotate-[1.5deg] opacity-90'
            : 'border-[#E2E8F0] shadow-[0_1px_3px_rgba(30,41,59,0.05),0_1px_2px_rgba(30,41,59,0.03)] hover:border-[#CBD5E1]'
        }`}
      >
        {/* Top Row: Avatar + Title + Quick Move */}
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={() => onSelectApplication(app)}
            className="flex items-start gap-2.5 text-left flex-1 min-w-0 cursor-pointer"
          >
            <CompanyAvatar
              company={app.company}
              brandColor={app.brandColor}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#464555] truncate">
                {app.company}
              </p>
              <h3 className="font-display text-[15px] font-semibold text-[#0b1c30] leading-snug line-clamp-2 mt-0.5">
                {app.role}
              </h3>
            </div>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickMoveId(isMoveOpen ? null : app.id);
            }}
            aria-label={`Move ${app.company} stage`}
            className="min-w-[32px] min-h-[32px] inline-flex items-center justify-center rounded-md text-[#64748B] hover:text-[#0b1c30] hover:bg-[#f8f9ff] transition-colors cursor-pointer shrink-0"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Stage Mover Dropdown */}
        {isMoveOpen && (
          <div className="mt-2.5 rounded-lg border border-[#E2E8F0] bg-[#f8f9ff] p-2">
            <p className="text-[11px] font-semibold text-[#64748B] px-1.5 mb-1.5">
              Move to stage
            </p>
            <div className="grid grid-cols-2 gap-1">
              {STAGES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    onMoveStage(app.id, s);
                    setQuickMoveId(null);
                  }}
                  className={`rounded-md px-2 py-1.5 text-left text-xs font-medium transition-colors cursor-pointer ${
                    app.stage === s
                      ? 'bg-[#1E293B] text-white'
                      : 'bg-white text-[#1E293B] hover:bg-[#eff4ff] border border-[#E2E8F0]'
                  }`}
                >
                  {STAGE_META[s].shortLabel}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mid Row: Compensation + Location + Follow-up date */}
        <button
          type="button"
          onClick={() => onSelectApplication(app)}
          className="w-full text-left mt-3 cursor-pointer"
        >
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[13px] text-[#464555] tabular-nums">
            <span className="font-semibold text-[#0b1c30]">
              {formatSalaryBand(app.salaryMin, app.salaryMax)}
            </span>
            <span aria-hidden="true" className="text-[#CBD5E1]">
              ·
            </span>
            <span className="truncate">{app.location}</span>
            <span aria-hidden="true" className="text-[#CBD5E1]">
              ·
            </span>
            <span>{app.workModel}</span>
          </div>

          {/* Follow-up date & Urgency row */}
          {(app.followUpDate || idle) && app.stage !== 'archived' && (
            <div className="mt-2.5 flex items-center justify-between gap-2 flex-wrap">
              {app.followUpDate ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-[#464555] tabular-nums">
                  <Calendar className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                  <span>Follow-up {formatShortDate(app.followUpDate)}</span>
                </span>
              ) : (
                <span />
              )}
              <FollowUpBadge urgency={followUpUrgency} />
            </div>
          )}

          {/* Idle Alert Banner inside card */}
          {idle && (
            <div className="mt-2.5 flex items-center justify-between gap-2 rounded-md border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-1.5 text-[11px] font-semibold text-[#92400E]">
              <span className="inline-flex items-center gap-1.5 tabular-nums">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Idle {idleDays}d</span>
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onLogFollowUp(app.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    onLogFollowUp(app.id);
                  }
                }}
                className="underline decoration-[#92400E]/50 hover:text-[#0b1c30]"
              >
                Log Touch
              </span>
            </div>
          )}

          {/* Bottom Row: Status Badge + Countdown */}
          <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
            <StatusBadge stage={app.stage} compact />
            <span className="text-xs font-medium text-[#64748B] tabular-nums whitespace-nowrap">
              {app.nextMilestoneLabel
                ? `${countdown}`
                : `Applied ${formatShortDate(app.appliedDate)}`}
            </span>
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[28px] sm:text-[32px] font-bold tracking-[-0.02em] text-[#0b1c30] leading-tight">
            Application Pipeline
          </h1>
          <p className="mt-1 text-sm text-[#464555]">
            Drag cards across swimlanes, monitor follow-up deadlines, and catch
            idle applications early.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center rounded-lg border border-[#E2E8F0] bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-[#1E293B] text-white'
                  : 'text-[#64748B] hover:text-[#0b1c30]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#1E293B] text-white'
                  : 'text-[#64748B] hover:text-[#0b1c30]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Interviews Summary Strip */}
      <UpcomingInterviewsStrip
        applications={applications}
        onSelectApplication={onSelectApplication}
        onPracticeCompany={onPracticeCompany}
      />

      {/* 48px Search Bar + Interactive Filter Pills */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-xl">
          <Search
            className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search role, company, or city..."
            aria-label="Search applications"
            className="w-full h-12 rounded-lg border border-[#CBD5E1] bg-white pl-11 pr-10 text-sm text-[#0b1c30] placeholder:text-[#64748B] shadow-[0_1px_3px_rgba(30,41,59,0.05)] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] inline-flex items-center justify-center text-[#64748B] hover:text-[#0b1c30] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills (Interactive Buttons) */}
        <div
          role="group"
          aria-label="Filter applications"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0"
        >
          {(
            [
              { id: 'all', label: 'All Roles' },
              { id: 'urgent', label: 'Due / Overdue' },
              {
                id: 'idle',
                label: idleCount > 0 ? `Idle (${idleCount})` : 'Idle',
              },
              { id: 'high', label: 'High Priority' },
              { id: 'remote', label: 'Remote' },
              { id: 'hybrid', label: 'Hybrid' },
            ] as { id: FilterOption; label: string }[]
          ).map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer ${
                  active
                    ? 'bg-[#1E293B] text-white border-[#1E293B]'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0b1c30]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Stage Tabs (< 768px) */}
      <div className="md:hidden space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {STAGES.map((stage) => {
            const active = mobileStage === stage;
            const count = appsByStage[stage].length;
            return (
              <button
                key={stage}
                type="button"
                onClick={() => setMobileStage(stage)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold border whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer transition-colors ${
                  active
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                    : 'bg-white text-[#464555] border-[#E2E8F0]'
                }`}
              >
                <span>{STAGE_META[stage].shortLabel}</span>
                <span className="tabular-nums opacity-85">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {appsByStage[mobileStage].length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-white p-8 text-center">
              <p className="text-sm font-semibold text-[#0b1c30]">
                No roles in {STAGE_META[mobileStage].label}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                Add a new opportunity or adjust your active filters.
              </p>
              <button
                type="button"
                onClick={onOpenAddModal}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#4F46E5] px-4 py-2.5 text-xs font-semibold text-white min-h-[44px] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Application</span>
              </button>
            </div>
          ) : (
            appsByStage[mobileStage].map(renderCard)
          )}
        </div>
      </div>

      {/* Desktop Board or List View (>= 768px) */}
      <div className="hidden md:block">
        {viewMode === 'board' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {STAGES.map((stage) => {
              const items = appsByStage[stage];
              const isDropTarget = dragOverStage === stage;
              return (
                <div
                  key={stage}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverStage(stage);
                  }}
                  onDragLeave={() => setDragOverStage(null)}
                  onDrop={(e) => handleDrop(e, stage)}
                  className={`rounded-lg border p-3 min-h-[420px] transition-colors ${
                    isDropTarget
                      ? 'border-[#4F46E5] bg-[#eff4ff]'
                      : 'border-[#E2E8F0] bg-[#eff4ff]/55'
                  }`}
                >
                  <div className="flex items-center justify-between px-1 pb-3">
                    <div>
                      <h2 className="font-display text-sm font-semibold text-[#0b1c30]">
                        {STAGE_META[stage].label}
                      </h2>
                    </div>
                    <span className="text-xs font-semibold text-[#64748B] tabular-nums">
                      {items.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {items.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-white/70 p-6 text-center">
                        <p className="text-xs text-[#64748B]">
                          Drop a role here or add new
                        </p>
                      </div>
                    ) : (
                      items.map(renderCard)
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden shadow-[0_1px_3px_rgba(30,41,59,0.05)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#f8f9ff] text-xs font-semibold text-[#64748B]">
                    <th className="py-3 px-4">Company & Role</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">Follow-Up</th>
                    <th className="py-3 px-4">Compensation</th>
                    <th className="py-3 px-4">Activity</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-sm">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-sm text-[#64748B]"
                      >
                        No matching applications found.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => {
                      const urgency = getFollowUpUrgency(
                        app.followUpDate,
                        app.stage
                      );
                      const idle = isIdleApplication(app);
                      const idleDays = getIdleDays(app);

                      return (
                        <tr
                          key={app.id}
                          className="hover:bg-[#f8f9ff] transition-colors"
                        >
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => onSelectApplication(app)}
                              className="flex items-center gap-3 text-left cursor-pointer"
                            >
                              <CompanyAvatar
                                company={app.company}
                                brandColor={app.brandColor}
                                size="md"
                              />
                              <div>
                                <p className="font-semibold text-[#0b1c30]">
                                  {app.company}
                                </p>
                                <p className="text-xs text-[#464555]">
                                  {app.role}
                                </p>
                              </div>
                            </button>
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge stage={app.stage} />
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-medium text-[#0b1c30] tabular-nums whitespace-nowrap">
                                {app.followUpDate
                                  ? formatShortDate(app.followUpDate)
                                  : '—'}
                              </span>
                              <FollowUpBadge urgency={urgency} />
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-[#0b1c30] tabular-nums whitespace-nowrap">
                            {formatSalaryBand(app.salaryMin, app.salaryMax)}
                          </td>
                          <td className="py-3.5 px-4 text-xs tabular-nums whitespace-nowrap">
                            {idle ? (
                              <span className="inline-flex items-center gap-1 font-semibold text-[#92400E]">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Idle {idleDays}d</span>
                              </span>
                            ) : (
                              <span className="text-[#64748B]">
                                {idleDays === 0 ? 'Active today' : `${idleDays}d ago`}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => onSelectApplication(app)}
                              className="text-xs font-semibold text-[#4F46E5] hover:text-[#3525cd] cursor-pointer whitespace-nowrap"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
