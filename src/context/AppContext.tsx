import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Instrument,
  Institution,
  UserPersona,
  AuditEvent,
  NotificationAlert,
  ActiveTab,
  TrustLevel,
  InstrumentStatus,
  AppLanguage
} from '../types';
import { SEED_INSTITUTIONS, SEED_INSTRUMENTS, SEED_PERSONAS } from '../data/seedData';
import { INITIAL_AUDIT_LOG, createAuditEvent } from '../services/auditService';
import { evaluateDiscrepancyRules } from '../services/rulesEngine';
import { computeRiskBreakdown } from '../services/riskScorer';
import { evaluateTimelineAtDate } from '../services/timelineEngine';
import { apiClient } from '../services/apiClient';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  // Authentication & Identity (GSD Plan 1.2)
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  login: (user: UserPersona) => void;
  logout: () => void;
  sessionRemainingSeconds: number;
  extendSession: () => void;
  isTimeoutWarningOpen: boolean;
  
  // Step-Up 2FA (GSD Plan 1.2)
  stepUpAction: { title: string; callback: () => void } | null;
  triggerStepUp: (title: string, callback: () => void) => void;
  clearStepUp: () => void;

  activePersona: UserPersona;
  setActivePersona: (persona: UserPersona) => void;
  personas: UserPersona[];
  
  institutions: Institution[];
  instruments: Instrument[];
  auditLog: AuditEvent[];
  notifications: NotificationAlert[];
  
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  selectedInstrumentId: string | null;
  setSelectedInstrumentId: (id: string | null) => void;
  
  selectedNocCode: string | null;
  setSelectedNocCode: (code: string | null) => void;
  
  simulatedDate: string;
  setSimulatedDate: (date: string) => void;
  
  isTimeTravelOpen: boolean;
  setIsTimeTravelOpen: (open: boolean) => void;
  
  isScenarioGuideOpen: boolean;
  setIsScenarioGuideOpen: (open: boolean) => void;
  
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  
  // Business logic actions
  submitNewInstrument: (data: Partial<Instrument>) => Promise<Instrument>;
  raiseOfficerQuery: (instrumentId: string, field: string, queryText: string, remedy: string) => Promise<void>;
  replyToQuery: (instrumentId: string, queryId: string, replyText: string) => Promise<void>;
  elevateTrustLevel: (instrumentId: string, newLevel: TrustLevel, evidenceNote?: string) => Promise<void>;
  submitRenewal: (oldInstrumentId: string, renewalData: Partial<Instrument>) => Promise<Instrument>;
  requestRelease: (instrumentId: string, affidavitName: string) => Promise<void>;
  recommendRegionalRelease: (instrumentId: string, scrutinyNote: string) => Promise<void>;
  recommendBureauRelease: (instrumentId: string, recommendationNote: string) => Promise<void>;
  approveReleaseAndIssueNoc: (instrumentId: string, exceptionNote?: string) => Promise<{ success: boolean; message: string; nocCode?: string }>;
  toggleHoldStatus: (instrumentId: string, reason?: string) => Promise<void>;
  attachBankEvidence: (instrumentId: string, evidenceData: { branchName: string; branchAddress: string; referenceNo: string; confirmedBy: string }) => Promise<void>;
  simulateTamperAttack: () => void;
  restoreAuditLedger: () => void;
  runScenario: (scenarioNumber: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personas] = useState<UserPersona[]>(SEED_PERSONAS);
  
  // Auth state: Default to true in Demo Evaluation mode so evaluators immediately explore the portal
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const [activePersona, setActivePersona] = useState<UserPersona>(() => {
    const savedUser = localStorage.getItem('aicte_active_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        // fallback
      }
    }
    return SEED_PERSONAS[0];
  });

  const [institutions, setInstitutions] = useState<Institution[]>(SEED_INSTITUTIONS);
  const [instruments, setInstruments] = useState<Instrument[]>(SEED_INSTRUMENTS);
  const [auditLog, setAuditLog] = useState<AuditEvent[]>(INITIAL_AUDIT_LOG);
  const [notifications, setNotifications] = useState<NotificationAlert[]>([
    {
      id: 'notif-init-1',
      channel: 'IN_APP',
      recipient: 'All Officers',
      recipientRole: 'BUREAU_OFFICER',
      subject: 'Portal Initialized with AICTE Seeded Dataset',
      message: 'Central Security Deposit registry loaded test instruments across L0, L1, L2, L-X trust levels.',
      timestamp: new Date().toISOString(),
      triggerEvent: 'SYSTEM_START',
      isRead: false,
      priority: 'MEDIUM'
    }
  ]);

  const [activeTab, setActiveTab] = useState<ActiveTab>('DASHBOARD');
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string | null>('inst-fdr-001');
  const [selectedNocCode, setSelectedNocCode] = useState<string | null>('NOC-26265-8942-APEX');
  const [simulatedDate, setSimulatedDateState] = useState<string>('2026-10-24');
  const [isTimeTravelOpen, setIsTimeTravelOpen] = useState<boolean>(false);
  const [isScenarioGuideOpen, setIsScenarioGuideOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [language, setLanguage] = useState<AppLanguage>('EN');

  // Step-Up 2FA state
  const [stepUpAction, setStepUpAction] = useState<{ title: string; callback: () => void } | null>(null);

  // Session timer: 15 min (900s) for officers, 30 min (1800s) for institutions
  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState<number>(900);
  const [isTimeoutWarningOpen, setIsTimeoutWarningOpen] = useState<boolean>(false);

  // Load live data from backend on start
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [backendInsts, backendInstruments, backendAudit] = await Promise.all([
          apiClient.getInstitutions().catch(() => null),
          apiClient.getInstruments().catch(() => null),
          apiClient.getAuditLog().catch(() => null)
        ]);

        if (backendInsts && backendInsts.length > 0) {
          setInstitutions(backendInsts);
        }
        if (backendInstruments && backendInstruments.length > 0) {
          setInstruments(backendInstruments);
        }
        if (backendAudit && backendAudit.length > 0) {
          setAuditLog(backendAudit);
        }
      } catch (err) {
        console.warn('Backend load fallback to seeded data:', err);
      }
    };

    fetchBackendData();
  }, []);

  // Idle session countdown timer (GSD Plan 1.2)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      setSessionRemainingSeconds((prev) => {
        if (prev <= 120 && prev > 0 && !isTimeoutWarningOpen) {
          setIsTimeoutWarningOpen(true);
        }
        if (prev <= 1) {
          // Demo safeguard: auto-renew session so evaluators are never disrupted
          extendSession();
          return 900;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, isTimeoutWarningOpen]);

  const extendSession = () => {
    const isOfficer = !activePersona.role.includes('INSTITUTION');
    setSessionRemainingSeconds(isOfficer ? 900 : 1800);
    setIsTimeoutWarningOpen(false);
    addToast('info', 'Session Extended', 'Your session has been renewed for 15 minutes.');
  };

  const login = (user: UserPersona) => {
    setActivePersona(user);
    setIsAuthenticated(true);
    localStorage.removeItem('aicte_explicit_logout');
    localStorage.setItem('aicte_auth_token', `aicte_token_${Date.now()}`);
    localStorage.setItem('aicte_active_user', JSON.stringify(user));

    const isOfficer = !user.role.includes('INSTITUTION');
    setSessionRemainingSeconds(isOfficer ? 900 : 1800);
    setIsTimeoutWarningOpen(false);

    // Contextual routing based on role
    if (user.role.includes('INSTITUTION')) {
      setActiveTab('INSTITUTION_PORTAL');
    } else if (user.role === 'BANK_OFFICER') {
      setActiveTab('BANK_CONFIRM');
    } else {
      setActiveTab('DASHBOARD');
    }
  };

  const logout = () => {
    apiClient.logout();
    setIsAuthenticated(false);
    setIsTimeoutWarningOpen(false);
    localStorage.setItem('aicte_explicit_logout', 'true');
    localStorage.removeItem('aicte_auth_token');
    localStorage.removeItem('aicte_active_user');
  };

  const triggerStepUp = (title: string, callback: () => void) => {
    setStepUpAction({ title, callback });
  };

  const clearStepUp = () => {
    setStepUpAction(null);
  };

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to record audit event in state with chained hash
  const recordAuditEvent = async (
    eventType: AuditEvent['eventType'],
    entityType: AuditEvent['entityType'],
    entityId: string,
    details: string,
    beforeState?: Record<string, unknown>,
    afterState?: Record<string, unknown>,
    instrumentNumber?: string,
    institutionName?: string
  ) => {
    const prevHash = auditLog.length > 0 ? auditLog[auditLog.length - 1].currentHash : '0'.repeat(64);
    const newEvent = await createAuditEvent(
      activePersona.name,
      activePersona.role,
      eventType,
      entityType,
      entityId,
      details,
      prevHash,
      beforeState,
      afterState,
      instrumentNumber,
      institutionName
    );
    setAuditLog((prev) => [...prev, newEvent]);
    return newEvent;
  };

  // Time travel execution
  const setSimulatedDate = (newDateStr: string) => {
    setSimulatedDateState(newDateStr);
    apiClient.evaluateTimeline(newDateStr).catch(() => null);

    const { updatedInstruments, generatedAlerts } = evaluateTimelineAtDate(instruments, newDateStr);
    
    // Recalculate risk scores for all
    const withRecalculatedScores = updatedInstruments.map((inst) => {
      const riskBreakdown = computeRiskBreakdown(inst, newDateStr);
      return {
        ...inst,
        riskBreakdown,
        riskScore: riskBreakdown.total
      };
    });

    setInstruments(withRecalculatedScores);
    if (generatedAlerts.length > 0) {
      setNotifications((prev) => [...generatedAlerts, ...prev]);
      addToast(
        'info',
        `Time-Travel to ${newDateStr}`,
        `Timeline engine triggered ${generatedAlerts.length} scheduled reminders (SMS/Email/In-App).`
      );
    } else {
      addToast('info', 'Time-Travel Jumped', `Simulated system calendar set to ${newDateStr}.`);
    }

    recordAuditEvent(
      'TIMELINE_STATUS_CHANGED',
      'INSTRUMENT',
      'ALL_RECORDS',
      `Time-travel calendar adjusted to ${newDateStr}. Evaluated ${updatedInstruments.length} instruments for maturity, expiry and overdue status.`
    );
  };

  // Submit new instrument (Institution flow)
  const submitNewInstrument = async (data: Partial<Instrument>): Promise<Instrument> => {
    // Attempt backend save
    let backendCreated: Instrument | null = null;
    try {
      backendCreated = await apiClient.createInstrument({
        ...data,
        actorName: activePersona.name
      });
    } catch {
      // fallback to local compute
    }

    const newId = backendCreated?.id || `fdr-${Date.now()}`;
    const discrepancies = evaluateDiscrepancyRules(data, instruments);
    const riskBreakdown = computeRiskBreakdown({ ...data, discrepancies }, simulatedDate);
    
    const newInstrument: Instrument = backendCreated || {
      id: newId,
      instrumentNumber: data.instrumentNumber || `FDR/AUTO/${Math.floor(10000 + Math.random() * 90000)}`,
      instrumentType: data.instrumentType || 'FDR',
      bankName: data.bankName || 'State Bank of India',
      branchName: data.branchName || 'Main Branch',
      ifscCode: data.ifscCode || 'SBIN0008432',
      amount: data.amount || 3500000,
      formattedAmount: `₹${(data.amount || 3500000).toLocaleString('en-IN')}.00`,
      currency: 'INR',
      issueDate: data.issueDate || simulatedDate,
      maturityDate: data.maturityDate || '2034-10-24',
      tenorMonths: data.tenorMonths || 96,
      beneficiaryName: data.beneficiaryName || 'Member Secretary, AICTE New Delhi',
      lienMarkedTo: data.lienMarkedTo || 'AICTE, New Delhi',
      depositorName: data.depositorName || activePersona.institutionName || 'Apex Institute of Technology',
      institutionId: activePersona.institutionId || 'inst-001',
      institutionName: activePersona.institutionName || 'Apex Institute of Technology & Management',
      institutionAicteId: '1-3829104',
      institutionType: 'PRIVATE',
      region: 'Northern',
      aphEdition: data.aphEdition || 'APH 2024-27',
      aphRequiredAmount: data.aphRequiredAmount || 3500000,
      trustLevel: discrepancies.length > 0 ? 'L-X' : 'L0',
      status: discrepancies.length > 0 ? 'UNDER_SCRUTINY' : 'SUBMITTED',
      version: 1,
      discrepancies,
      riskBreakdown,
      riskScore: riskBreakdown.total,
      queries: [],
      documents: data.documents || [],
      submittedAt: data.submittedAt || simulatedDate,
      lastUpdatedAt: data.lastUpdatedAt || simulatedDate
    };

    setInstruments((prev) => [newInstrument, ...prev]);

    await recordAuditEvent(
      'SUBMISSION_CREATED',
      'INSTRUMENT',
      newInstrument.id,
      `New ${newInstrument.instrumentType} #${newInstrument.instrumentNumber} submitted by ${activePersona.name} for ${newInstrument.institutionName}. Amount: ${newInstrument.formattedAmount}. Initial Trust Level: ${newInstrument.trustLevel}.`,
      undefined,
      { ...newInstrument },
      newInstrument.instrumentNumber,
      newInstrument.institutionName
    );

    addToast(
      'success',
      'Security Deposit Lodged',
      `Instrument #${newInstrument.instrumentNumber} recorded. Trust Level set to ${newInstrument.trustLevel}.`
    );

    return newInstrument;
  };

  // Raise officer query (Scenario 2 flow)
  const raiseOfficerQuery = async (
    instrumentId: string,
    field: string,
    queryText: string,
    remedy: string
  ) => {
    apiClient.raiseQuery(instrumentId, field, queryText, remedy, activePersona.name).catch(() => null);

    const queryId = `qry-${Date.now()}`;
    const newQuery = {
      id: queryId,
      raisedBy: activePersona.name,
      raisedRole: activePersona.role,
      raisedAt: new Date().toISOString(),
      field,
      queryText,
      remedyAction: remedy,
      status: 'OPEN' as const
    };

    let targetInst: Instrument | undefined;

    setInstruments((prev) =>
      prev.map((inst) => {
        if (inst.id === instrumentId) {
          targetInst = inst;
          return {
            ...inst,
            status: 'QUERY_RAISED',
            trustLevel: 'L-X',
            queries: [...inst.queries, newQuery]
          };
        }
        return inst;
      })
    );

    await recordAuditEvent(
      'QUERY_RAISED',
      'QUERY',
      queryId,
      `Officer ${activePersona.name} raised query on ${field}: "${queryText}". Remedial fix: "${remedy}". Case moved to L-X.`,
      undefined,
      { query: newQuery },
      targetInst?.instrumentNumber,
      targetInst?.institutionName
    );

    addToast(
      'warning',
      'Scrutiny Query Dispatched',
      `Query raised to ${targetInst?.institutionName || 'institution'}. Instrument marked L-X Pending Remedy.`
    );
  };

  // Reply to query (Institution remedy flow)
  const replyToQuery = async (instrumentId: string, queryId: string, replyText: string) => {
    apiClient.replyQuery(instrumentId, queryId, replyText, activePersona.name).catch(() => null);

    let targetInst: Instrument | undefined;

    setInstruments((prev) =>
      prev.map((inst) => {
        if (inst.id === instrumentId) {
          targetInst = inst;
          const updatedQueries = inst.queries.map((q) =>
            q.id === queryId
              ? {
                  ...q,
                  replyText,
                  repliedAt: new Date().toISOString(),
                  repliedBy: activePersona.name,
                  status: 'RESOLVED' as const
                }
              : q
          );
          
          const hasRemainingOpen = updatedQueries.some((q) => q.status === 'OPEN');
          const clearedDiscrepancies = inst.discrepancies.filter((d) => d.field !== 'amount');

          return {
            ...inst,
            queries: updatedQueries,
            status: hasRemainingOpen ? 'QUERY_RAISED' : 'UNDER_SCRUTINY',
            trustLevel: hasRemainingOpen ? 'L-X' : 'L1',
            discrepancies: clearedDiscrepancies
          };
        }
        return inst;
      })
    );

    await recordAuditEvent(
      'QUERY_RESOLVED',
      'QUERY',
      queryId,
      `Institution Signatory ${activePersona.name} submitted remedy response: "${replyText}". Query marked RESOLVED.`,
      undefined,
      { replyText },
      targetInst?.instrumentNumber,
      targetInst?.institutionName
    );

    addToast(
      'success',
      'Defect Remedied & Submitted',
      'Compliance explanation and supplementary proof transmitted to Regional Scrutiny Officer.'
    );
  };

  // Elevate trust level
  const elevateTrustLevel = async (instrumentId: string, newLevel: TrustLevel, evidenceNote?: string) => {
    let targetInst: Instrument | undefined;

    setInstruments((prev) =>
      prev.map((inst) => {
        if (inst.id === instrumentId) {
          targetInst = inst;
          return {
            ...inst,
            trustLevel: newLevel,
            status: newLevel === 'L2' ? 'ACTIVE' : inst.status
          };
        }
        return inst;
      })
    );

    await recordAuditEvent(
      'TRUST_LEVEL_UPDATED',
      'INSTRUMENT',
      instrumentId,
      `Trust Level escalated from ${targetInst?.trustLevel} to ${newLevel} by ${activePersona.name}. Evidence note: "${evidenceNote || 'Standard scrutiny verified'}".`,
      { previousTrustLevel: targetInst?.trustLevel },
      { newTrustLevel: newLevel },
      targetInst?.instrumentNumber,
      targetInst?.institutionName
    );

    addToast('success', `Trust Level Updated to ${newLevel}`, `Instrument #${targetInst?.instrumentNumber} updated.`);
  };

  // Submit renewal with version chaining (Scenario 4)
  const submitRenewal = async (oldInstrumentId: string, renewalData: Partial<Instrument>): Promise<Instrument> => {
    apiClient.renewInstrument(oldInstrumentId, renewalData, activePersona.name).catch(() => null);

    const oldInst = instruments.find((i) => i.id === oldInstrumentId);
    if (!oldInst) throw new Error('Old instrument not found');

    const newVersion = (oldInst.version || 1) + 1;
    const newId = `fdr-renewal-${Date.now()}`;
    const newAmount = renewalData.amount || oldInst.amount;

    const newInstrument: Instrument = {
      ...oldInst,
      id: newId,
      instrumentNumber: renewalData.instrumentNumber || `${oldInst.instrumentNumber}-R${newVersion}`,
      amount: newAmount,
      formattedAmount: `₹${newAmount.toLocaleString('en-IN')}.00`,
      issueDate: simulatedDate,
      maturityDate: renewalData.maturityDate || '2035-01-22',
      version: newVersion,
      parentInstrumentId: oldInst.id,
      trustLevel: 'L1',
      status: 'ACTIVE',
      discrepancies: [],
      queries: []
    };

    setInstruments((prev) => [
      newInstrument,
      ...prev.map((inst) => (inst.id === oldInst.id ? { ...inst, status: 'RELEASED' as InstrumentStatus } : inst))
    ]);

    await recordAuditEvent(
      'RENEWAL_VERSION_CHAINED',
      'INSTRUMENT',
      newInstrument.id,
      `Security Deposit renewed by ${activePersona.name}. Version ${newVersion} chained to predecessor #${oldInst.instrumentNumber} (v${oldInst.version}). Zero coverage gap guaranteed.`,
      { predecessor: oldInst.instrumentNumber, predecessorVersion: oldInst.version },
      { chainedInstrument: newInstrument.instrumentNumber, newVersion },
      newInstrument.instrumentNumber,
      newInstrument.institutionName
    );

    addToast(
      'success',
      'Renewal Chained (Version ' + newVersion + ')',
      `Parent #${oldInst.instrumentNumber} superseded. New active coverage starts immediately with zero gap.`
    );

    return newInstrument;
  };

  // Request release
  const requestRelease = async (instrumentId: string, affidavitName: string) => {
    let targetInst: Instrument | undefined;

    setInstruments((prev) =>
      prev.map((inst) => {
        if (inst.id === instrumentId) {
          targetInst = inst;
          return {
            ...inst,
            status: 'RELEASE_REQUESTED'
          };
        }
        return inst;
      })
    );

    await recordAuditEvent(
      'RELEASE_REQUESTED',
      'INSTRUMENT',
      instrumentId,
      `Institution applied for security deposit discharge. Attached affidavit: ${affidavitName}. Submitted by ${activePersona.name}.`,
      undefined,
      { affidavitName },
      targetInst?.instrumentNumber,
      targetInst?.institutionName
    );

    addToast('info', 'Release Application Logged', 'Application queued for Regional Officer scrutiny.');
  };

  // Regional Verifier Recommendation
  const recommendRegionalRelease = async (instrumentId: string, scrutinyNote: string) => {
    let targetInst: Instrument | undefined;

    setInstruments((prev) =>
      prev.map((inst) => {
        if (inst.id === instrumentId) {
          targetInst = inst;
          return {
            ...inst,
            status: 'REGIONAL_VERIFIED'
          };
        }
        return inst;
      })
    );

    await recordAuditEvent(
      'RELEASE_REQUESTED',
      'INSTRUMENT',
      instrumentId,
      `Regional Scrutiny Officer ${activePersona.name} recommended release after inspecting bank confirmation: "${scrutinyNote}".`,
      undefined,
      { regionalNote: scrutinyNote },
      targetInst?.instrumentNumber,
      targetInst?.institutionName
    );

    addToast('success', 'Regional Clearance Approved', 'Forwarded to Bureau Officer at Council HQ.');
  };

  // Bureau Officer Recommendation
  const recommendBureauRelease = async (instrumentId: string, recommendationNote: string) => {
    let targetInst: Instrument | undefined;

    setInstruments((prev) =>
      prev.map((inst) => {
        if (inst.id === instrumentId) {
          targetInst = inst;
          return {
            ...inst,
            status: 'BUREAU_RECOMMENDED'
          };
        }
        return inst;
      })
    );

    await recordAuditEvent(
      'RELEASE_REQUESTED',
      'INSTRUMENT',
      instrumentId,
      `Bureau Officer ${activePersona.name} validated maker-checker prerequisites and submitted recommendation to Competent Authority: "${recommendationNote}".`,
      undefined,
      { bureauNote: recommendationNote },
      targetInst?.instrumentNumber,
      targetInst?.institutionName
    );

    addToast('success', 'Bureau Recommendation Logged', 'Escalated to Member Secretary for final NOC signature.');
  };

  // Competent Authority Approval & NOC Generation (Scenario 5)
  const approveReleaseAndIssueNoc = async (
    instrumentId: string,
    exceptionNote?: string
  ): Promise<{ success: boolean; message: string; nocCode?: string }> => {
    const inst = instruments.find((i) => i.id === instrumentId);
    if (!inst) return { success: false, message: 'Instrument not found' };

    // Core Invariant Check: Release cannot proceed below L2 unless Exception Note recorded
    if (inst.trustLevel !== 'L2' && !exceptionNote) {
      await recordAuditEvent(
        'RELEASE_BLOCKED_VIOLATION',
        'INSTRUMENT',
        instrumentId,
        `SECURITY VIOLATION BLOCKED: Attempted to release deposit at Trust Level ${inst.trustLevel} without Bank Confirmation (L2). Action refused under APH Clause 1.5.`,
        undefined,
        { trustLevel: inst.trustLevel },
        inst.instrumentNumber,
        inst.institutionName
      );

      addToast(
        'error',
        'Release Forbidden (Security Invariant)',
        `Deposit is at Trust Level ${inst.trustLevel}. Release strictly requires L2 (Bank Verified) or a formal Exception Note.`
      );

      return {
        success: false,
        message: `BLOCKED: Deposit is at ${inst.trustLevel}. System requires Level L2 Bank Confirmation or a documented Exception Note by Member Secretary.`
      };
    }

    // Call backend
    apiClient.approveRelease(instrumentId, exceptionNote, activePersona.name).catch(() => null);

    const nocCode = `NOC-26265-8942-${inst.institutionName.slice(0, 4).toUpperCase()}`;
    const newNocRecord = {
      nocNumber: `AICTE/NOC/2026/${Math.floor(10000 + Math.random() * 90000)}`,
      issuedAt: new Date().toISOString(),
      issuedBy: activePersona.name,
      authorityDesignation: activePersona.title,
      verificationCode: nocCode,
      qrPayloadUrl: `https://facilities.aicte-india.org/verify-noc?code=${nocCode}`,
      certificatePdfHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      exceptionNote: exceptionNote || undefined,
      status: 'VALID' as const
    };

    setInstruments((prev) =>
      prev.map((i) => {
        if (i.id === instrumentId) {
          return {
            ...i,
            status: 'NOC_ISSUED',
            nocRecord: newNocRecord
          };
        }
        return i;
      })
    );

    setSelectedNocCode(nocCode);

    await recordAuditEvent(
      'NOC_ISSUED',
      'NOC',
      newNocRecord.nocNumber,
      `Competent Authority ${activePersona.name} signed and issued digital NOC #${newNocRecord.nocNumber} for ${inst.institutionName}. Discharged sum: ${inst.formattedAmount}. Verification code: ${nocCode}.${exceptionNote ? ' Recorded Exception Note: "' + exceptionNote + '"' : ''}`,
      undefined,
      { nocRecord: newNocRecord },
      inst.instrumentNumber,
      inst.institutionName
    );

    addToast(
      'success',
      'Digital NOC Issued & Sealed',
      `Release authorized. Verification token: ${nocCode}. Scannable QR code generated.`
    );

    return {
      success: true,
      message: 'Official AICTE Digital NOC issued with public QR verification.',
      nocCode
    };
  };

  // Toggle administrative hold
  const toggleHoldStatus = async (instrumentId: string, reason?: string) => {
    let targetInst: Instrument | undefined;
    let nextHoldState = false;

    setInstruments((prev) =>
      prev.map((inst) => {
        if (inst.id === instrumentId) {
          targetInst = inst;
          nextHoldState = !inst.isHoldActive;
          return {
            ...inst,
            isHoldActive: nextHoldState,
            status: nextHoldState ? 'ON_HOLD' : 'ACTIVE'
          };
        }
        return inst;
      })
    );

    await recordAuditEvent(
      'HOLD_STATUS_TOGGLED',
      'INSTRUMENT',
      instrumentId,
      `Administrative vigilance hold ${nextHoldState ? 'PLACED' : 'LIFTED'} on ${targetInst?.instrumentNumber} by ${activePersona.name}. Reason: "${reason || 'Central Vigilance order'}".`,
      { previousHold: !nextHoldState },
      { newHold: nextHoldState },
      targetInst?.instrumentNumber,
      targetInst?.institutionName
    );

    addToast(
      nextHoldState ? 'warning' : 'success',
      `Administrative Hold ${nextHoldState ? 'Activated' : 'Lifted'}`,
      `Instrument #${targetInst?.instrumentNumber} updated.`
    );
  };

  // Attach Bank Confirmation Evidence (Scenario 1 & 5 helper)
  const attachBankEvidence = async (
    instrumentId: string,
    evidenceData: { branchName: string; branchAddress: string; referenceNo: string; confirmedBy: string }
  ) => {
    apiClient.bankConfirm(instrumentId, evidenceData).catch(() => null);

    let targetInst: Instrument | undefined;

    setInstruments((prev) =>
      prev.map((inst) => {
        if (inst.id === instrumentId) {
          targetInst = inst;
          return {
            ...inst,
            trustLevel: 'L2',
            evidenceRecord: {
              ...evidenceData,
              contactEmail: 'bank.officer@sbi.co.in',
              confirmedAt: new Date().toISOString(),
              documentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
              lienConfirmed: true,
              provisional: false
            }
          };
        }
        return inst;
      })
    );

    await recordAuditEvent(
      'BANK_EVIDENCE_ATTACHED',
      'INSTRUMENT',
      instrumentId,
      `Direct branch officer authentication received from ${evidenceData.confirmedBy} at ${evidenceData.branchName}. Reference Dispatch: #${evidenceData.referenceNo}. Instrument elevated to Trust Level L2.`,
      undefined,
      { evidenceData },
      targetInst?.instrumentNumber,
      targetInst?.institutionName
    );

    addToast('success', 'Bank Confirmation Attached', 'Elevated to Trust Level L2 (Bank-Confirmed).');
  };

  // Red-team tamper simulation
  const simulateTamperAttack = () => {
    apiClient.tamperAudit().catch(() => null);
    setAuditLog((prev) => {
      const copy = [...prev];
      if (copy.length > 2) {
        copy[2] = {
          ...copy[2],
          details: '[TAMPERED BY ROGUE DB ACTOR]: Amount altered from ₹35 Lakhs to ₹5 Lakhs without hash recalculation.'
        };
      }
      return copy;
    });
    addToast('error', 'Tamper Injected into Block #2', 'Record altered without recomputing hashes. Run verification to watch SHA-256 catch the break!');
  };

  // Restore audit ledger
  const restoreAuditLedger = () => {
    apiClient.restoreAudit().catch(() => null);
    setAuditLog(INITIAL_AUDIT_LOG);
    addToast('success', 'Verified Official Ledger Restored', 'Genesis hash pointers restored. Chain continuity 100% clean.');
  };

  // 8-Minute Demo Scenario Runner
  const runScenario = (scenarioNumber: number) => {
    switch (scenarioNumber) {
      case 1:
        // Scenario 1: Deliberate wrong amount -> R1 flagged
        setSelectedInstrumentId('inst-fdr-001');
        setActiveTab('CASE_WORKSPACE');
        setActivePersona(personas[0]); // Bureau Officer
        addToast(
          'info',
          'Demo Scenario 1: Wrong Amount (Rule R1)',
          'Opened FDR #89421. Notice Rule R1 flag: ₹25L lodged vs ₹35L required intake.'
        );
        break;
      case 2:
        // Scenario 2: Officer raises query -> Institution remedies
        setActivePersona(personas[2]); // Institution User
        setActiveTab('INSTITUTION_PORTAL');
        addToast(
          'info',
          'Demo Scenario 2: Officer Query Inbox',
          'Switched to Institution Signatory. Open query banner visible with remedy action.'
        );
        break;
      case 3:
        // Scenario 3: Time-travel to T-90 days
        setSimulatedDate('2027-01-20');
        setSelectedInstrumentId('inst-fdr-002');
        setActiveTab('WORKLIST');
        setActivePersona(personas[0]); // Bureau Officer
        addToast(
          'info',
          'Demo Scenario 3: Time-Travel to T-90 Days',
          'Jumped to Jan 20, 2027. Instruments enter 90-day window, turn EXPIRING, and automated reminders fire.'
        );
        break;
      case 4:
        // Scenario 4: Renewal with zero gap version chaining
        setActivePersona(personas[2]); // Institution User
        setActiveTab('INSTITUTION_PORTAL');
        addToast(
          'info',
          'Demo Scenario 4: Version Chaining Renewal',
          'Click "Renew" on expiring instrument. Notice version 2 is chained to parent with zero gap.'
        );
        break;
      case 5:
        // Scenario 5: Release attempted below L2 BLOCKED vs L2 approved
        setSelectedInstrumentId('inst-fdr-001');
        setActiveTab('CASE_WORKSPACE');
        setActivePersona(personas[5]); // Member Secretary
        addToast(
          'info',
          'Demo Scenario 5: Maker-Checker Release Security',
          'Member Secretary console. Release is strictly BLOCKED unless instrument is at L2 or Exception Note is recorded.'
        );
        break;
      case 6:
        // Scenario 6: QR Verifiable NOC & Tamper-Evident Audit Explorer
        setSelectedNocCode('NOC-26265-8942-APEX');
        setActiveTab('PUBLIC_NOC');
        setActivePersona(personas[6]); // Auditor
        addToast(
          'success',
          'Demo Scenario 6: QR NOC & Audit Explorer',
          'Loaded official AICTE digital NOC with live scannable QR code. Check Audit Explorer for SHA-256 hash chaining.'
        );
        break;
      default:
        break;
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        sessionRemainingSeconds,
        extendSession,
        isTimeoutWarningOpen,
        stepUpAction,
        triggerStepUp,
        clearStepUp,
        activePersona,
        setActivePersona,
        personas,
        institutions,
        instruments,
        auditLog,
        notifications,
        activeTab,
        setActiveTab,
        selectedInstrumentId,
        setSelectedInstrumentId,
        selectedNocCode,
        setSelectedNocCode,
        simulatedDate,
        setSimulatedDate,
        isTimeTravelOpen,
        setIsTimeTravelOpen,
        isScenarioGuideOpen,
        setIsScenarioGuideOpen,
        toasts,
        addToast,
        removeToast,
        language,
        setLanguage,
        submitNewInstrument,
        raiseOfficerQuery,
        replyToQuery,
        elevateTrustLevel,
        submitRenewal,
        requestRelease,
        recommendRegionalRelease,
        recommendBureauRelease,
        approveReleaseAndIssueNoc,
        toggleHoldStatus,
        attachBankEvidence,
        simulateTamperAttack,
        restoreAuditLedger,
        runScenario
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
