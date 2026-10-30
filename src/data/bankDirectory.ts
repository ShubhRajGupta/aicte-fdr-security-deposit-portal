export interface IfscRecord {
  ifsc: string;
  bankName: string;
  branchName: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
}

export const IFSC_DIRECTORY: Record<string, IfscRecord> = {
  SBIN0008432: {
    ifsc: 'SBIN0008432',
    bankName: 'State Bank of India',
    branchName: 'Noida Sector 62 Branch',
    address: 'C-56/2, Sector 62, Noida, Gautam Buddha Nagar, UP - 201309',
    contactEmail: 'sbi.08432@sbi.co.in',
    contactPhone: '+91 120 2400124'
  },
  SBIN0000108: {
    ifsc: 'SBIN0000108',
    bankName: 'State Bank of India',
    branchName: 'Kanpur Main Mall Road',
    address: 'The Mall, Kanpur Nagar, UP - 208001',
    contactEmail: 'sbi.00108@sbi.co.in',
    contactPhone: '+91 512 2314112'
  },
  SBIN0000125: {
    ifsc: 'SBIN0000125',
    bankName: 'State Bank of India',
    branchName: 'Main Branch, Hazratganj, Lucknow',
    address: 'Hazratganj, Lucknow, UP - 226001',
    contactEmail: 'sbi.00125@sbi.co.in',
    contactPhone: '+91 522 2229014'
  },
  PUNB0014200: {
    ifsc: 'PUNB0014200',
    bankName: 'Punjab National Bank',
    branchName: 'Andheri East, Mumbai',
    address: 'M.V. Road, Near Station, Andheri East, Mumbai - 400069',
    contactEmail: 'bo0142@pnb.co.in',
    contactPhone: '+91 22 28321045'
  },
  PUNB0008800: {
    ifsc: 'PUNB0008800',
    bankName: 'Punjab National Bank',
    branchName: 'Cuttack Main Branch',
    address: 'Choudhury Bazar, Cuttack, Odisha - 753001',
    contactEmail: 'bo0088@pnb.co.in',
    contactPhone: '+91 671 2518920'
  },
  BARB0SAHBIS: {
    ifsc: 'BARB0SAHBIS',
    bankName: 'Bank of Baroda',
    branchName: 'Saheed Nagar, Bhubaneswar',
    address: 'Plot 214, Saheed Nagar, Bhubaneswar, Odisha - 751007',
    contactEmail: 'saheed@bankofbaroda.com',
    contactPhone: '+91 674 2548810'
  },
  BARB0BKCMUM: {
    ifsc: 'BARB0BKCMUM',
    bankName: 'Bank of Baroda',
    branchName: 'Bandra Kurla Complex, Mumbai',
    address: 'Baroda Sun Tower, C-34, G-Block, BKC, Bandra (E), Mumbai - 400051',
    contactEmail: 'bkc.mum@bankofbaroda.com',
    contactPhone: '+91 22 66984000'
  },
  CNRB0000404: {
    ifsc: 'CNRB0000404',
    bankName: 'Canara Bank',
    branchName: 'Malleshwaram, Bangalore',
    address: 'Margosa Road, 8th Cross, Malleshwaram, Bangalore - 560003',
    contactEmail: 'cb0404@canarabank.com',
    contactPhone: '+91 80 23340029'
  },
  HDFC0000003: {
    ifsc: 'HDFC0000003',
    bankName: 'HDFC Bank Ltd',
    branchName: 'Barakhamba Road, New Delhi',
    address: 'KG Marg & Barakhamba Road, Connaught Place, New Delhi - 110001',
    contactEmail: 'barakhamba@hdfcbank.com',
    contactPhone: '+91 11 41513000'
  },
  BKID0001021: {
    ifsc: 'BKID0001021',
    bankName: 'Bank of India',
    branchName: 'Shivaji Nagar, Pune',
    address: '1205/1, F.C. Road, Shivaji Nagar, Pune - 411004',
    contactEmail: 'pune.shivaji@bankofindia.co.in',
    contactPhone: '+91 20 25531980'
  }
};

export interface AphRuleRequirement {
  program: string;
  category: 'UG' | 'PG' | 'DIPLOMA';
  minDepositPrivate: number;
  minDepositGovt: number;
  tenorYears: number;
  beneficiaryExact: string;
  lienPhrase: string;
}

export const APH_RULES: Record<string, AphRuleRequirement> = {
  'ENGG_UG': {
    program: 'Engineering & Technology (UG Degree)',
    category: 'UG',
    minDepositPrivate: 3500000,
    minDepositGovt: 0,
    tenorYears: 8,
    beneficiaryExact: 'Member Secretary, AICTE New Delhi',
    lienPhrase: 'AICTE, New Delhi'
  },
  'PHARM_UG': {
    program: 'Pharmacy (B.Pharm)',
    category: 'UG',
    minDepositPrivate: 2500000,
    minDepositGovt: 0,
    tenorYears: 8,
    beneficiaryExact: 'Member Secretary, AICTE New Delhi',
    lienPhrase: 'AICTE, New Delhi'
  },
  'MGMT_PG': {
    program: 'Management (MBA / PGDM)',
    category: 'PG',
    minDepositPrivate: 1500000,
    minDepositGovt: 0,
    tenorYears: 8,
    beneficiaryExact: 'Member Secretary, AICTE New Delhi',
    lienPhrase: 'AICTE, New Delhi'
  },
  'POLY_DIPLOMA': {
    program: 'Polytechnic / Applied Arts (Diploma)',
    category: 'DIPLOMA',
    minDepositPrivate: 1500000,
    minDepositGovt: 0,
    tenorYears: 8,
    beneficiaryExact: 'Member Secretary, AICTE New Delhi',
    lienPhrase: 'AICTE, New Delhi'
  }
};
