import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Sparkles,
  Bell,
  UserCheck,
  ChevronDown,
  Shield,
  Layers,
  CheckCircle,
  Clock,
  Mail,
  Smartphone,
  ExternalLink,
  Volume2,
  Eye,
  LogOut
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activePersona,
    setActivePersona,
    personas,
    simulatedDate,
    setIsTimeTravelOpen,
    setIsScenarioGuideOpen,
    notifications,
    language,
    setLanguage,
    logout,
    sessionRemainingSeconds
  } = useApp();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState<'sm' | 'md' | 'lg'>('md');

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  const handleFontResize = (scale: 'sm' | 'md' | 'lg') => {
    setFontSizeScale(scale);
    document.documentElement.className = `font-scale-${scale}`;
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
      {/* 1. Indian Government Utility Bar (GIGW 3.0 Standard) */}
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
          <a href="#main-content" className="gov-utility-link" title="Skip to Main Content">
            Skip to Main Content
          </a>
          <span style={{ color: '#475569' }}>|</span>
          <span className="gov-utility-link" title="Screen Reader Access">
            <Volume2 size={11} /> Screen Reader
          </span>
          <span style={{ color: '#475569' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '10px', marginRight: '3px', color: '#94a3b8' }}>Text Size:</span>
            <button
              onClick={() => handleFontResize('sm')}
              className={`gov-size-btn ${fontSizeScale === 'sm' ? 'active' : ''}`}
              title="Small text"
            >
              A-
            </button>
            <button
              onClick={() => handleFontResize('md')}
              className={`gov-size-btn ${fontSizeScale === 'md' ? 'active' : ''}`}
              title="Normal text"
            >
              A
            </button>
            <button
              onClick={() => handleFontResize('lg')}
              className={`gov-size-btn ${fontSizeScale === 'lg' ? 'active' : ''}`}
              title="Large text"
            >
              A+
            </button>
          </div>
          <span style={{ color: '#475569' }}>|</span>
          <button
            onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
            className="gov-size-btn"
            style={{ padding: '1px 8px', background: '#003366', color: '#ffffff', border: '1px solid #3b82f6' }}
            title="Language Toggle"
          >
            {language === 'EN' ? 'हिंदी में देखें' : 'English View'}
          </button>
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

      {/* 2. Official Main Branding Section */}
      <div className="gov-main-header">
        <div className="gov-branding-block">
          {/* Real Ashoka Lion Capital National Emblem */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '45px' }}>
            <img
              src="./assets/emblem-india.svg"
              alt="National Emblem of India"
              style={{ height: '56px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Real Official AICTE Council Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="./assets/aicte-logo.png"
              alt="AICTE Official Logo"
              style={{ height: '54px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Titles */}
          <div className="gov-title-block">
            <h1>
              {language === 'HI' ? 'अखिल भारतीय तकनीकी शिक्षा परिषद' : 'ALL INDIA COUNCIL FOR TECHNICAL EDUCATION'}
            </h1>
            <h2>
              {language === 'HI'
                ? 'ई-एफडीआर एवं प्रतिभूति जमा प्रबंधन पोर्टल (APH 2024-27)'
                : 'Central Security Deposit & FDR Management Portal (e-FDR)'}
            </h2>
            <div className="subtitle">
              {language === 'HI'
                ? 'शिक्षा मंत्रालय, भारत सरकार के अधीन एक सांविधिक निकाय'
                : 'A Statutory Body of the Government of India, Ministry of Education | PSID 26265'}
            </div>
          </div>
        </div>

        {/* User Identity, Sovereign Timestamp & Session Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Sovereign Session Time & NIC Server Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              fontSize: '11px',
              color: '#334155'
            }}
          >
            <Clock size={12} style={{ color: '#002147' }} />
            <span>{simulatedDate} | 10:30 IST</span>
            <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '9px', background: '#dcfce7', padding: '1px 5px', borderRadius: '2px' }}>
              NIC SYNC
            </span>
          </div>

          {/* Official Digital India Logo */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px', borderLeft: '1px solid #e2e8f0' }}>
            <img
              src="./assets/digital-india.svg"
              alt="Digital India"
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
              title="Digital India Initiative"
            />
          </div>

          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="btn-gov btn-gov-secondary btn-gov-sm"
              style={{ padding: '4px 7px', position: 'relative' }}
              title="System Alerts & Scheduled Reminders"
            >
              <Bell size={13} />
              {unreadNotifs.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    background: '#b91c1c',
                    color: '#ffffff',
                    fontSize: '9px',
                    fontWeight: 800,
                    width: '14px',
                    height: '14px',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifMenu && (
              <div
                className="gov-panel"
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '320px',
                  maxHeight: '360px',
                  overflowY: 'auto',
                  zIndex: 2000,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  border: '1px solid #94a3b8'
                }}
              >
                <div style={{ background: '#002147', color: '#ffffff', padding: '6px 10px', fontSize: '11px', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Statutory Reminders & Alerts</span>
                  <span>{notifications.length} queued</span>
                </div>
                <div style={{ padding: '8px' }}>
                  {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '12px', color: '#64748b', fontSize: '11px' }}>
                      No unread alerts
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        style={{
                          background: n.priority === 'URGENT' ? '#fef2f2' : '#f8fafc',
                          borderLeft: `3px solid ${n.priority === 'URGENT' ? '#b91c1c' : '#003366'}`,
                          padding: '6px 8px',
                          marginBottom: '6px',
                          fontSize: '11px',
                          borderTop: '1px solid #e2e8f0',
                          borderRight: '1px solid #e2e8f0',
                          borderBottom: '1px solid #e2e8f0'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '10px' }}>
                          <span>{n.channel} Dispatch · {n.recipient}</span>
                          <span>{n.timestamp.slice(11, 16)}</span>
                        </div>
                        <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{n.subject}</div>
                        <div style={{ color: '#475569', marginTop: '2px' }}>{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Persona & Sovereign Profile Card */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="gov-user-card"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: '#ffffff', border: '1px solid #cbd5e1' }}
              title="Click to View Official Profile and Account Details"
            >
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, color: '#002147', fontSize: '12px' }}>
                  {activePersona.name}
                </div>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 500 }}>
                  {activePersona.title} ({activePersona.department || activePersona.institutionName || 'HQ'})
                </div>
              </div>
              <ChevronDown size={14} style={{ color: '#003366' }} />
            </div>

            {/* Sovereign Government Profile Dropdown */}
            {showPersonaMenu && (
              <div
                className="gov-panel"
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: '320px',
                  zIndex: 2000,
                  boxShadow: '0 8px 24px rgba(0,33,71,0.2)',
                  border: '1px solid #002147',
                  background: '#ffffff'
                }}
              >
                {/* Header Strip */}
                <div style={{ background: '#002147', color: '#ffffff', padding: '10px 12px' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ff9933', fontWeight: 800 }}>
                    Government of India • Ministry of Education
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                    {activePersona.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                    {activePersona.title}
                  </div>
                </div>

                {/* Details Body */}
                <div style={{ padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b' }}>Designation:</span>
                      <strong style={{ color: '#0f172a' }}>{activePersona.title}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b' }}>Station / Office:</span>
                      <strong style={{ color: '#0f172a' }}>{activePersona.department || activePersona.institutionName || 'Council HQ, New Delhi'}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b' }}>Portal Tier:</span>
                      <span style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: 700, padding: '1px 6px', fontSize: '10px', borderRadius: '2px' }}>
                        {activePersona.role}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b' }}>Digital Identity:</span>
                      <span style={{ color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
                        NIC Class-3 DSC Active
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px' }}>
                      <span style={{ color: '#64748b' }}>Statutory Authority:</span>
                      <span style={{ color: '#002147', fontWeight: 600 }}>APH 2024-27 Cl. 1.4</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                    <button
                      onClick={() => {
                        setShowPersonaMenu(false);
                        logout();
                      }}
                      className="btn-gov btn-gov-secondary btn-gov-sm"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        color: '#b91c1c',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        fontWeight: 700,
                        padding: '6px 12px'
                      }}
                      title="End current authenticated session and return to access gateway"
                    >
                      <LogOut size={13} />
                      <span>Sign Out / Secure Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sign Out & Session Security Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                fontSize: '10px',
                color: sessionRemainingSeconds < 300 ? '#b91c1c' : '#64748b',
                background: sessionRemainingSeconds < 300 ? '#fee2e2' : '#f8fafc',
                border: '1px solid #cbd5e1',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600
              }}
              title="Session idle security timeout (GSD Plan 1.2)"
            >
              <Clock size={11} style={{ color: sessionRemainingSeconds < 300 ? '#dc2626' : '#d97706' }} />
              <span>{Math.floor(sessionRemainingSeconds / 60)}:{(sessionRemainingSeconds % 60).toString().padStart(2, '0')}</span>
            </div>

            <button
              onClick={logout}
              className="btn-gov btn-gov-secondary btn-gov-sm"
              style={{
                border: '1px solid #fecaca',
                background: '#fef2f2',
                color: '#991b1b',
                fontWeight: 700,
                gap: '4px',
                padding: '4px 8px'
              }}
              title="Terminate session and return to official login page"
            >
              <LogOut size={12} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Official Government Notification Ticker / Marquee */}
      <div className="gov-marquee-ticker">
        <span className="gov-marquee-label">OFFICIAL DIRECTIVE</span>
        {React.createElement(
          'marquee',
          { scrollamount: '5', style: { flex: 1 } },
          <span>
            <strong>APH 2024-27 Clause 1.4:</strong> All FDRs / JFDRs must be issued by a Scheduled Commercial Bank in joint name with "Member Secretary, AICTE New Delhi" with official lien endorsement. Instruments without bank confirmation remain at Trust Level L0. Encashment / NOC release requires Trust Level L2 verification.
          </span>
        )}
      </div>
    </header>
  );
};
