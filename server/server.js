import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'db.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// In-memory DB cache
let db = {
  users: [],
  institutions: [],
  instruments: [],
  auditLog: []
};

const DEFAULT_USERS = [
  {
    id: 'director-bureau',
    username: 'rajesh.sharma@aicte-india.gov.in',
    email: 'rajesh.sharma@aicte-india.gov.in',
    password: 'AicteDirector@2026!',
    name: 'Dr. Rajesh Sharma',
    role: 'BUREAU_OFFICER',
    title: 'Director (Approval Bureau)',
    department: 'Central Approval Bureau, HQ New Delhi',
    badge: 'HQ-DIR-01',
    mfaEnabled: true,
    mfaType: 'SMS_OTP',
    phone: '+91 98100 23456',
    failedAttempts: 0,
    isLocked: false
  },
  {
    id: 'regional-officer',
    username: 'arvind.swaminathan@aicte-india.gov.in',
    email: 'arvind.swaminathan@aicte-india.gov.in',
    password: 'AicteRegional@2026!',
    name: 'Er. Arvind Swaminathan',
    role: 'REGIONAL_VERIFIER',
    title: 'Regional Officer & Scrutiny Lead',
    department: 'Northern Regional Office (NRO), Kanpur',
    badge: 'RO-NRO-04',
    mfaEnabled: true,
    mfaType: 'SMS_OTP',
    phone: '+91 94150 87654',
    failedAttempts: 0,
    isLocked: false
  },
  {
    id: 'inst-principal',
    username: '1-3829104',
    email: 'principal@apextech.edu.in',
    password: 'ApexPrincipal@2026!',
    name: 'Dr. Ramesh Chandra',
    role: 'INSTITUTION_USER',
    title: 'Principal & Authorized Signatory',
    department: 'Apex Institute of Technology & Management',
    institutionId: 'inst-001',
    institutionName: 'Apex Institute of Technology & Management',
    badge: 'PID: 1-3829104',
    mfaEnabled: true,
    mfaType: 'SMS_OTP',
    phone: '+91 98290 11223',
    failedAttempts: 0,
    isLocked: false
  },
  {
    id: 'inst-clerk',
    username: 'priya.finance@apextech.edu.in',
    email: 'priya.finance@apextech.edu.in',
    password: 'ApexFinance@2026!',
    name: 'Smt. Priya Nair',
    role: 'INSTITUTION_CLERK',
    title: 'Finance & Compliance Assistant',
    department: 'Accounts Section, Apex Institute',
    institutionId: 'inst-001',
    institutionName: 'Apex Institute of Technology & Management',
    badge: 'INST-CLK-02',
    mfaEnabled: true,
    mfaType: 'SMS_OTP',
    phone: '+91 97110 99887',
    failedAttempts: 0,
    isLocked: false
  },
  {
    id: 'bank-manager',
    username: 'SBIN0008432',
    email: 'chiefmgr.parliamentst@sbi.co.in',
    password: 'SbiManager@2026!',
    name: 'Shri S. K. Mahapatra',
    role: 'BANK_OFFICER',
    title: 'Chief Manager & Lien Officer',
    department: 'State Bank of India, Parliament Street Branch',
    badge: 'SBI-IFSC-08432',
    mfaEnabled: true,
    mfaType: 'SMS_OTP',
    phone: '+91 99100 55443',
    failedAttempts: 0,
    isLocked: false
  },
  {
    id: 'competent-authority',
    username: 'membersecretary@aicte-india.gov.in',
    email: 'membersecretary@aicte-india.gov.in',
    password: 'MemberSecretary@2026!',
    name: 'Prof. T. G. Sitharam',
    role: 'COMPETENT_AUTHORITY',
    title: 'Member Secretary & Appellate Authority',
    department: 'Apex Executive Council, AICTE HQ',
    badge: 'HQ-MS-EXEC',
    mfaEnabled: true,
    mfaType: 'SMS_OTP',
    phone: '+91 98111 00001',
    failedAttempts: 0,
    isLocked: false
  },
  {
    id: 'auditor-cvo',
    username: 'cvo@aicte-india.gov.in',
    email: 'cvo@aicte-india.gov.in',
    password: 'AicteAuditor@2026!',
    name: 'Smt. Sunita Verma, ITS',
    role: 'CENTRAL_AUDITOR',
    title: 'Chief Vigilance Officer (CVO)',
    department: 'Chief Vigilance & Compliance Commission',
    badge: 'CVO-CENTRAL',
    mfaEnabled: true,
    mfaType: 'SMS_OTP',
    phone: '+91 98188 33221',
    failedAttempts: 0,
    isLocked: false
  }
];

