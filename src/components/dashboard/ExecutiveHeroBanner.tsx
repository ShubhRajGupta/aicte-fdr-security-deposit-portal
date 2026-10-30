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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '0px' }}>
        {/* Left: Panoramic National Policy Hero Banner with Indian Parliament Backdrop */}
        <div
          style={{
            position: 'relative',
            backgroundImage: 'url(/assets/indian-parliament.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            minHeight: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '20px 24px'
          }}
        >
          {/* Sovereign Navy Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(0, 33, 71, 0.95) 0%, rgba(0, 33, 71, 0.88) 55%, rgba(0, 51, 102, 0.75) 100%)',
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
                  padding: '2px 6px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                Viksit Bharat @ 2047
              </span>
              <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 600 }}>
                Ministry of Education · Government of India
              </span>
            </div>

            <h2
              style={{
                fontSize: '18px',
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
                fontSize: '11px',
                color: '#e2e8f0',
                marginTop: '6px',
                lineHeight: 1.45,
                maxWidth: '680px'
              }}
            >
              Automated end-to-end statutory governance under <strong>APH 2024-27 Clause 1.4</strong>. Enforcing mandatory joint lien endorsements with <em>Member Secretary, AICTE New Delhi</em>, automated T-90 renewal notifications, real-time Scheduled Commercial Bank confirmations, and tamper-evident digital QR-NOC releases.
            </p>

            <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '10px', color: '#93c5fd' }}>
              <span>✓ 100% Digital Lien Verification</span>
              <span>✓ Direct Bank Branch Attestation (L2)</span>
              <span>✓ Zero Temporal Coverage Gap Guarantee</span>
            </div>
          </div>
        </div>

        {/* Right: Official Government Leadership Dignitary Cards */}
        <div
          style={{
            background: '#f8fafc',
            borderLeft: '1px solid #cbd5e1',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          {/* Card 1: Hon'ble Minister Dharmendra Pradhan */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              padding: '6px 8px',
              borderRadius: '2px'
            }}
          >
            <img
              src="./assets/leadership/minister-pradhan.jpg"
              alt="Shri Dharmendra Pradhan"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #003366',
                flexShrink: 0
              }}
            />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#002147' }}>
                Shri Dharmendra Pradhan
              </div>
              <div style={{ fontSize: '9px', color: '#475569', fontWeight: 600, marginTop: '1px' }}>
                Hon'ble Union Minister of Education
              </div>
              <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                Government of India
              </div>
            </div>
          </div>

          {/* Card 2: Hon'ble Chairman Prof. T. G. Sitharam */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              padding: '6px 8px',
              borderRadius: '2px'
            }}
          >
            <img
              src="./assets/leadership/chairman-sitharam.png"
              alt="Prof. T. G. Sitharam"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #f37022',
                flexShrink: 0
              }}
            />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#002147' }}>
                Prof. T. G. Sitharam
              </div>
              <div style={{ fontSize: '9px', color: '#475569', fontWeight: 600, marginTop: '1px' }}>
                Hon'ble Chairman, AICTE
              </div>
              <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                New Delhi HQ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
