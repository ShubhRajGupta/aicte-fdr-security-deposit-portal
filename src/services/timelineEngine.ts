import { Instrument, NotificationAlert } from '../types';

export interface TimelineEvaluationResult {
  updatedInstruments: Instrument[];
  generatedAlerts: NotificationAlert[];
}

/**
 * Timeline Engine with Time-Travel Simulation
 * When simulated date changes, automatically evaluates:
 * - ACTIVE -> EXPIRING (< 90 days to maturity)
 * - EXPIRING -> MATURED (on or after maturity date)
 * - MATURED -> OVERDUE (if maturity passed without renewal)
 * Generates automated multi-channel alerts (SMS, Email, In-App).
 */
export function evaluateTimelineAtDate(
  instruments: Instrument[],
  simulatedDateStr: string
): TimelineEvaluationResult {
  const simDate = new Date(simulatedDateStr);
  const generatedAlerts: NotificationAlert[] = [];

  const updatedInstruments = instruments.map((inst) => {
    // If instrument is already NOC_ISSUED or RELEASED or ON_HOLD, do not auto-expire
    if (['NOC_ISSUED', 'RELEASED', 'ON_HOLD', 'DRAFT'].includes(inst.status)) {
      return inst;
    }

    const matDate = new Date(inst.maturityDate);
    const diffDays = Math.ceil((matDate.getTime() - simDate.getTime()) / (1000 * 60 * 60 * 24));

    let newStatus = inst.status;

    if (diffDays < 0) {
      // Overdue if not renewed or released
      if (inst.status !== 'RELEASE_REQUESTED' && inst.status !== 'RENEWAL_PENDING') {
        newStatus = 'OVERDUE';
        generatedAlerts.push({
          id: `alert-overdue-${inst.id}-${simulatedDateStr}`,
          channel: 'SMS',
          recipient: inst.institutionName,
          recipientRole: 'INSTITUTION_USER',
          subject: `URGENT: FDR #${inst.instrumentNumber} Overdue by ${Math.abs(diffDays)} Days`,
          message: `Your Security Deposit #${inst.instrumentNumber} expired on ${inst.maturityDate}. Penalty proceedings initiated. Submit renewal immediately.`,
          timestamp: new Date().toISOString(),
          triggerEvent: 'OVERDUE_LAPSE',
          isRead: false,
          priority: 'URGENT'
        });
      }
    } else if (diffDays <= 30) {
      if (newStatus !== 'RENEWAL_PENDING' && newStatus !== 'RELEASE_REQUESTED') {
        newStatus = 'EXPIRING';
        generatedAlerts.push({
          id: `alert-t30-${inst.id}-${simulatedDateStr}`,
          channel: 'EMAIL',
          recipient: inst.institutionName,
          recipientRole: 'INSTITUTION_USER',
          subject: `CRITICAL T-30 ALERT: FDR #${inst.instrumentNumber} Matures in ${diffDays} Days`,
          message: `FDR #${inst.instrumentNumber} reaches maturity on ${inst.maturityDate}. Prepare renewal or initiate release application.`,
          timestamp: new Date().toISOString(),
          triggerEvent: 'T-30_RENEWAL_WINDOW',
          isRead: false,
          priority: 'URGENT'
        });
      }
    } else if (diffDays <= 90) {
      if (newStatus === 'ACTIVE' || newStatus === 'SUBMITTED') {
        newStatus = 'EXPIRING';
        generatedAlerts.push({
          id: `alert-t90-${inst.id}-${simulatedDateStr}`,
          channel: 'IN_APP',
          recipient: inst.institutionName,
          recipientRole: 'INSTITUTION_USER',
          subject: `Automated Reminder (T-90 Days): FDR #${inst.instrumentNumber} Maturity Approaching`,
          message: `Notice of upcoming maturity on ${inst.maturityDate}. Renew instrument before cutoff date to maintain uninterrupted approval status.`,
          timestamp: new Date().toISOString(),
          triggerEvent: 'T-90_EXPIRING_FLAG',
          isRead: false,
          priority: 'HIGH'
        });
      }
    } else {
      if (newStatus === 'EXPIRING' || newStatus === 'OVERDUE') {
        newStatus = 'ACTIVE';
      }
    }

    return {
      ...inst,
      status: newStatus
    };
  });

  return {
    updatedInstruments,
    generatedAlerts
  };
}