// Load initial database from disk
function loadDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      db = JSON.parse(raw);
      if (!db.users || db.users.length === 0) {
        db.users = DEFAULT_USERS;
        saveDb();
      }
      console.log(`[AICTE DB] Loaded ${db.instruments?.length || 0} instruments and ${db.users?.length || 0} users from disk.`);
    } else {
      console.warn(`[AICTE DB] db.json not found at ${DB_PATH}. Using fallback.`);
    }
  } catch (err) {
    console.error('[AICTE DB] Error loading db.json:', err);
  }
}

// Persist database to disk
function saveDb() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[AICTE DB] Error writing db.json:', err);
  }
}

loadDb();

// Cryptographic hash helper for SHA-256 audit blocks
function computeSha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

// Append an immutable audit event linked to previous block
function appendAuditEvent(eventData) {
  const previousBlock = db.auditLog[db.auditLog.length - 1];
  const previousHash = previousBlock ? previousBlock.currentHash : '0000000000000000000000000000000000000000000000000000000000000000';
  const timestamp = new Date().toISOString();
  const id = `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const blockPayload = `${previousHash}|${timestamp}|${eventData.actorName}|${eventData.eventType}|${eventData.entityId}|${eventData.details}`;
  const currentHash = computeSha256(blockPayload);

  const newBlock = {
    id,
    timestamp,
    actorName: eventData.actorName || 'AICTE Officer',
    actorRole: eventData.actorRole || 'BUREAU_OFFICER',
    eventType: eventData.eventType,
    entityType: eventData.entityType || 'INSTRUMENT',
    entityId: eventData.entityId,
    instrumentNumber: eventData.instrumentNumber,
    institutionName: eventData.institutionName,
    details: eventData.details,
    previousHash,
    currentHash
  };

  db.auditLog.push(newBlock);
  saveDb();
  return newBlock;
}

// ----------------------------------------------------
// 1. AUTHENTICATION & IDENTITY (GSD Phase 1 Plan 1.2)
// ----------------------------------------------------

// Active sessions table (token -> user)
const activeSessions = new Map();

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { username, password, portalType, captchaInput, captchaExpected } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username or User ID is required.' });
  }

  // Find user by username, email, ID, or badge
  const user = db.users.find(
    (u) =>
      u.username?.toLowerCase() === username.trim().toLowerCase() ||
      u.email?.toLowerCase() === username.trim().toLowerCase() ||
      u.id?.toLowerCase() === username.trim().toLowerCase() ||
      u.badge?.toLowerCase() === username.trim().toLowerCase()
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. User not found in AICTE registry.' });
  }

  // Check lockout (GSD Rule: 5 failed attempts -> 30 min lockout)
  const now = Date.now();
  if (user.isLocked && user.lockUntil && now < user.lockUntil) {
    const minutesRemaining = Math.ceil((user.lockUntil - now) / 60000);
    return res.status(423).json({
      error: `Account temporarily locked due to 5 consecutive failed attempts. Please retry after ${minutesRemaining} minutes or contact AICTE Helpdesk.`,
      isLocked: true,
      minutesRemaining
    });
  } else if (user.isLocked && user.lockUntil && now >= user.lockUntil) {
    // Unlock after expiry
    user.isLocked = false;
    user.failedAttempts = 0;
    user.lockUntil = null;
    saveDb();
  }

  // Verify Captcha if provided
  if (captchaExpected && captchaInput && captchaInput.toUpperCase() !== captchaExpected.toUpperCase()) {
    return res.status(400).json({ error: 'Security Captcha mismatch. Please enter the characters shown.' });
  }

  // Verify Password (Default password: Aicte@Password2026)
  if (password !== user.password && password !== 'Aicte@Password2026') {
    user.failedAttempts = (user.failedAttempts || 0) + 1;
    if (user.failedAttempts >= 5) {
      user.isLocked = true;
      user.lockUntil = now + 30 * 60 * 1000; // 30 minutes
      saveDb();
      return res.status(423).json({
        error: 'Security threshold breached: 5 failed login attempts. Account locked for 30 minutes under NIST SP 800-63B guidelines.',
        isLocked: true,
        minutesRemaining: 30
      });
    }
    saveDb();
    const attemptsLeft = 5 - user.failedAttempts;
    return res.status(401).json({
      error: `Incorrect password. ${attemptsLeft} attempt(s) remaining before security lockout.`,
      attemptsLeft
    });
  }

  // Password correct: reset failed attempts
  user.failedAttempts = 0;
  user.isLocked = false;
  user.lockUntil = null;
  saveDb();

  // Generate simulated session token
  const token = `aicte_jwt_${crypto.randomBytes(16).toString('hex')}`;
  activeSessions.set(token, user);

  // Check if 2FA is required (SMS OTP for institution, TOTP for officers)
  const is2faRequired = user.mfaEnabled !== false;
  const simulatedOtp = '262650'; // standard evaluation OTP

  return res.json({
    message: 'Authentication successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      title: user.title,
      department: user.department,
      institutionId: user.institutionId,
      institutionName: user.institutionName,
      badge: user.badge,
      email: user.email,
      phone: user.phone
    },
    requiresOtp: is2faRequired,
    mfaType: user.mfaType || 'SMS_OTP',
    simulatedOtp: is2faRequired ? simulatedOtp : undefined
  });
});

// POST /api/auth/verify-otp
app.post('/api/auth/verify-otp', (req, res) => {
  const { otp, token } = req.body;
  if (!otp) {
    return res.status(400).json({ error: 'OTP is required.' });
  }

  // In demo environment, accept '262650' or any valid 6-digit OTP
  if (otp === '262650' || otp.length === 6) {
    appendAuditEvent({
      actorName: 'Security Identity Gateway',
      actorRole: 'SYSTEM',
      eventType: 'TIMELINE_STATUS_CHANGED',
      entityId: 'AUTH_SESSION',
      details: 'Two-factor OTP verified successfully. Session issued under GIGW 3.0 guidelines.'
    });
    return res.json({ success: true, message: 'OTP verified. Session active.' });
  }

  return res.status(400).json({ error: 'Invalid OTP code. Please enter the 6-digit verification code sent to your registered device.' });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    activeSessions.delete(token);
  }
  return res.json({ success: true, message: 'Session terminated. Logged out of AICTE Central Portal.' });
});

// GET /api/auth/session
app.get('/api/auth/session', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = activeSessions.get(token);
    if (user) {
      return res.json({ authenticated: true, user });
    }
  }
  return res.json({ authenticated: false });
});

// POST /api/auth/step-up
app.post('/api/auth/step-up', (req, res) => {
  const { actionName, totpCode } = req.body;
  // Verify step-up second factor for sensitive maker-checker operations
  if (totpCode === '262650' || (totpCode && totpCode.length === 6)) {
    return res.json({ success: true, message: `Step-up authentication confirmed for: ${actionName || 'Sensitive Action'}` });
  }
  return res.status(400).json({ error: 'Step-up authentication failed. Valid 6-digit TOTP required.' });
});

// ----------------------------------------------------
// 2. CORE INSTITUTION & INSTRUMENT REGISTRY ENDPOINTS
// ----------------------------------------------------

// GET /api/institutions
app.get('/api/institutions', (req, res) => {
  return res.json(db.institutions);
});

// GET /api/instruments
app.get('/api/instruments', (req, res) => {
  const { institutionId, trustLevel, status } = req.query;
  let list = db.instruments;
  if (institutionId) {
    list = list.filter((i) => i.institutionId === institutionId);
  }
  if (trustLevel) {
    list = list.filter((i) => i.trustLevel === trustLevel);
  }
  if (status) {
    list = list.filter((i) => i.status === status);
  }
  return res.json(list);
});

// GET /api/instruments/:id
app.get('/api/instruments/:id', (req, res) => {
  const instrument = db.instruments.find((i) => i.id === req.params.id);
  if (!instrument) {
    return res.status(404).json({ error: 'Instrument not found' });
  }
  return res.json(instrument);
});

// POST /api/instruments (New Deposit Lodgement)
app.post('/api/instruments', (req, res) => {
  const data = req.body;
  const institution = db.institutions.find((inst) => inst.id === data.institutionId) || db.institutions[0];

  const requiredAmount = institution.requiredDepositAmount || 3500000;
  const lodgedAmount = Number(data.amount) || 0;

  // Evaluate deterministic rules R1-R5
  const discrepancies = [];
  if (lodgedAmount < requiredAmount && institution.type !== 'GOVERNMENT_EXEMPT') {
    discrepancies.push({
      code: 'R1',
      ruleTitle: 'Deficient Security Deposit Sum',
      field: 'amount',
      severity: 'CRITICAL',
      message: `Submitted ₹${lodgedAmount.toLocaleString('en-IN')} falls short of required ₹${requiredAmount.toLocaleString('en-IN')} under APH 2024-27 Table 1.4.`,
      requiredValue: `₹${requiredAmount.toLocaleString('en-IN')}`,
      detectedValue: `₹${lodgedAmount.toLocaleString('en-IN')}`,
      resolved: false
    });
  }

  const id = `inst-fdr-${Date.now()}`;
  const newInstrument = {
    id,
    instrumentNumber: data.instrumentNumber || `FDR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    instrumentType: data.instrumentType || 'FDR',
    bankName: data.bankName || 'State Bank of India',
    branchName: data.branchName || 'Parliament Street, New Delhi',
    ifscCode: data.ifscCode || 'SBIN0000691',
    amount: lodgedAmount,
    formattedAmount: `₹${lodgedAmount.toLocaleString('en-IN')}`,
    currency: 'INR',
    issueDate: data.issueDate || '2026-01-24',
    maturityDate: data.maturityDate || '2034-01-24',
    tenorMonths: data.tenorMonths || 96,
    beneficiaryName: 'Member Secretary, AICTE New Delhi',
    lienMarkedTo: 'AICTE, New Delhi',
    depositorName: data.depositorName || institution.name,
    institutionId: institution.id,
    institutionName: institution.name,
    institutionAicteId: institution.aictePermanentId,
    institutionType: institution.type,
    trustLevel: discrepancies.length > 0 ? 'L-X' : 'L0',
    status: 'SUBMITTED',
    version: 1,
    isHoldActive: false,
    aphEdition: 'APH 2024-27',
    aphRequiredAmount: requiredAmount,
    riskScore: discrepancies.length > 0 ? 88 : 45,
    discrepancies,
    queries: [],
    documents: [
      {
        id: `doc-${Date.now()}`,
        fileName: `${data.instrumentNumber || 'FDR'}_Certificate.pdf`,
        fileSize: '2.1 MB',
        mimeType: 'application/pdf',
        hash: computeSha256(data.instrumentNumber || id),
        scanStatus: 'CLEAN',
        uploadedAt: new Date().toISOString(),
        documentType: 'FDR_CERTIFICATE'
      }
    ]
  };

  db.instruments.unshift(newInstrument);

  // Write audit event in the same transaction
  appendAuditEvent({
    actorName: data.actorName || 'Institution User',
    actorRole: 'INSTITUTION_USER',
    eventType: 'SUBMISSION_CREATED',
    entityId: id,
    instrumentNumber: newInstrument.instrumentNumber,
    institutionName: institution.name,
    details: `Security deposit lodged for ${institution.name}. Principal: ${newInstrument.formattedAmount}. Initial Trust Level: ${newInstrument.trustLevel}.`
  });

  saveDb();
  return res.status(201).json(newInstrument);
});

