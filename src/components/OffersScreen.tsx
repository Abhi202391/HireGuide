import React, { useMemo, useState } from 'react';
import { Award, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { JobApplication, OfferDetails } from '../types/career';
import { CompanyAvatar } from './CompanyAvatar';
import {
  computeRecurringComp,
  computeYearOneComp,
  formatCountdown,
  formatCurrencyFull,
  formatShortDate,
} from '../utils/formatters';

interface OffersScreenProps {
  applications: JobApplication[];
  onSelectApplication: (app: JobApplication) => void;
  onUpdateOffer: (appId: string, offer: OfferDetails) => void;
}

export const OffersScreen: React.FC<OffersScreenProps> = ({
  applications,
  onSelectApplication,
  onUpdateOffer,
}) => {
  const offerApps = useMemo(
    () => applications.filter((a) => a.stage === 'offer' && a.offer),
    [applications]
  );

  const [selectedOfferAppId, setSelectedOfferAppId] = useState<string>(
    offerApps[0]?.id || ''
  );

  const activeOfferApp =
    offerApps.find((a) => a.id === selectedOfferAppId) || offerApps[0];

  const [counterBaseDelta, setCounterBaseDelta] = useState<number>(15000);
  const [counterEquityDelta, setCounterEquityDelta] = useState<number>(20000);
  const [counterSignOnDelta, setCounterSignOnDelta] = useState<number>(15000);

  const currentYearOne = activeOfferApp?.offer
    ? computeYearOneComp(activeOfferApp.offer)
    : 0;
  const currentRecurring = activeOfferApp?.offer
    ? computeRecurringComp(activeOfferApp.offer)
    : 0;

  const modeledOffer: OfferDetails | null = activeOfferApp?.offer
    ? {
        ...activeOfferApp.offer,
        baseSalary: activeOfferApp.offer.baseSalary + counterBaseDelta,
        equityAnnual: activeOfferApp.offer.equityAnnual + counterEquityDelta,
        signOnBonus: activeOfferApp.offer.signOnBonus + counterSignOnDelta,
      }
    : null;

  const modeledYearOne = modeledOffer ? computeYearOneComp(modeledOffer) : 0;
  const modeledFourYear = modeledOffer
    ? modeledOffer.baseSalary * 4 +
      Math.round(
        modeledOffer.baseSalary * (modeledOffer.annualBonusPct / 100)
      ) *
        4 +
      modeledOffer.equityAnnual * 4 +
      modeledOffer.signOnBonus
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[28px] sm:text-[32px] font-bold tracking-[-0.02em] text-[#0b1c30] leading-tight">
            Offers & Compensation
          </h1>
          <p className="mt-1 text-sm text-[#464555]">
            Side-by-side total compensation analysis, deadlines, and
            counter-offer modeling.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3.5 py-1.5 text-xs font-semibold text-[#065F46] tabular-nums self-start sm:self-auto">
          <Award className="w-3.5 h-3.5" />
          <span>{offerApps.length} Active Offers</span>
        </span>
      </div>

      {offerApps.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
          <p className="font-display text-base font-semibold text-[#0b1c30]">
            No active offers recorded yet
          </p>
          <p className="text-sm text-[#64748B] mt-1 max-w-md mx-auto">
            Move any application into the Offer Received stage in your Pipeline
            to unlock compensation benchmarking and counter-offer modeling.
          </p>
        </div>
      ) : (
        <>
          {/* Side-by-Side Offer Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offerApps.map((app) => {
              const offer = app.offer!;
              const year1 = computeYearOneComp(offer);
              const recurring = computeRecurringComp(offer);
              const bonusCash = Math.round(
                offer.baseSalary * (offer.annualBonusPct / 100)
              );

              return (
                <div
                  key={app.id}
                  className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(30,41,59,0.05),0_1px_2px_rgba(30,41,59,0.03)] space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectApplication(app)}
                      className="flex items-center gap-3 text-left cursor-pointer"
                    >
                      <CompanyAvatar
                        company={app.company}
                        brandColor={app.brandColor}
                        size="lg"
                      />
                      <div>
                        <h2 className="font-display text-base font-bold text-[#0b1c30]">
                          {app.company}
                        </h2>
                        <p className="text-xs text-[#464555]">{app.role}</p>
                        <p className="text-xs text-[#64748B] mt-0.5">
                          {app.location} · {app.workModel}
                        </p>
                      </div>
                    </button>

                    <select
                      aria-label={`${app.company} offer status`}
                      value={offer.status}
                      onChange={(e) =>
                        onUpdateOffer(app.id, {
                          ...offer,
                          status: e.target.value as OfferDetails['status'],
                        })
                      }
                      className={`h-9 rounded-full border px-3 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4F46E5] ${
                        offer.status === 'Accepted'
                          ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                          : offer.status === 'Countering'
                            ? 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]'
                            : 'bg-[#EEF2FF] text-[#3730A3] border-[#C7D2FE]'
                      }`}
                    >
                      <option value="Evaluating">Evaluating</option>
                      <option value="Countering">Countering</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </div>

                  {/* Year-1 & Recurring Highlight */}
                  <div className="grid grid-cols-2 gap-3 rounded-lg bg-[#f8f9ff] border border-[#E2E8F0] p-3.5">
                    <div>
                      <p className="text-[11px] font-semibold text-[#64748B]">
                        Year-1 Total Comp
                      </p>
                      <p className="font-display text-xl sm:text-2xl font-bold text-[#0b1c30] tabular-nums mt-0.5">
                        {formatCurrencyFull(year1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#64748B]">
                        Annual Recurring
                      </p>
                      <p className="font-display text-xl sm:text-2xl font-bold text-[#4F46E5] tabular-nums mt-0.5">
                        {formatCurrencyFull(recurring)}
                      </p>
                    </div>
                  </div>

                  {/* Breakdown Table */}
                  <dl className="divide-y divide-[#F1F5F9] text-sm">
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-[#64748B]">Base Salary</dt>
                      <dd className="font-semibold text-[#0b1c30] tabular-nums">
                        {formatCurrencyFull(offer.baseSalary)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-[#64748B]">
                        Target Bonus ({offer.annualBonusPct}%)
                      </dt>
                      <dd className="font-semibold text-[#0b1c30] tabular-nums">
                        {formatCurrencyFull(bonusCash)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-[#64748B]">Annual Equity (4-yr)</dt>
                      <dd className="font-semibold text-[#0b1c30] tabular-nums">
                        {formatCurrencyFull(offer.equityAnnual)}/yr
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-[#64748B]">Sign-On Bonus</dt>
                      <dd className="font-semibold text-[#065F46] tabular-nums">
                        {formatCurrencyFull(offer.signOnBonus)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-[#64748B]">Decision Deadline</dt>
                      <dd className="font-semibold text-[#92400E] tabular-nums">
                        {formatShortDate(offer.decisionDeadline)} (
                        {formatCountdown(offer.decisionDeadline)})
                      </dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>

          {/* Interactive Counter-Offer Modeler */}
          {activeOfferApp && modeledOffer && (
            <section className="rounded-lg border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(30,41,59,0.05)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="w-5 h-5 text-[#4F46E5]" />
                  <div>
                    <h2 className="font-display text-base font-bold text-[#0b1c30]">
                      Counter-Offer Scenario Modeler
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      Model base, equity, and sign-on adjustments before your
                      recruiter call
                    </p>
                  </div>
                </div>

                <select
                  aria-label="Select offer to model"
                  value={activeOfferApp.id}
                  onChange={(e) => setSelectedOfferAppId(e.target.value)}
                  className="h-11 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm font-semibold text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                >
                  {offerApps.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.company} — {app.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 items-center">
                {/* Sliders */}
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <label htmlFor="slider-base" className="text-[#1E293B]">
                        Base Salary Adjustment
                      </label>
                      <span className="text-[#4F46E5] tabular-nums">
                        +{formatCurrencyFull(counterBaseDelta)} →{' '}
                        {formatCurrencyFull(modeledOffer.baseSalary)}
                      </span>
                    </div>
                    <input
                      id="slider-base"
                      type="range"
                      min={0}
                      max={40000}
                      step={5000}
                      value={counterBaseDelta}
                      onChange={(e) =>
                        setCounterBaseDelta(Number(e.target.value))
                      }
                      className="w-full accent-[#4F46E5] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <label htmlFor="slider-equity" className="text-[#1E293B]">
                        Annual Equity Uplift
                      </label>
                      <span className="text-[#4F46E5] tabular-nums">
                        +{formatCurrencyFull(counterEquityDelta)}/yr →{' '}
                        {formatCurrencyFull(modeledOffer.equityAnnual)}/yr
                      </span>
                    </div>
                    <input
                      id="slider-equity"
                      type="range"
                      min={0}
                      max={60000}
                      step={5000}
                      value={counterEquityDelta}
                      onChange={(e) =>
                        setCounterEquityDelta(Number(e.target.value))
                      }
                      className="w-full accent-[#4F46E5] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <label htmlFor="slider-signon" className="text-[#1E293B]">
                        Sign-On Bridge Uplift
                      </label>
                      <span className="text-[#4F46E5] tabular-nums">
                        +{formatCurrencyFull(counterSignOnDelta)} →{' '}
                        {formatCurrencyFull(modeledOffer.signOnBonus)}
                      </span>
                    </div>
                    <input
                      id="slider-signon"
                      type="range"
                      min={0}
                      max={50000}
                      step={5000}
                      value={counterSignOnDelta}
                      onChange={(e) =>
                        setCounterSignOnDelta(Number(e.target.value))
                      }
                      className="w-full accent-[#4F46E5] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Output Summary Box */}
                <div className="lg:col-span-5 rounded-lg border border-[#C7D2FE] bg-[#EEF2FF]/60 p-5 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-[#3730A3]">
                      Modeled Year-1 Package ({activeOfferApp.company})
                    </p>
                    <p className="font-display text-3xl font-bold text-[#0b1c30] tabular-nums mt-1">
                      {formatCurrencyFull(modeledYearOne)}
                    </p>
                    <p className="text-xs font-semibold text-[#065F46] tabular-nums mt-1">
                      +{formatCurrencyFull(modeledYearOne - currentYearOne)} vs
                      initial ({formatCurrencyFull(currentYearOne)})
                    </p>
                  </div>

                  <div className="border-t border-[#C7D2FE] pt-3 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#464555]">Modeled Recurring</span>
                      <p className="font-bold text-[#0b1c30] tabular-nums mt-0.5">
                        {formatCurrencyFull(computeRecurringComp(modeledOffer))}
                        /yr
                      </p>
                    </div>
                    <div>
                      <span className="text-[#464555]">4-Year Total Value</span>
                      <p className="font-bold text-[#0b1c30] tabular-nums mt-0.5">
                        {formatCurrencyFull(modeledFourYear)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onUpdateOffer(activeOfferApp.id, {
                        ...modeledOffer,
                        status: 'Countering',
                      });
                      setCounterBaseDelta(0);
                      setCounterEquityDelta(0);
                      setCounterSignOnDelta(0);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3525cd] min-h-[44px] transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Apply Modeled Terms to Offer</span>
                  </button>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};
