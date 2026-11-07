import React from 'react';
import { Landmark } from 'lucide-react';

interface BankLogoProps {
  bankName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const getBankLogoUrl = (bankName: string): string => {
  const lower = (bankName || '').toLowerCase();
  if (lower.includes('state bank') || lower.includes('sbi')) {
    return './assets/banks/sbi.svg';
  }
  if (lower.includes('punjab') || lower.includes('pnb')) {
    return './assets/banks/pnb.svg';
  }
  if (lower.includes('baroda') || lower.includes('bob')) {
    return './assets/banks/bob.svg';
  }
  if (lower.includes('canara')) {
    return './assets/banks/canara.svg';
  }
  if (lower.includes('union')) {
    return './assets/banks/unionbank.svg';
  }
  if (lower.includes('hdfc')) {
    return './assets/banks/hdfc.svg';
  }
  if (lower.includes('icici')) {
    return './assets/banks/icici.svg';
  }
  return './assets/banks/sbi.svg'; // default scheduled bank emblem
};

export const BankLogo: React.FC<BankLogoProps> = ({
  bankName,
  size = 'md',
  showName = false,
  className = '',
  style = {}
}) => {
  const [hasError, setHasError] = React.useState(false);

  const dimMap = {
    sm: { height: 18, width: 22 },
    md: { height: 24, width: 28 },
    lg: { height: 36, width: 44 },
    xl: { height: 50, width: 62 }
  };

  const dim = dimMap[size] || dimMap.md;
  const logoUrl = getBankLogoUrl(bankName);

  return (
    <div
      className={`bank-logo-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        ...style
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '3px',
          padding: '2px 4px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          flexShrink: 0
        }}
      >
        {!hasError ? (
          <img
            src={logoUrl}
            alt={bankName}
            onError={() => setHasError(true)}
            style={{
              height: `${dim.height}px`,
              width: `${dim.width}px`,
              objectFit: 'contain'
            }}
          />
        ) : (
          <Landmark size={dim.height - 4} style={{ color: '#002147' }} />
        )}
      </div>
      {showName && (
        <span style={{ fontWeight: 600, color: '#002147' }}>{bankName}</span>
      )}
    </div>
  );
};
