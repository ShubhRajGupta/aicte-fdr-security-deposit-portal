export type TrustLevel = 'L0' | 'L1' | 'L2' | 'L-X';

export type InstrumentStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_SCRUTINY'
  | 'QUERY_RAISED'
  | 'ACTIVE'
  | 'EXPIRING'
  | 'RENEWAL_PENDING'
  | 'MATURED'
  | 'RELEASE_REQUESTED'
  | 'REGIONAL_VERIFIED'
  | 'BUREAU_RECOMMENDED'
  | 'RELEASE_APPROVED'
  | 'NOC_ISSUED'
  | 'RELEASED'
  | 'ON_HOLD'
  | 'OVERDUE'
  | 'REJECTED';

export type DiscrepancyRuleCode =
  | 'R1'
  | 'R2'
  | 'R3'
  | 'R4'
  | 'R5'
  | 'R6'
  | 'R7'
  | 'R8'
  | 'R9'
  | 'R10';

export interface Discrepancy {
  code: DiscrepancyRuleCode;
  ruleTitle: string;
  field: string;
  severity: 'CRITICAL' | 'WARNING';
  message: string;
  requiredValue: string;
  detectedValue: string;
  resolved: boolean;
}

export interface DocumentAttachment {
  id: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  hash: string;
  scanStatus: 'CLEAN' | 'QUEUED' | 'SCANNING';
  uploadedAt: string;
  documentType: 'FDR_CERTIFICATE' | 'BANK_AFFIDAVIT' | 'BOARD_RESOLUTION' | 'BANK_CONFIRMATION_LETTER';
  ocrExtractedText?: string;
  ocrConfidence?: number;
}

export interface OfficerQuery {
  id: string;
  raisedBy: string;
  raisedRole: string;
  raisedAt: string;
  field: string;
  queryText: string;
  remedyAction: string;
  replyText?: string;
  repliedAt?: string;
  repliedBy?: string;
  status: 'OPEN' | 'RESOLVED';
}

export interface RiskBreakdown {
  urgency: number; // Days to maturity (steeper inside 30 days)
  amountBand: number; // High value gets more weight
  discrepancySeverity: number; // R1-R10 active weight
  bankWaitTime: number; // Days waiting on bank confirmation
  caseAge: number; // Days since submission
  total: number;
}

export interface BankEvidenceRecord {
  confirmedBy: string;
  branchName: string;
  branchAddress: string;
  contactEmail: string;
  referenceNo: string;
  confirmedAt: string;
  documentHash: string;
  lienConfirmed: boolean;
  provisional: boolean;
}

export interface NocRecord {
  nocNumber: string;
  issuedAt: string;
  issuedBy: string;
  authorityDesignation: string;
  verificationCode: string;
  qrPayloadUrl: string;
  exceptionNote?: string;
  certificatePdfHash: string;
  status: 'VALID' | 'REVOKED';
}

export interface Instrument {
  id: string;
  instrumentNumber: string;
  instrumentType: 'FDR' | 'BANK_GUARANTEE' | 'ONLINE_RTGS';
  bankName: string;
  branchName: string;
  ifscCode: string;
  amount: number; // exact numeric
  formattedAmount: string;
  currency: string;
  issueDate: string; // YYYY-MM-DD
  maturityDate: string; // YYYY-MM-DD
  tenorMonths: number;
  beneficiaryName: string; // Expected: "Member Secretary, AICTE"
  lienMarkedTo: string; // Expected: "AICTE, New Delhi"
  depositorName: string;
  
  institutionId: string;
  institutionName: string;
  institutionAicteId: string;
  institutionType: 'PRIVATE' | 'GOVERNMENT_EXEMPT' | 'MERGER_PENDING';
  region: string;
  aphEdition: string;
  aphRequiredAmount: number;
  
  trustLevel: TrustLevel;
  status: InstrumentStatus;
  version: number;
  parentInstrumentId?: string;
  supersededBy?: string;
  
  discrepancies: Discrepancy[];
  riskBreakdown: RiskBreakdown;
  riskScore: number;
  
  documents: DocumentAttachment[];
  queries: OfficerQuery[];
  
  holdReason?: string;
  isHoldActive?: boolean;
  
  evidenceRecord?: BankEvidenceRecord;
  nocRecord?: NocRecord;
  
  assignedOfficer?: string;
  submittedAt: string;
  lastUpdatedAt: string;
}

export interface Institution {
  id: string;
  aictePermanentId: string;
  name: string;
  state: string;
  region: string;
  type: 'PRIVATE' | 'GOVERNMENT_EXEMPT' | 'MERGER_PENDING';
  establishedYear: number;
  approvedIntake: number;
  programType: string;
  requiredDepositAmount: number;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

export type PersonaRole =
  | 'INSTITUTION_USER'
  | 'INSTITUTION_CLERK'
  | 'REGIONAL_VERIFIER'
  | 'BUREAU_OFFICER'
  | 'COMPETENT_AUTHORITY'
  | 'BANK_OFFICER'
  | 'CENTRAL_AUDITOR';

export interface UserPersona {
  id: string;
  name: string;
  role: PersonaRole;
  title: string;
  department: string;
  badge: string;
  institutionId?: string;
  institutionName?: string;
  email?: string;
  phone?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string; // ISO
  actorName: string;
  actorRole: string;
  eventType:
    | 'SUBMISSION_CREATED'
    | 'DISCREPANCY_FLAGGED'
    | 'QUERY_RAISED'
    | 'QUERY_RESOLVED'
    | 'TRUST_LEVEL_UPDATED'
    | 'TIMELINE_STATUS_CHANGED'
    | 'RENEWAL_VERSION_CHAINED'
    | 'RELEASE_REQUESTED'
    | 'RELEASE_BLOCKED_VIOLATION'
    | 'COMPETENT_AUTHORITY_EXCEPTION'
    | 'NOC_ISSUED'
    | 'BANK_EVIDENCE_ATTACHED'
    | 'HOLD_STATUS_TOGGLED'
    | 'TAMPER_CHECK_EXECUTED';
  entityType: 'INSTRUMENT' | 'QUERY' | 'NOC' | 'AUDIT_CHAIN';
  entityId: string;
  instrumentNumber?: string;
  institutionName?: string;
  details: string;
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;
  previousHash: string;
  currentHash: string;
}

export interface NotificationAlert {
  id: string;
  channel: 'SMS' | 'EMAIL' | 'IN_APP';
  recipient: string;
  recipientRole: string;
  subject: string;
  message: string;
  timestamp: string;
  triggerEvent: string;
  isRead: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'URGENT';
}

export type ActiveTab =
  | 'DASHBOARD'
  | 'WORKLIST'
  | 'CASE_WORKSPACE'
  | 'INSTITUTION_PORTAL'
  | 'NEW_SUBMISSION'
  | 'AUDIT_EXPLORER'
  | 'PUBLIC_NOC'
  | 'BANK_CONFIRM'
  | 'RULE_SANDBOX'
  | 'API_EXPLORER'
  | 'REPORTS'
  | 'ROI_SLIDES'
  | 'LOGIN_DEMO';

export type AppLanguage = 'EN' | 'HI';

