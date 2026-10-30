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
              <a href="https://www.aicte-india.org/approval/approval-process-handbook" target="_blank" rel="noopener noreferrer">
                Approval Process Handbook (APH 2024-27)
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

        {/* Col 2: Government of India Links */}
        <div className="gov-footer-col">
          <h4>Government of India</h4>
          <ul>
            <li>
              <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer">
                National Portal of India (india.gov.in) <ExternalLink size={10} />
              </a>
            </li>
            <li>
              <a href="https://www.education.gov.in" target="_blank" rel="noopener noreferrer">
                Ministry of Education (moe.gov.in)
              </a>
            </li>
            <li>
              <a href="https://www.mygov.in" target="_blank" rel="noopener noreferrer">
                MyGov - Citizen Engagement Platform
              </a>
            </li>
            <li>
              <a href="https://www.digitalindia.gov.in" target="_blank" rel="noopener noreferrer">
                Digital India National Initiative
              </a>
            </li>
            <li>
              <a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer">
                National Scholarship Portal (NSP)
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Statutory Policies & Guidelines */}
        <div className="gov-footer-col">
          <h4>Statutory Policies (GIGW)</h4>
          <ul>
            <li><a href="#">Website Policies & Guidelines</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Hyperlinking Policy</a></li>
            <li><a href="#">Copyright Policy</a></li>
            <li><a href="#">Disclaimer & Security Protocol</a></li>
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
