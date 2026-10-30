import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrustBadge } from '../common/TrustBadge';
import { StatusBadge } from '../common/StatusBadge';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Download,
  Eye,
  CheckCircle2,
  HelpCircle,
  Lock,
  Unlock,
  Award,
  Send,
  MessageSquare,
  Building,
  Calendar,
  AlertOctagon,
  Sparkles,
  FileCheck
} from 'lucide-react';

export const CaseWorkspace: React.FC = () => {
  const {
    instruments,
    selectedInstrumentId,
    setSelectedInstrumentId,
    activePersona,
    raiseOfficerQuery,
    replyToQuery,
    elevateTrustLevel,
    recommendRegionalRelease,
    recommendBureauRelease,
    approveReleaseAndIssueNoc,
    toggleHoldStatus,
    setActiveTab,
    setSelectedNocCode,
    runScenario,
    addToast
  } = useApp();

  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showOcrOverlay, setShowOcrOverlay] = useState(false);
  const [asOfYear, setAsOfYear] = useState<number>(2026);

  // Modals / forms
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [queryField, setQueryField] = useState('amount');
  const [queryText, setQueryText] = useState('');
  const [queryRemedy, setQueryRemedy] = useState('');

  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [activeQueryId, setActiveQueryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [exceptionNote, setExceptionNote] = useState('');

  const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);
  const [holdReasonInput, setHoldReasonInput] = useState('');

  const instrument = instruments.find((i) => i.id === selectedInstrumentId) || instruments[0];

  if (!instrument) {
    return (
      <div className="gov-container" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        No instrument selected. Please select one from the Worklist.
      </div>
    );
  }

  const activeDoc = instrument.documents[activeDocIndex] || instrument.documents[0];

  const handleRaiseQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;
    raiseOfficerQuery(instrument.id, queryField, queryText, queryRemedy);
    setIsQueryModalOpen(false);
    setQueryText('');
    setQueryRemedy('');
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQueryId || !replyText.trim()) return;
    replyToQuery(instrument.id, activeQueryId, replyText);
    setIsReplyModalOpen(false);
    setReplyText('');
    setActiveQueryId(null);
  };

  const handleApproveRelease = async () => {
    const res = await approveReleaseAndIssueNoc(instrument.id, exceptionNote.trim() || undefined);
    setIsApproveModalOpen(false);
    setExceptionNote('');
    if (res.success && res.nocCode) {
      setSelectedNocCode(res.nocCode);
      setActiveTab('PUBLIC_NOC');
    }
  };

  return (
    <div className="gov-container">
      {/* 1. Top Case Selector Bar */}
      <div className="gov-panel" style={{ padding: '8px 14px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#002147' }}>Active Application / Case:</span>
            <select
              value={instrument.id}
              onChange={(e) => setSelectedInstrumentId(e.target.value)}
              className="gov-select"
              style={{ fontWeight: 600, minWidth: '340px' }}
            >
              {instruments.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  [{inst.trustLevel}] {inst.instrumentNumber} — {inst.institutionName} ({inst.status})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={() => runScenario(1)} className="btn-gov btn-gov-secondary btn-gov-sm" title="Scenario 1: Flag R1">
              <Sparkles size={11} />
              <span>Scenario 1</span>
            </button>
            <button onClick={() => runScenario(2)} className="btn-gov btn-gov-secondary btn-gov-sm" title="Scenario 2: Query">
              <Sparkles size={11} />
              <span>Scenario 2</span>
            </button>
            <button onClick={() => runScenario(5)} className="btn-gov btn-gov-secondary btn-gov-sm" title="Scenario 5: Release Enforce">
              <Sparkles size={11} />
              <span>Scenario 5</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Split-Screen Grid: Left Document Inspector | Right Data & Scrutiny */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'start' }}>
        {/* LEFT PANE: Document Vault & Certificate Inspector */}
        <div className="gov-panel" style={{ display: 'flex', flexDirection: 'column', minHeight: '750px' }}>
          {/* Document Header Toolbar */}
          <div className="gov-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} style={{ color: '#003366' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '12px', color: '#002147' }}>
                  Document Vault: {activeDoc?.fileName || 'Certificate.pdf'}
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>
                  SHA-256: <code>{activeDoc?.hash.slice(0, 16)}...</code> · Virus Scan: <strong style={{ color: '#15803d' }}>{activeDoc?.scanStatus || 'CLEAN'}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setShowOcrOverlay(!showOcrOverlay)}
                className={`btn-gov btn-gov-sm ${showOcrOverlay ? 'btn-gov-primary' : 'btn-gov-secondary'}`}
                title="Toggle OCR text recognition assist"
              >
                <Eye size={12} />
                <span>OCR Assist</span>
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
                className="btn-gov btn-gov-secondary btn-gov-sm"
              >
                <ZoomOut size={12} />
              </button>
              <span style={{ fontSize: '11px', color: '#475569', width: '32px', textAlign: 'center', fontWeight: 600 }}>
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                className="btn-gov btn-gov-secondary btn-gov-sm"
              >
                <ZoomIn size={12} />
              </button>
            </div>
          </div>

          {/* Document Attachment Tabs */}
          <div style={{ display: 'flex', gap: '4px', padding: '6px 12px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', overflowX: 'auto' }}>
            {instrument.documents.map((doc, idx) => (
              <button
                key={doc.id}
                onClick={() => setActiveDocIndex(idx)}
                style={{
                  padding: '3px 8px',
                  borderRadius: '2px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: activeDocIndex === idx ? '#003366' : '#ffffff',
                  color: activeDocIndex === idx ? '#ffffff' : '#475569',
                  border: activeDocIndex === idx ? '1px solid #002244' : '1px solid #cbd5e1',
                  cursor: 'pointer'
                }}
              >
                {doc.documentType.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Rendered FDR Certificate Preview Canvas */}
          <div
            style={{
              flex: 1,
              background: '#e2e8f0',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* The Authentic Bank Fixed Deposit Receipt Document */}
            <div
              style={{
                width: '100%',
                maxWidth: '540px',
                background: '#ffffff',
                color: '#1e293b',
                padding: '24px 20px',
                borderRadius: '2px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                border: '2px solid #b45309',
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.1s ease',
                position: 'relative'
              }}
            >
              {/* Bank Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #002147', paddingBottom: '8px', marginBottom: '12px' }}>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#002147', letterSpacing: '0.04em' }}>
                  {instrument.bankName.toUpperCase()}
                </div>
                <div style={{ fontSize: '10px', color: '#475569' }}>
                  {instrument.branchName} · IFSC: <strong>{instrument.ifscCode}</strong>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>
                  TERM / FIXED DEPOSIT RECEIPT (SPECIAL DEPOSIT ADVICE)
                </div>
              </div>

              {/* Document Key Attributes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '11px', marginBottom: '12px' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Certificate / FDR No:</span>
                  <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#002147' }}>{instrument.instrumentNumber}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Date of Issue:</span>
                  <div style={{ fontWeight: 700 }}>{instrument.issueDate}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Principal Deposit:</span>
                  <div style={{ fontWeight: 900, color: '#15803d', fontSize: '13px' }}>{instrument.formattedAmount}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Maturity Date:</span>
                  <div style={{ fontWeight: 700, color: '#b91c1c' }}>{instrument.maturityDate}</div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#64748b' }}>Depositor Name:</span>
                  <div style={{ fontWeight: 700 }}>{instrument.depositorName}</div>
                </div>
              </div>

              {/* Official AICTE Red Lien Stamp */}
              <div
                style={{
                  border: '2px dashed #b91c1c',
                  background: '#fef2f2',
                  padding: '8px',
                  borderRadius: '2px',
                  textAlign: 'center',
                  margin: '10px 0',
                  color: '#991b1b'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.05em' }}>
                  ★ OFFICIAL STATUTORY LIEN MARKING ★
                </div>
                <div style={{ fontSize: '10px', fontWeight: 700, marginTop: '2px' }}>
                  LIEN ENDORSED TO: MEMBER SECRETARY, AICTE NEW DELHI
                </div>
                <div style={{ fontSize: '9px', marginTop: '2px' }}>
                  "Deposit shall not be encashed, pledged, or cancelled without explicit written NOC from AICTE."
                </div>
              </div>

              {/* Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px', paddingTop: '8px', borderTop: '1px solid #cbd5e1' }}>
                <div>
                  <div style={{ width: '80px', height: '24px', border: '1px solid #cbd5e1', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#15803d', fontWeight: 800 }}>
                    VERIFIED
                  </div>
                  <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>BRANCH AUDITED</div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '10px', color: '#475569' }}>
                  <div style={{ fontWeight: 700, color: '#002147' }}>Alok Verma</div>
                  <div>For {instrument.bankName}</div>
                  <div>Authorized Branch Signatory</div>
                </div>
              </div>
            </div>

            {/* Optional OCR Text Assist Overlay */}
            {showOcrOverlay && (
              <div
                style={{
                  position: 'absolute',
                  inset: '16px',
                  background: 'rgba(255, 255, 255, 0.96)',
                  color: '#003366',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  padding: '16px',
                  borderRadius: '2px',
                  overflowY: 'auto',
                  border: '2px solid #003366',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                }}
              >
                <div style={{ color: '#b45309', fontWeight: 800, marginBottom: '6px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px' }}>
                  [AICTE OCR OPTICAL CHARACTER RECOGNITION STREAM]
                </div>
                {activeDoc?.ocrExtractedText || 'No OCR stream extracted for this file.'}
                <div style={{ marginTop: '8px', color: '#15803d', fontWeight: 700 }}>
                  Confidence: {activeDoc?.ocrConfidence || 95}% · Discrepancy Matching: Rule Verified
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Structured Data, Discrepancies, Queries & Officer Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Case Summary Card */}
          <div className="gov-panel">
            <div className="gov-panel-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#002147', fontFamily: 'var(--font-mono)' }}>
                    {instrument.instrumentNumber}
                  </span>
                  <span className="gov-nav-badge" style={{ background: '#475569' }}>
                    v{instrument.version}
                  </span>
                  {instrument.supersededBy && (
                    <span className="gov-nav-badge" style={{ background: '#7c3aed' }}>
                      Superseded by {instrument.supersededBy}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: '#003366', fontWeight: 700, marginTop: '2px' }}>
                  {instrument.institutionName} ({instrument.institutionAicteId})
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <TrustBadge level={instrument.trustLevel} size="md" />
                <StatusBadge status={instrument.status} />
              </div>
            </div>

            <div className="gov-panel-body" style={{ padding: '12px' }}>
              {/* Hold Alert Banner if active */}
              {instrument.isHoldActive && (
                <div className="gov-alert gov-alert-warning" style={{ marginBottom: '10px' }}>
                  <Lock size={14} style={{ color: '#b45309', flexShrink: 0 }} />
                  <div>
                    <strong>ADMINISTRATIVE / LEGAL HOLD ACTIVE:</strong> {instrument.holdReason}
                  </div>
                </div>
              )}

              {/* Metadata Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '11px', background: '#f8fafc', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '2px' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Deposit Amount:</span>
                  <div style={{ fontWeight: 800, color: '#15803d', fontSize: '13px' }}>{instrument.formattedAmount}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>APH Mandated Requirement:</span>
                  <div style={{ fontWeight: 700, color: '#002147' }}>₹{instrument.aphRequiredAmount.toLocaleString('en-IN')}.00</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Issuing Bank &amp; Branch:</span>
                  <div style={{ fontWeight: 600 }}>{instrument.bankName} ({instrument.ifscCode})</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Tenor &amp; Maturity:</span>
                  <div>{instrument.tenorMonths} Mos ({instrument.maturityDate})</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Beneficiary In Favour:</span>
                  <div style={{ color: '#334155' }}>{instrument.beneficiaryName}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Lien Clause Endorsed:</span>
                  <div style={{ color: '#334155' }}>{instrument.lienMarkedTo}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Discrepancy Rules Evaluation Panel (R1 - R10) */}
          <div className="gov-panel">
            <div className="gov-panel-header">
              <div className="gov-panel-title">
                <AlertTriangle size={14} style={{ color: instrument.discrepancies.length > 0 ? '#b91c1c' : '#15803d' }} />
                <span>Deterministic Rules Engine Verification (R1–R10 Checks)</span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                {instrument.discrepancies.length} discrepancies flagged
              </span>
            </div>

            <div className="gov-panel-body" style={{ padding: '12px' }}>
              {instrument.discrepancies.length === 0 ? (
                <div className="gov-alert gov-alert-success" style={{ marginBottom: 0 }}>
                  <CheckCircle2 size={15} style={{ color: '#15803d' }} />
                  <span>No active discrepancies detected. Rules R1 through R10 successfully verified under APH 2024-27.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {instrument.discrepancies.map((disc, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fca5a5',
                        borderRadius: '2px',
                        padding: '8px 10px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '12px', color: '#b91c1c' }}>
                          RULE {disc.code}: {disc.ruleTitle}
                        </span>
                        <span style={{ background: '#b91c1c', color: '#ffffff', fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '2px' }}>
                          {disc.severity}
                        </span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#7f1d1d', marginTop: '4px' }}>
                        {disc.message}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '4px', fontSize: '10px' }}>
                        <div><span style={{ color: '#64748b' }}>Required:</span> <strong style={{ color: '#002147' }}>{disc.requiredValue}</strong></div>
                        <div><span style={{ color: '#64748b' }}>Detected:</span> <strong style={{ color: '#b91c1c' }}>{disc.detectedValue}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Queries Section */}
          <div className="gov-panel">
            <div className="gov-panel-header">
              <div className="gov-panel-title">
                <MessageSquare size={14} style={{ color: '#003366' }} />
                <span>Scrutiny Queries &amp; Clarification Log ({instrument.queries.length})</span>
              </div>

              {['BUREAU_OFFICER', 'REGIONAL_VERIFIER'].includes(activePersona.role) && (
                <button
                  onClick={() => setIsQueryModalOpen(true)}
                  className="btn-gov btn-gov-secondary btn-gov-sm"
                  style={{ border: '1px solid #003366', color: '#003366' }}
                >
                  <HelpCircle size={11} />
                  <span>Raise Scrutiny Query</span>
                </button>
              )}
            </div>

            <div className="gov-panel-body" style={{ padding: '12px' }}>
              {instrument.queries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '12px', color: '#64748b', fontSize: '11px' }}>
                  No outstanding scrutiny queries recorded for this case.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {instrument.queries.map((q) => (
                    <div
                      key={q.id}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderLeft: `3px solid ${q.status === 'RESOLVED' ? '#15803d' : '#b45309'}`,
                        borderRadius: '2px',
                        padding: '8px 10px',
                        fontSize: '11px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#002147' }}>Field: {q.field}</span>
                        <span style={{ fontSize: '9px', fontWeight: 700, color: q.status === 'RESOLVED' ? '#15803d' : '#b45309' }}>
                          [{q.status}]
                        </span>
                      </div>
                      <div style={{ marginTop: '2px', color: '#334155' }}><strong>Query:</strong> {q.queryText}</div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '1px' }}><strong>Remedy:</strong> {q.remedyAction}</div>

                      {q.replyText && (
                        <div style={{ marginTop: '6px', background: '#f0fdf4', border: '1px solid #86efac', padding: '6px', borderRadius: '2px', color: '#14532d' }}>
                          <strong>Institution Reply:</strong> {q.replyText}
                          <div style={{ fontSize: '9px', color: '#15803d', marginTop: '2px' }}>Replied by Signatory at {q.repliedAt?.slice(0, 10)}</div>
                        </div>
                      )}

                      {!q.replyText && activePersona.role.includes('INSTITUTION') && (
                        <button
                          onClick={() => {
                            setActiveQueryId(q.id);
                            setIsReplyModalOpen(true);
                          }}
                          className="btn-gov btn-gov-saffron btn-gov-sm"
                          style={{ marginTop: '6px' }}
                        >
                          <Send size={10} />
                          <span>Submit Clarification / Remedy</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Historical Temporal State Reconstruction Slider */}
          <div className="gov-panel">
            <div className="gov-panel-header">
              <div className="gov-panel-title">
                <Calendar size={14} style={{ color: '#003366' }} />
                <span>Historical Temporal State Reconstruction &amp; Audit Playback</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#b45309', fontWeight: 800 }}>
                As-Of: Year {asOfYear}
              </span>
            </div>

            <div className="gov-panel-body" style={{ padding: '12px' }}>
              <input
                type="range"
                min={2014}
                max={2034}
                value={asOfYear}
                onChange={(e) => setAsOfYear(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#003366', cursor: 'pointer' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                <span>2014 (APH 2014-15)</span>
                <span>2020 (Pandemic Exemption)</span>
                <span>2026 (Current)</span>
                <span>2034 (Future Tenor)</span>
              </div>

              <div className="gov-alert gov-alert-info" style={{ marginTop: '8px', marginBottom: 0 }}>
                {asOfYear < Number(instrument.issueDate.slice(0, 4)) ? (
                  <span>⏳ <strong>Year {asOfYear}:</strong> Instrument was NOT YET ISSUED. (Created in {instrument.issueDate})</span>
                ) : asOfYear > Number(instrument.maturityDate.slice(0, 4)) ? (
                  <span style={{ color: '#b91c1c' }}>⚠️ <strong>Year {asOfYear}:</strong> Instrument lock-in period has CONCLUDED. Status: MATURED / OVERDUE.</span>
                ) : (
                  <span style={{ color: '#15803d' }}>✓ <strong>Year {asOfYear}:</strong> Active statutory security deposit in full legal force. {Number(instrument.maturityDate.slice(0, 4)) - asOfYear} years remaining until maturity.</span>
                )}
              </div>
            </div>
          </div>

          {/* Officer Action Command Center with Maker-Checker Multi-Stage Approvals */}
          <div className="gov-panel" style={{ border: '2px solid #003366' }}>
            <div className="gov-panel-header" style={{ background: '#002147', color: '#ffffff' }}>
              <div style={{ fontWeight: 700, fontSize: '12px', color: '#ffffff' }}>
                Casework Decisions &amp; Multi-Stage Maker-Checker Workflow
              </div>
              <span style={{ fontSize: '11px', color: '#93c5fd' }}>
                Role: {activePersona.title}
              </span>
            </div>

            <div className="gov-panel-body" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {/* Accept Scrutiny L1 */}
                <button
                  onClick={() => elevateTrustLevel(instrument.id, 'L1', 'Officer matched scan with typed data')}
                  className="btn-gov btn-gov-secondary btn-gov-sm"
                  title="Mark document-checked (L1)"
                >
                  <CheckCircle2 size={12} style={{ color: '#b45309' }} />
                  <span>Accept Scrutiny (→ L1)</span>
                </button>

                {/* Request Bank Confirmation Link (Innovation I11) */}
                <button
                  onClick={() => {
                    setActiveTab('BANK_CONFIRM');
                  }}
                  className="btn-gov btn-gov-secondary btn-gov-sm"
                  title="Simulate Bank Branch Confirmation Link"
                >
                  <Building size={12} style={{ color: '#15803d' }} />
                  <span>Initiate Bank Confirmation</span>
                </button>

                {/* Maker-Checker Stage 2: Regional Verifier Recommendation */}
                {instrument.status === 'RELEASE_REQUESTED' && (
                  <button
                    onClick={() => recommendRegionalRelease(instrument.id, 'Regional office verified no pending student embezzlement')}
                    className="btn-gov btn-gov-primary btn-gov-sm"
                  >
                    <ShieldCheck size={12} />
                    <span>Stage 2: Regional Verify &amp; Forward</span>
                  </button>
                )}

                {/* Maker-Checker Stage 3: Bureau Scrutiny Recommendation */}
                {instrument.status === 'REGIONAL_VERIFIED' && (
                  <button
                    onClick={() => recommendBureauRelease(instrument.id, 'APH eligibility & interest reconciliation verified')}
                    className="btn-gov btn-gov-primary btn-gov-sm"
                  >
                    <FileCheck size={12} />
                    <span>Stage 3: Bureau Recommend to Authority</span>
                  </button>
                )}

                {/* Administrative Hold */}
                <button
                  onClick={() => {
                    if (instrument.isHoldActive) {
                      toggleHoldStatus(instrument.id);
                    } else {
                      setIsHoldModalOpen(true);
                    }
                  }}
                  className="btn-gov btn-gov-secondary btn-gov-sm"
                >
                  {instrument.isHoldActive ? <Unlock size={12} /> : <Lock size={12} />}
                  <span>{instrument.isHoldActive ? 'Remove Legal Hold' : 'Place on Hold'}</span>
                </button>

                {/* Approve Release & Issue NOC (Scenario 5 & 6) */}
                <button
                  onClick={() => setIsApproveModalOpen(true)}
                  className="btn-gov btn-gov-saffron btn-gov-sm"
                >
                  <Award size={12} />
                  <span>
                    {instrument.status === 'BUREAU_RECOMMENDED'
                      ? 'Stage 4: Executive NOC Approval'
                      : 'Approve Release & Issue NOC'}
                  </span>
                </button>

                {/* Export Evidence Pack Bundle (Innovation I1) */}
                <button
                  onClick={() => {
                    addToast(
                      'success',
                      'Evidence Pack Generated (I1)',
                      `Compiled audit bundle for ${instrument.instrumentNumber} (FDR scan + Bank confirmation + SHA-256 Manifest).`
                    );
                  }}
                  className="btn-gov btn-gov-secondary btn-gov-sm"
                >
                  <Download size={12} />
                  <span>Evidence Pack Bundle</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Raise Scrutiny Query */}
      {isQueryModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="gov-panel" style={{ width: '100%', maxWidth: '500px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            <div className="gov-panel-header" style={{ background: '#002147', color: '#ffffff' }}>
              <span style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>
                Raise Scrutiny Query on FDR #{instrument.instrumentNumber}
              </span>
            </div>
            <div className="gov-panel-body">
              <form onSubmit={handleRaiseQuerySubmit}>
                <div className="gov-form-group">
                  <label className="gov-label">Flagged Field:</label>
                  <select value={queryField} onChange={(e) => setQueryField(e.target.value)} className="gov-select">
                    <option value="amount">Deposit Amount (Shortfall / Mismatch)</option>
                    <option value="beneficiaryName">Beneficiary Name (Must be Member Secretary AICTE)</option>
                    <option value="lienMarkedTo">Lien Marking (Must be AICTE New Delhi)</option>
                    <option value="ifscCode">IFSC Code / Branch Authenticity</option>
                    <option value="maturityDate">Maturity Date / Tenor Inconsistency</option>
                    <option value="documents">Missing Affidavit / Unclear Scan</option>
                  </select>
                </div>

                <div className="gov-form-group">
                  <label className="gov-label">Officer Query Description:<span className="req">*</span></label>
                  <textarea
                    rows={3}
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder="Specify discrepancy details observed during scrutiny..."
                    className="gov-textarea"
                    required
                  />
                </div>

                <div className="gov-form-group">
                  <label className="gov-label">Required Remedial Action by Institution:<span className="req">*</span></label>
                  <input
                    type="text"
                    value={queryRemedy}
                    onChange={(e) => setQueryRemedy(e.target.value)}
                    placeholder="e.g. Upload supplementary FDR of ₹10,00,000 or amend lien clause"
                    className="gov-input"
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setIsQueryModalOpen(false)} className="btn-gov btn-gov-secondary btn-gov-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn-gov btn-gov-primary btn-gov-sm">
                    Dispatch Query to Institution
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Reply to Query */}
      {isReplyModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="gov-panel" style={{ width: '100%', maxWidth: '500px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            <div className="gov-panel-header" style={{ background: '#002147', color: '#ffffff' }}>
              <span style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>
                Institution Clarification &amp; Remedy
              </span>
            </div>
            <div className="gov-panel-body">
              <form onSubmit={handleReplySubmit}>
                <div className="gov-form-group">
                  <label className="gov-label">Clarification &amp; Supplementary Details:<span className="req">*</span></label>
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Enter details of supplementary deposit, bank endorsement letter, or rectification submitted..."
                    className="gov-textarea"
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setIsReplyModalOpen(false)} className="btn-gov btn-gov-secondary btn-gov-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn-gov btn-gov-primary btn-gov-sm">
                    Submit Clarification
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Approve Release & Issue NOC */}
      {isApproveModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="gov-panel" style={{ width: '100%', maxWidth: '520px', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', border: '2px solid #002147' }}>
            <div className="gov-panel-header" style={{ background: '#002147', color: '#ffffff' }}>
              <span style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>
                Competent Authority Release Approval &amp; NOC Signature
              </span>
            </div>
            <div className="gov-panel-body">
              <p style={{ fontSize: '11px', color: '#475569', marginBottom: '10px' }}>
                Confirm release of security deposit #{instrument.instrumentNumber} ({instrument.formattedAmount}) for {instrument.institutionName}.
              </p>

              {/* Invariant Rule Notification */}
              <div className={`gov-alert ${instrument.trustLevel === 'L2' ? 'gov-alert-success' : 'gov-alert-danger'}`} style={{ marginBottom: '12px' }}>
                {instrument.trustLevel === 'L2' ? (
                  <div>
                    <strong>TRUST LEVEL L2 VERIFIED:</strong> Bank confirmation evidence record attached. Safe to issue digital NOC.
                  </div>
                ) : (
                  <div>
                    <strong>SECURITY INVARIANT WARNING:</strong> Current trust level is <code>{instrument.trustLevel}</code>.
                    Release cannot proceed below L2 unless a documented Competent Authority Exception Note is entered below.
                  </div>
                )}
              </div>

              {instrument.trustLevel !== 'L2' && (
                <div className="gov-form-group">
                  <label className="gov-label" style={{ color: '#b91c1c' }}>
                    Mandatory Competent Authority Exception Note (Required to bypass L2 check):<span className="req">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={exceptionNote}
                    onChange={(e) => setExceptionNote(e.target.value)}
                    placeholder="Enter official executive justification and council file reference number..."
                    className="gov-textarea"
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
                <button onClick={() => setIsApproveModalOpen(false)} className="btn-gov btn-gov-secondary btn-gov-sm">
                  Cancel
                </button>
                <button onClick={handleApproveRelease} className="btn-gov btn-gov-saffron btn-gov-sm">
                  Execute Release &amp; Issue Digital NOC
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Place On Hold */}
      {isHoldModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="gov-panel" style={{ width: '100%', maxWidth: '460px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            <div className="gov-panel-header" style={{ background: '#002147', color: '#ffffff' }}>
              <span style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>
                Place Case on Administrative Hold
              </span>
            </div>
            <div className="gov-panel-body">
              <div className="gov-form-group">
                <label className="gov-label">Official Ground for Hold:<span className="req">*</span></label>
                <textarea
                  rows={3}
                  value={holdReasonInput}
                  onChange={(e) => setHoldReasonInput(e.target.value)}
                  placeholder="e.g. State Vigilance Bureau enquiry pending / Court stay order..."
                  className="gov-textarea"
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button onClick={() => setIsHoldModalOpen(false)} className="btn-gov btn-gov-secondary btn-gov-sm">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toggleHoldStatus(instrument.id, holdReasonInput);
                    setIsHoldModalOpen(false);
                    setHoldReasonInput('');
                  }}
                  className="btn-gov btn-gov-primary btn-gov-sm"
                >
                  Confirm Administrative Hold
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
