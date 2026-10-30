import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Clock, Play, RotateCcw, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

export const TimeTravelModal: React.FC = () => {
  const {
    isTimeTravelOpen,
    setIsTimeTravelOpen,
    simulatedDate,
    setSimulatedDate
  } = useApp();

  const [customDate, setCustomDate] = useState<string>(simulatedDate);

  if (!isTimeTravelOpen) return null;

  const presets = [
    {
      title: 'Baseline (Current Date)',
      date: '2026-10-24',
      badge: 'Active Today',
      description: 'Default initial state: Active portfolio, preliminary scrutiny queue.'
    },
    {
      title: 'T-90 Days to Maturity',
      date: '2027-01-20',
      badge: 'Scenario 3',
      description: 'Instrument enters 90-day window. Status turns EXPIRING. Automated statutory SMS/Email reminders fire.'
    },
    {
      title: 'T-30 Days Critical Urgency',
      date: '2027-03-20',
      badge: 'Escalation',
      description: 'Urgency escalation. Officer queue risk scores spike for expiring cases.'
    },
    {
      title: 'Instrument Matures',
      date: '2027-04-15',
      badge: 'Maturity',
      description: 'Statutory lock-in period concludes. Case eligible for renewal or release workflow.'
    },
    {
      title: 'Overdue (+30 Days Lapsed)',
      date: '2027-05-15',
      badge: 'Penal Action',
      description: 'Unrenewed deposit turns OVERDUE with high risk score and penal alert.'
    }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
    >
      <div
        className="gov-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          background: '#ffffff',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
        }}
      >
        {/* Header */}
        <div className="gov-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} />
            <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>
              AICTE TIME-TRAVEL SIMULATION ENGINE (TEMPORAL EVALUATION)
            </span>
          </div>
          <button
            onClick={() => setIsTimeTravelOpen(false)}
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '2px' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <div className="gov-alert gov-alert-info" style={{ marginBottom: '1rem', fontSize: '0.78rem' }}>
            Simulate the passage of time across statutory lock-in periods to trigger automated state transitions, expiry reminders, and risk score escalations.
          </div>

          {/* Current Active Date Banner */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              padding: '0.75rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                CURRENT VIRTUAL CLOCK:
              </span>
              <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gov-navy-dark)' }}>
                {simulatedDate}
              </div>
            </div>

            <button
              onClick={() => {
                setSimulatedDate('2026-10-24');
                setCustomDate('2026-10-24');
              }}
              className="btn-gov btn-gov-secondary btn-gov-sm"
              title="Reset to today"
            >
              <RotateCcw size={12} />
              <span>Reset to Today</span>
            </button>
          </div>

          {/* Presets List */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Standard Evaluation Milestones (Hackathon Scenarios):
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {presets.map((preset, idx) => {
                const isActive = simulatedDate === preset.date;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSimulatedDate(preset.date);
                      setCustomDate(preset.date);
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      border: isActive ? '2px solid var(--gov-navy-medium)' : '1px solid #cbd5e1',
                      borderLeft: isActive ? '5px solid var(--gov-saffron)' : '3px solid #cbd5e1',
                      background: isActive ? '#f0f4f8' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'background-color 100ms'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--gov-navy-dark)', fontSize: '0.85rem' }}>
                          {preset.title}
                        </span>
                        <span
                          style={{
                            background: isActive ? 'var(--gov-navy-medium)' : '#e2e8f0',
                            color: isActive ? '#ffffff' : '#475569',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '1px 6px'
                          }}
                        >
                          {preset.badge}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0', lineHeight: 1.3 }}>
                        {preset.description}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span className="font-mono" style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--gov-navy-dark)', display: 'block' }}>
                        {preset.date}
                      </span>
                      {isActive && (
                        <span style={{ fontSize: '0.68rem', color: 'var(--gov-green-dark)', fontWeight: 800 }}>
                          ● ACTIVE
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Date Input */}
          <div
            style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label className="gov-label" style={{ marginBottom: '2px' }}>
                Set Arbitrary Target Date:
              </label>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="gov-input font-mono"
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            <button
              onClick={() => setSimulatedDate(customDate)}
              className="btn-gov btn-gov-primary"
              style={{ marginTop: '16px', fontWeight: 700 }}
            >
              <Play size={13} />
              <span>Apply Target Date</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
