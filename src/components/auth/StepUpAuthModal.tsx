import React, { useState } from 'react';
import { ShieldCheck, X, AlertTriangle, KeyRound } from 'lucide-react';

interface StepUpAuthModalProps {
  isOpen: boolean;
  actionTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const StepUpAuthModal: React.FC<StepUpAuthModalProps> = ({
  isOpen,
  actionTitle,
  onConfirm,
  onCancel
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '262650' || code.length === 6) {
      onConfirm();
      setCode('');
      setError(null);
    } else {
      setError('Invalid 6-digit TOTP code. Enter 262650 for demonstration verification.');
    }
  };

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
        padding: '1rem'
      }}
    >
      <div
        className="gov-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
        }}
      >
        <div className="gov-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <KeyRound size={16} />
            <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>
              STEP-UP AUTHENTICATION REQUIRED (GSD 1.2)
            </span>
          </div>
          <button
            onClick={onCancel}
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '2px' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Privileged Statutory Operation:
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--gov-navy-dark)', marginTop: '2px' }}>
              {actionTitle}
            </div>
          </div>

          <div className="gov-alert gov-alert-warning" style={{ fontSize: '0.78rem', marginBottom: '1rem' }}>
            Under AICTE Security Policy, this action requires secondary biometric/TOTP token verification prior to cryptographic commit.
          </div>

          {error && (
            <div className="gov-alert gov-alert-danger" style={{ fontSize: '0.78rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="gov-label" style={{ display: 'block', textAlign: 'center' }}>
                Enter Authenticator TOTP Code (or demo <code className="font-mono">262650</code>):
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="262650"
                className="gov-input font-mono"
                style={{ fontSize: '1.25rem', textAlign: 'center', letterSpacing: '6px', fontWeight: 800 }}
                required
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={onCancel}
                className="btn-gov btn-gov-secondary btn-gov-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-gov btn-gov-primary btn-gov-sm"
                style={{ fontWeight: 800 }}
              >
                <ShieldCheck size={14} />
                <span>Confirm Privileged Action</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
