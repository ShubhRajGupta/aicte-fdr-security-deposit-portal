import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        maxWidth: '420px',
        width: '100%'
      }}
    >
      {toasts.map((toast) => {
        let borderLeftColor = 'var(--gov-navy-medium)';
        let Icon = Info;
        let bgColor = '#ffffff';
        if (toast.type === 'success') {
          borderLeftColor = 'var(--gov-green-dark)';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          borderLeftColor = '#dc2626';
          Icon = AlertOctagon;
        } else if (toast.type === 'warning') {
          borderLeftColor = 'var(--gov-saffron)';
          Icon = AlertTriangle;
        }

        return (
          <div
            key={toast.id}
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              borderLeft: `5px solid ${borderLeftColor}`,
              borderTop: '1px solid #cbd5e1',
              borderRight: '1px solid #cbd5e1',
              borderBottom: '1px solid #cbd5e1',
              borderRadius: '2px',
              background: bgColor,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <Icon size={18} style={{ color: borderLeftColor, flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--gov-navy-dark)' }}>{toast.title}</div>
              <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '2px', lineHeight: 1.35 }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
