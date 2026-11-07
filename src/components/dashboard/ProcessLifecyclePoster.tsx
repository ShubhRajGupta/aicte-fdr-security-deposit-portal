import React from 'react';
import { FileUp, FileCheck2, Landmark, Award, ShieldAlert, ArrowRight, QrCode } from 'lucide-react';

export const ProcessLifecyclePoster: React.FC = () => {
  return (
    <div
      className="gov-panel"
      style={{
        borderRadius: '0px',
        border: '1px solid #cbd5e1',
        marginBottom: '14px',
        background: '#ffffff',
        boxShadow: '0 2px 6px rgba(0, 33, 71, 0.05)'
      }}
    >
      <div
        className="gov-panel-header"
        style={{
          padding: '8px 12px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="./assets/stamps/aicte-gold-seal.svg"
            alt="AICTE Seal"
            style={{ width: '20px', height: '20px' }}
          />
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#002147' }}>
            Statutory Four-Stage Workflow of Security Deposits under APH 2024-27 Clause 1.4
          </span>
        </div>
        <span style={{ fontSize: '10px', color: '#b91c1c', fontWeight: 700 }}>
          Mandatory Requirement: Deposit release strictly prohibited below Stage 3 (L2)
        </span>
      </div>

      <div style={{ padding: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {/* STAGE 1: LODGEMENT */}
          <div
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: '3px',
              background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '2px',
                      background: '#002147',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    01
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em' }}>
                    STAGE 1: LODGEMENT
                  </span>
                </div>
                <FileUp size={16} style={{ color: '#003366' }} />
              </div>

              <div style={{ fontSize: '12px', fontWeight: 700, color: '#002147', marginBottom: '2px' }}>
                Institutional Declaration
              </div>
              <div style={{ fontSize: '9.5px', color: '#0369a1', fontWeight: 600, marginBottom: '6px' }}>
                Role: Technical Institution Signatory
              </div>
              <div style={{ fontSize: '10px', color: '#475569', lineHeight: 1.4 }}>
                College enters joint FDR details, attaches certificate scan and mandatory board resolution.
              </div>

              {/* Graphic Asset Preview */}
              <div
                style={{
                  marginTop: '10px',
                  background: '#ffffff',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '2px',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src="./assets/emblem-india.svg"
                    alt="Emblem"
                    style={{ height: '22px', width: 'auto' }}
                  />
                </div>
                <div style={{ fontSize: '9px', color: '#334155' }}>
                  <div style={{ fontWeight: 700 }}>Joint FDR Lodgement</div>
                  <div style={{ color: '#64748b' }}>Form &amp; Scan Upload</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#475569',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  padding: '2px 6px',
                  borderRadius: '2px'
                }}
              >
                L0 Submitted (Pending Scrutiny)
              </span>
            </div>
          </div>

          {/* STAGE 2: SCRUTINY */}
          <div
            style={{
              border: '1px solid #fed7aa',
              borderRadius: '3px',
              background: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '2px',
                      background: '#b45309',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    02
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#b45309', letterSpacing: '0.04em' }}>
                    STAGE 2: SCRUTINY
                  </span>
                </div>
                <FileCheck2 size={16} style={{ color: '#b45309' }} />
              </div>

              <div style={{ fontSize: '12px', fontWeight: 700, color: '#002147', marginBottom: '2px' }}>
                Officer Verification
              </div>
              <div style={{ fontSize: '9.5px', color: '#b45309', fontWeight: 600, marginBottom: '6px' }}>
                Role: Regional / Bureau Officer
              </div>
              <div style={{ fontSize: '10px', color: '#475569', lineHeight: 1.4 }}>
                Matches scan against typed data, verifies joint lien clause to "Member Secretary AICTE", checks APH Table 1.4.
              </div>

              {/* Graphic Asset Preview */}
              <div
                style={{
                  marginTop: '10px',
                  background: '#ffffff',
                  border: '1px solid #fed7aa',
                  borderRadius: '2px',
                  padding: '4px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <img
                  src="./assets/stamps/stamp-lien-verified.svg"
                  alt="Lien Verified Stamp"
                  style={{ height: '32px', width: 'auto' }}
                />
                <div style={{ fontSize: '8.5px', color: '#991b1b', lineHeight: 1.2 }}>
                  <div style={{ fontWeight: 800 }}>AICTE Bureau Scrutiny</div>
                  <div>Clause 1.4 Endorsed</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #fed7aa' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#b45309',
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  padding: '2px 6px',
                  borderRadius: '2px'
                }}
              >
                L1 Scrutinized (Officer Verified)
              </span>
            </div>
          </div>

          {/* STAGE 3: ATTESTATION */}
          <div
            style={{
              border: '1px solid #bbf7d0',
              borderRadius: '3px',
              background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '2px',
                      background: '#15803d',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    03
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#15803d', letterSpacing: '0.04em' }}>
                    STAGE 3: ATTESTATION
                  </span>
                </div>
                <Landmark size={16} style={{ color: '#15803d' }} />
              </div>

              <div style={{ fontSize: '12px', fontWeight: 700, color: '#002147', marginBottom: '2px' }}>
                Branch Lien Confirmation
              </div>
              <div style={{ fontSize: '9.5px', color: '#15803d', fontWeight: 600, marginBottom: '6px' }}>
                Role: Issuing Bank Branch Manager
              </div>
              <div style={{ fontSize: '10px', color: '#475569', lineHeight: 1.4 }}>
                Scheduled Bank verifies lien in Core Banking System (CBS) and signs cryptographic confirmation.
              </div>

              {/* Graphic Asset Preview with Real Bank Logos */}
              <div
                style={{
                  marginTop: '10px',
                  background: '#ffffff',
                  border: '1px solid #bbf7d0',
                  borderRadius: '2px',
                  padding: '4px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <img src="./assets/banks/sbi.svg" alt="SBI" style={{ height: '16px' }} />
                  <img src="./assets/banks/pnb.svg" alt="PNB" style={{ height: '16px' }} />
                  <img src="./assets/banks/bob.svg" alt="BOB" style={{ height: '16px' }} />
                </div>
                <img
                  src="./assets/stamps/stamp-bank-confirmed.svg"
                  alt="Bank Confirmed Stamp"
                  style={{ height: '24px', width: 'auto' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #bbf7d0' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#15803d',
                  background: '#dcfce7',
                  border: '1px solid #86efac',
                  padding: '2px 6px',
                  borderRadius: '2px'
                }}
              >
                L2 Bank-Confirmed (CBS Attested)
              </span>
            </div>
          </div>

          {/* STAGE 4: RELEASE */}
          <div
            style={{
              border: '1px solid #bae6fd',
              borderRadius: '3px',
              background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '2px',
                      background: '#0369a1',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    04
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#0369a1', letterSpacing: '0.04em' }}>
                    STAGE 4: RELEASE
                  </span>
                </div>
                <Award size={16} style={{ color: '#0369a1' }} />
              </div>

              <div style={{ fontSize: '12px', fontWeight: 700, color: '#002147', marginBottom: '2px' }}>
                Digital QR-NOC Issuance
              </div>
              <div style={{ fontSize: '9.5px', color: '#0369a1', fontWeight: 600, marginBottom: '6px' }}>
                Role: Member Secretary / Bureau Executive
              </div>
              <div style={{ fontSize: '10px', color: '#475569', lineHeight: 1.4 }}>
                Dual-authority approved digital release certificate with tamper-evident QR code and cryptographic audit lock.
              </div>

              {/* Graphic Asset Preview */}
              <div
                style={{
                  marginTop: '10px',
                  background: '#ffffff',
                  border: '1px solid #bae6fd',
                  borderRadius: '2px',
                  padding: '4px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <img
                  src="./assets/stamps/stamp-noc-released.svg"
                  alt="NOC Released Stamp"
                  style={{ height: '30px', width: 'auto' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '8.5px', color: '#0369a1' }}>
                  <QrCode size={18} style={{ color: '#002147' }} />
                  <div>
                    <div style={{ fontWeight: 800 }}>Tamper-Evident QR</div>
                    <div>Digital Signature</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #bae6fd' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#0369a1',
                  background: '#e0f2fe',
                  border: '1px solid #7dd3fc',
                  padding: '2px 6px',
                  borderRadius: '2px'
                }}
              >
                NOC Issued (Digital Lien Released)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
