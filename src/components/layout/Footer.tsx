import React from 'react';
import { ExternalLink, Phone, Mail, MapPin, Shield, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="gov-footer">
      {/* Indian Sovereign Tricolor Accent Strip */}
      <div className="gov-footer-tricolor" />

      {/* Main 4-Column Directory */}
      <div className="gov-footer-main">
        {/* Col 1: AICTE Links */}
        <div className="gov-footer-col">
          <h4>AICTE Portals & Resources</h4>
          <ul>
            <li>
              <a href="https://www.aicte-india.org" target="_blank" rel="noopener noreferrer">
                AICTE Official Website (aicte-india.org) <ExternalLink size={10} />
              </a>
            </li>
            <li>
              <a href="https://aicte-qa.aicte-india.org/sites/default/files/APH%20Final.pdf" target="_blank" rel="noopener noreferrer">
                Approval Process Handbook (APH 2024-27 PDF) <ExternalLink size={10} />
              </a>
            </li>
            <li>
              <a href="https://swayam.gov.in" target="_blank" rel="noopener noreferrer">
                SWAYAM Central Portal
              </a>
            </li>
            <li>
              <a href="https://neat.aicte-india.org" target="_blank" rel="noopener noreferrer">
                National Educational Alliance for Technology (NEAT)
              </a>
            </li>
            <li>
              <a href="https://nats.education.gov.in" target="_blank" rel="noopener noreferrer">
                NATS National Apprenticeship Portal
              </a>
            </li>
          </ul>
        </div>

        {/* Col 2: Government of India & Design Systems */}
        <div className="gov-footer-col">
          <h4>Government of India & Standards</h4>
          <ul>
            <li>
              <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer">
                National Portal of India (india.gov.in) <ExternalLink size={10} />
              </a>
            </li>
            <li>
              <a href="https://www.ux4g.gov.in" target="_blank" rel="noopener noreferrer">
                UX4G Unified Design System <ExternalLink size={10} />
              </a>
            </li>
            <li>
              <a href="https://guidelines.india.gov.in" target="_blank" rel="noopener noreferrer">
                GIGW 3.0 Web Guidelines <ExternalLink size={10} />
              </a>
            </li>
            <li>
              <a href="https://www.nic.in" target="_blank" rel="noopener noreferrer">
                National Informatics Centre (NIC) <ExternalLink size={10} />
              </a>
            </li>
            <li>
              <a href="https://www.digitalindia.gov.in" target="_blank" rel="noopener noreferrer">
                Digital India National Initiative
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Banking & Regulatory Policies */}
        <div className="gov-footer-col">
          <h4>Banking & Regulatory References</h4>
          <ul>
            <li>
              <a href="https://data.rbi.org.in/" target="_blank" rel="noopener noreferrer">
                RBI Database on Indian Economy (DBIE) <ExternalLink size={10} />
              </a>
            </li>
            <li>
              <a href="https://www.rbi.org.in/Scripts/Publications.aspx" target="_blank" rel="noopener noreferrer">
                RBI Banking Publications & Norms
              </a>
            </li>
            <li>
              <a href="https://sbi.co.in" target="_blank" rel="noopener noreferrer">
                State Bank of India (sbi.co.in)
              </a>
            </li>
            <li>
              <a href="https://pnb.bank.in" target="_blank" rel="noopener noreferrer">
                Punjab National Bank (pnb.bank.in)
              </a>
            </li>
            <li><a href="#">Website Security &amp; Privacy Policy</a></li>
            <li><a href="#">Hyperlinking &amp; Copyright Policy</a></li>
            <li><a href="#">GIGW 3.0 Compliance Statement</a></li>
          </ul>
        </div>

        {/* Col 4: Council Headquarters & Helpdesk */}
        <div className="gov-footer-col">
          <h4>Council Headquarters</h4>
          <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6 }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '6px' }}>
              <MapPin size={13} style={{ color: '#f37022', flexShrink: 0, marginTop: '2px' }} />
              <span>
                All India Council for Technical Education (AICTE),<br />
                Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
              <Phone size={12} style={{ color: '#38bdf8' }} />
              <span>Helpdesk: 011-29581000 / 011-29581014</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <Mail size={12} style={{ color: '#34d399' }} />
              <span>Email: fdr-support@aicte-india.org</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Government Agencies & Security Certification Showcase */}
      <div
        style={{
          background: '#07162c',
          borderTop: '1px solid #1e3a8a',
          borderBottom: '1px solid #001733',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="./assets/badges/nic.svg"
            alt="National Informatics Centre"
            style={{ height: '36px', width: 'auto', background: '#ffffff', borderRadius: '3px', padding: '2px 4px' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="./assets/digital-india.svg"
            alt="Digital India"
            style={{ height: '36px', width: 'auto', filter: 'brightness(0) invert(1)' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="./assets/badges/cert-in.svg"
            alt="CERT-In Cyber Secured"
            style={{ height: '36px', width: 'auto', borderRadius: '3px' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="./assets/badges/digilocker.svg"
            alt="DigiLocker Verified"
            style={{ height: '36px', width: 'auto', borderRadius: '3px' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="./assets/badges/gigw.svg"
            alt="GIGW 3.0 Compliant"
            style={{ height: '36px', width: 'auto', borderRadius: '3px' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="./assets/badges/iso27001.svg"
            alt="ISO 27001 Certified ISMS"
            style={{ height: '36px', width: 'auto', borderRadius: '3px' }}
          />
        </div>
      </div>

      {/* Bottom Legal, Hosting, and Certification Strip */}
      <div className="gov-footer-bottom">
        <div>
          Website Content Managed by <strong>All India Council for Technical Education (AICTE), Ministry of Education, Government of India</strong>
        </div>
        <div style={{ marginTop: '3px' }}>
          Designed, Developed and Hosted by <strong>National Informatics Centre (NIC)</strong> | Standard: <strong>GIGW 3.0 &amp; WCAG 2.1 AA</strong>
        </div>
        <div style={{ marginTop: '3px', color: '#64748b', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span>Last Reviewed and Updated on: <strong>24-Oct-2026</strong> | Total Visitors: <strong>14,82,925</strong></span>
          <span>•</span>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-evaluator-dock'))}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#475569',
              fontSize: '10px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            title="Toggle SIH Evaluator Sandbox Console (Shortcut: Ctrl+Shift+D)"
          >
            Evaluator Sandbox [Ctrl+Shift+D]
          </button>
        </div>
      </div>
    </footer>
  );
};