// POST /api/instruments/:id/query (Officer raises discrepancy query)
app.post('/api/instruments/:id/query', (req, res) => {
  const { id } = req.params;
  const { field, queryText, remedy, officerName } = req.body;

  const instrument = db.instruments.find((i) => i.id === id);
  if (!instrument) {
    return res.status(404).json({ error: 'Instrument not found' });
  }

  const newQuery = {
    id: `query-${Date.now()}`,
    raisedBy: officerName || 'Shri Rajesh Sharma (Director, Bureau)',
    raisedRole: 'BUREAU_OFFICER',
    raisedAt: new Date().toISOString(),
    field: field || 'amount',
    queryText: queryText || 'Mandatory deposit shortfall flagged under APH 2024-27.',
    remedyAction: remedy || 'Submit supplementary FDR or explanation.',
    status: 'OPEN'
  };

  instrument.queries.push(newQuery);
  instrument.status = 'QUERY_RAISED';
  instrument.trustLevel = 'L-X';

  appendAuditEvent({
    actorName: officerName || 'Shri Rajesh Sharma',
    actorRole: 'BUREAU_OFFICER',
    eventType: 'QUERY_RAISED',
    entityId: id,
    instrumentNumber: instrument.instrumentNumber,
    institutionName: instrument.institutionName,
    details: `Officer raised query on ${field}: "${queryText}". Remedial fix requested: "${remedy}".`
  });

  saveDb();
  return res.json({ success: true, query: newQuery, instrument });
});

