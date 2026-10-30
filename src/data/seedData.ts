import { Institution, Instrument, UserPersona } from '../types';

export const SEED_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-001',
    aictePermanentId: '1-3829104',
    name: 'Apex Institute of Technology & Management',
    state: 'Uttar Pradesh',
    region: 'Northern',
    type: 'PRIVATE',
    establishedYear: 2021,
    approvedIntake: 420,
    programType: 'Engineering & Technology (UG/PG)',
    requiredDepositAmount: 3500000, // ₹35 Lakhs per APH Table 1.4
    contactPerson: 'Dr. Rajesh Sharma (Director)',
    contactEmail: 'director@apextech.edu.in',
    contactPhone: '+91 98112 45890'
  },
  {
    id: 'inst-002',
    aictePermanentId: '1-5092183',
    name: 'Vanguard Polytechnic Institute',
    state: 'Maharashtra',
    region: 'Western',
    type: 'PRIVATE',
    establishedYear: 2023,
    approvedIntake: 240,
    programType: 'Applied Arts & Crafts / Diploma',
    requiredDepositAmount: 1500000, // ₹15 Lakhs per APH
    contactPerson: 'Prof. Anjali Deshmukh (Principal)',
    contactEmail: 'principal@vanguardpoly.ac.in',
    contactPhone: '+91 94220 88123'
  },
  {
    id: 'inst-003',
    aictePermanentId: '1-7489201',
    name: 'Kalinga Institute of Pharmacy & Research',
    state: 'Odisha',
    region: 'Eastern',
    type: 'PRIVATE',
    establishedYear: 2019,
    approvedIntake: 180,
    programType: 'Pharmacy (B.Pharm / M.Pharm)',
    requiredDepositAmount: 2500000, // ₹25 Lakhs
    contactPerson: 'Dr. Debabrata Jena',
    contactEmail: 'head@kalingapharmacy.edu.in',
    contactPhone: '+91 97761 30492'
  },
  {
    id: 'inst-004',
    aictePermanentId: '1-1029485',
    name: 'Government Engineering College, Raipur',
    state: 'Chhattisgarh',
    region: 'Central',
    type: 'GOVERNMENT_EXEMPT',
    establishedYear: 2008,
    approvedIntake: 600,
    programType: 'Engineering & Technology',
    requiredDepositAmount: 0, // Govt institutions exempt
    contactPerson: 'Er. Sandeep Baghel (Principal)',
    contactEmail: 'principal@gecraipur.gov.in',
    contactPhone: '+91 771 297012'
  },
  {
    id: 'inst-005',
    aictePermanentId: '1-8930192',
    name: 'Meridian Business Academy (Amalgamating)',
    state: 'Karnataka',
    region: 'South-Western',
    type: 'MERGER_PENDING',
    establishedYear: 2018,
    approvedIntake: 120,
    programType: 'Management (MBA/PGDM)',
    requiredDepositAmount: 1500000,
    contactPerson: 'Mr. Arvind Swamy (Trustee)',
    contactEmail: 'trustee@meridianedu.org',
    contactPhone: '+91 80 4123 9981'
  }
];

