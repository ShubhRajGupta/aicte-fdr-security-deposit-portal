import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateQrCodeDataUrl } from '../../services/qrService';
import { Award, ShieldCheck, Printer, CheckCircle, ExternalLink, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NocCertificateProps {
  nocCode?: string;
}

export const NocCertificate: React.FC<NocCertificateProps> = ({ nocCode }) => {
  const { instruments, selectedNocCode, setActiveTab, setSelectedNocCode } = useApp();

  const codeToDisplay = nocCode || selectedNocCode || 'NOC-26265-8942-APEX';
  const matchingInstrument = instruments.find((i) => i.nocRecord?.verificationCode === codeToDisplay) || instruments.find((i) => i.id === 'fdr-010-noc-issued') || instruments[4];
  const nocRecord = matchingInstrument.nocRecord || {
    nocNumber: 'AICTE/REG/NOC/2026/0491',
    issuedAt: '2026-10-24T16:20:00Z',
    issuedBy: 'Prof. Rajive Kumar',
    authorityDesignation: 'Member Secretary, AICTE New Delhi',
    verificationCode: codeToDisplay,
    qrPayloadUrl: `${window.location.origin}/#/public/noc/${codeToDisplay}`,
    certificatePdfHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    status: 'VALID' as const
  };

  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    generateQrCodeDataUrl(nocRecord.qrPayloadUrl).then(setQrDataUrl);
    // Fire celebratory confetti when viewing issued certificate
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, [nocRecord.qrPayloadUrl]);

  return (
    <div style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Action Toolbar */}
      <div
        className="glass-panel"
        style={{
          padding: '0.85rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={20} style={{ color: '#f97316' }} />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
            Central Security Deposit Release — Official Digital No Objection Certificate (NOC)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => {
              setSelectedNocCode(codeToDisplay);
              setActiveTab('PUBLIC_NOC');
            }}
            className="btn btn-primary btn-sm"
          >
            <QrCode size={14} />
            <span>Simulate Public QR Scanner View</span>
          </button>
          <button
            onClick={() => window.print()}
            className="btn btn-secondary btn-sm"
          >
            <Printer size={14} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Official Government NOC Certificate Form */}
      <div
        style={{
          background: '#ffffff',
          color: '#0f172a',
          padding: '3rem 2.5rem',
          borderRadius: '8px',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
          border: '3px solid #1e3a8a',
          position: 'relative'
        }}
      >
        {/* Ashoka & AICTE Official Header Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px double #002147',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem',
            gap: '1rem'
          }}
        >
          {/* Authentic National Emblem of India */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px' }}>
            <img
              src="./assets/emblem-india.svg"
              alt="State Emblem of India"
              style={{ height: '70px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Center Title Block */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#334155', letterSpacing: '0.08em' }}>
              भारत सरकार / GOVERNMENT OF INDIA
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#002147', letterSpacing: '0.03em', margin: '3px 0' }}>
              ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#d97706' }}>
              अखिल भारतीय तकनीकी शिक्षा परिषद (Regulation Bureau)
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '3px' }}>
              Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070 • www.aicte-india.org
            </div>
          </div>

          {/* Authentic Official AICTE Crest */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px' }}>
            <img
              src="./assets/aicte-logo.png"
              alt="Official AICTE Crest"
              style={{ height: '70px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Certificate Reference & Date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ color: '#64748b' }}>Certificate No: </span>
            <strong style={{ fontFamily: 'var(--font-mono)', color: '#1e3a8a' }}>{nocRecord.nocNumber}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Date of Issuance: </span>
            <strong style={{ fontFamily: 'var(--font-mono)' }}>{nocRecord.issuedAt.slice(0, 10)}</strong>
          </div>
        </div>

        {/* Certificate Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 900,
              color: '#0f172a',
              textDecoration: 'underline',
              letterSpacing: '0.04em'
            }}
          >
            NO OBJECTION CERTIFICATE (NOC) FOR RELEASE OF SECURITY DEPOSIT
          </h3>
          <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, marginTop: '4px' }}>
            [ISSUED UNDER APH REGULATORY PROVISIONS · TRUST LEVEL L2 VERIFIED]
          </div>
        </div>

        {/* Legal Text Body */}
        <div style={{ fontSize: '0.86rem', lineHeight: 1.6, textAlign: 'justify', marginBottom: '1.75rem', color: '#1e293b' }}>
          <p style={{ marginBottom: '0.75rem' }}>
            This is to certify that the All India Council for Technical Education (AICTE) has <strong>NO OBJECTION</strong> to
            the discharge, release, and encashment of the Security Deposit held in the form of Fixed Deposit Receipt / Bank
            Guarantee detailed hereunder, previously lien-marked in favour of the Member Secretary, AICTE:
          </p>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              margin: '1rem 0',
              fontSize: '0.82rem',
              border: '1px solid #cbd5e1'
            }}
          >
            <tbody>
              <tr style={{ borderBottom: '1px solid #cbd5e1', background: '#f8fafc' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600, width: '35%', color: '#475569' }}>Name of Institution:</td>
                <td style={{ padding: '0.5rem', fontWeight: 700, color: '#0f172a' }}>{matchingInstrument.institutionName}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600, color: '#475569' }}>AICTE Permanent ID:</td>
                <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{matchingInstrument.institutionAicteId}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #cbd5e1', background: '#f8fafc' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600, color: '#475569' }}>Instrument / FDR Receipt No:</td>
                <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1e3a8a' }}>{matchingInstrument.instrumentNumber}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600, color: '#475569' }}>Issuing Bank & Branch:</td>
                <td style={{ padding: '0.5rem' }}>{matchingInstrument.bankName} ({matchingInstrument.branchName})</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #cbd5e1', background: '#f8fafc' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600, color: '#475569' }}>Principal Amount:</td>
                <td style={{ padding: '0.5rem', fontWeight: 800, color: '#15803d', fontSize: '0.9rem' }}>{matchingInstrument.formattedAmount}</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', fontWeight: 600, color: '#475569' }}>Verification Trust Level:</td>
                <td style={{ padding: '0.5rem', fontWeight: 700, color: '#15803d' }}>
                  LEVEL L2 (Independently Confirmed by Bank with Signed Evidence)
                </td>
              </tr>
            </tbody>
          </table>

          <p>
            The issuing bank is hereby authorized to release the lien and return the principal deposit along with accrued interest
            to the authorized accounts of the institution as per approved financial rules.
          </p>

          {nocRecord.exceptionNote && (
            <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', padding: '0.5rem', borderRadius: '4px', marginTop: '0.75rem', fontSize: '0.78rem' }}>
              <strong>COMPETENT AUTHORITY NOTE:</strong> {nocRecord.exceptionNote}
            </div>
          )}
        </div>

        {/* Footer: Live QR Code & Digital Signature */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #1e3a8a', paddingTop: '1.25rem' }}>
          {/* Live Scannable QR Code */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="AICTE Official QR Verification Code"
                style={{ width: '110px', height: '110px', border: '1px solid #cbd5e1', padding: '2px' }}
              />
            ) : (
              <div style={{ width: '110px', height: '110px', background: '#f1f5f9' }} />
            )}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a' }}>
                SCAN TO VERIFY AUTHENTICITY
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                Directly validates against AICTE Central Ledger
              </div>
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#0f172a', marginTop: '2px' }}>
                Code: {nocRecord.verificationCode}
              </div>
              <button
                onClick={() => {
                  setSelectedNocCode(codeToDisplay);
                  setActiveTab('PUBLIC_NOC');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  padding: 0,
                  marginTop: '4px'
                }}
              >
                Click to open verification view →
              </button>
            </div>
          </div>

          {/* Digital Signature Stamp */}
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                border: '2px solid #16a34a',
                color: '#16a34a',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                textAlign: 'center',
                display: 'inline-block',
                marginBottom: '0.5rem'
              }}
            >
              <div>✓ DIGITALLY SIGNED</div>
              <div style={{ fontSize: '0.62rem', color: '#15803d' }}>CERT-IN EMPANELLED DSC</div>
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{nocRecord.issuedBy}</div>
            <div style={{ fontSize: '0.75rem', color: '#475569' }}>{nocRecord.authorityDesignation}</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Council Secretariat, AICTE New Delhi</div>
          </div>
        </div>
      </div>
    </div>
  );
};
