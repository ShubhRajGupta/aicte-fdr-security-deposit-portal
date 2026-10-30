import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserPersona } from '../../types';
import { BankPartnersRibbon } from '../common/BankPartnersRibbon';
import {
  Building2,
  Lock,
  UserCheck,
  Shield,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Landmark,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: UserPersona) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { personas, setActivePersona, setActiveTab, addToast, runScenario } = useApp();

  const [activeTab, setActiveTabState] = useState<'INSTITUTION' | 'OFFICER' | 'BANK' | 'AUDITOR'>('INSTITUTION');
  const [username, setUsername] = useState('1-3829104');
  const [password, setPassword] = useState('Aicte@Password2026');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('7K9XM');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<number>(0);

  // 2FA OTP verification modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [pendingUser, setPendingUser] = useState<UserPersona | null>(null);

  // Generate random 5-character Captcha
  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, [activeTab]);

  // Lockout countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && lockCountdown > 0) {
      timer = setInterval(() => {
        setLockCountdown((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockCountdown]);

  // Update default fields on tab change
  const handleTabChange = (tab: 'INSTITUTION' | 'OFFICER' | 'BANK' | 'AUDITOR') => {
    setActiveTabState(tab);
    setErrorMessage(null);
    if (tab === 'INSTITUTION') {
      setUsername('1-3829104');
      setPassword('Aicte@Password2026');
    } else if (tab === 'OFFICER') {
      setUsername('sunita.rao@aicte-india.org');
      setPassword('Aicte@Password2026');
    } else if (tab === 'BANK') {
      setUsername('SBIN0000691');
      setPassword('Aicte@Password2026');
    } else if (tab === 'AUDITOR') {
      setUsername('cag.audit@nic.in');
      setPassword('Aicte@Password2026');
    }
  };

  // Sector-based Persona Login
  const handleQuickLogin = (persona: UserPersona) => {
    if (selectedScenario > 0) {
      runScenario(selectedScenario);
    }
    setActivePersona(persona);
    onLoginSuccess(persona);
    addToast('success', `Signed In as ${persona.name}`, `Role: ${persona.title} (${persona.department || 'HQ'})`);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    // Verify Captcha
    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMessage('Security Captcha mismatch. Please enter the characters shown in the box.');
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // Call authentication backend or verify with personas list
    setTimeout(() => {
      // Find user
      const foundUser = personas.find(
        (p) =>
          p.id.toLowerCase().includes(username.toLowerCase()) ||
          p.name.toLowerCase().includes(username.toLowerCase()) ||
          (p.institutionId && p.institutionId.includes(username)) ||
          (activeTab === 'INSTITUTION' && p.role.includes('INSTITUTION')) ||
          (activeTab === 'OFFICER' && p.role.includes('OFFICER')) ||
          (activeTab === 'BANK' && p.role.includes('BANK'))
      ) || personas[0];

      // Check password (Default: Aicte@Password2026)
      if (password !== 'Aicte@Password2026') {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        if (nextFailed >= 5) {
          setIsLocked(true);
          setLockCountdown(30 * 60); // 30 minutes in seconds
          setErrorMessage('Security lockout triggered: 5 consecutive failed attempts. Account locked for 30 minutes under NIST SP 800-63B guidelines.');
        } else {
          setErrorMessage(`Invalid credentials. ${5 - nextFailed} attempt(s) remaining before security lockout.`);
        }
        setIsSubmitting(false);
        generateCaptcha();
        return;
      }

      // Successful credentials match -> Trigger 2FA step
      setPendingUser(foundUser);
      setShowOtpModal(true);
      setIsSubmitting(false);
    }, 400);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim()) return;

    if (otpInput === '262650' || otpInput.length === 6) {
      if (pendingUser) {
        if (selectedScenario > 0) {
          runScenario(selectedScenario);
        }
        setActivePersona(pendingUser);
        onLoginSuccess(pendingUser);
        setShowOtpModal(false);
        addToast('success', 'Two-Factor Authentication Confirmed', `Welcome, ${pendingUser.name}`);
      }
    } else {
      setErrorMessage('Invalid 6-digit OTP code. Enter 262650 for demonstration verification.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Official GIGW 3.0 Utility Bar */}
      <div className="gov-utility-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700, color: '#f37022' }}>🇮🇳</span>
          <span style={{ fontWeight: 600 }}>भारत सरकार</span>
          <span style={{ color: '#64748b' }}>|</span>
          <span>Government of India</span>
          <span style={{ color: '#64748b' }}>•</span>
          <span>Ministry of Education</span>
        </div>

        <div className="gov-utility-links">
          <span className="gov-utility-link">Screen Reader Accessible</span>
          <span style={{ color: '#475569' }}>|</span>
          <span className="gov-utility-link">Security Guidelines</span>
          <span style={{ color: '#475569' }}>|</span>
          <a
            href="https://www.india.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="gov-utility-link"
            style={{ color: '#93c5fd' }}
          >
            National Portal (india.gov.in) <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* 2. Official AICTE Branding Header */}
      <div className="gov-main-header" style={{ padding: '12px 20px', background: '#ffffff', borderBottom: '1px solid #cbd5e1' }}>
        <div className="gov-branding-block">
          {/* Authentic National Lion Capital Emblem */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '45px' }}>
            <img
              src="./assets/emblem-india.svg"
              alt="State Emblem of India"
              style={{ height: '52px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Authentic Official AICTE Crest */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '48px' }}>
            <img
              src="./assets/aicte-logo.png"
              alt="Official AICTE Crest"
              style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Title Block */}
          <div className="gov-title-block">
            <h1 style={{ fontSize: '15px' }}>अखिल भारतीय तकनीकी शिक्षा परिषद</h1>
            <h2 style={{ fontSize: '13px', color: '#002147' }}>ALL INDIA COUNCIL FOR TECHNICAL EDUCATION</h2>
            <div className="subtitle" style={{ fontSize: '11px' }}>
              Central Security Deposit & FDR Electronic Management System (e-FDR Portal) • APH 2024-27
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src="./assets/digital-india.svg"
            alt="Digital India"
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
          />
          <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '4px 10px', fontSize: '11px', fontWeight: 700, borderRadius: '2px' }}>
            🔒 256-Bit SSL Secure Portal
          </span>
        </div>
      </div>

      {/* Sovereign Tricolor Ribbon */}
      <div className="gov-footer-tricolor" />

      {/* 3. Sovereign Multi-Portal Access Gateway Body */}
      <div style={{ flex: 1, padding: '1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        {/* Interactive Login Container */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 490px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left Column: Official Form & Gateway Access Box */}
          <div className="gov-panel" style={{ background: '#ffffff', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>
            {/* Tabbed Portal Header */}
            <div style={{ display: 'flex', background: 'var(--gov-navy-dark)', borderBottom: '2px solid var(--gov-saffron)' }}>
              <button
                onClick={() => handleTabChange('INSTITUTION')}
                style={{
                  flex: 1,
                  padding: '10px 6px',
                  background: activeTab === 'INSTITUTION' ? '#001733' : 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderBottom: activeTab === 'INSTITUTION' ? '3px solid var(--gov-saffron)' : '3px solid transparent'
                }}
              >
                🏛️ Institutions
              </button>
              <button
                onClick={() => handleTabChange('OFFICER')}
                style={{
                  flex: 1,
                  padding: '10px 6px',
                  background: activeTab === 'OFFICER' ? '#001733' : 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderBottom: activeTab === 'OFFICER' ? '3px solid var(--gov-saffron)' : '3px solid transparent'
                }}
              >
                👔 AICTE Officers
              </button>
              <button
                onClick={() => handleTabChange('BANK')}
                style={{
                  flex: 1,
                  padding: '10px 6px',
                  background: activeTab === 'BANK' ? '#001733' : 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderBottom: activeTab === 'BANK' ? '3px solid var(--gov-saffron)' : '3px solid transparent'
                }}
              >
                🏦 Banks
              </button>
              <button
                onClick={() => handleTabChange('AUDITOR')}
                style={{
                  flex: 1,
                  padding: '10px 6px',
                  background: activeTab === 'AUDITOR' ? '#001733' : 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderBottom: activeTab === 'AUDITOR' ? '3px solid var(--gov-saffron)' : '3px solid transparent'
                }}
              >
                🔍 Audit & Public
              </button>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gov-navy-dark)', margin: '0 0 4px 0' }}>
                  {activeTab === 'INSTITUTION' && 'Technical Institution Authorized Access'}
                  {activeTab === 'OFFICER' && 'AICTE Regional Office & Bureau Scrutiny Login'}
                  {activeTab === 'BANK' && 'Scheduled Commercial Bank Nodal Portal'}
                  {activeTab === 'AUDITOR' && 'Statutory Audit & Public Verification Portal'}
                </h3>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Enter official credentials or select an authorized statutory demonstrator profile below.
                </div>
              </div>

              {/* Error / Lockout Alert */}
              {errorMessage && (
                <div className="gov-alert gov-alert-danger" style={{ marginBottom: '1rem', fontSize: '0.78rem' }}>
                  <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>{errorMessage}</div>
                </div>
              )}

              {/* Lockout Countdown Warning */}
              {isLocked && (
                <div className="gov-alert gov-alert-danger" style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
                  <ShieldAlert size={18} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>ACCOUNT LOCKED:</strong> Retry disabled for{' '}
                    <strong>{Math.floor(lockCountdown / 60)}m {lockCountdown % 60}s</strong>.
                  </div>
                </div>
              )}

              {/* Standard Credentials Form */}
              <form onSubmit={handleFormSubmit}>
                <div style={{ marginBottom: '0.85rem' }}>
                  <label className="gov-label" style={{ fontSize: '0.78rem' }}>
                    {activeTab === 'INSTITUTION' && 'AICTE Permanent ID (PID) / Username'}
                    {activeTab === 'OFFICER' && 'AICTE Official Email ID / Employee Code'}
                    {activeTab === 'BANK' && 'Bank Branch IFSC Code / Nodal Officer ID'}
                    {activeTab === 'AUDITOR' && 'Empanelled Auditor ID / Email'}
                    <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="gov-input font-mono"
                    placeholder="e.g. user ID"
                    required
                    disabled={isLocked}
                    style={{ fontSize: '0.82rem', padding: '6px 8px' }}
                  />
                </div>

                <div style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="gov-label" style={{ fontSize: '0.78rem' }}>Password <span className="req">*</span></label>
                    <span style={{ fontSize: '0.68rem', color: 'var(--gov-navy-medium)', cursor: 'pointer', textDecoration: 'underline' }}>
                      Forgot Password?
                    </span>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="gov-input"
                    required
                    disabled={isLocked}
                    style={{ fontSize: '0.82rem', padding: '6px 8px' }}
                  />
                  <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '2px' }}>
                    Default Password: <code className="font-mono" style={{ color: 'var(--gov-navy-dark)', fontWeight: 700 }}>Aicte@Password2026</code>
                  </div>
                </div>

                {/* Security Captcha Box */}
                <div style={{ marginBottom: '1rem' }}>
                  <label className="gov-label" style={{ fontSize: '0.78rem' }}>Security Verification Captcha <span className="req">*</span></label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div
                      style={{
                        background: '#1e293b',
                        color: '#38bdf8',
                        padding: '4px 12px',
                        letterSpacing: '5px',
                        fontFamily: 'monospace',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        userSelect: 'none',
                        border: '1px solid #0f172a',
                        borderRadius: '2px'
                      }}
                    >
                      {captchaCode}
                    </div>
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="btn-gov btn-gov-secondary btn-gov-sm"
                      title="Reload Captcha"
                      style={{ padding: '4px 8px' }}
                    >
                      <RefreshCw size={13} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Type characters shown above..."
                    className="gov-input font-mono"
                    style={{ textTransform: 'uppercase', fontSize: '0.82rem', padding: '6px 8px' }}
                    required
                    disabled={isLocked}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isLocked}
                  className="btn-gov btn-gov-primary"
                  style={{ width: '100%', padding: '0.6rem 1rem', fontWeight: 800, fontSize: '0.85rem' }}
                >
                  <Lock size={14} />
                  <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In Securely'}</span>
                </button>
              </form>

              {/* Pre-Authorized Sector Demonstrator Entry */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Authorized Demonstrator Access</span>
                  <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>1-Click Entry</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {activeTab === 'INSTITUTION' &&
                    personas
                      .filter((p) => p.role.includes('INSTITUTION'))
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleQuickLogin(p)}
                          className="btn-gov btn-gov-secondary btn-gov-sm"
                          style={{
                            textAlign: 'left',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            borderLeft: '3px solid #002147'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 800, color: '#002147', fontSize: '11px' }}>{p.name}</div>
                            <div style={{ fontSize: '9px', color: '#64748b' }}>{p.title}</div>
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#16a34a' }}>Enter Portal →</span>
                        </button>
                      ))}

                  {activeTab === 'OFFICER' &&
                    personas
                      .filter(
                        (p) =>
                          p.role.includes('VERIFIER') ||
                          p.role.includes('BUREAU') ||
                          p.role.includes('COMPETENT') ||
                          (p.role.includes('OFFICER') && !p.role.includes('BANK'))
                      )
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleQuickLogin(p)}
                          className="btn-gov btn-gov-secondary btn-gov-sm"
                          style={{
                            textAlign: 'left',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            borderLeft: '3px solid #002147'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 800, color: '#002147', fontSize: '11px' }}>{p.name}</div>
                            <div style={{ fontSize: '9px', color: '#64748b' }}>{p.title} · {p.department || 'HQ'}</div>
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#16a34a' }}>Enter Portal →</span>
                        </button>
                      ))}

                  {activeTab === 'BANK' &&
                    personas
                      .filter((p) => p.role.includes('BANK'))
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleQuickLogin(p)}
                          className="btn-gov btn-gov-secondary btn-gov-sm"
                          style={{
                            textAlign: 'left',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            borderLeft: '3px solid #002147'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 800, color: '#002147', fontSize: '11px' }}>{p.name}</div>
                            <div style={{ fontSize: '9px', color: '#64748b' }}>{p.title} · {p.department}</div>
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#16a34a' }}>Enter Portal →</span>
                        </button>
                      ))}

                  {activeTab === 'AUDITOR' && (
                    <>
                      {personas
                        .filter((p) => p.role.includes('AUDITOR'))
                        .map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleQuickLogin(p)}
                            className="btn-gov btn-gov-secondary btn-gov-sm"
                            style={{
                              textAlign: 'left',
                              justifyContent: 'space-between',
                              padding: '6px 10px',
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              borderLeft: '3px solid #002147'
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 800, color: '#002147', fontSize: '11px' }}>{p.name}</div>
                              <div style={{ fontSize: '9px', color: '#64748b' }}>{p.title}</div>
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#16a34a' }}>Enter Portal →</span>
                          </button>
                        ))}

                      <div style={{ marginTop: '6px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const publicPersona = personas.find((p) => p.role.includes('AUDITOR')) || personas[0];
                            setActivePersona(publicPersona);
                            setActiveTab('PUBLIC_NOC');
                            onLoginSuccess(publicPersona);
                          }}
                          className="btn-gov btn-gov-secondary btn-gov-sm"
                          style={{ width: '100%', justifyContent: 'center', fontWeight: 700, padding: '7px 8px', fontSize: '11px' }}
                        >
                          <span>Verify Released NOC Without Login (Public View) →</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Simulation Scenario Seed Selector */}
                <div style={{ marginTop: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '6px 8px', borderRadius: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#002147' }}>
                      Simulation Scenario Seed (Optional)
                    </span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>Pre-load regulatory state</span>
                  </div>
                  <select
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(Number(e.target.value))}
                    className="gov-input"
                    style={{ fontSize: '10px', padding: '3px 6px', background: '#ffffff', width: '100%' }}
                  >
                    <option value={0}>Standard Production / Default Live Records</option>
                    <option value={1}>Scenario 1: Wrong Amount Shortfall (Rule R1 Flag)</option>
                    <option value={2}>Scenario 2: Regional Officer Scrutiny & Query Inbox</option>
                    <option value={3}>Scenario 3: Fast-Forward Expiry Window (T-90 Days)</option>
                    <option value={4}>Scenario 4: Zero-Gap Renewal & Version Chaining</option>
                    <option value={5}>Scenario 5: Direct Bank Attestation & NOC Release</option>
                    <option value={6}>Scenario 6: Public QR Code Citizen Verification</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic National Visual Showcase & Statutory Advisory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* National Sansad Bhawan & Leadership Graphic Banner */}
            <div
              style={{
                position: 'relative',
                borderRadius: '2px',
                overflow: 'hidden',
                border: '1px solid #002147',
                background: '#002147',
                boxShadow: '0 4px 12px rgba(0,33,71,0.15)'
              }}
            >
              <img
                src="./assets/indian-parliament.jpg"
                alt="Parliament of India"
                style={{
                  width: '100%',
                  height: '175px',
                  objectFit: 'cover',
                  opacity: 0.35,
                  filter: 'contrast(1.15) brightness(0.95)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, rgba(0,33,71,0.95) 0%, rgba(0,33,71,0.72) 65%, rgba(0,33,71,0.92) 100%)',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  color: '#ffffff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#ff9933', fontWeight: 800 }}>
                      Ministry of Education • Government of India
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#ffffff', letterSpacing: '0.02em', marginTop: '2px' }}>
                      Viksit Bharat @ 2047: Cryptographic Trust
                    </div>
                    <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>
                      Digitally Safeguarding ₹3,400+ Cr in Institutional Security Deposits
                    </div>
                  </div>
                  <img
                    src="./assets/digital-india.svg"
                    alt="Digital India"
                    style={{ height: '32px', filter: 'brightness(0) invert(1)', opacity: 0.9 }}
                  />
                </div>

                {/* Real Leadership Portraits */}
                <div style={{ display: 'flex', gap: '18px', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.18)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                      src="./assets/leadership/minister-pradhan.jpg"
                      alt="Shri Dharmendra Pradhan"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #ff9933',
                        background: '#ffffff'
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#ffffff' }}>Shri Dharmendra Pradhan</div>
                      <div style={{ fontSize: '9px', color: '#ff9933' }}>Hon'ble Minister of Education</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                      src="./assets/leadership/chairman-sitharam.png"
                      alt="Prof. T. G. Sitharam"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #138808',
                        background: '#ffffff'
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#ffffff' }}>Prof. T. G. Sitharam</div>
                      <div style={{ fontSize: '9px', color: '#86efac' }}>Chairman, AICTE New Delhi</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statutory Advisory */}
            <div className="gov-panel" style={{ padding: '1.25rem', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Shield size={18} style={{ color: 'var(--gov-navy-medium)' }} />
                <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--gov-navy-dark)', margin: 0 }}>
                  Statutory Instructions for Technical Institutions (APH 2024-27)
                </h4>
              </div>

              <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.78rem', color: '#334155', lineHeight: 1.6 }}>
                <li>
                  <strong>Clause 1.4 Mandate:</strong> Fixed Deposit Receipts (FDR) and Bank Guarantees (BG) must be issued in joint name with <em>"Member Secretary, AICTE New Delhi"</em> by Scheduled Commercial Banks.
                </li>
                <li>
                  <strong>Trust Levels:</strong> Institution submissions enter registry at <strong>Level L0</strong>. Final Approval (EoA) and release discharge strictly require <strong>Level L2 (Bank Confirmation)</strong>.
                </li>
                <li>
                  <strong>Lockout Advisory:</strong> For electronic security, 5 consecutive failed login attempts trigger an automated 30-minute account lockout per CERT-In guidelines.
                </li>
              </ul>
            </div>

            <div className="gov-panel" style={{ padding: '1.25rem', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Landmark size={18} style={{ color: 'var(--gov-green-dark)' }} />
                <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--gov-navy-dark)', margin: 0 }}>
                  Central Vigilance & Security Standards
                </h4>
              </div>

              <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45, margin: 0 }}>
                Every authentication event, state change, and document upload writes an immutable record to the AICTE cryptographic audit ledger using SHA-256 hash chaining. Hosted in compliance with MeitY, GIGW 3.0, and NIC cyber guidelines.
              </p>
            </div>
          </div>
        </div>

        {/* Scheduled Commercial Bank Network Ribbon */}
        <div style={{ marginTop: '1.5rem' }}>
          <BankPartnersRibbon />
        </div>
      </div>

      {/* 2FA OTP Modal */}
      {showOtpModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div className="gov-panel" style={{ width: '100%', maxWidth: '440px', background: '#ffffff', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            <div className="gov-panel-header">
              <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>
                TWO-FACTOR AUTHENTICATION (2FA OTP)
              </span>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <Smartphone size={32} style={{ color: 'var(--gov-navy-medium)', margin: '0 auto 0.5rem' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--gov-navy-dark)', margin: 0 }}>
                  Enter Verification Code
                </h4>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  A 6-digit statutory OTP has been dispatched to {pendingUser?.phone || '+91 98*** ***90'}.
                </div>
              </div>

              <div className="gov-alert gov-alert-info" style={{ fontSize: '0.75rem', marginBottom: '1rem', textAlign: 'center' }}>
                <strong>Demo Passcode:</strong> Enter <code className="font-mono" style={{ fontWeight: 800, color: 'var(--gov-navy-dark)' }}>262650</code> to authenticate.
              </div>

              <form onSubmit={handleOtpVerify}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="gov-label" style={{ textAlign: 'center', display: 'block' }}>
                    Enter 6-Digit OTP:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="262650"
                    className="gov-input font-mono"
                    style={{ fontSize: '1.3rem', textAlign: 'center', letterSpacing: '6px', fontWeight: 800 }}
                    required
                    autoFocus
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowOtpModal(false)}
                    className="btn-gov btn-gov-secondary btn-gov-sm"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gov btn-gov-primary btn-gov-sm"
                    style={{ flex: 1, fontWeight: 800 }}
                  >
                    Verify & Enter Portal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
