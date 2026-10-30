import React from 'react';
import { FileUp, FileCheck2, Landmark, Award, ShieldAlert, ArrowRight } from 'lucide-react';

export const ProcessLifecyclePoster: React.FC = () => {
  const steps = [
    {
      step: '01',
      stage: 'STAGE 1: LODGEMENT',
      trust: 'L0 Submitted',
      trustColor: '#475569',
      trustBg: '#f1f5f9',
      title: 'Institutional Declaration',
      actor: 'Technical Institution Signatory',
      desc: 'College enters FDR details, attaches certificate scan and mandatory board resolution. Initial record registered.',
      icon: <FileUp size={16} style={{ color: '#003366' }} />
    },
    {
      step: '02',
      stage: 'STAGE 2: SCRUTINY',
      trust: 'L1 Scrutinized',
      trustColor: '#b45309',
      trustBg: '#fffbeb',
      title: 'Officer Verification',
      actor: 'Regional / Bureau Officer',
      desc: 'Matches scan with typed data, verifies joint lien clause to "Member Secretary AICTE", checks APH Table 1.4 adequacy.',
      icon: <FileCheck2 size={16} style={{ color: '#b45309' }} />
    },
    {
      step: '03',
      stage: 'STAGE 3: ATTESTATION',
      trust: 'L2 Bank-Confirmed',
      trustColor: '#15803d',
      trustBg: '#f0fdf4',
      title: 'Branch Lien Confirmation',
      actor: 'Issuing Bank Branch Manager',
      desc: 'Scheduled Bank branch verifies lien notation in Core Banking System (CBS) and signs cryptographic confirmation.',
      icon: <Landmark size={16} style={{ color: '#15803d' }} />
    },
    {
      step: '04',
      stage: 'STAGE 4: RELEASE',
      trust: 'NOC Issued',
      trustColor: '#0369a1',
      trustBg: '#f0f9ff',
      title: 'Digital QR-NOC Issuance',
      actor: 'Member Secretary / Executive Authority',
      desc: 'Maker-checker approved digital release certificate generated with tamper-evident QR code and cryptographic audit lock.',
      icon: <Award size={16} style={{ color: '#0369a1' }} />
    }
  ];

  return (
    <div
      className="gov-panel"
      style={{
        borderRadius: '0px',
        border: '1px solid #cbd5e1',
        marginBottom: '14px',
        background: '#ffffff'
      }}
    >
      <div
        className="gov-panel-header"
        style={{
          padding: '8px 12px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#002147' }}>
          Statutory Four-Stage Workflow of Security Deposits under APH 2024-27 Clause 1.4
        </span>
        <span style={{ fontSize: '10px', color: '#b91c1c', fontWeight: 700 }}>
          Mandatory Requirement: Deposit release strictly prohibited below Stage 3 (L2)
        </span>
      </div>

      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {steps.map((s, idx) => (
            <div
              key={s.step}
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: '2px',
                background: '#ffffff',
                padding: '10px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
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
                      {s.step}
                    </div>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#64748b', letterSpacing: '0.04em' }}>
                      {s.stage}
                    </span>
                  </div>
                  {s.icon}
                </div>

                <div style={{ fontSize: '12px', fontWeight: 700, color: '#002147', marginBottom: '2px' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: '9px', color: '#0369a1', fontWeight: 600, marginBottom: '6px' }}>
                  Role: {s.actor}
                </div>
                <div style={{ fontSize: '10px', color: '#475569', lineHeight: 1.35 }}>
                  {s.desc}
                </div>
              </div>

              <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '9px',
                    fontWeight: 700,
                    color: s.trustColor,
                    background: s.trustBg,
                    border: `1px solid ${s.trustColor}40`,
                    padding: '2px 5px',
                    borderRadius: '2px'
                  }}
                >
                  {s.trust}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
