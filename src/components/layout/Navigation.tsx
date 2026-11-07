import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  ListOrdered,
  FileSearch,
  Building2,
  FilePlus,
  ShieldCheck,
  QrCode,
  Landmark,
  TrendingUp,
  Sliders,
  Terminal,
  FileSpreadsheet,
  Printer,
  FileText,
  Lock
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, language } = useApp();

  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    {
      id: 'DASHBOARD',
      label: language === 'HI' ? 'कार्यकारी डैशबोर्ड' : 'Overview Dashboard',
      icon: <LayoutDashboard size={13} />
    },
    {
      id: 'WORKLIST',
      label: language === 'HI' ? 'संवीक्षा कार्यसूची' : 'Scrutiny Worklist',
      icon: <ListOrdered size={13} />
    },
    {
      id: 'CASE_WORKSPACE',
      label: language === 'HI' ? 'केस सत्यापन' : 'Case Scrutiny',
      icon: <FileSearch size={13} />
    },
    {
      id: 'INSTITUTION_PORTAL',
      label: language === 'HI' ? 'संस्थान पोर्टल' : 'Institution Desk',
      icon: <Building2 size={13} />
    },
    {
      id: 'NEW_SUBMISSION',
      label: language === 'HI' ? 'जमा प्रविष्टि (e-FDR)' : 'Deposit Lodgement',
      icon: <FilePlus size={13} />
    },
    {
      id: 'AUDIT_EXPLORER',
      label: language === 'HI' ? 'सतर्कता एवं ऑडिट लेजर' : 'Audit Ledger',
      icon: <ShieldCheck size={13} />
    },
    {
      id: 'PUBLIC_NOC',
      label: language === 'HI' ? 'डिजिटल एनओसी सत्यापन' : 'NOC Verification',
      icon: <QrCode size={13} />
    },
    {
      id: 'BANK_CONFIRM',
      label: language === 'HI' ? 'बैंक सत्यापन' : 'Bank Confirmation',
      icon: <Landmark size={13} />
    },
    {
      id: 'RULE_SANDBOX',
      label: language === 'HI' ? 'विनियमन सैंडबॉक्स' : 'Regulatory Sandbox',
      icon: <Sliders size={13} />
    },
    {
      id: 'API_EXPLORER',
      label: language === 'HI' ? 'पोर्टल एपीआई' : 'Approval APIs',
      icon: <Terminal size={13} />
    },
    {
      id: 'REPORTS',
      label: language === 'HI' ? 'सांविधिक रिपोर्ट' : 'Statutory Reports',
      icon: <FileSpreadsheet size={13} />
    },
    {
      id: 'ROI_SLIDES',
      label: language === 'HI' ? 'परिषद एमआईएस' : 'Council MIS',
      icon: <TrendingUp size={13} />
    },
    {
      id: 'LOGIN_DEMO',
      label: language === 'HI' ? 'लॉगिन द्वार (2FA)' : 'Login & 2FA Gate',
      icon: <Lock size={13} />
    }
  ];

  const currentTab = navItems.find((n) => n.id === activeTab);

  return (
    <>
      {/* 1. Deep Navy Government Navigation Bar */}
      <nav className="gov-nav-bar">
        <div className="gov-nav-tabs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`gov-nav-tab ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 2. Official "You Are Here" Breadcrumb Strip */}
      <div className="gov-breadcrumb-strip" id="main-content">
        <div className="gov-breadcrumb-links">
          <span>You are here: </span>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('DASHBOARD'); }}>Home</a>
          <span> » </span>
          <span>Approval Process 2026-27</span>
          <span> » </span>
          <span>Central Security Deposit (e-FDR)</span>
          <span> » </span>
          <strong style={{ color: '#002147' }}>{currentTab?.label || 'Overview'}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => window.print()}
            className="btn-gov btn-gov-secondary btn-gov-sm"
            style={{ fontSize: '11px', padding: '2px 8px' }}
            title="Print Current Screen / Record"
          >
            <Printer size={11} />
            <span>Print View</span>
          </button>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            Academic Year: <strong>2026-27</strong>
          </span>
        </div>
      </div>
    </>
  );
};