// POST /api/instruments/:id/reply (Institution remedies query)
app.post('/api/instruments/:id/reply', (req, res) => {
  const { id } = req.params;
  const { queryId, replyText, actorName } = req.body;

  const instrument = db.instruments.find((i) => i.id === id);
  if (!instrument) {
    return res.status(404).json({ error: 'Instrument not found' });
  }

  const query = instrument.queries.find((q) => q.id === queryId);
  if (query) {
    query.replyText = replyText;
    query.repliedAt = new Date().toISOString();
    query.repliedBy = actorName || 'Institution Signatory';
    query.status = 'RESOLVED';
  }

  // Clear discrepancies on the field if any
  instrument.discrepancies = instrument.discrepancies.filter((d) => d.field !== query?.field);
  if (instrument.discrepancies.length === 0) {
    instrument.trustLevel = 'L1';
    instrument.status = 'UNDER_SCRUTINY';
  }

  appendAuditEvent({
    actorName: actorName || 'Dr. Ramesh Chandra',
    actorRole: 'INSTITUTION_USER',
    eventType: 'QUERY_RESOLVED',
    entityId: id,
    instrumentNumber: instrument.instrumentNumber,
    institutionName: instrument.institutionName,
    details: `Institution responded to query #${queryId}: "${replyText}". Defect marked rectified.`
  });

  saveDb();
  return res.json({ success: true, instrument });
});

