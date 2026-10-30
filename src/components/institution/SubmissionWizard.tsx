import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IFSC_DIRECTORY, APH_RULES } from '../../data/bankDirectory';
import { evaluateDiscrepancyRules } from '../../services/rulesEngine';
import { computeSha256 } from '../../services/auditService';
import { generateQrCodeDataUrl } from '../../services/qrService';
import { Instrument, Discrepancy } from '../../types';
import {
  FilePlus,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileText,
  Shield,
  ArrowRight,
  ArrowLeft,
  Search,
  Building,
  IndianRupee,
  Printer,
  ExternalLink
} from 'lucide-react';

export const SubmissionWizard: React.FC = () => {
  const { activePersona, submitNewInstrument, setActiveTab, setSelectedInstrumentId, language } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form Fields
  const [selectedAphProgram, setSelectedAphProgram] = useState<string>('ENGG_UG');
  const [instrumentType, setInstrumentType] = useState<'FDR' | 'BANK_GUARANTEE' | 'ONLINE_RTGS'>('FDR');
  const [bankName, setBankName] = useState('State Bank of India');
  const [branchName, setBranchName] = useState('Noida Sector 62 Branch');
  const [ifscCode, setIfscCode] = useState('SBIN0008432');
  const [instrumentNumber, setInstrumentNumber] = useState(`FDR/SBI/2026/${Math.floor(10000 + Math.random() * 90000)}`);
  const [amount, setAmount] = useState<number>(3500000); // ₹35 Lakhs default
  const [issueDate, setIssueDate] = useState('2026-10-24');
  const [maturityDate, setMaturityDate] = useState('2034-10-24'); // 8 years tenor
  const [tenorMonths, setTenorMonths] = useState<number>(96);
  const [beneficiaryName, setBeneficiaryName] = useState('Member Secretary, AICTE New Delhi');
  const [lienMarkedTo, setLienMarkedTo] = useState('AICTE, New Delhi');
  const [depositorName, setDepositorName] = useState(activePersona.institutionName || 'Apex Institute of Technology');

  // Document upload state
  const [uploadedFileName, setUploadedFileName] = useState<string>('Original_SBI_FDR_Receipt.pdf');
  const [fileHash, setFileHash] = useState<string>('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  const [isUploading, setIsUploading] = useState(false);

  // Official Lodgement Acknowledgment Slip State
  const [acknowledgedInstrument, setAcknowledgedInstrument] = useState<Instrument | null>(null);
  const [ackQrUrl, setAckQrUrl] = useState<string>('');

  // Live client-side discrepancy checks
  const aphConfig = APH_RULES[selectedAphProgram] || APH_RULES['ENGG_UG'];
  const requiredAmount = aphConfig.minDepositPrivate;

  // Real-time evaluation
  const previewDiscrepancies = evaluateDiscrepancyRules(
    {
      amount,
      aphRequiredAmount: requiredAmount,
      beneficiaryName,
      lienMarkedTo,
      instrumentNumber,
      bankName,
      ifscCode,
      issueDate,
      maturityDate,
      documents: uploadedFileName ? [{ id: '1', fileName: uploadedFileName, fileSize: '2MB', mimeType: 'pdf', hash: fileHash, scanStatus: 'CLEAN', uploadedAt: new Date().toISOString(), documentType: 'FDR_CERTIFICATE' }] : []
    },
    []
  );

  const handleIfscLookup = (code: string) => {
    const upper = code.toUpperCase().trim();
    setIfscCode(upper);
    const found = IFSC_DIRECTORY[upper];
    if (found) {
      setBankName(found.bankName);
      setBranchName(found.branchName);
    }
  };

  const handleSimulateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      setUploadedFileName(file.name);
      const generatedHash = await computeSha256(file.name + Date.now());
      setTimeout(() => {
        setFileHash(generatedHash);
        setIsUploading(false);
      }, 500);
    }
  };

  const handleFinalSubmit = async () => {
    const created = await submitNewInstrument({
      instrumentNumber,
      instrumentType,
      bankName,
      branchName,
      ifscCode,
      amount,
      issueDate,
      maturityDate,
      tenorMonths,
      beneficiaryName,
      lienMarkedTo,
      depositorName,
      aphEdition: 'APH 2024-27',
      aphRequiredAmount: requiredAmount,
      documents: [
        {
          id: `doc-${Date.now()}`,
          fileName: uploadedFileName,
          fileSize: '2.4 MB',
          mimeType: 'application/pdf',
          hash: fileHash,
          scanStatus: 'CLEAN',
          uploadedAt: new Date().toISOString(),
          documentType: 'FDR_CERTIFICATE',
          ocrExtractedText: `TERM DEPOSIT NO: ${instrumentNumber} | PRINCIPAL: RS ${amount} | LIEN TO: AICTE`,
          ocrConfidence: 98.2
        }
      ]
    });

    setSelectedInstrumentId(created.id);
    const qr = await generateQrCodeDataUrl(`${window.location.origin}/#/track/${created.instrumentNumber}`);
    setAckQrUrl(qr);
    setAcknowledgedInstrument(created);
  };

  // Printable Official AICTE Lodgement Acknowledgment Slip
  if (acknowledgedInstrument) {
    const ackRefNumber = `AICTE/ACK/2026/${acknowledgedInstrument.instrumentNumber.replace(/[^0-9]/g, '').slice(-5) || '92415'}`;
    return (
      <div className="gov-container" style={{ maxWidth: '850px' }}>
        <div
          className="gov-panel"
          style={{
            padding: '24px 20px',
            border: '2px solid #002147',
            background: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {/* Sovereign Indian Tricolor Header */}
          <div
            style={{
              height: '4px',
              background: 'linear-gradient(90deg, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%)',
              marginBottom: '16px'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '2px solid #002147', paddingBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#f37022', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (NEW DELHI)
              </div>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#002147', marginTop: '2px' }}>
                Official Security Deposit Lodgement Acknowledgment Slip
              </h2>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Central e-FDR Registry System under Approval Process Handbook (APH 2024-27)
              </div>
            </div>

            {ackQrUrl && (
              <div style={{ textAlign: 'center' }}>
                <img
                  src={ackQrUrl}
                  alt="Acknowledgment Tracking QR"
                  style={{ width: '80px', height: '80px', border: '1px solid #cbd5e1', padding: '2px' }}
                />
                <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>Tracking QR Seal</div>
              </div>
            )}
          </div>

          {/* Reference & Timestamp Pill */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              padding: '8px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              margin: '12px 0',
              fontSize: '11px'
            }}
          >
            <div>
              <span style={{ color: '#64748b' }}>Acknowledgment Reference No:</span>{' '}
              <strong style={{ color: '#002147', fontFamily: 'var(--font-mono)' }}>{ackRefNumber}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Lodgement Date &amp; Time:</span>{' '}
              <strong style={{ color: '#1e293b' }}>{new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</strong>
            </div>
          </div>

          {/* Lodgement Details Table */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '11px', marginBottom: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '8px 10px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '10px', display: 'block' }}>LODGING INSTITUTION</span>
              <strong style={{ color: '#002147', fontSize: '12px' }}>{acknowledgedInstrument.institutionName}</strong>
              <div style={{ fontSize: '10px', color: '#64748b' }}>AICTE ID: {acknowledgedInstrument.institutionAicteId}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '8px 10px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '10px', display: 'block' }}>DEPOSIT PRINCIPAL AMOUNT</span>
              <strong style={{ color: '#15803d', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>{acknowledgedInstrument.formattedAmount}</strong>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Mandated APH Requirement: ₹{acknowledgedInstrument.aphRequiredAmount.toLocaleString('en-IN')}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '8px 10px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '10px', display: 'block' }}>ISSUING BANK &amp; BRANCH</span>
              <div style={{ fontWeight: 700, color: '#1e293b' }}>{acknowledgedInstrument.bankName}</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>IFSC: {acknowledgedInstrument.ifscCode} · {acknowledgedInstrument.branchName}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '8px 10px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '10px', display: 'block' }}>FDR CERTIFICATE NUMBER</span>
              <div style={{ fontWeight: 800, color: '#002147', fontFamily: 'var(--font-mono)' }}>{acknowledgedInstrument.instrumentNumber}</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Maturity Date: {acknowledgedInstrument.maturityDate} ({acknowledgedInstrument.tenorMonths} Mos)</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '8px 10px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '10px', display: 'block' }}>INITIAL TRUST LEVEL</span>
              <span style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '1px 6px', fontWeight: 700, fontSize: '10px' }}>
                {acknowledgedInstrument.trustLevel} (Submitted - Pending Regional Scrutiny)
              </span>
            </div>

            <div style={{ background: '#f8fafc', padding: '8px 10px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '10px', display: 'block' }}>DOCUMENT SHA-256 VAULT PROOF</span>
              <code style={{ fontSize: '10px', color: '#003366', wordBreak: 'break-all' }}>
                {acknowledgedInstrument.documents[0]?.hash || 'e3b0c44298fc1c...'}
              </code>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="gov-alert gov-alert-info" style={{ marginBottom: '16px' }}>
            <div>
              <strong>STATUTORY ACKNOWLEDGMENT:</strong> This receipt confirms digital lodgement of your security deposit into the central AICTE registry.
              The Regional Verification Officer will scrutinize the joint lien endorsement against issuing bank records prior to Trust Level elevation.
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={() => window.print()}
              className="btn-gov btn-gov-secondary btn-gov-sm"
            >
              <Printer size={12} />
              <span>Print Official Lodgement Slip</span>
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setAcknowledgedInstrument(null);
                  setActiveTab('INSTITUTION_PORTAL');
                }}
                className="btn-gov btn-gov-secondary btn-gov-sm"
              >
                <span>Institution Dashboard</span>
              </button>
              <button
                onClick={() => {
                  setAcknowledgedInstrument(null);
                  setActiveTab('CASE_WORKSPACE');
                }}
                className="btn-gov btn-gov-primary btn-gov-sm"
              >
                <span>Open in Case Workspace</span>
                <ExternalLink size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gov-container" style={{ maxWidth: '960px' }}>
      {/* Wizard Header */}
      <div className="gov-panel" style={{ borderLeft: '4px solid #f37022', marginBottom: '12px' }}>
        <div className="gov-panel-header">
          <div>
            <span className="gov-panel-title">
              {language === 'HI' ? 'सावधि जमा / प्रतिभूति जमा डिजिटल प्रविष्टि' : 'Digital Submission of Security Deposit / FDR'}
            </span>
            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              4-Step Resumable Multi-Step Verification Form with instant APH Rule checks (R1–R5) &amp; Document Vault Hashing.
            </p>
          </div>
          <span className="gov-nav-badge" style={{ background: '#003366', fontSize: '11px' }}>
            Step {step} of 4
          </span>
        </div>

        {/* Step Progress Indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', padding: '10px 14px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          {[
            { s: 1, label: '1. APH Handbook' },
            { s: 2, label: '2. Bank & Instrument' },
            { s: 3, label: '3. Document Vault' },
            { s: 4, label: '4. Review & Submit' }
          ].map((st) => (
            <div
              key={st.s}
              onClick={() => {
                if (st.s < step) setStep(st.s);
              }}
              style={{
                background: step === st.s ? '#003366' : step > st.s ? '#e2e8f0' : '#ffffff',
                border: step === st.s ? '1px solid #002244' : '1px solid #cbd5e1',
                padding: '6px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: 700,
                color: step === st.s ? '#ffffff' : step > st.s ? '#15803d' : '#64748b',
                cursor: st.s < step ? 'pointer' : 'default',
                borderRadius: '2px'
              }}
            >
              {st.label} {step > st.s ? '✓' : ''}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: APH Handbook Program Requirements */}
      {step === 1 && (
        <div className="gov-panel">
          <div className="gov-panel-header">
            <span className="gov-panel-title">Step 1: Select Approved Academic Program &amp; Handbook Edition</span>
          </div>

          <div className="gov-panel-body">
            <div className="gov-form-group">
              <label className="gov-label">Approval Process Handbook Edition:</label>
              <input type="text" value="APH 2024-27 (Edition 1.0 — Effective 2024-2027)" disabled className="gov-input" />
            </div>

            <div className="gov-form-group">
              <label className="gov-label">Select Course / Level:<span className="req">*</span></label>
              <select
                value={selectedAphProgram}
                onChange={(e) => {
                  setSelectedAphProgram(e.target.value);
                  const req = APH_RULES[e.target.value];
                  if (req) {
                    setAmount(req.minDepositPrivate);
                    setTenorMonths(req.tenorYears * 12);
                  }
                }}
                className="gov-select"
              >
                <option value="ENGG_UG">Engineering &amp; Technology (UG Degree) — ₹35,00,000 (8 Years)</option>
                <option value="PHARM_UG">Pharmacy (B.Pharm Degree) — ₹25,00,000 (8 Years)</option>
                <option value="MGMT_PG">Management (MBA / PGDM) — ₹15,00,000 (8 Years)</option>
                <option value="POLY_DIPLOMA">Polytechnic / Applied Arts (Diploma) — ₹15,00,000 (8 Years)</option>
              </select>
            </div>

            <div className="gov-alert gov-alert-info" style={{ marginTop: '12px' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '11px', color: '#002147' }}>Prescribed Mandatory Deposit (Private Category):</span>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#003366', fontFamily: 'var(--font-mono)' }}>
                  ₹{requiredAmount.toLocaleString('en-IN')}.00
                </div>
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                  Mandatory Tenor: {aphConfig.tenorYears} Years · Beneficiary: {aphConfig.beneficiaryExact}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setStep(2)} className="btn-gov btn-gov-primary">
                <span>Next: Bank &amp; Instrument Details</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Bank & Instrument Details */}
      {step === 2 && (
        <div className="gov-panel">
          <div className="gov-panel-header">
            <span className="gov-panel-title">Step 2: Enter Instrument &amp; Issuing Bank Details</span>
          </div>

          <div className="gov-panel-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="gov-form-group">
                <label className="gov-label">Instrument Type:<span className="req">*</span></label>
                <select
                  value={instrumentType}
                  onChange={(e) => setInstrumentType(e.target.value as any)}
                  className="gov-select"
                >
                  <option value="FDR">Fixed Deposit Receipt (FDR)</option>
                  <option value="BANK_GUARANTEE">Bank Guarantee (e-BG)</option>
                  <option value="ONLINE_RTGS">Online RTGS Security Transfer</option>
                </select>
              </div>

              <div className="gov-form-group">
                <label className="gov-label">Instrument / Receipt Number:<span className="req">*</span></label>
                <input
                  type="text"
                  value={instrumentNumber}
                  onChange={(e) => setInstrumentNumber(e.target.value)}
                  className="gov-input"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
              <div className="gov-form-group">
                <label className="gov-label">Bank IFSC Code:<span className="req">*</span></label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => handleIfscLookup(e.target.value)}
                  placeholder="e.g. SBIN0008432"
                  className="gov-input"
                  required
                />
              </div>

              <div className="gov-form-group">
                <label className="gov-label">Resolved Branch Name:</label>
                <input type="text" value={`${bankName} — ${branchName}`} disabled className="gov-input" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div className="gov-form-group">
                <label className="gov-label">Principal Deposit Amount (₹):<span className="req">*</span></label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="gov-input"
                  required
                />
                {amount < requiredAmount && (
                  <div style={{ fontSize: '10px', color: '#b91c1c', marginTop: '2px', fontWeight: 600 }}>
                    ⚠️ Less than required ₹{requiredAmount.toLocaleString('en-IN')} (Will trigger Rule R1 Shortfall)
                  </div>
                )}
              </div>

              <div className="gov-form-group">
                <label className="gov-label">Date of Issue:<span className="req">*</span></label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="gov-input"
                  required
                />
              </div>

              <div className="gov-form-group">
                <label className="gov-label">Maturity Date:<span className="req">*</span></label>
                <input
                  type="date"
                  value={maturityDate}
                  onChange={(e) => setMaturityDate(e.target.value)}
                  className="gov-input"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="gov-form-group">
                <label className="gov-label">Beneficiary Name (Mandatory):<span className="req">*</span></label>
                <input
                  type="text"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  className="gov-input"
                  required
                />
              </div>

              <div className="gov-form-group">
                <label className="gov-label">Lien Endorsement Clause:<span className="req">*</span></label>
                <input
                  type="text"
                  value={lienMarkedTo}
                  onChange={(e) => setLienMarkedTo(e.target.value)}
                  className="gov-input"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button onClick={() => setStep(1)} className="btn-gov btn-gov-secondary">
                <ArrowLeft size={12} />
                <span>Previous</span>
              </button>
              <button onClick={() => setStep(3)} className="btn-gov btn-gov-primary">
                <span>Next: Document Vault</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Document Vault & Instant Rule Checks */}
      {step === 3 && (
        <div className="gov-panel">
          <div className="gov-panel-header">
            <span className="gov-panel-title">Step 3: Document Vault Upload &amp; Rule Pre-Evaluation</span>
          </div>

          <div className="gov-panel-body">
            {/* Upload Box */}
            <div
              style={{
                border: '2px dashed #003366',
                borderRadius: '2px',
                padding: '24px',
                textAlign: 'center',
                background: '#f8fafc',
                marginBottom: '14px',
                position: 'relative'
              }}
            >
              <UploadCloud size={32} style={{ color: '#003366', margin: '0 auto 6px' }} />
              <div style={{ fontWeight: 700, color: '#002147', fontSize: '13px' }}>
                {isUploading ? 'Hashing & Scanning File...' : uploadedFileName ? `Attached: ${uploadedFileName}` : 'Select or drop scanned FDR copy (PDF / JPEG)'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                Supported: PDF, JPEG (Max 10 MB, 200 DPI recommended)
              </div>

              <input
                type="file"
                accept=".pdf,.png,.jpg"
                onChange={handleSimulateUpload}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Document Hash */}
            <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: '2px', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
              <div>SHA-256 Vault Hash: <code style={{ color: '#003366' }}>{fileHash}</code></div>
              <div style={{ color: '#15803d', fontWeight: 700 }}>Virus Scan: Clean</div>
            </div>

            {/* Live Discrepancy Preview */}
            <div style={{ marginTop: '14px' }}>
              <div style={{ fontWeight: 700, fontSize: '12px', color: '#002147', marginBottom: '6px' }}>
                Instant Client-Side Compliance Checks (Rules R1 - R5):
              </div>
              {previewDiscrepancies.length === 0 ? (
                <div className="gov-alert gov-alert-success" style={{ marginBottom: 0 }}>
                  <CheckCircle size={14} style={{ color: '#15803d' }} />
                  <span>All preliminary statutory checks passed. Instrument ready for submission.</span>
                </div>
              ) : (
                <div className="gov-alert gov-alert-danger" style={{ marginBottom: 0 }}>
                  <AlertTriangle size={14} style={{ color: '#b91c1c' }} />
                  <div>
                    <strong>Warning:</strong> {previewDiscrepancies.length} discrepancy will be flagged upon lodgement:
                    <ul style={{ marginLeft: '16px', marginTop: '4px' }}>
                      {previewDiscrepancies.map((d, i) => (
                        <li key={i}>{d.message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button onClick={() => setStep(2)} className="btn-gov btn-gov-secondary">
                <ArrowLeft size={12} />
                <span>Previous</span>
              </button>
              <button onClick={() => setStep(4)} className="btn-gov btn-gov-primary">
                <span>Next: Review &amp; Undertaking</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Legal Undertaking */}
      {step === 4 && (
        <div className="gov-panel">
          <div className="gov-panel-header">
            <span className="gov-panel-title">Step 4: Statutory Undertaking &amp; Lodgement Confirmation</span>
          </div>

          <div className="gov-panel-body">
            {/* Review Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '11px', background: '#f8fafc', padding: '12px', border: '1px solid #cbd5e1', marginBottom: '14px' }}>
              <div><span style={{ color: '#64748b' }}>Institution Name:</span> <strong style={{ color: '#002147' }}>{activePersona.institutionName || 'Apex Institute'}</strong></div>
              <div><span style={{ color: '#64748b' }}>Instrument Number:</span> <strong style={{ color: '#002147', fontFamily: 'var(--font-mono)' }}>{instrumentNumber}</strong></div>
              <div><span style={{ color: '#64748b' }}>Issuing Bank &amp; IFSC:</span> <div>{bankName} ({ifscCode})</div></div>
              <div><span style={{ color: '#64748b' }}>Principal Amount:</span> <strong style={{ color: '#15803d', fontSize: '13px' }}>₹{amount.toLocaleString('en-IN')}.00</strong></div>
              <div><span style={{ color: '#64748b' }}>Maturity Date:</span> <div style={{ fontFamily: 'var(--font-mono)' }}>{maturityDate}</div></div>
              <div><span style={{ color: '#64748b' }}>Initial Trust Level:</span> <strong style={{ color: previewDiscrepancies.length > 0 ? '#b91c1c' : '#475569' }}>{previewDiscrepancies.length > 0 ? 'L-X (Disputed Flag)' : 'L0 (Submitted Unverified)'}</strong></div>
            </div>

            {/* Legal Undertaking */}
            <div className="gov-alert gov-alert-warning" style={{ marginBottom: '14px' }}>
              <input type="checkbox" defaultChecked style={{ marginTop: '2px', marginRight: '6px' }} />
              <span style={{ fontSize: '11px', lineHeight: 1.4 }}>
                I, <strong>{activePersona.name}</strong>, authorized signatory of {depositorName}, hereby solemnly declare that
                the FDR/JFDR details entered above are true, free from encumbrance other than AICTE lien, and compliant with APH 2024-27.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button onClick={() => setStep(3)} className="btn-gov btn-gov-secondary">
                <ArrowLeft size={12} />
                <span>Previous</span>
              </button>
              <button onClick={handleFinalSubmit} className="btn-gov btn-gov-saffron">
                <span>Submit Deposit &amp; Generate Formal Receipt</span>
                <CheckCircle size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
