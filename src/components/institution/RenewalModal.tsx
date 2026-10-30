import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Instrument } from '../../types';
import { RefreshCw, X, CheckCircle } from 'lucide-react';

interface RenewalModalProps {
  instrument: Instrument;
  isOpen: boolean;
  onClose: () => void;
}

export const RenewalModal: React.FC<RenewalModalProps> = ({ instrument, isOpen, onClose }) => {
  const { submitRenewal } = useApp();

  const [newNumber, setNewNumber] = useState(`${instrument.instrumentNumber}-R${(instrument.version || 1) + 1}`);
  const [newMaturityDate, setNewMaturityDate] = useState('2035-01-22');
  const [renewalAmount, setRenewalAmount] = useState<number>(instrument.amount);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitRenewal(instrument.id, {
      instrumentNumber: newNumber,
      maturityDate: newMaturityDate,
      amount: renewalAmount
    });
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
            <RefreshCw size={16} />
            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
              RENEWAL OF SECURITY DEPOSIT (VERSION CHAINING v{(instrument.version || 1) + 1})
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
          {/* Parent Instrument Snapshot */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              padding: '0.85rem',
              marginBottom: '1rem',
              fontSize: '0.8rem'
            }}
          >
            <div style={{ color: '#64748b', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Current Expiring Instrument Record:
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span className="font-mono" style={{ fontWeight: 700, color: 'var(--gov-navy-dark)' }}>
                {instrument.instrumentNumber} (Version: {instrument.version || 1}.0)
              </span>
              <span style={{ fontWeight: 700, color: 'var(--gov-green-dark)' }}>{instrument.formattedAmount}</span>
            </div>
            <div style={{ color: '#b45309', marginTop: '2px', fontSize: '0.75rem' }}>
              <strong>Maturity Date:</strong> {instrument.maturityDate} · <strong>Bank:</strong> {instrument.bankName}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '0.85rem' }}>
              <label className="gov-label">
                New Renewal FDR / BG Certificate Number <span className="req">*</span>
              </label>
              <input
                type="text"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                className="gov-input font-mono"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.85rem' }}>
              <div>
                <label className="gov-label">
                  Renewed Deposit Amount (₹) <span className="req">*</span>
                </label>
                <input
                  type="number"
                  value={renewalAmount}
                  onChange={(e) => setRenewalAmount(Number(e.target.value))}
                  className="gov-input font-mono"
                  required
                />
              </div>

              <div>
                <label className="gov-label">
                  New Extended Maturity Date <span className="req">*</span>
                </label>
                <input
                  type="date"
                  value={newMaturityDate}
                  onChange={(e) => setNewMaturityDate(e.target.value)}
                  className="gov-input font-mono"
                  required
                />
              </div>
            </div>

            <div className="gov-alert gov-alert-success" style={{ marginBottom: '1.25rem', fontSize: '0.75rem' }}>
              <strong>Statutory Coverage Continuity Guarantee (Clause 1.4):</strong> The parent instrument #{instrument.instrumentNumber} will be marked as superseded in the cryptographic ledger. Version {(instrument.version || 1) + 1} takes over active coverage immediately with zero temporal coverage gap.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn-gov btn-gov-secondary btn-gov-sm">
                Cancel
              </button>
              <button type="submit" className="btn-gov btn-gov-primary btn-gov-sm">
                <CheckCircle size={14} />
                <span>Submit Renewal & Chain v{(instrument.version || 1) + 1}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
