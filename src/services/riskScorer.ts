import { Instrument, RiskBreakdown } from '../types';

/**
 * Innovation I2: Explainable Risk-Ranked Worklist Scoring
 * Score = Urgency + Amount Band + Discrepancy Severity + Bank Wait Time + Case Age
 * Every point is deterministic, verifiable, and explained on the officer's case card.
 */
export function computeRiskBreakdown(
  instrument: Partial<Instrument>,
  simulatedDateStr: string = '2026-10-24'
): RiskBreakdown {
  const simDate = new Date(simulatedDateStr);
  const matDate = instrument.maturityDate ? new Date(instrument.maturityDate) : new Date('2034-01-01');
  const subDate = instrument.submittedAt ? new Date(instrument.submittedAt) : new Date(simulatedDateStr);

  // 1. Urgency (Days to maturity, steeper inside 30 days)
  const diffTime = matDate.getTime() - simDate.getTime();
  const daysToMaturity = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let urgency = 10;
  if (daysToMaturity < 0) {
    // Overdue penalty
    urgency = 50;
  } else if (daysToMaturity <= 30) {
    urgency = 45;
  } else if (daysToMaturity <= 60) {
    urgency = 35;
  } else if (daysToMaturity <= 90) {
    urgency = 25;
  } else if (daysToMaturity <= 180) {
    urgency = 15;
  } else {
    urgency = 5;
  }

  // 2. Amount Band
  const amount = instrument.amount || 0;
  let amountBand = 10;
  if (amount >= 3500000) {
    amountBand = 30; // ₹35L+ is highest deposit category
  } else if (amount >= 2500000) {
    amountBand = 25;
  } else if (amount >= 1500000) {
    amountBand = 20;
  } else if (amount > 0) {
    amountBand = 15;
  }

  // 3. Discrepancy Severity
  let discrepancySeverity = 0;
  const activeDiscrepancies = (instrument.discrepancies || []).filter((d) => !d.resolved);
  if (activeDiscrepancies.some((d) => d.code === 'R4')) {
    discrepancySeverity = 50; // Duplicate FDR is critical fraud risk
  } else if (activeDiscrepancies.some((d) => d.severity === 'CRITICAL')) {
    discrepancySeverity = 40;
  } else if (activeDiscrepancies.some((d) => d.severity === 'WARNING')) {
    discrepancySeverity = 20;
  }

  // 4. Bank Wait Time
  let bankWaitTime = 0;
  if (instrument.trustLevel === 'L1' && !instrument.evidenceRecord) {
    bankWaitTime = 10;
  } else if (instrument.trustLevel === 'L-X') {
    bankWaitTime = 5;
  }

  // 5. Case Age (Days in system pending action)
  const ageDays = Math.max(0, Math.ceil((simDate.getTime() - subDate.getTime()) / (1000 * 60 * 60 * 24)));
  const caseAge = Math.min(25, Math.floor(ageDays / 5) * 5);

  const total = urgency + amountBand + discrepancySeverity + bankWaitTime + caseAge;

  return {
    urgency,
    amountBand,
    discrepancySeverity,
    bankWaitTime,
    caseAge,
    total
  };
}
