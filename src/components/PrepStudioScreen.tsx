import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CoachingDrill, StarStory } from '../types/career';

interface PrepStudioScreenProps {
  drills: CoachingDrill[];
  stories: StarStory[];
  initialCompanyFilter?: string;
  onToggleDrillComplete: (drillId: string) => void;
  onUpdateDrillDraft: (drillId: string, draft: string) => void;
  onAddStory: (story: Omit<StarStory, 'id'>) => void;
}

type DrillCategory = 'All' | CoachingDrill['category'];

export const PrepStudioScreen: React.FC<PrepStudioScreenProps> = ({
  drills,
  stories,
  initialCompanyFilter,
  onToggleDrillComplete,
  onUpdateDrillDraft,
  onAddStory,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<DrillCategory>('All');
  const [companyFilter, setCompanyFilter] = useState<string>(
    initialCompanyFilter || 'All'
  );
  const [selectedDrillId, setSelectedDrillId] = useState<string>(
    drills[0]?.id || ''
  );

  // Timer state
  const activeDrill =
    drills.find((d) => d.id === selectedDrillId) || drills[0];
  const [secondsLeft, setSecondsLeft] = useState<number>(
    activeDrill?.targetDurationSec || 180
  );
  const [timerRunning, setTimerRunning] = useState(false);

  // Story Bank state
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(
    stories[0]?.id || null
  );
  const [showNewStoryForm, setShowNewStoryForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompetency, setNewCompetency] = useState('Scale & Reliability');
  const [newContext, setNewContext] = useState('');
  const [newSituation, setNewSituation] = useState('');
  const [newTask, setNewTask] = useState('');
  const [newAction, setNewAction] = useState('');
  const [newResult, setNewResult] = useState('');

  useEffect(() => {
    if (initialCompanyFilter) {
      setCompanyFilter(initialCompanyFilter);
      const match = drills.find((d) => d.linkedCompany === initialCompanyFilter);
      if (match) {
        setSelectedDrillId(match.id);
      }
    }
  }, [initialCompanyFilter, drills]);

  useEffect(() => {
    setTimerRunning(false);
    setSecondsLeft(activeDrill?.targetDurationSec || 180);
  }, [activeDrill?.id, activeDrill?.targetDurationSec]);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);

  const companies = Array.from(
    new Set(drills.map((d) => d.linkedCompany).filter(Boolean) as string[])
  );

  const visibleDrills = drills.filter((d) => {
    if (categoryFilter !== 'All' && d.category !== categoryFilter) return false;
    if (companyFilter !== 'All' && d.linkedCompany !== companyFilter)
      return false;
    return true;
  });

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSituation.trim() || !newResult.trim()) return;
    onAddStory({
      title: newTitle.trim(),
      competency: newCompetency.trim() || 'Leadership',
      companyContext: newContext.trim() || 'Previous Role',
      situation: newSituation.trim(),
      task: newTask.trim() || 'Define execution plan and align stakeholders.',
      action: newAction.trim() || 'Led technical execution.',
      result: newResult.trim(),
    });
    setNewTitle('');
    setNewContext('');
    setNewSituation('');
    setNewTask('');
    setNewAction('');
    setNewResult('');
    setShowNewStoryForm(false);
  };

  const completedCount = drills.filter((d) => d.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[28px] sm:text-[32px] font-bold tracking-[-0.02em] text-[#0b1c30] leading-tight">
            Interview Prep Studio
          </h1>
          <p className="mt-1 text-sm text-[#464555]">
            Timed coaching drills, structured response notes, and reusable STAR
            stories.
          </p>
        </div>
        <div className="text-xs font-semibold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] rounded-full px-3.5 py-1.5 tabular-nums self-start sm:self-auto whitespace-nowrap">
          {completedCount} of {drills.length} drills mastered
        </div>
      </div>

      {/* Category & Target Company Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {(
            [
              'All',
              'System Design',
              'Executive Leadership',
              'Behavioral',
              'Negotiation',
            ] as DrillCategory[]
          ).map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold border whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer transition-colors ${
                  active
                    ? 'bg-[#1E293B] text-white border-[#1E293B]'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:text-[#0b1c30]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label
            htmlFor="company-prep-filter"
            className="text-xs font-semibold text-[#64748B] whitespace-nowrap"
          >
            Target Role:
          </label>
          <select
            id="company-prep-filter"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-xs font-semibold text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
          >
            <option value="All">All Companies</option>
            {companies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2-Column Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Drill Queue + Active Practice Session */}
        <div className="lg:col-span-7 space-y-5">
          {/* Drill Selector Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {visibleDrills.length === 0 ? (
              <div className="sm:col-span-2 rounded-lg border border-dashed border-[#CBD5E1] bg-white p-6 text-center text-sm text-[#64748B]">
                No drills match the selected category and company filter.
              </div>
            ) : (
              visibleDrills.map((drill) => {
                const isSelected = activeDrill?.id === drill.id;
                return (
                  <button
                    key={drill.id}
                    type="button"
                    onClick={() => setSelectedDrillId(drill.id)}
                    className={`text-left rounded-lg border p-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#4F46E5] bg-white ring-2 ring-[#4F46E5]/15 shadow-xs'
                        : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-[#4F46E5]">
                        {drill.category}
                        {drill.linkedCompany ? ` · ${drill.linkedCompany}` : ''}
                      </span>
                      {drill.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#CBD5E1] shrink-0" />
                      )}
                    </div>
                    <h3 className="mt-1.5 font-display text-sm font-semibold text-[#0b1c30] leading-snug">
                      {drill.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#64748B] tabular-nums">
                      Target {Math.round(drill.targetDurationSec / 60)} min
                    </p>
                  </button>
                );
              })
            )}
          </div>

          {/* Active Coaching Workspace Card */}
          {activeDrill && (
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(30,41,59,0.05),0_1px_2px_rgba(30,41,59,0.03)] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#464555]">
                    <span>{activeDrill.category}</span>
                    {activeDrill.linkedCompany && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{activeDrill.linkedCompany}</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-display text-lg font-bold text-[#0b1c30] mt-1">
                    {activeDrill.title}
                  </h2>
                </div>

                {/* Practice Timer Controls */}
                <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#f8f9ff] px-3 py-2 shrink-0 self-start">
                  <span
                    className={`font-mono text-base font-bold tabular-nums min-w-[54px] text-center ${
                      secondsLeft === 0 ? 'text-[#DC2626]' : 'text-[#0b1c30]'
                    }`}
                  >
                    {formatTimer(secondsLeft)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTimerRunning((r) => !r)}
                    aria-label={timerRunning ? 'Pause timer' : 'Start timer'}
                    className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-md bg-[#4F46E5] text-white hover:bg-[#3525cd] cursor-pointer"
                  >
                    {timerRunning ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTimerRunning(false);
                      setSecondsLeft(activeDrill.targetDurationSec);
                    }}
                    aria-label="Reset timer"
                    className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-[#464555] hover:text-[#0b1c30] cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Interview Prompt */}
              <div>
                <p className="text-xs font-semibold text-[#64748B] mb-1.5">
                  Prompt
                </p>
                <p className="text-sm sm:text-[15px] text-[#0b1c30] leading-relaxed bg-[#f8f9ff] rounded-lg border border-[#E2E8F0] p-4">
                  {activeDrill.prompt}
                </p>
              </div>

              {/* Response Scratchpad */}
              <div>
                <label
                  htmlFor="drill-draft"
                  className="block text-xs font-semibold text-[#64748B] mb-1.5"
                >
                  Structured Response Outline
                </label>
                <textarea
                  id="drill-draft"
                  rows={4}
                  value={activeDrill.draftResponse}
                  onChange={(e) =>
                    onUpdateDrillDraft(activeDrill.id, e.target.value)
                  }
                  placeholder="Outline your key metrics, architecture trade-offs, or STAR bullet points..."
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] p-3.5 text-sm text-[#0b1c30] placeholder:text-[#64748B] transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                />
              </div>

              {/* Coaching Feedback Card (clean hairline border + tinted surface, zero thick left stripe) */}
              <div
                className={`rounded-lg border p-4 ${
                  activeDrill.feedbackTone === 'emerald'
                    ? 'border-[#A7F3D0] bg-[#ECFDF5]/60'
                    : 'border-[#FDE68A] bg-[#FFFBEB]/70'
                }`}
              >
                <p
                  className={`text-xs font-semibold mb-2 ${
                    activeDrill.feedbackTone === 'emerald'
                      ? 'text-[#065F46]'
                      : 'text-[#92400E]'
                  }`}
                >
                  Executive Coaching Benchmarks
                </p>
                <ul className="space-y-1.5 text-xs sm:text-[13px] text-[#1E293B] list-disc pl-4">
                  {activeDrill.coachingTips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer Action */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#64748B]">
                  Notes auto-save locally as you type
                </span>
                <button
                  type="button"
                  onClick={() => onToggleDrillComplete(activeDrill.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold min-h-[44px] transition-all active:scale-[0.98] cursor-pointer ${
                    activeDrill.completed
                      ? 'border border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                      : 'bg-[#4F46E5] text-white hover:bg-[#3525cd]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {activeDrill.completed ? 'Drill Completed' : 'Mark Completed'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Cols: STAR Story Bank */}
        <div className="lg:col-span-5 rounded-lg border border-[#E2E8F0] bg-white shadow-[0_1px_3px_rgba(30,41,59,0.05),0_1px_2px_rgba(30,41,59,0.03)]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
            <div>
              <h2 className="font-display text-base font-semibold text-[#0b1c30]">
                STAR Story Bank
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Core leadership & impact narratives
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewStoryForm((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-semibold text-[#1E293B] hover:bg-[#eff4ff] min-h-[38px] cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showNewStoryForm ? 'Close' : 'Add Story'}</span>
            </button>
          </div>

          {showNewStoryForm && (
            <form
              onSubmit={handleSaveStory}
              className="border-b border-[#E2E8F0] bg-[#f8f9ff] p-4 space-y-3"
            >
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Story title (e.g. Zero-Downtime Search Cutover)"
                className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newCompetency}
                  onChange={(e) => setNewCompetency(e.target.value)}
                  placeholder="Competency"
                  className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-white px-3 text-xs text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                />
                <input
                  type="text"
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  placeholder="Org / Team context"
                  className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-white px-3 text-xs text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                />
              </div>
              <textarea
                rows={2}
                required
                value={newSituation}
                onChange={(e) => setNewSituation(e.target.value)}
                placeholder="Situation & Task..."
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
              <textarea
                rows={2}
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="Key Actions taken..."
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
              <input
                type="text"
                required
                value={newResult}
                onChange={(e) => setNewResult(e.target.value)}
                placeholder="Quantified Result (e.g. -42% P99 latency)"
                className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-white px-3 text-xs text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[#4F46E5] text-xs font-semibold text-white hover:bg-[#3525cd] cursor-pointer"
              >
                Save STAR Story
              </button>
            </form>
          )}

          <div className="divide-y divide-[#E2E8F0]">
            {stories.map((story) => {
              const isOpen = expandedStoryId === story.id;
              return (
                <div key={story.id} className="p-4">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedStoryId(isOpen ? null : story.id)
                    }
                    className="w-full flex items-start justify-between gap-3 text-left cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#4F46E5]">
                        {story.competency} · {story.companyContext}
                      </p>
                      <h3 className="text-sm font-semibold text-[#0b1c30] mt-0.5">
                        {story.title}
                      </h3>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#64748B] shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0 mt-1" />
                    )}
                  </button>

                  {isOpen && (
                    <dl className="mt-3 space-y-2 text-xs text-[#464555] bg-[#f8f9ff] rounded-lg border border-[#E2E8F0] p-3">
                      <div>
                        <dt className="font-semibold text-[#0b1c30]">
                          Situation
                        </dt>
                        <dd className="mt-0.5">{story.situation}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-[#0b1c30]">Task</dt>
                        <dd className="mt-0.5">{story.task}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-[#0b1c30]">Action</dt>
                        <dd className="mt-0.5">{story.action}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-[#065F46]">Result</dt>
                        <dd className="mt-0.5 font-medium text-[#065F46]">
                          {story.result}
                        </dd>
                      </div>
                    </dl>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
