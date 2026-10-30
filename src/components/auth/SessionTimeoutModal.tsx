import React from 'react';
import { Clock, ShieldAlert, LogOut, RefreshCw } from 'lucide-react';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  secondsRemaining: number;
  onExtend: () => void;
  onLogout: () => void;
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  isOpen,
  secondsRemaining,
  onExtend,
  onLogout
}) => {
  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 10000,
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
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          border: '2px solid #dc2626'
        }}
      >
        <div className="gov-panel-header" style={{ background: '#dc2626' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} />
            <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>
              SESSION TIMEOUT WARNING (NIST SP 800-63B)
            </span>
          </div>
        </div>

        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
          <ShieldAlert size={36} style={{ color: '#dc2626', margin: '0 auto 0.75rem' }} />
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--gov-navy-dark)', margin: 0 }}>
            Session Expiring Due to Inactivity
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0.5rem 0 1.25rem 0', lineHeight: 1.4 }}>
            In accordance with Government of India electronic security guidelines, inactive sessions are automatically terminated to prevent unauthorized access.
          </p>

          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '0.75rem',
              marginBottom: '1.5rem',
              borderRadius: '2px'
            }}
          >
            <div style={{ fontSize: '0.72rem', color: '#991b1b', fontWeight: 700, textTransform: 'uppercase' }}>
              TIME REMAINING BEFORE AUTO LOGOUT:
            </div>
            <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#dc2626', margin: '2px 0' }}>
              0{minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={onLogout}
              className="btn-gov btn-gov-secondary btn-gov-sm"
              style={{ flex: 1, padding: '0.5rem' }}
            >
              <LogOut size={13} />
              <span>Log Out Now</span>
            </button>
            <button
              onClick={onExtend}
              className="btn-gov btn-gov-primary btn-gov-sm"
              style={{ flex: 1, padding: '0.5rem', fontWeight: 800 }}
            >
              <RefreshCw size={13} />
              <span>Extend Session (15m)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
