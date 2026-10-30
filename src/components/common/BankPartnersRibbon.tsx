import React from 'react';

export const BankPartnersRibbon: React.FC = () => {
  const banks = [
    { name: 'State Bank of India', logo: './assets/banks/sbi.svg', code: 'SBI' },
    { name: 'Punjab National Bank', logo: './assets/banks/pnb.svg', code: 'PNB' },
    { name: 'Bank of Baroda', logo: './assets/banks/bob.svg', code: 'BOB' },
    { name: 'Canara Bank', logo: './assets/banks/canara.svg', code: 'CANARA' },
    { name: 'Union Bank of India', logo: './assets/banks/unionbank.svg', code: 'UNION' },
    { name: 'HDFC Bank', logo: './assets/banks/hdfc.svg', code: 'HDFC' },
    { name: 'ICICI Bank', logo: './assets/banks/icici.svg', code: 'ICICI' }
  ];

  return (
    <div
      className="gov-panel"
      style={{
        borderRadius: '0px',
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        marginBottom: '14px',
        padding: '10px 14px'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '6px',
          marginBottom: '8px'
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#002147', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Authorized Scheduled Commercial Banks Network (APH 2024-27 Clause 1.4)
        </span>
        <span style={{ fontSize: '10px', color: '#64748b' }}>
          Direct API Lien Endorsement &amp; Verification Partners
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          padding: '4px 0'
        }}
      >
        {banks.map((b) => (
          <div
            key={b.code}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '2px',
              flex: '1 1 120px',
              justifyContent: 'center',
              height: '38px'
            }}
            title={b.name}
          >
            <img
              src={b.logo}
              alt={b.name}
              style={{
                maxHeight: '24px',
                maxWidth: '90px',
                objectFit: 'contain'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