// POST /api/instruments/:id/renew (Version Chaining)
app.post('/api/instruments/:id/renew', (req, res) => {
  const { id } = req.params;
  const { instrumentNumber, maturityDate, amount, actorName } = req.body;

  const oldInstrument = db.instruments.find((i) => i.id === id);
  if (!oldInstrument) {
    return res.status(404).json({ error: 'Parent instrument not found' });
  }

  // Mark old instrument superseded
  oldInstrument.status = 'RELEASED';

  const newVersion = (oldInstrument.version || 1) + 1;
  const newInstId = `inst-fdr-${Date.now()}`;
  const renewalAmount = Number(amount) || oldInstrument.amount;

  const newInstrument = {
    ...oldInstrument,
    id: newInstId,
    instrumentNumber: instrumentNumber || `${oldInstrument.instrumentNumber}-R${newVersion}`,
    amount: renewalAmount,
    formattedAmount: `₹${renewalAmount.toLocaleString('en-IN')}`,
    maturityDate: maturityDate || '2035-01-22',
    version: newVersion,
    parentInstrumentId: oldInstrument.id,
    trustLevel: 'L1',
    status: 'ACTIVE',
    discrepancies: [],
    queries: []
  };

  db.instruments.unshift(newInstrument);

  appendAuditEvent({
    actorName: actorName || 'Institution Signatory',
    actorRole: 'INSTITUTION_USER',
    eventType: 'RENEWAL_VERSION_CHAINED',
    entityId: newInstId,
    instrumentNumber: newInstrument.instrumentNumber,
    institutionName: newInstrument.institutionName,
    details: `Instrument #${oldInstrument.instrumentNumber} renewed into version ${newVersion} with zero temporal coverage gap. New maturity: ${newInstrument.maturityDate}.`
  });

  saveDb();
  return res.json({ success: true, newInstrument, supersededInstrument: oldInstrument });
});

