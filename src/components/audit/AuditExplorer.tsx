import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { verifyAuditChain, VerificationReport } from '../../services/auditService';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  AlertOctagon,
  RefreshCw,
  Hash,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Lock,
  RotateCcw
} from 'lucide-react';

export const AuditExplorer: React.FC = () => {
  const { auditLog, addToast, simulateTamperAttack, restoreAuditLedger } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterEventType, setFilterEventType] = useState('ALL');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [verificationReport, setVerificationReport] = useState<VerificationReport | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isTamperInjected, setIsTamperInjected] = useState(false);

  // Run chain verification
  const handleVerifyChain = async () => {
    setIsVerifying(true);
    setTimeout(async () => {
      const report = await verifyAuditChain(auditLog);
      setVerificationReport(report);
      setIsVerifying(false);
      if (report.isChainIntact) {
        addToast(
          'success',
          'Cryptographic Chain Verified Intact',
          `All ${report.totalBlocks} event blocks verified with valid SHA-256 hash continuity. No silent edits or deletions detected.`
        );
      } else {
        addToast(
          'error',
          'Audit Integrity Compromised!',
          `Block #${report.brokenBlockIndex! + 1} failed cryptographic hash verification!`
        );
      }
    }, 600);
  };

  const handleInjectTamper = () => {
    simulateTamperAttack();
    setIsTamperInjected(true);
    setVerificationReport(null);
  };

  const handleRestoreLedger = () => {
    restoreAuditLedger();
    setIsTamperInjected(false);
    setVerificationReport(null);
  };

  const filteredEvents = auditLog
    .filter((event) => {
      const matchesSearch =
        event.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.instrumentNumber && event.instrumentNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = filterEventType === 'ALL' || event.eventType === filterEventType;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div style={{ padding: '1.25rem', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Official Government Banner */}
      <div
        className="gov-panel"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.25rem',
          borderLeft: '5px solid var(--gov-navy-medium)',
          background: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Lock size={20} style={{ color: 'var(--gov-navy-medium)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gov-navy-dark)', margin: 0 }}>
                STATUTORY TAMPER-EVIDENT AUDIT TRAIL (INNOVATION I5)
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.35rem', lineHeight: 1.4 }}>
              Every lifecycle state transition generates an immutable cryptographic SHA-256 block linked to its predecessor. In compliance with Central Vigilance Commission (CVC) & GIGW 3.0 electronic governance audit guidelines.
            </p>
          </div>

          <button
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="btn-gov btn-gov-primary"
            style={{ fontWeight: 700 }}
          >
            {isVerifying ? <RefreshCw size={15} className="spin" /> : <ShieldCheck size={16} />}
            <span>{isVerifying ? 'Verifying Block Hashes...' : 'Verify Cryptographic Chain Integrity'}</span>
          </button>
        </div>
      </div>

      {/* Red Team Tamper Attack Interactive Demonstration Card */}
      <div
        className="gov-panel"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          border: isTamperInjected ? '2px solid #dc2626' : '1px solid #cbd5e1',
          background: isTamperInjected ? '#fef2f2' : '#ffffff'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                background: isTamperInjected ? '#fee2e2' : '#f0f4f8',
                border: isTamperInjected ? '1px solid #f87171' : '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isTamperInjected ? '#dc2626' : 'var(--gov-navy-medium)'
              }}
            >
              <AlertOctagon size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: isTamperInjected ? '#991b1b' : 'var(--gov-navy-dark)' }}>
                {isTamperInjected ? 'CRITICAL VIGILANCE ALERT: Block #2 State Altered Out-of-Band' : 'Vigilance Red-Team Security Simulation (Hackathon Demo)'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                {isTamperInjected
                  ? 'A rogue database mutation secretly modified Block #2. Click "Verify Cryptographic Chain Integrity" above to observe the SHA-256 hash mismatch break the chain!'
                  : 'Test cryptographic resilience by injecting an unauthorized out-of-band database modification without recomputing block hashes.'}
              </div>
            </div>
          </div>

          <div>
            {!isTamperInjected ? (
              <button
                onClick={handleInjectTamper}
                className="btn-gov btn-gov-danger btn-gov-sm"
                style={{ fontWeight: 700 }}
              >
                <AlertOctagon size={13} />
                <span>Simulate DB Tamper Attack</span>
              </button>
            ) : (
              <button
                onClick={handleRestoreLedger}
                className="btn-gov btn-gov-primary btn-gov-sm"
                style={{ fontWeight: 700, background: 'var(--gov-green-dark)' }}
              >
                <RotateCcw size={13} />
                <span>Restore Verified Official Ledger</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Verification Report Result Banner (If run) */}
      {verificationReport && (
        <div
          className={`gov-alert ${verificationReport.isChainIntact ? 'gov-alert-success' : 'gov-alert-danger'}`}
          style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {verificationReport.isChainIntact ? (
                <ShieldCheck size={28} style={{ color: 'var(--gov-green-dark)' }} />
              ) : (
                <ShieldAlert size={28} style={{ color: '#dc2626' }} />
              )}
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: verificationReport.isChainIntact ? 'var(--gov-green-dark)' : '#991b1b', margin: 0 }}>
                  {verificationReport.isChainIntact
                    ? '100% Cryptographic Ledger Integrity Verified Intact'
                    : 'INTEGRITY BREACH DETECTED: SHA-256 HASH CHAIN BROKEN AT BLOCK #' + (verificationReport.brokenBlockIndex! + 1)}
                </h4>
                <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '2px' }}>
                  Verified <strong>{verificationReport.totalBlocks} event blocks</strong> sequentially against genesis root. Anchor Hash:{' '}
                  <code className="font-mono" style={{ color: 'var(--gov-navy-medium)', fontWeight: 700 }}>{verificationReport.latestHash.slice(0, 24)}...</code>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Verification Timestamp: {verificationReport.verifiedAt.slice(11, 19)} IST
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div
        className="gov-panel"
        style={{
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          background: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '260px' }}>
          <Search size={16} style={{ color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search audit trail by actor, event type, FDR number, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="gov-input"
            style={{ width: '100%', fontSize: '0.82rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Filter Type:</label>
          <select
            value={filterEventType}
            onChange={(e) => setFilterEventType(e.target.value)}
            className="gov-select"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
          >
            <option value="ALL">All Event Types ({auditLog.length})</option>
            <option value="SUBMISSION_CREATED">Submission Created</option>
            <option value="DISCREPANCY_FLAGGED">Discrepancy Flagged</option>
            <option value="QUERY_RAISED">Query Raised</option>
            <option value="QUERY_RESOLVED">Query Resolved</option>
            <option value="TRUST_LEVEL_UPDATED">Trust Level Updated</option>
            <option value="TIMELINE_STATUS_CHANGED">Timeline Status Changed</option>
            <option value="RENEWAL_VERSION_CHAINED">Renewal Version Chained</option>
            <option value="RELEASE_BLOCKED_VIOLATION">Release Blocked Violation</option>
            <option value="NOC_ISSUED">NOC Issued</option>
            <option value="BANK_EVIDENCE_ATTACHED">Bank Evidence Attached</option>
            <option value="HOLD_STATUS_TOGGLED">Hold Status Toggled</option>
          </select>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Showing <strong>{filteredEvents.length}</strong> events
        </div>
      </div>

      {/* Audit Log Chronological Blocks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {filteredEvents.map((event) => {
          const originalIndex = auditLog.findIndex((e) => e.id === event.id);
          const isBrokenBlock =
            verificationReport !== null &&
            !verificationReport.isChainIntact &&
            verificationReport.brokenBlockIndex === originalIndex;

          const isExpanded = expandedEventId === event.id || isBrokenBlock;
          let borderAccent = 'var(--gov-navy-medium)';
          if (isBrokenBlock) borderAccent = '#dc2626';
          else if (event.eventType.includes('VIOLATION') || event.eventType.includes('DISCREPANCY')) borderAccent = '#dc2626';
          else if (event.eventType.includes('NOC') || event.eventType.includes('RESOLVED')) borderAccent = 'var(--gov-green-dark)';
          else if (event.eventType.includes('RENEWAL')) borderAccent = '#7c3aed';
          else if (event.eventType.includes('HOLD') || event.eventType.includes('QUERY')) borderAccent = 'var(--gov-saffron)';

          return (
            <div
              key={event.id}
              className="gov-panel"
              style={{
                padding: '0.85rem 1.25rem',
                borderLeft: `5px solid ${borderAccent}`,
                borderTop: isBrokenBlock ? '2px solid #dc2626' : undefined,
                borderRight: isBrokenBlock ? '2px solid #dc2626' : undefined,
                borderBottom: isBrokenBlock ? '2px solid #dc2626' : undefined,
                background: isBrokenBlock ? '#fef2f2' : '#ffffff'
              }}
            >
              {isBrokenBlock && (
                <div
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    marginBottom: '0.5rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <AlertOctagon size={13} />
                  <span>TAMPER DETECTED AT BLOCK #{originalIndex + 1}: SHA-256 HASH VERIFICATION FAILED</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        background: '#f1f5f9',
                        color: 'var(--gov-navy-dark)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        border: '1px solid #cbd5e1'
                      }}
                    >
                      {event.eventType}
                    </span>

                    {event.instrumentNumber && (
                      <span className="font-mono" style={{ fontWeight: 700, color: 'var(--gov-navy-medium)', fontSize: '0.8rem' }}>
                        {event.instrumentNumber}
                      </span>
                    )}

                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Actor: <strong>{event.actorName}</strong> ({event.actorRole})
                    </span>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: '#1e293b', marginTop: '0.35rem', lineHeight: 1.4 }}>
                    {event.details}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#64748b' }}>
                    <div>{event.timestamp.slice(0, 10)}</div>
                    <div className="font-mono">{event.timestamp.slice(11, 19)} IST</div>
                  </div>

                  <button
                    onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                    className="btn-gov btn-gov-secondary btn-gov-sm"
                    style={{ padding: '0.3rem 0.5rem' }}
                    title="View cryptographic block hashes and state diff"
                  >
                    <Hash size={13} />
                    <span>Hash Proof</span>
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>
              </div>

              {/* Cryptographic Block Details */}
              {isExpanded && (
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    padding: '0.85rem',
                    marginTop: '0.75rem',
                    fontSize: '0.75rem'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.65rem' }}>
                    <div>
                      <span style={{ color: '#64748b', fontWeight: 600, display: 'block' }}>PREVIOUS HASH (CHAIN POINTER):</span>
                      <code className="font-mono" style={{ color: '#7c3aed', wordBreak: 'break-all', display: 'block', marginTop: '2px', fontSize: '0.72rem' }}>
                        {event.previousHash}
                      </code>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontWeight: 600, display: 'block' }}>CURRENT BLOCK HASH (SHA-256):</span>
                      <code className="font-mono" style={{ color: 'var(--gov-navy-medium)', wordBreak: 'break-all', display: 'block', marginTop: '2px', fontSize: '0.72rem', fontWeight: 700 }}>
                        {event.currentHash}
                      </code>
                    </div>
                  </div>

                  {(event.beforeState || event.afterState) && (
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                      <span style={{ color: '#334155', fontWeight: 700 }}>State Transition Diff:</span>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '4px' }}>
                        {event.beforeState && (
                          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.4rem' }}>
                            <span style={{ color: '#991b1b', fontWeight: 700 }}>Before State:</span>
                            <pre style={{ margin: 0, color: '#b91c1c', fontFamily: 'monospace', fontSize: '0.68rem', overflowX: 'auto' }}>
                              {JSON.stringify(event.beforeState, null, 2)}
                            </pre>
                          </div>
                        )}
                        {event.afterState && (
                          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.4rem' }}>
                            <span style={{ color: '#166534', fontWeight: 700 }}>After State:</span>
                            <pre style={{ margin: 0, color: '#15803d', fontFamily: 'monospace', fontSize: '0.68rem', overflowX: 'auto' }}>
                              {JSON.stringify(event.afterState, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
