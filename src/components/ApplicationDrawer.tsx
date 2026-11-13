import React, { useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckSquare,
  Clock,
  Mail,
  Plus,
  Square,
  Trash2,
  X,
} from 'lucide-react';
import { ApplicationStage, JobApplication } from '../types/career';
import { CompanyAvatar } from './CompanyAvatar';
import { FollowUpBadge, StatusBadge } from './StatusBadge';
import {
  formatDateTime,
  formatSalaryBand,
  formatShortDate,
  getFollowUpUrgency,
  getIdleDays,
  isIdleApplication,
  STAGE_META,
} from '../utils/formatters';

interface ApplicationDrawerProps {
  application: JobApplication | null;
  onClose: () => void;
  onMoveStage: (appId: string, stage: ApplicationStage) => void;
  onUpdateNotes: (appId: string, notes: string) => void;
  onUpdateFollowUpDate: (appId: string, date: string) => void;
  onLogFollowUp: (appId: string) => void;
  onToggleRoundComplete: (appId: string, roundId: string) => void;
  onAddRound: (
    appId: string,
    round: {
      title: string;
      interviewer: string;
      interviewerRole: string;
      scheduledAt: string;
      durationMins: number;
    }
  ) => void;
  onTogglePrepTask: (appId: string, taskId: string) => void;
  onAddPrepTask: (appId: string, label: string) => void;
  onDeleteApplication: (appId: string) => void;
}

const STAGES: ApplicationStage[] = ['applied', 'interview', 'offer', 'archived'];