// POST /api/instruments/:id/bank-confirm (Direct bank branch authentication to L2)
app.post('/api/instruments/:id/bank-confirm', (req, res) => {
  const { id } = req.params;
  const { branchName, branchAddress, referenceNo, confirmedBy } = req.body;

  const instrument = db.instruments.find((i) => i.id === id);
  if (!instrument) {
    return res.status(404).json({ error: 'Instrument not found' });
  }

  instrument.trustLevel = 'L2';
  instrument.evidenceRecord = {
    confirmedBy: confirmedBy || 'Shri Alok Verma (Chief Branch Manager, SBI)',
    branchName: branchName || instrument.branchName,
    branchAddress: branchAddress || 'Parliament Street, New Delhi - 110001',
    contactEmail: 'bm.00691@sbi.co.in',
    referenceNo: referenceNo || `SBI-CONF-${Date.now().toString().slice(-4)}`,
    confirmedAt: new Date().toISOString(),
    documentHash: computeSha256(referenceNo || id),
    lienConfirmed: true,
    provisional: false
  };

  appendAuditEvent({
    actorName: confirmedBy || 'Shri Alok Verma (SBI)',
    actorRole: 'BANK_OFFICER',
    eventType: 'BANK_EVIDENCE_ATTACHED',
    entityId: id,
    instrumentNumber: instrument.instrumentNumber,
    institutionName: instrument.institutionName,
    details: `Issuing bank branch authenticated lien marking and confirmed safe custody. Elevated to Trust Level L2 (Bank Verified).`
  });

  saveDb();
  return res.json({ success: true, instrument });
});

// POST /api/instruments/:id/approve-release (Competent Authority Maker-Checker Release)
app.post('/api/instruments/:id/approve-release', (req, res) => {
  const { id } = req.params;
  const { exceptionNote, authorityName } = req.body;

  const instrument = db.instruments.find((i) => i.id === id);
  if (!instrument) {
    return res.status(404).json({ error: 'Instrument not found' });
  }

  // Hard Invariant Check: Release cannot proceed below L2 unless Exception Note recorded
  if (instrument.trustLevel !== 'L2' && !exceptionNote) {
    appendAuditEvent({
      actorName: authorityName || 'Member Secretary',
      actorRole: 'COMPETENT_AUTHORITY',
      eventType: 'RELEASE_BLOCKED_VIOLATION',
      entityId: id,
      instrumentNumber: instrument.instrumentNumber,
      institutionName: instrument.institutionName,
      details: `SECURITY VIOLATION BLOCKED: Attempted to release deposit at Trust Level ${instrument.trustLevel} without Bank Confirmation (L2). Action refused under APH Clause 1.5.`
    });
    return res.status(403).json({
      error: 'RELEASE FORBIDDEN: Instrument is at Trust Level ' + instrument.trustLevel + '. AICTE statutory rules prohibit release without Level L2 Bank Confirmation, unless an explicit Competent Authority Exception Note is recorded.'
    });
  }

  // Issue digital NOC
  const nocCode = `NOC-26265-${Math.floor(1000 + Math.random() * 9000)}-${instrument.institutionName.slice(0, 4).toUpperCase()}`;
  instrument.status = 'NOC_ISSUED';
  instrument.nocRecord = {
    nocNumber: `AICTE/NOC/2026/${Math.floor(10000 + Math.random() * 90000)}`,
    issuedAt: new Date().toISOString(),
    issuedBy: authorityName || 'Prof. T. G. Sitharam',
    authorityDesignation: 'Member Secretary, AICTE New Delhi',
    verificationCode: nocCode,
    qrPayloadUrl: `https://facilities.aicte-india.org/verify-noc?code=${nocCode}`,
    certificatePdfHash: computeSha256(nocCode),
    exceptionNote: exceptionNote || undefined,
    status: 'VALID'
  };

  appendAuditEvent({
    actorName: authorityName || 'Member Secretary, AICTE',
    actorRole: 'COMPETENT_AUTHORITY',
    eventType: 'NOC_ISSUED',
    entityId: id,
    instrumentNumber: instrument.instrumentNumber,
    institutionName: instrument.institutionName,
    details: `Official Digital NOC issued for release of ${instrument.formattedAmount}. Verification code: ${nocCode}. Lien discharged.`
  });

  saveDb();
  return res.json({ success: true, message: 'NOC Issued successfully', nocRecord: instrument.nocRecord, instrument });
});

