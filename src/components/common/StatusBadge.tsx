import React from 'react';
import { InstrumentStatus } from '../../types';
import { CheckCircle, AlertOctagon, HelpCircle, FileCheck, ShieldAlert, Award } from 'lucide-react';

interface StatusBadgeProps {
  status: InstrumentStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'ACTIVE':
        return { label: 'Active Coverage', className: 'status-active', icon: <CheckCircle size={12} /> };
      case 'EXPIRING':
        return { label: 'Expiring (<90d)', className: 'status-expiring', icon: <AlertOctagon size={12} /> };
      case 'OVERDUE':
        return { label: 'OVERDUE (Lapsed)', className: 'status-overdue', icon: <AlertOctagon size={12} /> };
      case 'UNDER_SCRUTINY':
        return { label: 'Under Scrutiny', className: 'status-scrutiny', icon: <FileCheck size={12} /> };
      case 'QUERY_RAISED':
        return { label: 'Query Raised', className: 'status-query', icon: <HelpCircle size={12} /> };
      case 'RELEASE_REQUESTED':
        return { label: 'Release Requested', className: 'status-scrutiny', icon: <FileCheck size={12} /> };
      case 'NOC_ISSUED':
        return { label: 'NOC Issued', className: 'status-released', icon: <Award size={12} /> };
      case 'RELEASED':
        return { label: 'Released & Closed', className: 'status-released', icon: <CheckCircle size={12} /> };
      case 'ON_HOLD':
        return { label: 'On Hold (Legal/Admin)', className: 'status-hold', icon: <ShieldAlert size={12} /> };
      case 'SUBMITTED':
        return { label: 'Submitted', className: 'status-scrutiny', icon: <FileCheck size={12} /> };
      default:
        return { label: status, className: 'status-scrutiny', icon: <CheckCircle size={12} /> };
    }
  };

  const { label, className, icon } = getStatusConfig();

  return (
    <span className={`status-badge ${className}`}>
      {icon}
      <span>{label}</span>
    </span>
  );
};
