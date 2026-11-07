import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrustBadge } from '../common/TrustBadge';
import { BankLogo } from '../common/BankLogo';
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Lock,
  Building
} from 'lucide-react';

export const BankConfirmationPortal: React.FC = () => {
  const { instruments, attachBankEvidence, setActiveTab, setSelectedInstrumentId } = useApp();

  const [selectedInstId, setSelectedInstId] = useState<string>(
    instruments.find((i) => i.trustLevel === 'L1' || i.trustLevel === 'L0')?.id || instruments[0].id
  );

  const [branchManagerName, setBranchManagerName] = useState('Shri Alok Verma');
  const [branchName, setBranchName] = useState('Parliament Street Branch, New Delhi');
  const [branchAddress, setBranchAddress] = useState('11, Parliament Street, New Delhi - 110001');
  const [referenceNo, setReferenceNo] = useState(`SBI-CONF-${Date.now().toString().slice(-4)}`);
  const [lienConfirmed, setLienConfirmed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const instrument = instruments.find((i) => i.id === selectedInstId) || instruments[0];

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await attachBankEvidence(instrument.id, {
      branchName,
      branchAddress,
      referenceNo,
      confirmedBy: `${branchManagerName} (Chief Branch Manager)`
    });
    setIsSubmitting(false);
    setSelectedInstrumentId(instrument.id);
    setActiveTab('CASE_WORKSPACE');
  };

  return (
    <div style={{ padding: '1.25rem', maxWidth: '1200px', margin: '0 auto' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Landmark size={24} style={{ color: 'var(--gov-navy-medium)' }} />
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gov-navy-dark)', margin: 0 }}>
              SCHEDULED COMMERCIAL BANK CONFIRMATION CHANNEL (INNOVATION I11)
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem' }}>
              Direct branch officer authentication protocol for joint lien verification and deposit confirmation under AICTE Tripartite Agreement guidelines. Directly elevates instruments to Trust Level L2 (Bank Verified).
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left: Instrument Selector & Current Evidence Status */}
        <div className="gov-panel">
          <div className="gov-panel-header">
            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>
              STEP 1: SELECT DEPOSIT INSTRUMENT RECORD
            </span>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label className="gov-label">
                Pending Verification Queue: <span className="req">*</span>
              </label>
              <select
                value={selectedInstId}
                onChange={(e) => setSelectedInstId(e.target.value)}
                className="gov-select font-mono"
                style={{ fontSize: '0.82rem' }}
              >
                {instruments.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    [{inst.trustLevel}] {inst.instrumentNumber} — {inst.institutionName} ({inst.formattedAmount})
                  </option>
                ))}
              </select>
            </div>

            {/* Instrument Summary Table */}
            <table className="gov-table" style={{ fontSize: '0.8rem' }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 700, width: '40%', background: '#f8fafc', color: 'var(--gov-navy-dark)' }}>Current Trust Level:</td>
                  <td><TrustBadge level={instrument.trustLevel} size="sm" /></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, background: '#f8fafc', color: 'var(--gov-navy-dark)' }}>Institution Name:</td>
                  <td><strong>{instrument.institutionName}</strong></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, background: '#f8fafc', color: 'var(--gov-navy-dark)' }}>Principal Amount:</td>
                  <td><strong style={{ color: 'var(--gov-green-dark)', fontSize: '0.95rem' }}>{instrument.formattedAmount}</strong></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, background: '#f8fafc', color: 'var(--gov-navy-dark)' }}>Issuing Bank &amp; Branch:</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BankLogo bankName={instrument.bankName} size="sm" />
                      <div>
                        <strong>{instrument.bankName}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{instrument.branchName} · IFSC: {instrument.ifscCode}</div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, background: '#f8fafc', color: 'var(--gov-navy-dark)' }}>Maturity Date:</td>
                  <td className="font-mono">{instrument.maturityDate}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, background: '#f8fafc', color: 'var(--gov-navy-dark)' }}>Joint Lien Title:</td>
                  <td style={{ color: '#334155' }}>{instrument.lienMarkedTo}</td>
                </tr>
              </tbody>
            </table>

            {instrument.evidenceRecord && (
              <div
                className="gov-alert gov-alert-success"
                style={{ marginTop: '1rem', fontSize: '0.75rem' }}
              >
                <div style={{ fontWeight: 800 }}>✓ EXISTING L2 EVIDENCE RECORD ON FILE</div>
                <div>Confirmed by: {instrument.evidenceRecord.confirmedBy}</div>
                <div>Ref Dispatch No: {instrument.evidenceRecord.referenceNo} ({instrument.evidenceRecord.confirmedAt.slice(0, 10)})</div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Bank Branch Authentication Form */}
        <div className="gov-panel">
          <div className="gov-panel-header" style={{ background: 'var(--gov-navy-medium)' }}>
            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>
              STEP 2: BRANCH OFFICER ATTESTATION FORM
            </span>
          </div>

          <div style={{ padding: '1.25rem' }}>
            <form onSubmit={handleConfirm}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label className="gov-label">
                  Authorized Branch Manager / Officer Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  value={branchManagerName}
                  onChange={(e) => setBranchManagerName(e.target.value)}
                  className="gov-input"
                  required
                />
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <label className="gov-label">
                  Bank Branch Name & Centre <span className="req">*</span>
                </label>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="gov-input"
                  required
                />
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <label className="gov-label">
                  Branch Postal Address & PIN Code <span className="req">*</span>
                </label>
                <input
                  type="text"
                  value={branchAddress}
                  onChange={(e) => setBranchAddress(e.target.value)}
                  className="gov-input"
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="gov-label">
                  Bank Official Dispatch Reference Number <span className="req">*</span>
                </label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="gov-input font-mono"
                  required
                />
              </div>

              {/* Legal Confirmation Checkbox */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  padding: '0.85rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.78rem',
                  color: '#1e293b',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start'
                }}
              >
                <input
                  type="checkbox"
                  id="lien-attest"
                  checked={lienConfirmed}
                  onChange={(e) => setLienConfirmed(e.target.checked)}
                  style={{ marginTop: '2px', cursor: 'pointer' }}
                  required
                />
                <label htmlFor="lien-attest" style={{ cursor: 'pointer', lineHeight: 1.4 }}>
                  <strong>Statutory Declaration:</strong> I hereby certify that FDR #{instrument.instrumentNumber} of principal sum <strong>{instrument.formattedAmount}</strong> is held in safe custody at this branch, duly lien-marked in favor of <strong>Member Secretary, AICTE</strong>. This deposit will not be released or encashed without a digitally verifiable AICTE Release NOC.
                </label>
              </div>

              {/* Visual Stamp Preview */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '3px',
                  padding: '8px 12px',
                  marginBottom: '1rem'
                }}
              >
                <img
                  src="./assets/stamps/stamp-bank-confirmed.svg"
                  alt="Bank CBS Attestation Stamp"
                  style={{ height: '55px', width: 'auto' }}
                />
                <div style={{ fontSize: '0.75rem', color: '#1e3a8a', lineHeight: 1.3 }}>
                  <div style={{ fontWeight: 800 }}>Direct CBS Attestation Preview</div>
                  <div>Upon sign-off, official CBS lien mark is registered into AICTE SHA-256 Ledger (Level L2).</div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !lienConfirmed}
                className="btn-gov btn-gov-primary"
                style={{ width: '100%', padding: '0.65rem 1rem', fontWeight: 800 }}
              >
                <ShieldCheck size={16} />
                <span>Submit Official Bank Confirmation (Elevate to Level L2)</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
