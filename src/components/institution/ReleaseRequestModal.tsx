import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Instrument } from '../../types';
import { Award, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface ReleaseRequestModalProps {
  instrument: Instrument;
  isOpen: boolean;
  onClose: () => void;
}

export const ReleaseRequestModal: React.FC<ReleaseRequestModalProps> = ({ instrument, isOpen, onClose }) => {
  const { requestRelease } = useApp();

  const [affidavitName, setAffidavitName] = useState('Non_Embezzlement_Affidavit_2026.pdf');
  const [boardResolutionNo, setBoardResolutionNo] = useState('BR/2026/09/AICTE');

  if (!isOpen) return null;

  // Eligibility evaluation
  const isL2 = instrument.trustLevel === 'L2';
  const noHolds = !instrument.isHoldActive;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestRelease(instrument.id, `${affidavitName} (Resolution: ${boardResolutionNo})`);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="gov-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#ffffff',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
        }}
      >
        <div className="gov-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={16} />
            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
              APPLICATION FOR SECURITY DEPOSIT DISCHARGE & NOC
            </span>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '2px' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.25rem' }}>
          {/* Eligibility Checklist */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              padding: '0.85rem',
              marginBottom: '1rem',
              fontSize: '0.8rem'
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--gov-navy-dark)', marginBottom: '0.4rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>
              Statutory Release Eligibility Checklist (APH Clause 1.5):
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isL2 ? 'var(--gov-green-dark)' : '#dc2626' }}>
                {isL2 ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
                <span>
                  Trust Level L2 (Bank Verified): <strong>{instrument.trustLevel}</strong> {isL2 ? '✓ Satisfied' : '(Non-compliant - Must be L2)'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: noHolds ? 'var(--gov-green-dark)' : '#dc2626' }}>
                {noHolds ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
                <span>
                  Vigilance / Administrative Hold: <strong>{noHolds ? 'No Active Holds ✓' : 'HOLD ACTIVE (Discharge Prohibited)'}</strong>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gov-navy-medium)' }}>
                <CheckCircle size={15} />
                <span>
                  Lock-in Period: <strong>{instrument.tenorMonths} Months lock-in fulfilled ✓</strong>
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '0.85rem' }}>
              <label className="gov-label">
                Governing Board Resolution No. for Deposit Discharge <span className="req">*</span>
              </label>
              <input
                type="text"
                value={boardResolutionNo}
                onChange={(e) => setBoardResolutionNo(e.target.value)}
                className="gov-input font-mono"
                required
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="gov-label">
                Uploaded Statutory Non-Embezzlement Affidavit & Compliance Document <span className="req">*</span>
              </label>
              <input
                type="text"
                value={affidavitName}
                onChange={(e) => setAffidavitName(e.target.value)}
                className="gov-input"
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn-gov btn-gov-secondary btn-gov-sm">
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-gov btn-gov-saffron btn-gov-sm"
                disabled={!isL2 || !noHolds}
              >
                <span>Submit Formal Release Request to AICTE</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
