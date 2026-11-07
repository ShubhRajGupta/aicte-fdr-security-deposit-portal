import React from 'react';

export const ExecutiveHeroBanner: React.FC = () => {
  return (
    <div
      className="gov-panel"
      style={{
        borderRadius: '0px',
        marginBottom: '14px',
        border: '1px solid #cbd5e1',
        overflow: 'hidden',
        background: '#ffffff'
      }}
    >
      {/* Panoramic National Policy Hero Banner with Indian Parliament Backdrop */}
      <div
        style={{
          position: 'relative',
          backgroundImage: 'url(./assets/indian-parliament.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          minHeight: '140px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '22px 28px'
        }}
      >
        {/* Sovereign Navy Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(0, 33, 71, 0.96) 0%, rgba(0, 33, 71, 0.90) 60%, rgba(0, 51, 102, 0.82) 100%)',
            zIndex: 1
          }}
        />

        {/* Tricolor Sovereign Top Hairline */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #f37022 33.3%, #ffffff 33.3% 66.6%, #15803d 66.6%)',
            zIndex: 3
          }}
        />

        {/* Banner Text Content */}
        <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                background: '#f37022',
                color: '#ffffff',
                fontSize: '9px',
                fontWeight: 800,
                padding: '2px 8px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderRadius: '2px'
              }}
            >
              Viksit Bharat @ 2047
            </span>
            <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 600 }}>
              Ministry of Education · Government of India · AICTE Regulation Bureau (HQ, New Delhi)
            </span>
          </div>

          <h2
            style={{
              fontSize: '19px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.25,
              margin: 0,
              letterSpacing: '0.02em'
            }}
          >
            National Central Security Deposit &amp; Joint FDR Registry (e-FDR)
          </h2>

          <p
            style={{
              fontSize: '12px',
              color: '#e2e8f0',
              marginTop: '6px',
              lineHeight: 1.5,
              maxWidth: '900px'
            }}
          >
            Automated statutory governance under <strong>APH 2024-27 Clause 1.4</strong>. Enforcing mandatory joint lien endorsements with <em>Member Secretary, AICTE New Delhi</em>, automated T-90 renewal notifications, real-time Scheduled Commercial Bank confirmations, and tamper-evident digital QR-NOC releases.
          </p>

          <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '11px', color: '#93c5fd', flexWrap: 'wrap' }}>
            <span>✓ 100% Digital Lien Verification</span>
            <span>✓ Direct Scheduled Bank Branch Attestation (L2)</span>
            <span>✓ Zero Temporal Coverage Gap Guarantee</span>
            <span>✓ SHA-256 Merkle Ledger Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
