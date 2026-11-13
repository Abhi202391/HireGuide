import { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  Kanban,
  LayoutDashboard,
  Plus,
} from 'lucide-react';
import {
  ActiveTab,
  ApplicationStage,
  CoachingDrill,
  JobApplication,
  OfferDetails,
  StarStory,
} from './types/career';
import {
  INITIAL_APPLICATIONS,
  INITIAL_DRILLS,
  INITIAL_STORIES,
} from './data/initialData';
import { OverviewScreen } from './components/OverviewScreen';
import { PipelineScreen } from './components/PipelineScreen';
import { PrepStudioScreen } from './components/PrepStudioScreen';
import { OffersScreen } from './components/OffersScreen';
import { ApplicationDrawer } from './components/ApplicationDrawer';
import { AddApplicationModal } from './components/AddApplicationModal';
import { addDaysISO, getTodayLocalISO } from './utils/formatters';

const STORAGE_KEYS = {
  apps: 'cadence_applications_v1',
  drills: 'cadence_drills_v1',
  stories: 'cadence_stories_v1',
};

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function hydrateApplications(stored: JobApplication[]): JobApplication[] {
  const seedById = new Map(INITIAL_APPLICATIONS.map((a) => [a.id, a]));
  return stored.map((app) => {
    const seed = seedById.get(app.id);
    return {
      ...app,
      followUpDate:
        app.followUpDate ??
        seed?.followUpDate ??
        (app.stage !== 'archived'
          ? addDaysISO(app.appliedDate, 5)
          : undefined),
      lastActivityDate:
        app.lastActivityDate ?? seed?.lastActivityDate ?? app.appliedDate,
    };
  });
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [prepCompanyFilter, setPrepCompanyFilter] = useState<
    string | undefined
  >(undefined);

  const [applications, setApplications] = useState<JobApplication[]>(() =>
    hydrateApplications(loadStored(STORAGE_KEYS.apps, INITIAL_APPLICATIONS))
  );
  const [drills, setDrills] = useState<CoachingDrill[]>(() =>
    loadStored(STORAGE_KEYS.drills, INITIAL_DRILLS)
  );
  const [stories, setStories] = useState<StarStory[]>(() =>
    loadStored(STORAGE_KEYS.stories, INITIAL_STORIES)
  );

  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.apps,
        JSON.stringify(applications)
      );
    } catch {
      // ignore storage quota errors
    }
  }, [applications]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.drills, JSON.stringify(drills));
    } catch {
      // ignore
    }
  }, [drills]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.stories,
        JSON.stringify(stories)
      );
    } catch {
      // ignore
    }
  }, [stories]);

  useEffect(() => {
    if (!feedbackMessage) return;
    const t = window.setTimeout(() => setFeedbackMessage(null), 3200);
    return () => window.clearTimeout(t);
  }, [feedbackMessage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedAppId(null);
        setIsAddModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedApplication =
    applications.find((a) => a.id === selectedAppId) || null;

  const handleNavigateTab = (tab: ActiveTab, companyFilter?: string) => {
    setPrepCompanyFilter(companyFilter);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMoveStage = (appId: string, newStage: ApplicationStage) => {
    const today = getTodayLocalISO();
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const needsDefaultOffer = newStage === 'offer' && !app.offer;
        return {
          ...app,
          stage: newStage,
          lastActivityDate: today,
          offer: needsDefaultOffer
            ? {
                baseSalary: app.salaryMax,
                annualBonusPct: 15,
                equityAnnual: 90000,
                signOnBonus: 20000,
                decisionDeadline: addDaysISO(today, 14),
                status: 'Evaluating',
              }
            : app.offer,
        };
      })
    );

    const moved = applications.find((a) => a.id === appId);
    if (moved && moved.stage !== newStage) {
      if (newStage === 'offer') {
        setFeedbackMessage(`Offer recorded for ${moved.company}.`);
      } else if (newStage === 'interview') {
        setFeedbackMessage(`${moved.company} moved to Interview Scheduled.`);
      }
    }
  };

  const handleAddApplication = (
    payload: Omit<JobApplication, 'id' | 'rounds' | 'prepTasks'>
  ) => {
    const created: JobApplication = {
      ...payload,
      id: `app-${Date.now()}`,
      rounds: [],
      prepTasks: [
        {
          id: `pt-${Date.now()}`,
          label: `Review ${payload.company} role scope & leadership principles`,
          completed: false,
        },
      ],
    };
    setApplications((prev) => [created, ...prev]);
    setFeedbackMessage(`${created.company} added to pipeline.`);
  };

  const handleDeleteApplication = (appId: string) => {
    const target = applications.find((a) => a.id === appId);
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    if (target) {
      setFeedbackMessage(`${target.company} removed from pipeline.`);
    }
  };

  const handleUpdateNotes = (appId: string, notes: string) => {
    const today = getTodayLocalISO();
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, notes, lastActivityDate: today } : app
      )
    );
  };

  const handleUpdateFollowUpDate = (appId: string, date: string) => {
    const today = getTodayLocalISO();
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              followUpDate: date || undefined,
              lastActivityDate: today,
            }
          : app
      )
    );
    setFeedbackMessage('Follow-up date updated.');
  };

  const handleLogFollowUp = (appId: string) => {
    const today = getTodayLocalISO();
    const nextFollowUp = addDaysISO(today, 4);
    const target = applications.find((a) => a.id === appId);
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              lastActivityDate: today,
              followUpDate: nextFollowUp,
            }
          : app
      )
    );
    if (target) {
      setFeedbackMessage(
        `Follow-up logged for ${target.company}. Next check-in scheduled.`
      );
    }
  };

  const handleToggleRoundComplete = (appId: string, roundId: string) => {
    const today = getTodayLocalISO();
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              lastActivityDate: today,
              rounds: app.rounds.map((r) =>
                r.id === roundId ? { ...r, completed: !r.completed } : r
              ),
            }
          : app
      )
    );
  };

  const handleAddRound = (
    appId: string,
    roundInput: {
      title: string;
      interviewer: string;
      interviewerRole: string;
      scheduledAt: string;
      durationMins: number;
    }
  ) => {
    const today = getTodayLocalISO();
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const newRound = {
          id: `round-${Date.now()}`,
          ...roundInput,
          completed: false,
          notes: '',
        };
        return {
          ...app,
          stage: app.stage === 'applied' ? 'interview' : app.stage,
          lastActivityDate: today,
          nextMilestoneDate: roundInput.scheduledAt,
          nextMilestoneLabel: roundInput.title,
          rounds: [...app.rounds, newRound],
        };
      })
    );
    setFeedbackMessage('Interview round scheduled.');
  };

  const handleTogglePrepTask = (appId: string, taskId: string) => {
    const today = getTodayLocalISO();
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              lastActivityDate: today,
              prepTasks: app.prepTasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }
          : app
      )
    );
  };

  const handleAddPrepTask = (appId: string, label: string) => {
    const today = getTodayLocalISO();
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              lastActivityDate: today,
              prepTasks: [
                ...app.prepTasks,
                { id: `pt-${Date.now()}`, label, completed: false },
              ],
            }
          : app
      )
    );
  };

  const handleUpdateOffer = (appId: string, offer: OfferDetails) => {
    const today = getTodayLocalISO();
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, offer, lastActivityDate: today } : app
      )
    );
    setFeedbackMessage('Compensation terms updated.');
  };

  const handleToggleDrillComplete = (drillId: string) => {
    setDrills((prev) =>
      prev.map((d) =>
        d.id === drillId ? { ...d, completed: !d.completed } : d
      )
    );
  };

  const handleUpdateDrillDraft = (drillId: string, draftResponse: string) => {
    setDrills((prev) =>
      prev.map((d) => (d.id === drillId ? { ...d, draftResponse } : d))
    );
  };

  const handleAddStory = (storyInput: Omit<StarStory, 'id'>) => {
    setStories((prev) => [{ ...storyInput, id: `story-${Date.now()}` }, ...prev]);
    setFeedbackMessage('STAR story saved to bank.');
  };

  const NAV_ITEMS: {
    id: ActiveTab;
    label: string;
    mobileLabel: string;
    Icon: typeof LayoutDashboard;
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      mobileLabel: 'Overview',
      Icon: LayoutDashboard,
    },
    {
      id: 'pipeline',
      label: 'Pipeline',
      mobileLabel: 'Pipeline',
      Icon: Kanban,
    },
    {
      id: 'prep',
      label: 'Interview Prep',
      mobileLabel: 'Prep',
      Icon: BookOpen,
    },
    {
      id: 'offers',
      label: 'Offers',
      mobileLabel: 'Offers',
      Icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col">
      {/* Desktop Top Bar (3-Zone Contract: Brand — Nav Links — Primary Action) */}
      <header className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavigateTab('overview')}
            className="font-display text-lg font-bold tracking-tight text-[#0b1c30] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Cadence
          </button>

          {/* Zone 2: Clean Single-Line Nav Links (Desktop) */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7"
          >
            {NAV_ITEMS.map(({ id, label }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavigateTab(id)}
                  className={`relative py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'text-[#3525cd]'
                      : 'text-[#464555] hover:text-[#0b1c30]'
                  }`}
                >
                  <span>{label}</span>
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#4F46E5]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#4F46E5] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#3525cd] active:scale-[0.98] transition-all min-h-[40px] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Role</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12">
        {activeTab === 'overview' && (
          <OverviewScreen
            applications={applications}
            drills={drills}
            onSelectApplication={(app) => setSelectedAppId(app.id)}
            onTogglePrepTask={handleTogglePrepTask}
            onLogFollowUp={handleLogFollowUp}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineScreen
            applications={applications}
            onSelectApplication={(app) => setSelectedAppId(app.id)}
            onMoveStage={handleMoveStage}
            onLogFollowUp={handleLogFollowUp}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onPracticeCompany={(company) => handleNavigateTab('prep', company)}
          />
        )}

        {activeTab === 'prep' && (
          <PrepStudioScreen
            drills={drills}
            stories={stories}
            initialCompanyFilter={prepCompanyFilter}
            onToggleDrillComplete={handleToggleDrillComplete}
            onUpdateDrillDraft={handleUpdateDrillDraft}
            onAddStory={handleAddStory}
          />
        )}

        {activeTab === 'offers' && (
          <OffersScreen
            applications={applications}
            onSelectApplication={(app) => setSelectedAppId(app.id)}
            onUpdateOffer={handleUpdateOffer}
          />
        )}
      </main>

      {/* Subtle Progression Confirmation Toast */}
      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 right-4 z-40 rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3 text-xs font-semibold text-[#065F46] shadow-[0_4px_6px_-1px_rgba(30,41,59,0.08)]"
        >
          {feedbackMessage}
        </div>
      )}

      {/* Mobile Fixed Bottom Tab Bar (< 768px) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[#E2E8F0] bg-white/95 backdrop-blur-md shadow-[0_-4px_12px_rgba(15,23,42,0.05)]"
      >
        <div className="grid grid-cols-4 h-16">
          {NAV_ITEMS.map(({ id, mobileLabel, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigateTab(id)}
                className={`flex flex-col items-center justify-center gap-1 min-h-[44px] cursor-pointer transition-colors ${
                  active ? 'text-[#4F46E5]' : 'text-[#64748B]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
                  {mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Slide-Over / Bottom Sheet Role Detail Drawer */}
      <ApplicationDrawer
        application={selectedApplication}
        onClose={() => setSelectedAppId(null)}
        onMoveStage={handleMoveStage}
        onUpdateNotes={handleUpdateNotes}
        onUpdateFollowUpDate={handleUpdateFollowUpDate}
        onLogFollowUp={handleLogFollowUp}
        onToggleRoundComplete={handleToggleRoundComplete}
        onAddRound={handleAddRound}
        onTogglePrepTask={handleTogglePrepTask}
        onAddPrepTask={handleAddPrepTask}
        onDeleteApplication={handleDeleteApplication}
      />

      {/* Add Application Modal */}
      <AddApplicationModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddApplication={handleAddApplication}
      />
    </div>
  );
}
