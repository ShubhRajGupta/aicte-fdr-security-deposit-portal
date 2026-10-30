import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, CheckCircle, ArrowRight, Play, Award, ShieldAlert, Clock, QrCode } from 'lucide-react';

export const ScenarioGuideModal: React.FC = () => {
  const { isScenarioGuideOpen, setIsScenarioGuideOpen, runScenario } = useApp();

  if (!isScenarioGuideOpen) return null;

  const scenarios = [
    {
      num: 1,
      title: 'New Submission with Deliberate Shortfall (Rule R1)',
      actor: 'Regulation Bureau Scrutiny Officer',
      action: 'Open Case Workspace for FDR #89421',
      description: 'System automatically flags Rule R1: Institution submitted ₹25,00,000 against required ₹35,00,000 per APH 2024-27 Table 1.4.',
      expected: 'System highlights exact shortfall (₹10.00 Lakhs) and blocks approval with an automated discrepancy defect.',
      icon: <ShieldAlert size={16} style={{ color: '#dc2626' }} />
    },
    {
      num: 2,
      title: 'Officer Scrutiny Query & Institution Defect Rectification',
      actor: 'Institution Authorized Signatory',
      action: 'Switch to Institution Portal & View Open Scrutiny Defect',
      description: 'Officer raised query specifying mandatory remedy. Institution reviews, provides supplementary guarantee details, and files rectification.',
      expected: 'Defect status updates, audit record is chained, and case refreshes in the Regional Scrutiny Officer queue.',
      icon: <CheckCircle size={16} style={{ color: 'var(--gov-navy-medium)' }} />
    },
    {
      num: 3,
      title: 'Time-Travel to T-90 Days Before Maturity',
      actor: 'Automated Lifecycle Timeline Engine',
      action: 'Execute Time-Travel Jump to Jan 20, 2027 (T-90)',
      description: 'Simulates temporal progression to 90 days before maturity. Instrument status changes from ACTIVE to EXPIRING.',
      expected: 'Automated SMS, Email, and In-Portal statutory notices dispatched to the Institution Head and Regional Director.',
      icon: <Clock size={16} style={{ color: 'var(--gov-saffron)' }} />
    },
    {
      num: 4,
      title: 'Deposit Renewal with Zero Coverage Gap Chaining',
      actor: 'Institution Authorized Officer',
      action: 'Submit Renewal Certificate (Chains Version v2 to v1)',
      description: 'Institution submits renewed FDR. Central Registry generates version 2 chained cryptographically to parent without legal gap.',
      expected: 'Unbroken statutory security coverage documented with zero temporal gap in institutional accreditation history.',
      icon: <ArrowRight size={16} style={{ color: 'var(--gov-green-dark)' }} />
    },
    {
      num: 5,
      title: 'Premature Release Attempt Below L2 BLOCKED vs. L2 Approval',
      actor: 'Competent Authority (Member Secretary)',
      action: 'Attempt Release at L0/L1 vs. Level L2 with Bank Evidence',
      description: 'Statutory Invariant: Release is strictly prohibited below Trust Level L2 (Bank Verified). Unauthorized release attempt is blocked.',
      expected: 'Release and NOC issuance succeeds strictly when L2 Bank Confirmation is verified on file.',
      icon: <ShieldAlert size={16} style={{ color: 'var(--gov-saffron)' }} />
    },
    {
      num: 6,
      title: 'NIC Secure QR Verifiable NOC & SHA-256 Audit Explorer',
      actor: 'Auditor, Bank Branch Manager & Evaluation Judge',
      action: 'Scan Live QR Code & Inspect Cryptographic Hash Ledger',
      description: 'Verify public NOC certificate via QR code. Tamper Explorer verifies cryptographic SHA-256 block continuity from intake to discharge.',
      expected: '100% cryptographic proof confirms zero silent database modifications or forged certificates.',
      icon: <QrCode size={16} style={{ color: '#7c3aed' }} />
    }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
    >
      <div
        className="gov-panel"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
        }}
      >
        {/* Header */}
        <div className="gov-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} />
            <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>
              OFFICIAL 8-MINUTE HACKATHON DEMONSTRATION SCRIPT (SIH PSID 26265)
            </span>
          </div>
          <button
            onClick={() => setIsScenarioGuideOpen(false)}
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '2px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '1.25rem', overflowY: 'auto' }}>
          <div className="gov-alert gov-alert-info" style={{ marginBottom: '1rem', fontSize: '0.78rem' }}>
            Click <strong>"Execute Scenario"</strong> to instantly configure all actors, sample records, and screens for live demonstration to the jury.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {scenarios.map((sc) => (
              <div
                key={sc.num}
                style={{
                  border: '1px solid #cbd5e1',
                  borderLeft: '4px solid var(--gov-navy-medium)',
                  background: '#f8fafc',
                  padding: '0.85rem 1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <div style={{ marginTop: '2px' }}>{sc.icon}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ background: 'var(--gov-navy-dark)', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '1px 6px' }}>
                          SCENARIO {sc.num}
                        </span>
                        <strong style={{ color: 'var(--gov-navy-dark)', fontSize: '0.88rem' }}>{sc.title}</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                        <strong>Active Actor:</strong> {sc.actor} · <strong>Key Action:</strong> {sc.action}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#334155', margin: '4px 0 2px 0', lineHeight: 1.35 }}>
                        {sc.description}
                      </p>
                      <div style={{ fontSize: '0.74rem', color: 'var(--gov-green-dark)', fontWeight: 600 }}>
                        ✓ Expected Verdict: {sc.expected}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      runScenario(sc.num);
                      setIsScenarioGuideOpen(false);
                    }}
                    className="btn-gov btn-gov-saffron btn-gov-sm"
                    style={{ fontWeight: 800, padding: '0.35rem 0.75rem', flexShrink: 0 }}
                  >
                    <Play size={12} />
                    <span>Run Scenario {sc.num}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '0.75rem 1.25rem', background: '#f8fafc', borderTop: '1px solid #cbd5e1', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setIsScenarioGuideOpen(false)}
            className="btn-gov btn-gov-secondary btn-gov-sm"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