export const SEED_PERSONAS: UserPersona[] = [
  {
    id: 'user-bureau',
    name: 'Dr. Vikram Seth',
    role: 'BUREAU_OFFICER',
    title: 'Adviser-I / Director',
    department: 'AICTE Regulation Bureau, New Delhi HQ',
    badge: 'HQ Officer'
  },
  {
    id: 'user-institution',
    name: 'Dr. Rajesh Sharma',
    role: 'INSTITUTION_USER',
    title: 'Director & Authorized Signatory',
    department: 'Apex Institute of Technology & Management',
    badge: 'Institution Signatory (1-3829104)',
    institutionId: 'inst-001',
    institutionName: 'Apex Institute of Technology & Management'
  },
  {
    id: 'user-clerk',
    name: 'Shri Mohit Verma',
    role: 'INSTITUTION_CLERK',
    title: 'Senior Accounts Clerk & Data Entry Operator',
    department: 'Apex Institute of Technology & Management (Registry)',
    badge: 'Institution Clerk (Drafts)',
    institutionId: 'inst-001',
    institutionName: 'Apex Institute of Technology & Management'
  },
  {
    id: 'user-regional',
    name: 'Smt. Sunita Rao',
    role: 'REGIONAL_VERIFIER',
    title: 'Regional Officer & Scrutiny Lead',
    department: 'AICTE Northern Regional Office (NRO), Kanpur',
    badge: 'Regional Verifier'
  },
  {
    id: 'user-competent',
    name: 'Prof. Rajive Kumar',
    role: 'COMPETENT_AUTHORITY',
    title: 'Member Secretary',
    department: 'Executive Approval Authority, AICTE Council',
    badge: 'Competent Authority'
  },
  {
    id: 'user-bank',
    name: 'Shri Alok Verma',
    role: 'BANK_OFFICER',
    title: 'Chief Branch Manager',
    department: 'State Bank of India (CP Parliament Street Branch, New Delhi)',
    badge: 'Bank Verifier'
  },
  {
    id: 'user-auditor',
    name: 'Shri K. Ramanathan',
    role: 'CENTRAL_AUDITOR',
    title: 'Senior Auditor (Empanelled CERT-In / CAG)',
    department: 'Public Verification & Audit Panel',
    badge: 'Independent Auditor'
  }
];

