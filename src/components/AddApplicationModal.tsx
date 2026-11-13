import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  ApplicationStage,
  JobApplication,
  PriorityLevel,
  WorkModel,
} from '../types/career';
import { addDaysISO, getTodayLocalISO } from '../utils/formatters';

interface AddApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onAddApplication: (
    app: Omit<JobApplication, 'id' | 'rounds' | 'prepTasks'>
  ) => void;
}

const BRAND_COLORS = ['#4F46E5', '#1E293B', '#0F172A', '#3525CD', '#005338'];

export const AddApplicationModal: React.FC<AddApplicationModalProps> = ({
  open,
  onClose,
  onAddApplication,
}) => {
  const todayIso = getTodayLocalISO();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [stage, setStage] = useState<ApplicationStage>('applied');
  const [salaryMin, setSalaryMin] = useState(210000);
  const [salaryMax, setSalaryMax] = useState(250000);
  const [location, setLocation] = useState('San Francisco, CA');
  const [workModel, setWorkModel] = useState<WorkModel>('Hybrid');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [followUpDate, setFollowUpDate] = useState(addDaysISO(todayIso, 5));
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [notes, setNotes] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const colorIdx = company.trim().length % BRAND_COLORS.length;
    onAddApplication({
      company: company.trim(),
      brandColor: BRAND_COLORS[colorIdx],
      role: role.trim(),
      stage,
      salaryMin: Number(salaryMin) || 180000,
      salaryMax: Number(salaryMax) || 220000,
      location: location.trim() || 'Remote',
      workModel,
      priority,
      appliedDate: todayIso,
      followUpDate: followUpDate || undefined,
      lastActivityDate: todayIso,
      recruiterName: recruiterName.trim() || 'Talent Team',
      recruiterEmail: recruiterEmail.trim(),
      notes: notes.trim(),
      ...(stage === 'offer'
        ? {
            offer: {
              baseSalary: Number(salaryMax) || 235000,
              annualBonusPct: 15,
              equityAnnual: 85000,
              signOnBonus: 20000,
              decisionDeadline: addDaysISO(todayIso, 14),
              status: 'Evaluating' as const,
            },
          }
        : {}),
    });

    setCompany('');
    setRole('');
    setNotes('');
    setRecruiterName('');
    setRecruiterEmail('');
    setFollowUpDate(addDaysISO(todayIso, 5));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0b1c30]/45 backdrop-blur-[2px] sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add new job application"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg max-h-[90vh] bg-white rounded-t-2xl sm:rounded-xl border border-[#E2E8F0] shadow-[0_10px_15px_-3px_rgba(15,23,42,0.08)] flex flex-col overflow-hidden"
      >
        <div className="sm:hidden pt-3 pb-1">
          <div className="w-10 h-1.5 bg-[#CBD5E1] rounded-full mx-auto" />
        </div>

        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0b1c30]">
              Add Application
            </h2>
            <p className="text-xs text-[#64748B]">
              Track a new executive opportunity in your pipeline
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#464555] hover:bg-[#f8f9ff] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="new-company"
                className="block text-xs font-semibold text-[#1E293B] mb-1"
              >
                Company *
              </label>
              <input
                id="new-company"
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe"
                className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 text-sm text-[#0b1c30] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label
                htmlFor="new-stage"
                className="block text-xs font-semibold text-[#1E293B] mb-1"
              >
                Initial Stage
              </label>
              <select
                id="new-stage"
                value={stage}
                onChange={(e) => setStage(e.target.value as ApplicationStage)}
                className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 text-sm text-[#0b1c30] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              >
                <option value="applied">Applied / Screening</option>
                <option value="interview">Interview Scheduled</option>
                <option value="offer">Offer Received</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label
                htmlFor="new-role"
                className="block text-xs font-semibold text-[#1E293B] mb-1"
              >
                Role Title *
              </label>
              <input
                id="new-role"
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Staff Product Engineer"
                className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 text-sm text-[#0b1c30] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label
                htmlFor="new-followup"
                className="block text-xs font-semibold text-[#1E293B] mb-1"
              >
                Follow-Up Date
              </label>
              <input
                id="new-followup"
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 text-xs font-medium text-[#0b1c30] tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="new-sal-min"
                className="block text-xs font-semibold text-[#1E293B] mb-1"
              >
                Base Min ($)
              </label>
              <input
                id="new-sal-min"
                type="number"
                step={5000}
                value={salaryMin}
                onChange={(e) => setSalaryMin(Number(e.target.value))}
                className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 text-sm text-[#0b1c30] tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label
                htmlFor="new-sal-max"
                className="block text-xs font-semibold text-[#1E293B] mb-1"
              >
                Base Max ($)
              </label>
              <input
                id="new-sal-max"
                type="number"
                step={5000}
                value={salaryMax}
                onChange={(e) => setSalaryMax(Number(e.target.value))}
                className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 text-sm text-[#0b1c30] tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="new-location"
                className="block text-xs font-semibold text-[#1E293B] mb-1"
              >
                Location
              </label>
              <input
                id="new-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 text-sm text-[#0b1c30] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label
                htmlFor="new-work-model"
                className="block text-xs font-semibold text-[#1E293B] mb-1"
              >
                Work Model
              </label>
              <select
                id="new-work-model"
                value={workModel}
                onChange={(e) => setWorkModel(e.target.value as WorkModel)}
                className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 text-sm text-[#0b1c30] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="new-priority"
                className="block text-xs font-semibold text-[#1E293B] mb-1"
              >
                Priority
              </label>
              <select
                id="new-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 text-sm text-[#0b1c30] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              >
                <option value="High">High</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="new-recruiter"
                className="block text-xs font-semibold text-[#1E293B] mb-1"
              >
                Recruiter Name
              </label>
              <input
                id="new-recruiter"
                type="text"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                placeholder="Optional"
                className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 text-sm text-[#0b1c30] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label
                htmlFor="new-email"
                className="block text-xs font-semibold text-[#1E293B] mb-1"
              >
                Recruiter Email
              </label>
              <input
                id="new-email"
                type="email"
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                placeholder="Optional"
                className="w-full h-11 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 text-sm text-[#0b1c30] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="new-notes"
              className="block text-xs font-semibold text-[#1E293B] mb-1"
            >
              Strategic Notes
            </label>
            <textarea
              id="new-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Referral source, team scope, or key differentiators..."
              className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] p-3 text-sm text-[#0b1c30] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#1E293B] hover:bg-[#eff4ff] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] rounded-lg bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3525cd] active:scale-[0.98] transition-all cursor-pointer"
            >
              Save Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
