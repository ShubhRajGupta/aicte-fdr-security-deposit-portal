import React, { useState } from 'react';
import { Instrument } from '../../types';
import { Calendar, AlertOctagon, TrendingUp } from 'lucide-react';

interface HeatmapCalendarProps {
  instruments: Instrument[];
  onSelectMonth?: (monthIndex: number) => void;
}

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ instruments, onSelectMonth }) => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(4); // Default to May (peak month)

  // 12 months for 2027 forecast
  const months = [
    { name: 'Jan', fullName: 'January 2027', count: 1, amount: 2500000, peak: false },
    { name: 'Feb', fullName: 'February 2027', count: 0, amount: 0, peak: false },
    { name: 'Mar', fullName: 'March 2027', count: 2, amount: 5000000, peak: false },
    { name: 'Apr', fullName: 'April 2027', count: 3, amount: 7500000, peak: false },
    { name: 'May', fullName: 'May 2027 (Peak Council Approval Window)', count: 9, amount: 28500000, peak: true },
    { name: 'Jun', fullName: 'June 2027', count: 4, amount: 11000000, peak: false },
    { name: 'Jul', fullName: 'July 2027', count: 2, amount: 5000000, peak: false },
    { name: 'Aug', fullName: 'August 2027', count: 1, amount: 2500000, peak: false },
    { name: 'Sep', fullName: 'September 2027', count: 1, amount: 1500000, peak: false },
    { name: 'Oct', fullName: 'October 2027', count: 2, amount: 6000000, peak: false },
    { name: 'Nov', fullName: 'November 2027', count: 0, amount: 0, peak: false },
    { name: 'Dec', fullName: 'December 2027', count: 1, amount: 2500000, peak: false }
  ];

  const maxCount = 9;

  return (
    <div className="gov-panel" style={{ borderRadius: '0px' }}>
      <div className="gov-panel-header" style={{ padding: '8px 12px' }}>
        <div className="gov-panel-title" style={{ fontSize: '13px' }}>
          <Calendar size={13} style={{ color: '#003366' }} />
          <span>Statutory Maturity Forecast &amp; Annual Approval Window Distribution (2027)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#475569' }}>
          <span>Intensity Legend:</span>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1' }} /> Normal
          <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#e0f2fe', border: '1px solid #7dd3fc' }} /> Medium
          <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#ffedd5', border: '1px solid #f97316' }} /> Peak (May Approval)
        </div>
      </div>

      <div className="gov-panel-body">
        {/* Heatmap Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(75px, 1fr))', gap: '8px', marginBottom: '12px' }}>
          {months.map((m, idx) => {
            const ratio = m.count / maxCount;
            let bg = '#ffffff';
            let borderColor = '#cbd5e1';
            let textColor = '#1e293b';

            if (m.peak) {
              bg = '#fff7ed';
              borderColor = '#ea580c';
              textColor = '#9a3412';
            } else if (ratio > 0.3) {
              bg = '#f0f9ff';
              borderColor = '#38bdf8';
              textColor = '#0369a1';
            } else if (ratio > 0) {
              bg = '#f8fafc';
              borderColor = '#cbd5e1';
              textColor = '#334155';
            }

            const isSelected = selectedMonth === idx;

            return (
              <div
                key={m.name}
                onClick={() => {
                  setSelectedMonth(idx);
                  if (onSelectMonth) onSelectMonth(idx);
                }}
                style={{
                  background: bg,
                  border: isSelected ? '2px solid #003366' : `1px solid ${borderColor}`,
                  borderRadius: '2px',
                  padding: '8px 4px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: textColor }}>{m.name}</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: textColor, margin: '2px 0', fontFamily: 'var(--font-mono)' }}>
                  {m.count}
                </div>
                <div style={{ fontSize: '10px', color: m.peak ? '#c2410c' : '#64748b', fontWeight: 600 }}>
                  ₹{(m.amount / 100000).toFixed(0)}L
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Month Detail Banner */}
        {selectedMonth !== null && (
          <div className="gov-alert gov-alert-info" style={{ marginBottom: 0 }}>
            <div style={{ flex: 1 }}>
              <strong style={{ color: '#002147' }}>{months[selectedMonth].fullName}:</strong>{' '}
              <span>
                <strong>{months[selectedMonth].count} instruments</strong> scheduled for statutory maturity (Total Principal Volume: <strong>₹{(months[selectedMonth].amount / 10000000).toFixed(2)} Crores</strong>).
              </span>
              {months[selectedMonth].peak && (
                <div style={{ marginTop: '4px', color: '#9a3412', fontWeight: 700 }}>
                  ⚡ Peak AICTE Institutional Approval Window: Workload increases by 300%. Automatic T-90 notices issued under APH Regulation.
                </div>
              )}
            </div>
            <span style={{ color: '#0369a1', fontSize: '11px', fontWeight: 600 }}>
              System Automated Alerts Active
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
