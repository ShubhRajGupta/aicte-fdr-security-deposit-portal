import { AuditEvent } from '../types';

/**
 * Standard SHA-256 implementation supporting both Browser SubtleCrypto and fast sync fallback
 */
export async function computeSha256(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Pure JS SHA-256 fallback for maximum environment compatibility
  return simpleSha256(text);
}

// Portable deterministic hash helper
function simpleSha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i = 0, j = 0;
  let result = '';
  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;
  const hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let wordsLength = 0;
  for (i = 0; i < ascii.length; i++) {
    const code = ascii.charCodeAt(i);
    words[i >> 2] |= (code & 0xff) << ((3 - (i % 4)) * 8);
  }
  words[ascii.length >> 2] |= 0x80 << ((3 - (ascii.length % 4)) * 8);
  words[(((ascii.length + 8) >> 6) << 4) + 15] = asciiBitLength;
  wordsLength = ascii.length;

  for (i = 0; i < wordsLength; i += 16) {
    const w = words.slice(i, i + 16);
    const oldHash = hash.slice(0);
    for (j = 0; j < 64; j++) {
      let w15 = w[j - 15], w2 = w[j - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[j] = j < 16 ? w[j] : (w[j - 16] + s0 + w[j - 7] + s1) | 0;

      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp1 = (hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[j] + w[j]) | 0;
      const temp2 = ((rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj) | 0;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (temp1 + temp2) | 0;
    }
    for (j = 0; j < 8; j++) {
      hash[j] = (hash[j] + oldHash[j]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

export const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

export async function createAuditEvent(
  actorName: string,
  actorRole: string,
  eventType: AuditEvent['eventType'],
  entityType: AuditEvent['entityType'],
  entityId: string,
  details: string,
  previousHash: string,
  beforeState?: Record<string, unknown>,
  afterState?: Record<string, unknown>,
  instrumentNumber?: string,
  institutionName?: string
): Promise<AuditEvent> {
  const timestamp = new Date().toISOString();
  const id = `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const payloadToHash = `${previousHash}|${timestamp}|${actorName}|${actorRole}|${eventType}|${entityType}|${entityId}|${details}|${JSON.stringify(beforeState || {})}|${JSON.stringify(afterState || {})}`;
  const currentHash = await computeSha256(payloadToHash);

  return {
    id,
    timestamp,
    actorName,
    actorRole,
    eventType,
    entityType,
    entityId,
    instrumentNumber,
    institutionName,
    details,
    beforeState,
    afterState,
    previousHash,
    currentHash
  };
}

export interface VerificationReport {
  isChainIntact: boolean;
  totalBlocks: number;
  genesisHash: string;
  latestHash: string;
  brokenBlockIndex: number | null;
  errorMessage?: string;
  verifiedAt: string;
}

export async function verifyAuditChain(events: AuditEvent[]): Promise<VerificationReport> {
  if (events.length === 0) {
    return {
      isChainIntact: true,
      totalBlocks: 0,
      genesisHash: GENESIS_HASH,
      latestHash: GENESIS_HASH,
      brokenBlockIndex: null,
      verifiedAt: new Date().toISOString()
    };
  }

  // Check from oldest to newest
  const sorted = [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  for (let i = 0; i < sorted.length; i++) {
    const block = sorted[i];
    const expectedPrevHash = i === 0 ? GENESIS_HASH : sorted[i - 1].currentHash;

    if (block.previousHash !== expectedPrevHash) {
      return {
        isChainIntact: false,
        totalBlocks: sorted.length,
        genesisHash: GENESIS_HASH,
        latestHash: sorted[sorted.length - 1].currentHash,
        brokenBlockIndex: i,
        errorMessage: `Block #${i + 1} (${block.eventType}) has mismatched previousHash pointer! Expected ${expectedPrevHash.slice(0, 12)}..., found ${block.previousHash.slice(0, 12)}...`,
        verifiedAt: new Date().toISOString()
      };
    }

    const payloadToHash = `${block.previousHash}|${block.timestamp}|${block.actorName}|${block.actorRole}|${block.eventType}|${block.entityType}|${block.entityId}|${block.details}|${JSON.stringify(block.beforeState || {})}|${JSON.stringify(block.afterState || {})}`;
    const calculatedHash = await computeSha256(payloadToHash);

    if (calculatedHash !== block.currentHash) {
      return {
        isChainIntact: false,
        totalBlocks: sorted.length,
        genesisHash: GENESIS_HASH,
        latestHash: sorted[sorted.length - 1].currentHash,
        brokenBlockIndex: i,
        errorMessage: `Block #${i + 1} (${block.eventType}) payload has been tampered with! Cryptographic SHA-256 signature mismatch.`,
        verifiedAt: new Date().toISOString()
      };
    }
  }

  return {
    isChainIntact: true,
    totalBlocks: sorted.length,
    genesisHash: GENESIS_HASH,
    latestHash: sorted[sorted.length - 1].currentHash,
    brokenBlockIndex: null,
    verifiedAt: new Date().toISOString()
  };
}

export const INITIAL_AUDIT_LOG: AuditEvent[] = [
  {
    id: 'audit-001',
    timestamp: '2026-08-11T10:20:00Z',
    actorName: 'Dr. Rajesh Sharma',
    actorRole: 'INSTITUTION_USER',
    eventType: 'SUBMISSION_CREATED',
    entityType: 'INSTRUMENT',
    entityId: 'fdr-001-r1',
    instrumentNumber: 'FDR/SBI/2026/89421',
    institutionName: 'Apex Institute of Technology & Management',
    details: 'Initial security deposit submitted for Technical Degree course. Amount: ₹25,00,000.',
    previousHash: GENESIS_HASH,
    currentHash: '34a1793740e69bd89311406e2dc05c84d728ea1121d4586dbd2b8b930d6e6ea1'
  },
  {
    id: 'audit-002',
    timestamp: '2026-08-11T10:20:02Z',
    actorName: 'System Rules Engine (v2024-27)',
    actorRole: 'BUREAU_OFFICER',
    eventType: 'DISCREPANCY_FLAGGED',
    entityType: 'INSTRUMENT',
    entityId: 'fdr-001-r1',
    instrumentNumber: 'FDR/SBI/2026/89421',
    institutionName: 'Apex Institute of Technology & Management',
    details: 'Rule R1 triggered: Amount shortfall detected. Required: ₹35,00,000, Submitted: ₹25,00,000.',
    previousHash: '34a1793740e69bd89311406e2dc05c84d728ea1121d4586dbd2b8b930d6e6ea1',
    currentHash: 'b5f00224d4589aa81267b2d56a7bc310188d447a15a0c0e12361093557e93da0'
  },
  {
    id: 'audit-003',
    timestamp: '2026-08-14T14:30:00Z',
    actorName: 'Dr. Vikram Seth',
    actorRole: 'BUREAU_OFFICER',
    eventType: 'QUERY_RAISED',
    entityType: 'QUERY',
    entityId: 'qry-101',
    instrumentNumber: 'FDR/SBI/2026/89421',
    institutionName: 'Apex Institute of Technology & Management',
    details: 'Officer raised Scrutiny Query regarding R1 shortfall of ₹10 Lakhs. Status changed to QUERY_RAISED.',
    previousHash: 'b5f00224d4589aa81267b2d56a7bc310188d447a15a0c0e12361093557e93da0',
    currentHash: 'a7183e8b09312c3f87a0224d2ef11909890cb54a01844b2ca5597b6697193a02'
  },
  {
    id: 'audit-004',
    timestamp: '2026-10-15T11:45:00Z',
    actorName: 'Shri Alok Verma',
    actorRole: 'BANK_OFFICER',
    eventType: 'BANK_EVIDENCE_ATTACHED',
    entityType: 'INSTRUMENT',
    entityId: 'fdr-005-l2-release',
    instrumentNumber: 'FDR/HDFC/2016/77881',
    institutionName: 'Apex Institute of Technology & Management',
    details: 'Bank confirmed lien marking and 10-year term completion via Branch Confirmation Ref #HDFC-CONF-2026-9921. Elevated to L2.',
    previousHash: 'a7183e8b09312c3f87a0224d2ef11909890cb54a01844b2ca5597b6697193a02',
    currentHash: '48f10b7762ac9108b335a10988cc8e010a01fa55e81d118237e1903328e104ab'
  },
  {
    id: 'audit-005',
    timestamp: '2026-10-20T14:10:00Z',
    actorName: 'Dr. Rajesh Sharma',
    actorRole: 'INSTITUTION_USER',
    eventType: 'RELEASE_REQUESTED',
    entityType: 'INSTRUMENT',
    entityId: 'fdr-005-l2-release',
    instrumentNumber: 'FDR/HDFC/2016/77881',
    institutionName: 'Apex Institute of Technology & Management',
    details: 'Institution submitted formal release application with Board Resolution & Non-Embezzlement Affidavit.',
    previousHash: '48f10b7762ac9108b335a10988cc8e010a01fa55e81d118237e1903328e104ab',
    currentHash: '9d214688e109ab777013ac22467bcf182901a182098bcda49810a9f02931bc77'
  }
];
