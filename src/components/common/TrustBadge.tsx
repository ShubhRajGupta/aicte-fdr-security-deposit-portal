import React from 'react';
import { TrustLevel } from '../../types';
import { Clock, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';

interface TrustBadgeProps {
  level: TrustLevel;
  size?: 'sm' | 'md' | 'lg';
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ level, size = 'md' }) => {
  const getDetails = () => {
    switch (level) {
      case 'L0':
        return {
          label: 'L0 Submitted',
          desc: 'Institution declared — Pending officer verification',
          icon: <Clock size={size === 'sm' ? 12 : 14} />,
          className: 'trust-badge-l0'
        };
      case 'L1':
        return {
          label: 'L1 Document-Checked',
          desc: 'Verified by Regional / Bureau Scrutiny Officer',
          icon: <CheckCircle2 size={size === 'sm' ? 12 : 14} />,
          className: 'trust-badge-l1'
        };
      case 'L2':
        return {
          label: 'L2 Bank-Confirmed',
          desc: 'Independently confirmed by Issuing Bank with evidence',
          icon: <ShieldCheck size={size === 'sm' ? 12 : 14} />,
          className: 'trust-badge-l2'
        };
      case 'L-X':
        return {
          label: 'L-X Disputed / Open Query',
          desc: 'Active discrepancy flagged by Rules Engine or Officer',
          icon: <AlertTriangle size={size === 'sm' ? 12 : 14} />,
          className: 'trust-badge-lx'
        };
    }
  };

  const { label, desc, icon, className } = getDetails();

  return (
    <span
      className={`trust-badge ${className}`}
      title={desc}
      style={{
        padding: size === 'sm' ? '0.15rem 0.45rem' : size === 'lg' ? '0.35rem 0.85rem' : '0.25rem 0.65rem',
        fontSize: size === 'sm' ? '0.7rem' : size === 'lg' ? '0.85rem' : '0.75rem'
      }}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};