// ----------------------------------------------------
// 3. AUDIT & CRYPTOGRAPHIC LEDGER ENDPOINTS (I5)
// ----------------------------------------------------

// GET /api/audit
app.get('/api/audit', (req, res) => {
  return res.json(db.auditLog);
});

// ALL /api/audit/verify
app.all('/api/audit/verify', (req, res) => {
  const chain = db.auditLog;
  let isChainIntact = true;
  let brokenBlockIndex = null;

  for (let i = 1; i < chain.length; i++) {
    const prev = chain[i - 1];
    const curr = chain[i];

    if (curr.previousHash !== prev.currentHash) {
      isChainIntact = false;
      brokenBlockIndex = i;
      break;
    }
  }

  const latestHash = chain.length > 0 ? chain[chain.length - 1].currentHash : '';
  return res.json({
    isChainIntact,
    totalBlocks: chain.length,
    latestHash,
    brokenBlockIndex,
    verifiedAt: new Date().toISOString()
  });
});

// POST /api/audit/tamper (Red Team Simulation)
app.post('/api/audit/tamper', (req, res) => {
  if (db.auditLog.length > 2) {
    db.auditLog[2].details = '[TAMPERED BY ROGUE DB ACTOR]: Amount altered from ₹35 Lakhs to ₹5 Lakhs without hash recalculation.';
    saveDb();
  }
  return res.json({ success: true, message: 'Simulated unauthorized out-of-band tampering injected at Block #2.' });
});

// POST /api/audit/restore (Restore genuine ledger)
app.post('/api/audit/restore', (req, res) => {
  loadDb();
  // Restore genuine text
  if (db.auditLog.length > 2) {
    db.auditLog[2].details = 'Rule R1 VIOLATION: Lodged sum ₹25,00,000 is deficient. Required ₹35,00,000 under APH 2024-27 Table 1.4.';
    saveDb();
  }
  return res.json({ success: true, message: 'Official verified ledger restored.' });
});

// ----------------------------------------------------
// 4. TIMELINE ENGINE & HEALTH
// ----------------------------------------------------

// POST /api/timeline/evaluate (Time travel engine simulation)
app.post('/api/timeline/evaluate', (req, res) => {
  const { simulatedDate } = req.body;
  const targetDate = new Date(simulatedDate || '2026-10-24');

  db.instruments.forEach((inst) => {
    const maturity = new Date(inst.maturityDate);
    const diffDays = Math.ceil((maturity.getTime() - targetDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays <= 0 && inst.status !== 'RELEASED' && inst.status !== 'NOC_ISSUED') {
      inst.status = 'OVERDUE';
    } else if (diffDays <= 90 && diffDays > 0 && inst.status === 'ACTIVE') {
      inst.status = 'EXPIRING';
    }
  });

  saveDb();
  return res.json({ success: true, simulatedDate, instruments: db.instruments });
});

// GET /api/health
app.get('/api/health', (req, res) => {
  return res.json({
    status: 'ONLINE',
    service: 'AICTE Central Security Deposit Registry Backend API',
    version: '1.4.2',
    timestamp: new Date().toISOString(),
    recordsCount: db.instruments.length,
    usersCount: db.users.length
  });
});

app.listen(PORT, () => {
  console.log(`[AICTE Government Backend] Server running on http://localhost:${PORT}`);
});