export const SEED_INSTRUMENTS: Instrument[] = [
  // 1. Scenario 1 Target: New submission with deliberate wrong amount (R1)
  {
    id: 'fdr-001-r1',
    instrumentNumber: 'FDR/SBI/2026/89421',
    instrumentType: 'FDR',
    bankName: 'State Bank of India',
    branchName: 'Noida Sector 62 Branch',
    ifscCode: 'SBIN0008432',
    amount: 2500000, // Submitted 25L, but APH 2024-27 requires 35L
    formattedAmount: '₹25,00,000.00',
    currency: 'INR',
    issueDate: '2026-08-10',
    maturityDate: '2034-08-10',
    tenorMonths: 96,
    beneficiaryName: 'Member Secretary, AICTE New Delhi',
    lienMarkedTo: 'AICTE, New Delhi',
    depositorName: 'Apex Institute of Technology & Management',
    institutionId: 'inst-001',
    institutionName: 'Apex Institute of Technology & Management',
    institutionAicteId: '1-3829104',
    institutionType: 'PRIVATE',
    region: 'Northern',
    aphEdition: 'APH 2024-27',
    aphRequiredAmount: 3500000,
    trustLevel: 'L-X',
    status: 'QUERY_RAISED',
    version: 1,
    discrepancies: [
      {
        code: 'R1',
        ruleTitle: 'Required Security Deposit Amount Mismatch',
        field: 'amount',
        severity: 'CRITICAL',
        message: 'Deposited amount ₹25,00,000 is less than prescribed ₹35,00,000 under APH 2024-27 Table 1.4 for Engineering (UG).',
        requiredValue: '₹35,00,000.00',
        detectedValue: '₹25,00,000.00',
        resolved: false
      }
    ],
    riskBreakdown: {
      urgency: 15,
      amountBand: 30,
      discrepancySeverity: 40,
      bankWaitTime: 5,
      caseAge: 12,
      total: 102
    },
    riskScore: 102,
    documents: [
      {
        id: 'doc-001',
        fileName: 'SBI_Fixed_Deposit_Receipt_89421.pdf',
        fileSize: '2.4 MB',
        mimeType: 'application/pdf',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        scanStatus: 'CLEAN',
        uploadedAt: '2026-08-11T10:15:00Z',
        documentType: 'FDR_CERTIFICATE',
        ocrExtractedText: 'STATE BANK OF INDIA - TERM DEPOSIT RECEIPT NO: 89421 | PRINCIPAL: RS 25,00,000/- | LIEN MARKED: AICTE NEW DELHI | MATURITY: 10-AUG-2034',
        ocrConfidence: 97.4
      },
      {
        id: 'doc-002',
        fileName: 'Institution_Security_Affidavit.pdf',
        fileSize: '1.1 MB',
        mimeType: 'application/pdf',
        hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        scanStatus: 'CLEAN',
        uploadedAt: '2026-08-11T10:17:00Z',
        documentType: 'BANK_AFFIDAVIT'
      }
    ],
    queries: [
      {
        id: 'qry-101',
        raisedBy: 'Dr. Vikram Seth (Adviser, AICTE)',
        raisedRole: 'BUREAU_OFFICER',
        raisedAt: '2026-08-14T14:30:00Z',
        field: 'amount',
        queryText: 'Discrepancy R1: As per APH 2024-27 Clause 1.4, the mandatory security deposit for Technical UG is ₹35,00,000. The uploaded FDR shows ₹25,00,000 (shortfall of ₹10,00,000).',
        remedyAction: 'Submit supplementary FDR of ₹10,00,000 or amend instrument to ₹35,00,000 with lien marking.',
        status: 'OPEN'
      }
    ],
    submittedAt: '2026-08-11T10:20:00Z',
    lastUpdatedAt: '2026-08-14T14:30:00Z'
  },

  // 2. Scenario 2: Duplicate FDR Number Check (R4)
  {
    id: 'fdr-002-r4',
    instrumentNumber: 'FDR/PNB/2025/11029',
    instrumentType: 'FDR',
    bankName: 'Punjab National Bank',
    branchName: 'Andheri East, Mumbai',
    ifscCode: 'PUNB0014200',
    amount: 1500000,
    formattedAmount: '₹15,00,000.00',
    currency: 'INR',
    issueDate: '2025-06-15',
    maturityDate: '2033-06-15',
    tenorMonths: 96,
    beneficiaryName: 'Member Secretary, AICTE New Delhi',
    lienMarkedTo: 'AICTE, New Delhi',
    depositorName: 'Vanguard Polytechnic Institute',
    institutionId: 'inst-002',
    institutionName: 'Vanguard Polytechnic Institute',
    institutionAicteId: '1-5092183',
    institutionType: 'PRIVATE',
    region: 'Western',
    aphEdition: 'APH 2024-27',
    aphRequiredAmount: 1500000,
    trustLevel: 'L-X',
    status: 'UNDER_SCRUTINY',
    version: 1,
    discrepancies: [
      {
        code: 'R4',
        ruleTitle: 'Duplicate Instrument Number in Central Registry',
        field: 'instrumentNumber',
        severity: 'CRITICAL',
        message: 'Instrument number FDR/PNB/2025/11029 is already registered in registry under St. Xavier Trust (ID: 1-1928371).',
        requiredValue: 'Unique FDR Certificate across all AICTE institutes',
        detectedValue: 'Duplicate detected in Western Region database',
        resolved: false
      }
    ],
    riskBreakdown: {
      urgency: 10,
      amountBand: 20,
      discrepancySeverity: 50,
      bankWaitTime: 10,
      caseAge: 18,
      total: 108
    },
    riskScore: 108,
    documents: [
      {
        id: 'doc-003',
        fileName: 'PNB_FDR_Scan_11029.pdf',
        fileSize: '3.1 MB',
        mimeType: 'application/pdf',
        hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
        scanStatus: 'CLEAN',
        uploadedAt: '2026-09-01T11:00:00Z',
        documentType: 'FDR_CERTIFICATE',
        ocrExtractedText: 'PUNJAB NATIONAL BANK | RECEIPT NO: 11029 | RS 15,00,000/-',
        ocrConfidence: 94.2
      }
    ],
    queries: [],
    submittedAt: '2026-09-01T11:30:00Z',
    lastUpdatedAt: '2026-09-02T09:15:00Z'
  },

  // 3. Scenario 3 Target: Approaching Maturity in 90 Days (T-90)
  // Maturity date set to 2027-01-20 (approaching within 90 days when simulated date is 2026-10-24 or near Jan 2027)
  {
    id: 'fdr-003-t90',
    instrumentNumber: 'FDR/BOB/2019/44018',
    instrumentType: 'FDR',
    bankName: 'Bank of Baroda',
    branchName: 'Saheed Nagar, Bhubaneswar',
    ifscCode: 'BARB0SAHBIS',
    amount: 2500000,
    formattedAmount: '₹25,00,000.00',
    currency: 'INR',
    issueDate: '2019-01-22',
    maturityDate: '2027-01-22', // 90 days from Oct 24, 2026
    tenorMonths: 96,
    beneficiaryName: 'Member Secretary, AICTE New Delhi',
    lienMarkedTo: 'AICTE, New Delhi',
    depositorName: 'Kalinga Institute of Pharmacy & Research',
    institutionId: 'inst-003',
    institutionName: 'Kalinga Institute of Pharmacy & Research',
    institutionAicteId: '1-7489201',
    institutionType: 'PRIVATE',
    region: 'Eastern',
    aphEdition: 'APH 2018-19',
    aphRequiredAmount: 2500000,
    trustLevel: 'L1',
    status: 'EXPIRING',
    version: 1,
    discrepancies: [],
    riskBreakdown: {
      urgency: 45, // High urgency because <90 days to maturity
      amountBand: 25,
      discrepancySeverity: 0,
      bankWaitTime: 0,
      caseAge: 5,
      total: 75
    },
    riskScore: 75,
    documents: [
      {
        id: 'doc-004',
        fileName: 'BOB_Fixed_Deposit_44018.pdf',
        fileSize: '1.8 MB',
        mimeType: 'application/pdf',
        hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        scanStatus: 'CLEAN',
        uploadedAt: '2019-01-25T10:00:00Z',
        documentType: 'FDR_CERTIFICATE',
        ocrExtractedText: 'BANK OF BARODA | FDR NO 44018 | MATURITY 22-JAN-2027 | AICTE LIEN NOTED',
        ocrConfidence: 98.1
      }
    ],
    queries: [],
    submittedAt: '2019-01-25T10:00:00Z',
    lastUpdatedAt: '2026-10-24T00:00:00Z'
  },

  // 4. Overdue Instrument (Maturity past, no renewal submitted)
  {
    id: 'fdr-004-overdue',
    instrumentNumber: 'FDR/CAN/2016/90214',
    instrumentType: 'FDR',
    bankName: 'Canara Bank',
    branchName: 'Malleshwaram, Bangalore',
    ifscCode: 'CNRB0000404',
    amount: 1500000,
    formattedAmount: '₹15,00,000.00',
    currency: 'INR',
    issueDate: '2016-08-15',
    maturityDate: '2026-08-15', // Past date! Overdue
    tenorMonths: 120,
    beneficiaryName: 'Member Secretary, AICTE New Delhi',
    lienMarkedTo: 'AICTE, New Delhi',
    depositorName: 'Meridian Business Academy (Amalgamating)',
    institutionId: 'inst-005',
    institutionName: 'Meridian Business Academy (Amalgamating)',
    institutionAicteId: '1-8930192',
    institutionType: 'MERGER_PENDING',
    region: 'South-Western',
    aphEdition: 'APH 2016-17',
    aphRequiredAmount: 1500000,
    trustLevel: 'L1',
    status: 'OVERDUE',
    version: 1,
    discrepancies: [
      {
        code: 'R7',
        ruleTitle: 'Instrument Maturity Expired Without Renewal',
        field: 'maturityDate',
        severity: 'CRITICAL',
        message: 'Maturity date 15-Aug-2026 has passed without renewal submission. Institution security deposit cover has lapsed.',
        requiredValue: 'Active valid tenor (minimum 3 years validity)',
        detectedValue: 'Lapsed 70 days ago',
        resolved: false
      }
    ],
    riskBreakdown: {
      urgency: 50, // Maximum overdue penalty
      amountBand: 20,
      discrepancySeverity: 30,
      bankWaitTime: 10,
      caseAge: 70,
      total: 180
    },
    riskScore: 180,
    documents: [
      {
        id: 'doc-005',
        fileName: 'Canara_Deposit_Receipt_90214.pdf',
        fileSize: '2.0 MB',
        mimeType: 'application/pdf',
        hash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
        scanStatus: 'CLEAN',
        uploadedAt: '2016-08-20T10:00:00Z',
        documentType: 'FDR_CERTIFICATE'
      }
    ],
    queries: [],
    submittedAt: '2016-08-20T10:00:00Z',
    lastUpdatedAt: '2026-08-16T00:00:00Z'
  },

  // 5. Scenario 5 Target: L2 Bank-Confirmed Instrument ready for Release
  {
    id: 'fdr-005-l2-release',
    instrumentNumber: 'FDR/HDFC/2016/77881',
    instrumentType: 'FDR',
    bankName: 'HDFC Bank Ltd',
    branchName: 'Barakhamba Road, New Delhi',
    ifscCode: 'HDFC0000003',
    amount: 3500000,
    formattedAmount: '₹35,00,000.00',
    currency: 'INR',
    issueDate: '2016-10-01',
    maturityDate: '2026-10-01', // Completed 10-year lock-in!
    tenorMonths: 120,
    beneficiaryName: 'Member Secretary, AICTE New Delhi',
    lienMarkedTo: 'AICTE, New Delhi',
    depositorName: 'Apex Institute of Technology & Management',
    institutionId: 'inst-001',
    institutionName: 'Apex Institute of Technology & Management',
    institutionAicteId: '1-3829104',
    institutionType: 'PRIVATE',
    region: 'Northern',
    aphEdition: 'APH 2016-17',
    aphRequiredAmount: 3500000,
    trustLevel: 'L2', // Bank Confirmed!
    status: 'RELEASE_REQUESTED',
    version: 1,
    discrepancies: [],
    riskBreakdown: {
      urgency: 20,
      amountBand: 30,
      discrepancySeverity: 0,
      bankWaitTime: 0,
      caseAge: 15,
      total: 65
    },
    riskScore: 65,
    evidenceRecord: {
      confirmedBy: 'Shri Alok Verma (Chief Manager, HDFC Bank / SBI Pool)',
      branchName: 'Barakhamba Road, New Delhi',
      branchAddress: '15, Barakhamba Road, Connaught Place, New Delhi - 110001',
      contactEmail: 'cp.branch@hdfcbank.com',
      referenceNo: 'HDFC-CONF-2026-9921',
      confirmedAt: '2026-10-15T11:45:00Z',
      documentHash: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
      lienConfirmed: true,
      provisional: false
    },
    documents: [
      {
        id: 'doc-006',
        fileName: 'HDFC_Fixed_Deposit_77881.pdf',
        fileSize: '3.4 MB',
        mimeType: 'application/pdf',
        hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        scanStatus: 'CLEAN',
        uploadedAt: '2016-10-05T09:00:00Z',
        documentType: 'FDR_CERTIFICATE',
        ocrExtractedText: 'HDFC BANK | FDR NO 77881 | PRINCIPAL RS 35,00,000 | BENEFICIARY: MEMBER SECRETARY AICTE',
        ocrConfidence: 99.2
      },
      {
        id: 'doc-007',
        fileName: 'Bank_Lien_Confirmation_Letter.pdf',
        fileSize: '1.5 MB',
        mimeType: 'application/pdf',
        hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        scanStatus: 'CLEAN',
        uploadedAt: '2026-10-15T11:45:00Z',
        documentType: 'BANK_CONFIRMATION_LETTER'
      },
      {
        id: 'doc-008',
        fileName: 'Release_Request_Affidavit_10Year_Completion.pdf',
        fileSize: '1.2 MB',
        mimeType: 'application/pdf',
        hash: 'b1f6305a2e9b8893d9ef9ee2bfd38379f87c95e1eb92a3449339243a41e974f1',
        scanStatus: 'CLEAN',
        uploadedAt: '2026-10-20T14:10:00Z',
        documentType: 'BOARD_RESOLUTION'
      }
    ],
    queries: [],
    submittedAt: '2016-10-05T09:00:00Z',
    lastUpdatedAt: '2026-10-20T14:10:00Z'
  },

  // 6. On-Hold Case: Embezzlement investigation / Legal stay
  {
    id: 'fdr-006-hold',
    instrumentNumber: 'FDR/BOI/2020/55190',
    instrumentType: 'FDR',
    bankName: 'Bank of India',
    branchName: 'Shivaji Nagar, Pune',
    ifscCode: 'BKID0001021',
    amount: 1500000,
    formattedAmount: '₹15,00,000.00',
    currency: 'INR',
    issueDate: '2020-04-10',
    maturityDate: '2028-04-10',
    tenorMonths: 96,
    beneficiaryName: 'Member Secretary, AICTE New Delhi',
    lienMarkedTo: 'AICTE, New Delhi',
    depositorName: 'Vanguard Polytechnic Institute',
    institutionId: 'inst-002',
    institutionName: 'Vanguard Polytechnic Institute',
    institutionAicteId: '1-5092183',
    institutionType: 'PRIVATE',
    region: 'Western',
    aphEdition: 'APH 2020-21',
    aphRequiredAmount: 1500000,
    trustLevel: 'L1',
    status: 'ON_HOLD',
    version: 1,
    isHoldActive: true,
    holdReason: 'State Vigilance Bureau Case #SVB-2024-819 pending; External NOC from Director of Technical Education (DTE Maharashtra) withheld.',
    discrepancies: [],
    riskBreakdown: {
      urgency: 10,
      amountBand: 20,
      discrepancySeverity: 20,
      bankWaitTime: 0,
      caseAge: 45,
      total: 95
    },
    riskScore: 95,
    documents: [
      {
        id: 'doc-009',
        fileName: 'BOI_FDR_55190.pdf',
        fileSize: '1.9 MB',
        mimeType: 'application/pdf',
        hash: 'bc65780f2d94d306b3f9ffc3755b40cfbca04ff8eb3747b99335f29d20c78a05',
        scanStatus: 'CLEAN',
        uploadedAt: '2020-04-15T10:00:00Z',
        documentType: 'FDR_CERTIFICATE'
      }
    ],
    queries: [],
    submittedAt: '2020-04-15T10:00:00Z',
    lastUpdatedAt: '2026-09-10T12:00:00Z'
  },

  // 7. L0 Submitted (Unverified fresh submission)
  {
    id: 'fdr-007-l0-fresh',
    instrumentNumber: 'FDR/PNB/2026/66301',
    instrumentType: 'FDR',
    bankName: 'Punjab National Bank',
    branchName: 'Cuttack Main Branch',
    ifscCode: 'PUNB0008800',
    amount: 2500000,
    formattedAmount: '₹25,00,000.00',
    currency: 'INR',
    issueDate: '2026-09-20',
    maturityDate: '2034-09-20',
    tenorMonths: 96,
    beneficiaryName: 'Member Secretary, AICTE New Delhi',
    lienMarkedTo: 'AICTE, New Delhi',
    depositorName: 'Kalinga Institute of Pharmacy & Research',
    institutionId: 'inst-003',
    institutionName: 'Kalinga Institute of Pharmacy & Research',
    institutionAicteId: '1-7489201',
    institutionType: 'PRIVATE',
    region: 'Eastern',
    aphEdition: 'APH 2024-27',
    aphRequiredAmount: 2500000,
    trustLevel: 'L0', // Unverified!
    status: 'SUBMITTED',
    version: 1,
    discrepancies: [],
    riskBreakdown: {
      urgency: 5,
      amountBand: 25,
      discrepancySeverity: 0,
      bankWaitTime: 0,
      caseAge: 3,
      total: 33
    },
    riskScore: 33,
    documents: [
      {
        id: 'doc-010',
        fileName: 'PNB_Deposit_Receipt_66301.pdf',
        fileSize: '2.2 MB',
        mimeType: 'application/pdf',
        hash: 'f69e6b4d3f3f0db6ee6cfc8b0e7d7a7ec48c1b48b598b0f80a4a7541b9e28e4e',
        scanStatus: 'QUEUED',
        uploadedAt: '2026-10-21T09:30:00Z',
        documentType: 'FDR_CERTIFICATE'
      }
    ],
    queries: [],
    submittedAt: '2026-10-21T09:30:00Z',
    lastUpdatedAt: '2026-10-21T09:30:00Z'
  },

  // 8. L0 Another Submitted (Fresh upload with minor discrepancy)
  {
    id: 'fdr-008-l0-beneficiary',
    instrumentNumber: 'BG/SBI/2026/00192',
    instrumentType: 'BANK_GUARANTEE',
    bankName: 'State Bank of India',
    branchName: 'Kanpur Mall Road',
    ifscCode: 'SBIN0000108',
    amount: 3500000,
    formattedAmount: '₹35,00,000.00',
    currency: 'INR',
    issueDate: '2026-10-05',
    maturityDate: '2031-10-05',
    tenorMonths: 60,
    beneficiaryName: 'Director of Technical Education, UP', // Wrong beneficiary! (R2)
    lienMarkedTo: 'AICTE, New Delhi',
    depositorName: 'Apex Institute of Technology & Management',
    institutionId: 'inst-001',
    institutionName: 'Apex Institute of Technology & Management',
    institutionAicteId: '1-3829104',
    institutionType: 'PRIVATE',
    region: 'Northern',
    aphEdition: 'APH 2024-27',
    aphRequiredAmount: 3500000,
    trustLevel: 'L0',
    status: 'SUBMITTED',
    version: 1,
    discrepancies: [
      {
        code: 'R2',
        ruleTitle: 'Beneficiary Not in Favour of AICTE',
        field: 'beneficiaryName',
        severity: 'CRITICAL',
        message: 'Beneficiary is marked to "Director of Technical Education, UP" instead of "Member Secretary, AICTE New Delhi".',
        requiredValue: 'Member Secretary, AICTE New Delhi',
        detectedValue: 'Director of Technical Education, UP',
        resolved: false
      }
    ],
    riskBreakdown: {
      urgency: 10,
      amountBand: 30,
      discrepancySeverity: 35,
      bankWaitTime: 0,
      caseAge: 19,
      total: 94
    },
    riskScore: 94,
    documents: [
      {
        id: 'doc-011',
        fileName: 'SBI_Bank_Guarantee_00192.pdf',
        fileSize: '4.1 MB',
        mimeType: 'application/pdf',
        hash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
        scanStatus: 'CLEAN',
        uploadedAt: '2026-10-05T14:00:00Z',
        documentType: 'FDR_CERTIFICATE'
      }
    ],
    queries: [],
    submittedAt: '2026-10-05T14:00:00Z',
    lastUpdatedAt: '2026-10-05T14:00:00Z'
  },

  // 9. L1 Active Instrument (Standard clean compliant deposit)
  {
    id: 'fdr-009-l1-active',
    instrumentNumber: 'FDR/BOB/2022/99014',
    instrumentType: 'FDR',
    bankName: 'Bank of Baroda',
    branchName: 'Bandra Kurla Complex, Mumbai',
    ifscCode: 'BARB0BKCMUM',
    amount: 1500000,
    formattedAmount: '₹15,00,000.00',
    currency: 'INR',
    issueDate: '2022-05-18',
    maturityDate: '2030-05-18',
    tenorMonths: 96,
    beneficiaryName: 'Member Secretary, AICTE New Delhi',
    lienMarkedTo: 'AICTE, New Delhi',
    depositorName: 'Vanguard Polytechnic Institute',
    institutionId: 'inst-002',
    institutionName: 'Vanguard Polytechnic Institute',
    institutionAicteId: '1-5092183',
    institutionType: 'PRIVATE',
    region: 'Western',
    aphEdition: 'APH 2022-23',
    aphRequiredAmount: 1500000,
    trustLevel: 'L1',
    status: 'ACTIVE',
    version: 1,
    discrepancies: [],
    riskBreakdown: {
      urgency: 5,
      amountBand: 15,
      discrepancySeverity: 0,
      bankWaitTime: 0,
      caseAge: 2,
      total: 22
    },
    riskScore: 22,
    documents: [
      {
        id: 'doc-012',
        fileName: 'BOB_Fixed_Deposit_99014.pdf',
        fileSize: '1.7 MB',
        mimeType: 'application/pdf',
        hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        scanStatus: 'CLEAN',
        uploadedAt: '2022-05-20T11:00:00Z',
        documentType: 'FDR_CERTIFICATE'
      }
    ],
    queries: [],
    submittedAt: '2022-05-20T11:00:00Z',
    lastUpdatedAt: '2022-05-22T16:00:00Z'
  },

  // 10. L2 Released Historical Instrument (with Valid QR-verifiable NOC issued!)
  {
    id: 'fdr-010-noc-issued',
    instrumentNumber: 'FDR/SBI/2014/10492',
    instrumentType: 'FDR',
    bankName: 'State Bank of India',
    branchName: 'Main Branch, Lucknow',
    ifscCode: 'SBIN0000125',
    amount: 3500000,
    formattedAmount: '₹35,00,000.00',
    currency: 'INR',
    issueDate: '2014-04-12',
    maturityDate: '2024-04-12',
    tenorMonths: 120,
    beneficiaryName: 'Member Secretary, AICTE New Delhi',
    lienMarkedTo: 'AICTE, New Delhi',
    depositorName: 'Apex Institute of Technology & Management',
    institutionId: 'inst-001',
    institutionName: 'Apex Institute of Technology & Management',
    institutionAicteId: '1-3829104',
    institutionType: 'PRIVATE',
    region: 'Northern',
    aphEdition: 'APH 2014-15',
    aphRequiredAmount: 3500000,
    trustLevel: 'L2',
    status: 'NOC_ISSUED',
    version: 1,
    discrepancies: [],
    riskBreakdown: {
      urgency: 0,
      amountBand: 30,
      discrepancySeverity: 0,
      bankWaitTime: 0,
      caseAge: 0,
      total: 30
    },
    riskScore: 30,
    evidenceRecord: {
      confirmedBy: 'Shri K. R. Meena (Branch Manager, SBI Lucknow)',
      branchName: 'Main Branch, Lucknow',
      branchAddress: 'Hazratganj, Lucknow, UP - 226001',
      contactEmail: 'sbi.00125@sbi.co.in',
      referenceNo: 'SBI-CONF-2024-0482',
      confirmedAt: '2024-04-15T10:00:00Z',
      documentHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
      lienConfirmed: true,
      provisional: false
    },
    nocRecord: {
      nocNumber: 'AICTE/REG/NOC/2026/0491',
      issuedAt: '2026-05-10T16:20:00Z',
      issuedBy: 'Prof. Rajive Kumar',
      authorityDesignation: 'Member Secretary, AICTE New Delhi',
      verificationCode: 'NOC-26265-8942-APEX',
      qrPayloadUrl: 'http://localhost:3000/#/public/noc/NOC-26265-8942-APEX',
      certificatePdfHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      status: 'VALID'
    },
    documents: [
      {
        id: 'doc-013',
        fileName: 'SBI_FDR_Original_10492.pdf',
        fileSize: '2.8 MB',
        mimeType: 'application/pdf',
        hash: '12d33458ef123456789abcdef123456789abcdef123456789abcdef12345678',
        scanStatus: 'CLEAN',
        uploadedAt: '2014-04-15T10:00:00Z',
        documentType: 'FDR_CERTIFICATE'
      },
      {
        id: 'doc-014',
        fileName: 'AICTE_Signed_NOC_Certificate.pdf',
        fileSize: '1.4 MB',
        mimeType: 'application/pdf',
        hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        scanStatus: 'CLEAN',
        uploadedAt: '2026-05-10T16:20:00Z',
        documentType: 'BOARD_RESOLUTION'
      }
    ],
    queries: [],
    submittedAt: '2014-04-15T10:00:00Z',
    lastUpdatedAt: '2026-05-10T16:20:00Z'
  }
];