export const ApplicationDrawer: React.FC<ApplicationDrawerProps> = ({
  application,
  onClose,
  onMoveStage,
  onUpdateNotes,
  onUpdateFollowUpDate,
  onLogFollowUp,
  onToggleRoundComplete,
  onAddRound,
  onTogglePrepTask,
  onAddPrepTask,
  onDeleteApplication,
}) => {
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [showAddRound, setShowAddRound] = useState(false);
  const [roundTitle, setRoundTitle] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [interviewerRole, setInterviewerRole] = useState('');
  const [scheduledAt, setScheduledAt] = useState('2026-11-19T14:00');
  const [durationMins, setDurationMins] = useState(45);

  if (!application) return null;

  const urgency = getFollowUpUrgency(
    application.followUpDate,
    application.stage
  );
  const idle = isIdleApplication(application);
  const idleDays = getIdleDays(application);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskLabel.trim()) return;
    onAddPrepTask(application.id, newTaskLabel.trim());
    setNewTaskLabel('');
  };

  const handleCreateRound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roundTitle.trim()) return;
    onAddRound(application.id, {
      title: roundTitle.trim(),
      interviewer: interviewer.trim() || 'Hiring Panel',
      interviewerRole: interviewerRole.trim() || 'Interviewer',
      scheduledAt,
      durationMins,
    });
    setRoundTitle('');
    setInterviewer('');
    setInterviewerRole('');
    setShowAddRound(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end bg-[#0b1c30]/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={`${application.company} application details`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-xl max-h-[90vh] sm:max-h-full bg-white rounded-t-2xl sm:rounded-none sm:border-l border-[#E2E8F0] shadow-[0_10px_15px_-3px_rgba(15,23,42,0.08),0_4px_6px_-4px_rgba(15,23,42,0.03)] flex flex-col overflow-hidden"
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden pt-3 pb-1">
          <div className="w-10 h-1.5 bg-[#CBD5E1] rounded-full mx-auto" />
        </div>

        {/* Sticky Drawer Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] px-5 py-4 bg-white">
          <div className="flex items-start gap-3 min-w-0">
            <CompanyAvatar
              company={application.company}
              brandColor={application.brandColor}
              size="lg"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-[#464555]">
                  {application.company}
                </span>
                <StatusBadge stage={application.stage} compact />
                <FollowUpBadge urgency={urgency} />
              </div>
              <h2 className="font-display text-lg font-bold text-[#0b1c30] leading-snug mt-0.5">
                {application.role}
              </h2>
              <p className="text-xs text-[#64748B] tabular-nums mt-1">
                {formatSalaryBand(application.salaryMin, application.salaryMax)}{' '}
                · {application.location} · {application.workModel}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#464555] hover:bg-[#f8f9ff] cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Idle Alert Banner */}
          {idle && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] p-3.5">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#92400E] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[#92400E]">
                    Idle Application Alert ({idleDays} days since last activity)
                  </p>
                  <p className="text-xs text-[#92400E]/90 mt-0.5">
                    Last touch recorded{' '}
                    {formatShortDate(
                      application.lastActivityDate || application.appliedDate
                    )}
                    . Send a quick check-in to keep momentum.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onLogFollowUp(application.id)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#92400E] px-3 py-2 text-xs font-semibold text-white hover:bg-[#78350F] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Log Follow-Up</span>
              </button>
            </div>
          )}

          {/* Stage Switcher */}
          <div>
            <p className="text-xs font-semibold text-[#64748B] mb-2">
              Pipeline Stage
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STAGES.map((stage) => {
                const active = application.stage === stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => onMoveStage(application.id, stage)}
                    className={`min-h-[40px] rounded-lg border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                        : 'bg-white text-[#1E293B] border-[#E2E8F0] hover:bg-[#eff4ff]'
                    }`}
                  >
                    {STAGE_META[stage].shortLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Follow-Up Cadence Control */}
          {application.stage !== 'archived' && (
            <div className="rounded-lg border border-[#E2E8F0] bg-[#f8f9ff] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <label
                  htmlFor="drawer-followup-date"
                  className="block text-[11px] font-semibold text-[#64748B] mb-1"
                >
                  Next Follow-Up Date
                </label>
                <input
                  id="drawer-followup-date"
                  type="date"
                  value={application.followUpDate || ''}
                  onChange={(e) =>
                    onUpdateFollowUpDate(application.id, e.target.value)
                  }
                  className="h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-xs font-semibold text-[#0b1c30] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                />
              </div>
              <button
                type="button"
                onClick={() => onLogFollowUp(application.id)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#1E293B] hover:bg-[#eff4ff] min-h-[40px] whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-end"
              >
                <Clock className="w-3.5 h-3.5 text-[#4F46E5]" />
                <span>Mark Followed Up</span>
              </button>
            </div>
          )}

          {/* Recruiter Contact */}
          <div className="rounded-lg border border-[#E2E8F0] bg-[#f8f9ff] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold text-[#64748B]">
                Primary Recruiter Contact
              </p>
              <p className="text-sm font-semibold text-[#0b1c30] mt-0.5">
                {application.recruiterName || 'Unassigned'}
              </p>
            </div>
            {application.recruiterEmail && (
              <a
                href={`mailto:${application.recruiterEmail}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] hover:text-[#3525cd]"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{application.recruiterEmail}</span>
              </a>
            )}
          </div>

          {/* Interview Rounds */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-semibold text-[#64748B]">
                Interview Loop ({application.rounds.length})
              </p>
              <button
                type="button"
                onClick={() => setShowAddRound((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#4F46E5] hover:text-[#3525cd] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddRound ? 'Cancel' : 'Schedule Round'}</span>
              </button>
            </div>

            {showAddRound && (
              <form
                onSubmit={handleCreateRound}
                className="mb-3 rounded-lg border border-[#E2E8F0] bg-[#f8f9ff] p-3.5 space-y-2.5"
              >
                <input
                  type="text"
                  required
                  value={roundTitle}
                  onChange={(e) => setRoundTitle(e.target.value)}
                  placeholder="Round title (e.g. Executive Architecture)"
                  className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={interviewer}
                    onChange={(e) => setInterviewer(e.target.value)}
                    placeholder="Interviewer name"
                    className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-white px-3 text-xs text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                  />
                  <input
                    type="text"
                    value={interviewerRole}
                    onChange={(e) => setInterviewerRole(e.target.value)}
                    placeholder="Title (e.g. VP Eng)"
                    className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-white px-3 text-xs text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-white px-3 text-xs text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                  />
                  <input
                    type="number"
                    min={15}
                    max={180}
                    step={15}
                    value={durationMins}
                    onChange={(e) => setDurationMins(Number(e.target.value))}
                    className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-white px-3 text-xs text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-11 rounded-lg bg-[#4F46E5] text-xs font-semibold text-white hover:bg-[#3525cd] cursor-pointer"
                >
                  Add Interview Round
                </button>
              </form>
            )}

            {application.rounds.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#CBD5E1] p-4 text-center text-xs text-[#64748B]">
                No interview rounds scheduled yet.
              </div>
            ) : (
              <div className="space-y-2">
                {application.rounds.map((round) => (
                  <div
                    key={round.id}
                    className="rounded-lg border border-[#E2E8F0] bg-white p-3.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onToggleRoundComplete(application.id, round.id)
                        }
                        className="flex items-start gap-2.5 text-left flex-1 cursor-pointer"
                      >
                        {round.completed ? (
                          <CheckSquare className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              round.completed
                                ? 'text-[#64748B] line-through'
                                : 'text-[#0b1c30]'
                            }`}
                          >
                            {round.title}
                          </p>
                          <p className="text-xs text-[#464555] mt-0.5">
                            {round.interviewer} · {round.interviewerRole}
                          </p>
                        </div>
                      </button>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748B] tabular-nums shrink-0">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDateTime(round.scheduledAt)}</span>
                      </span>
                    </div>
                    {round.notes && (
                      <p className="mt-2 text-xs text-[#464555] pl-6">
                        {round.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Role Prep Checklist */}
          <div>
            <p className="text-xs font-semibold text-[#64748B] mb-2">
              Role Preparation Checklist
            </p>
            <div className="space-y-1.5 mb-2.5">
              {application.prepTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onTogglePrepTask(application.id, task.id)}
                  className="w-full flex items-center gap-2.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-left hover:bg-[#f8f9ff] min-h-[44px] cursor-pointer"
                >
                  {task.completed ? (
                    <CheckSquare className="w-4 h-4 text-[#10B981] shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-[#64748B] shrink-0" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      task.completed
                        ? 'text-[#64748B] line-through'
                        : 'text-[#0b1c30]'
                    }`}
                  >
                    {task.label}
                  </span>
                </button>
              ))}
            </div>

            <form onSubmit={handleCreateTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskLabel}
                onChange={(e) => setNewTaskLabel(e.target.value)}
                placeholder="Add prep task..."
                className="flex-1 h-11 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 text-xs text-[#0b1c30] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
              <button
                type="submit"
                className="h-11 rounded-lg border border-[#E2E8F0] bg-white px-3.5 text-xs font-semibold text-[#1E293B] hover:bg-[#eff4ff] cursor-pointer whitespace-nowrap"
              >
                Add Task
              </button>
            </form>
          </div>

          {/* Executive Notes */}
          <div>
            <label
              htmlFor="app-notes"
              className="block text-xs font-semibold text-[#64748B] mb-1.5"
            >
              Executive Notes & Positioning
            </label>
            <textarea
              id="app-notes"
              rows={4}
              value={application.notes}
              onChange={(e) => onUpdateNotes(application.id, e.target.value)}
              placeholder="Capture role alignment, team culture signals, or negotiation leverage..."
              className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] p-3 text-sm text-[#0b1c30] transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
            />
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="border-t border-[#E2E8F0] bg-white px-5 py-3.5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onDeleteApplication(application.id);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#FEE2E2] bg-[#FEF2F2] px-3.5 py-2.5 text-xs font-semibold text-[#DC2626] hover:bg-[#fee2e2]/80 min-h-[44px] cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Role</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg bg-[#1E293B] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0b1c30] min-h-[44px] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
