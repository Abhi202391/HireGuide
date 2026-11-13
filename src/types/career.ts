export type ApplicationStage = 'applied' | 'interview' | 'offer' | 'archived';

export type WorkModel = 'Hybrid' | 'Remote' | 'On-site';

export type PriorityLevel = 'High' | 'Standard';

export interface InterviewRound {
  id: string;
  title: string;
  interviewer: string;
  interviewerRole: string;
  scheduledAt: string; // ISO date string
  durationMins: number;
  completed: boolean;
  notes: string;
}

export interface PrepTask {
  id: string;
  label: string;
  completed: boolean;
}

export interface OfferDetails {
  baseSalary: number;
  annualBonusPct: number;
  equityAnnual: number;
  signOnBonus: number;
  decisionDeadline: string;
  status: 'Evaluating' | 'Countering' | 'Accepted' | 'Declined';
}

export interface JobApplication {
  id: string;
  company: string;
  brandColor: string;
  role: string;
  stage: ApplicationStage;
  salaryMin: number;
  salaryMax: number;
  location: string;
  workModel: WorkModel;
  priority: PriorityLevel;
  appliedDate: string;
  followUpDate?: string;
  lastActivityDate?: string;
  nextMilestoneDate?: string;
  nextMilestoneLabel?: string;
  recruiterName: string;
  recruiterEmail: string;
  notes: string;
  rounds: InterviewRound[];
  prepTasks: PrepTask[];
  offer?: OfferDetails;
}

export interface CoachingDrill {
  id: string;
  category: 'Behavioral' | 'System Design' | 'Executive Leadership' | 'Negotiation';
  title: string;
  prompt: string;
  targetDurationSec: number;
  completed: boolean;
  linkedCompany?: string;
  feedbackTone: 'emerald' | 'amber';
  coachingTips: string[];
  draftResponse: string;
}

export interface StarStory {
  id: string;
  title: string;
  competency: string;
  companyContext: string;
  situation: string;
  task: string;
  action: string;
  result: string;
}

export type ActiveTab = 'overview' | 'pipeline' | 'prep' | 'offers';
