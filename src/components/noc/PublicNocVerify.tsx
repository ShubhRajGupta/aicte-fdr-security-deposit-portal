import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateQrCodeDataUrl } from '../../services/qrService';
import { BankLogo } from '../common/BankLogo';
import {
  ShieldCheck,
  AlertTriangle,
  QrCode,
  FileCheck2,
  ExternalLink,
  Search,
  CheckCircle2,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PublicNocVerify: React.FC = () => {
  const { instruments, selectedNocCode, setSelectedNocCode, setActiveTab, setSelectedInstrumentId } = useApp();

  const [inputCode, setInputCode] = useState(selectedNocCode || 'NOC-26265-8942-APEX');
  const [activeCode, setActiveCode] = useState(selectedNocCode || 'NOC-26265-8942-APEX');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Find if code matches any instrument with nocRecord
  const matchingInstrument = instruments.find(
    (i) => i.nocRecord?.verificationCode.toUpperCase() === activeCode.toUpperCase().trim()
  );

  const isValid = Boolean(matchingInstrument && matchingInstrument.nocRecord);
  const nocRecord = matchingInstrument?.nocRecord;

  useEffect(() => {
    if (isValid && nocRecord) {
      generateQrCodeDataUrl(nocRecord.qrPayloadUrl).then(setQrDataUrl);
      try {
        confetti({ particleCount: 25, spread: 60, origin: { y: 0.4 } });
      } catch {
        // ignore
      }
    }
  }, [activeCode, isValid, nocRecord]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setActiveCode(inputCode.trim());
      setSelectedNocCode(inputCode.trim());
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Official Government Search Bar */}
      <div
        className="gov-panel"
        style={{
          padding: '1.25rem',
          marginBottom: '1.5rem',
          background: '#ffffff'
        }}
      >
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--gov-navy-dark)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          National Public Portal for AICTE No-Objection Certificate (NOC) Online Verification
        </div>
        <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0 0 0.85rem 0' }}>
          Enter the unique 16-character alphanumeric NOC Security Reference Code or scan the QR code printed on the physical release certificate to verify genuine council authorization.
        </p>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <input
              type="text"
              placeholder="e.g. NOC-26265-8942-APEX"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="gov-input font-mono"
              style={{ width: '100%', fontSize: '0.9rem', fontWeight: 700 }}
            />
          </div>
          <button type="submit" className="btn-gov btn-gov-primary" style={{ padding: '0.5rem 1.25rem' }}>
            <Search size={15} />
            <span>Verify Certificate</span>
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem', marginTop: '0.75rem' }}>
          <span style={{ color: '#64748b', fontWeight: 600 }}>Demo Test Presets:</span>
          <button
            onClick={() => {
              setInputCode('NOC-26265-8942-APEX');
              setActiveCode('NOC-26265-8942-APEX');
              setSelectedNocCode('NOC-26265-8942-APEX');
            }}
            className="btn-gov btn-gov-secondary btn-gov-sm"
            style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
          >
            ✓ Authentic NOC (Apex Institute)
          </button>
          <button
            onClick={() => {
              setInputCode('NOC-FORGED-999-FAKE');
              setActiveCode('NOC-FORGED-999-FAKE');
              setSelectedNocCode('NOC-FORGED-999-FAKE');
            }}
            className="btn-gov btn-gov-danger btn-gov-sm"
            style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
          >
            ✕ Forged / Counterfeit NOC (Fraud Detection Demo)
          </button>
        </div>
      </div>

      {/* When Token is INVALID / COUNTERFEIT */}
      {!isValid && (
        <div
          className="gov-panel"
          style={{
            padding: '2rem 1.5rem',
            textAlign: 'center',
            marginBottom: '1.5rem',
            border: '2px solid #dc2626',
            background: '#fff5f5'
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              background: '#fee2e2',
              border: '2px solid #dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: '#dc2626'
            }}
          >
            <AlertTriangle size={34} />
          </div>

          <div
            style={{
              background: '#dc2626',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 800,
              padding: '4px 16px',
              display: 'inline-block',
              letterSpacing: '0.5px'
            }}
          >
            COUNTERFEIT / UNVERIFIED SECURITY DOCUMENT
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#991b1b', marginTop: '1rem' }}>
            Verification Failed: Document Not Found in AICTE National Registry
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#334155', maxWidth: '620px', margin: '0.5rem auto 0', lineHeight: 1.5 }}>
            The verification token <code className="font-mono" style={{ color: '#b91c1c', fontWeight: 800 }}>{activeCode}</code> does not match any valid digitally signed NOC issuance record in the AICTE Central Security Deposit Registry.
          </p>
          <div
            className="gov-alert gov-alert-danger"
            style={{
              maxWidth: '560px',
              margin: '1.25rem auto 0',
              fontSize: '0.8rem',
              textAlign: 'left'
            }}
          >
            <strong>CENTRAL VIGILANCE DIRECTIVE:</strong> Financial institutions, Scheduled Commercial Banks, and Regional Officers are strictly advised NOT to release funds or mark liens discharged against this unverified document. Incident automatically logged for vigilance audit.
          </div>
        </div>
      )}

      {/* When Token is VALID: Sovereign Government Certificate Card */}
      {isValid && nocRecord && matchingInstrument && (
        <>
          <div
            className="gov-panel"
            style={{
              background: '#ffffff',
              border: '2px solid var(--gov-green-dark)',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            {/* Certificate Header Banner with Sovereign Emblems */}
            <div
              style={{
                background: 'var(--gov-navy-dark)',
                color: '#ffffff',
                padding: '1.25rem 1.5rem',
                borderBottom: '4px solid var(--gov-saffron)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src="./assets/emblem-india.svg"
                  alt="Emblem of India"
                  style={{ height: '54px', width: 'auto', filter: 'brightness(0) invert(1)' }}
                />
                <img
                  src="./assets/aicte-logo.png"
                  alt="AICTE Logo"
                  style={{ height: '48px', width: 'auto' }}
                />
              </div>

              <div style={{ textAlign: 'center', flex: 1, minWidth: '240px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5px', color: '#e2e8f0' }}>
                  भारत सरकार | Government of India
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0' }}>
                  अखिल भारतीय तकनीकी शिक्षा परिषद | ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
                </div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                  (A Statutory Body of the Government of India under the AICTE Act, 1987)
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                  Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src="./assets/stamps/aicte-gold-seal.svg"
                  alt="AICTE Gold Seal"
                  style={{ height: '54px', width: 'auto' }}
                />
              </div>
            </div>

            {/* Verification Status Badge Strip */}
            <div
              style={{
                background: '#f0fdf4',
                borderBottom: '1px solid #bbf7d0',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--gov-green-dark)' }} />
                <span style={{ fontWeight: 800, color: 'var(--gov-green-dark)', fontSize: '0.9rem' }}>
                  GENUINE & OFFICIALLY RECORDED IN CENTRAL REGISTRY
                </span>
              </div>
              <span className="font-mono" style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>
                Verification ID: {nocRecord.verificationCode}
              </span>
            </div>

            {/* Certificate Content Body */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gov-navy-dark)', textDecoration: 'underline' }}>
                  CERTIFICATE OF DISCHARGE OF LIEN & NO-OBJECTION (NOC)
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
                  Issued in accordance with AICTE Approval Process Handbook (APH 2024-27 Clause 1.5)
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>NOC REFERENCE NUMBER:</div>
                  <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gov-navy-dark)' }}>
                    {nocRecord.nocNumber}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                    Date of Issue: <strong>{nocRecord.issuedAt.slice(0, 10)}</strong>
                  </div>
                </div>

                {qrDataUrl && (
                  <div style={{ textAlign: 'center', background: '#f8fafc', padding: '0.5rem', border: '1px solid #cbd5e1' }}>
                    <img
                      src={qrDataUrl}
                      alt="AICTE Official QR Seal"
                      style={{ width: '84px', height: '84px', display: 'block' }}
                    />
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--gov-navy-dark)', marginTop: '2px' }}>
                      NIC SECURE QR
                    </div>
                  </div>
                )}
              </div>

              {/* Verified Details Table */}
              <table className="gov-table" style={{ marginBottom: '1.25rem' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '35%', fontWeight: 700, background: '#f8fafc', color: 'var(--gov-navy-dark)' }}>Institution Name & PID:</td>
                    <td>
                      <strong>{matchingInstrument.institutionName}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>AICTE Permanent ID: {matchingInstrument.institutionAicteId}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, background: '#f8fafc', color: 'var(--gov-navy-dark)' }}>Discharged Security Deposit Amount:</td>
                    <td>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--gov-green-dark)' }}>{matchingInstrument.formattedAmount}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}> (Rupees Thirty-Five Lakhs Only)</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, background: '#f8fafc', color: 'var(--gov-navy-dark)' }}>FDR Certificate Number:</td>
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--gov-navy-dark)' }}>
                      {matchingInstrument.instrumentNumber}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, background: '#f8fafc', color: 'var(--gov-navy-dark)' }}>Lien Holding Bank & Branch:</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BankLogo bankName={matchingInstrument.bankName} size="sm" />
                        <div>
                          <strong>{matchingInstrument.bankName}</strong> ({matchingInstrument.branchName})
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>IFSC Code: {matchingInstrument.ifscCode}</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, background: '#f8fafc', color: 'var(--gov-navy-dark)' }}>Lock-in Tenor Completed:</td>
                    <td>{matchingInstrument.tenorMonths} Months (Statutory lock-in fulfilled)</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, background: '#f8fafc', color: 'var(--gov-navy-dark)' }}>Competent Authority Signatory:</td>
                    <td>
                      <strong>{nocRecord.issuedBy}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{nocRecord.authorityDesignation}, AICTE New Delhi</div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, background: '#f8fafc', color: 'var(--gov-navy-dark)' }}>Cryptographic PDF Hash (SHA-256):</td>
                    <td>
                      <code className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--gov-navy-medium)', wordBreak: 'break-all', fontWeight: 700 }}>
                        {nocRecord.certificatePdfHash}
                      </code>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Official AICTE Statutory Release Stamp Impression */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', marginBottom: '1rem', padding: '0.75rem', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src="./assets/stamps/stamp-noc-released.svg"
                    alt="AICTE Official Release Stamp"
                    style={{ height: '70px', width: 'auto' }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.85rem' }}>
                      STATUTORY DISCHARGE OF LIEN CONFIRMED
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                      Signed &amp; Approved by Member Secretary, AICTE New Delhi
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      National Tripartite Security Protocol (APH 2024-27 Clause 1.5)
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>DSC Token Status:</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#002147' }}>NIC Class-3 Validated</div>
                  <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>✓ SHA-256 Ledger Sealed</div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                Note: This electronic certificate is generated under Section 65B of the Indian Evidence Act, 1872 and does not require physical ink seal. The joint lien marked in favor of Member Secretary, AICTE stands hereby unconditionally discharged.
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.print()}
              className="btn-gov btn-gov-secondary"
            >
              <Printer size={15} />
              <span>Print Official NOC Verification</span>
            </button>
            <button
              onClick={() => {
                setSelectedInstrumentId(matchingInstrument.id);
                setActiveTab('CASE_WORKSPACE');
              }}
              className="btn-gov btn-gov-primary"
            >
              <span>View Full Case File in Workspace</span>
            </button>
            <button
              onClick={() => setActiveTab('AUDIT_EXPLORER')}
              className="btn-gov btn-gov-saffron"
            >
              <span>Inspect Hash-Chained Audit Trail (I5)</span>
              <ExternalLink size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
