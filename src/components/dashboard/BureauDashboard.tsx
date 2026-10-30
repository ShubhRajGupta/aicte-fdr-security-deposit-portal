import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrustBadge } from '../common/TrustBadge';
import { StatusBadge } from '../common/StatusBadge';
import { HeatmapCalendar } from './HeatmapCalendar';
import { ExecutiveHeroBanner } from './ExecutiveHeroBanner';
import { ProcessLifecyclePoster } from './ProcessLifecyclePoster';
import { BankPartnersRibbon } from '../common/BankPartnersRibbon';
import {
  ShieldCheck,
  AlertOctagon,
  Clock,
  CheckCircle,
  FileText,
  IndianRupee,
  ArrowRight,
  Printer,
  FileSpreadsheet,
  Layers,
  Award
} from 'lucide-react';

export const BureauDashboard: React.FC = () => {
  const { instruments, setActiveTab, setSelectedInstrumentId, language } = useApp();

  const totalValue = instruments.reduce((sum, i) => sum + i.amount, 0);
  const activeCount = instruments.filter((i) => i.status === 'ACTIVE').length;
  const expiringCount = instruments.filter((i) => i.status === 'EXPIRING').length;
  const overdueCount = instruments.filter((i) => i.status === 'OVERDUE').length;
  const scrutinyCount = instruments.filter((i) => ['UNDER_SCRUTINY', 'QUERY_RAISED', 'SUBMITTED'].includes(i.status)).length;
  const releasedCount = instruments.filter((i) => ['NOC_ISSUED', 'RELEASED'].includes(i.status)).length;

  const l0Count = instruments.filter((i) => i.trustLevel === 'L0').length;
  const l1Count = instruments.filter((i) => i.trustLevel === 'L1').length;
  const l2Count = instruments.filter((i) => i.trustLevel === 'L2').length;
  const lxCount = instruments.filter((i) => i.trustLevel === 'L-X').length;

  return (
    <div className="gov-container">
      {/* 1. Official Regulation Bureau Banner */}
      <div className="gov-panel" style={{ borderLeft: '4px solid #003366', borderRadius: '0px' }}>
        <div className="gov-panel-header" style={{ background: '#f8fafc', padding: '8px 12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="gov-panel-title" style={{ fontSize: '14px', color: '#002147', fontWeight: 800 }}>
                {language === 'HI' ? 'विनियमन ब्यूरो — केंद्रीय सुरक्षा जमा निगरानी डेस्क' : 'Regulation Bureau — Central Security Deposit Monitoring Desk'}
              </span>
              <span style={{ background: '#003366', color: '#ffffff', fontSize: '10px', fontWeight: 700, padding: '1px 6px' }}>
                CENTRAL REGISTRY
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
              {language === 'HI'
                ? 'अनुमोदन प्रक्रिया पुस्तिका (APH 2024-27) के तहत सुरक्षा जमा, सावधि जमा (FDR), बैंक गारंटी और एनओसी की वास्तविक समय निगरानी।'
                : 'Centralized statutory registry of institutional FDRs, Bank Guarantees, trust verification levels, and maturity compliance under APH 2024-27 Clause 1.4.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('WORKLIST')}
              className="btn-gov btn-gov-primary btn-gov-sm"
              style={{ borderRadius: '0px' }}
              title="Open Scrutiny Worklist"
            >
              <span>{language === 'HI' ? 'संवीक्षा कार्यसूची देखें' : 'View Scrutiny Worklist'}</span>
              <ArrowRight size={11} />
            </button>
            <button
              onClick={() => window.print()}
              className="btn-gov btn-gov-secondary btn-gov-sm"
              style={{ borderRadius: '0px' }}
              title="Print Official Summary"
            >
              <Printer size={11} />
              <span>{language === 'HI' ? 'प्रिंट सारांश' : 'Print Summary'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Executive Hero Banner & Leadership Cards */}
      <ExecutiveHeroBanner />

      {/* 3. Primary Executive MIS Metric Strip (Dense Government Layout) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '14px' }}>
        {/* Total Value */}
        <div className="gov-panel" style={{ padding: '8px 10px', margin: 0, borderRadius: '0px', borderTop: '2px solid #003366' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#475569', fontSize: '10px', fontWeight: 700 }}>
            <span>TOTAL DEPOSITS</span>
            <IndianRupee size={12} style={{ color: '#003366' }} />
          </div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: '#002147', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            ₹{(totalValue / 10000000).toFixed(2)} Cr
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
            {instruments.length} Registered Instruments
          </div>
        </div>

        {/* Active Coverage */}
        <div className="gov-panel" style={{ padding: '8px 10px', margin: 0, borderRadius: '0px', borderTop: '2px solid #15803d' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#475569', fontSize: '10px', fontWeight: 700 }}>
            <span>ACTIVE COMPLIANT</span>
            <CheckCircle size={12} style={{ color: '#15803d' }} />
          </div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: '#15803d', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            {activeCount}
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
            Continuous Legal Cover
          </div>
        </div>

        {/* Expiring <90 Days */}
        <div className="gov-panel" style={{ padding: '8px 10px', margin: 0, borderRadius: '0px', borderTop: '2px solid #b45309', background: expiringCount > 0 ? '#fffbeb' : '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#92400e', fontSize: '10px', fontWeight: 700 }}>
            <span>EXPIRING (&lt;90D)</span>
            <Clock size={12} style={{ color: '#b45309' }} />
          </div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: '#b45309', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            {expiringCount}
          </div>
          <div style={{ fontSize: '10px', color: '#92400e', marginTop: '2px' }}>
            Statutory T-90 Notices
          </div>
        </div>

        {/* Overdue */}
        <div className="gov-panel" style={{ padding: '8px 10px', margin: 0, borderRadius: '0px', borderTop: '2px solid #b91c1c', background: overdueCount > 0 ? '#fef2f2' : '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#991b1b', fontSize: '10px', fontWeight: 700 }}>
            <span>OVERDUE / LAPSED</span>
            <AlertOctagon size={12} style={{ color: '#b91c1c' }} />
          </div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: '#b91c1c', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            {overdueCount}
          </div>
          <div style={{ fontSize: '10px', color: '#991b1b', marginTop: '2px' }}>
            Encashment Action Due
          </div>
        </div>

        {/* Scrutiny Queue */}
        <div className="gov-panel" style={{ padding: '8px 10px', margin: 0, borderRadius: '0px', borderTop: '2px solid #475569' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#475569', fontSize: '10px', fontWeight: 700 }}>
            <span>UNDER SCRUTINY</span>
            <FileText size={12} style={{ color: '#475569' }} />
          </div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: '#1e293b', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            {scrutinyCount}
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
            Awaiting Officer Scrutiny
          </div>
        </div>

        {/* NOC Issued */}
        <div className="gov-panel" style={{ padding: '8px 10px', margin: 0, borderRadius: '0px', borderTop: '2px solid #0369a1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#475569', fontSize: '10px', fontWeight: 700 }}>
            <span>NOC ISSUED</span>
            <Award size={12} style={{ color: '#0369a1' }} />
          </div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: '#0369a1', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            {releasedCount}
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
            Digital Lien Discharged
          </div>
        </div>
      </div>

      {/* 3. Statutory Trust Verification Matrix (Official Regulatory Format) */}
      <div className="gov-panel" style={{ borderRadius: '0px', marginBottom: '14px' }}>
        <div className="gov-panel-header" style={{ padding: '8px 12px' }}>
          <div className="gov-panel-title" style={{ fontSize: '13px' }}>
            <Layers size={13} style={{ color: '#003366' }} />
            <span>Statutory Trust &amp; Verification Hierarchy (APH 2024-27 Clause 1.4)</span>
          </div>
          <span style={{ fontSize: '11px', color: '#b91c1c', fontWeight: 700 }}>
            * Statutory Mandate: Release / NOC generation is strictly prohibited below Trust Level L2
          </span>
        </div>

        <div className="gov-table-wrapper" style={{ border: 'none' }}>
          <table className="gov-table" style={{ fontSize: '11px', margin: 0 }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ width: '80px', background: '#002147', color: '#ffffff' }}>TIER</th>
                <th style={{ background: '#002147', color: '#ffffff', width: '160px' }}>STATUS CLASSIFICATION</th>
                <th style={{ textAlign: 'center', width: '70px', background: '#002147', color: '#ffffff' }}>COUNT</th>
                <th style={{ background: '#002147', color: '#ffffff' }}>REGULATORY VERIFICATION CRITERIA</th>
                <th style={{ textAlign: 'center', width: '150px', background: '#002147', color: '#ffffff' }}>NOC ELIGIBILITY</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><TrustBadge level="L0" size="sm" /></td>
                <td style={{ fontWeight: 600 }}>Declared / Lodged</td>
                <td style={{ textAlign: 'center', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{l0Count}</td>
                <td>Self-declared by Technical Institution in online portal. Pending regional scrutiny and scan validation.</td>
                <td style={{ textAlign: 'center', color: '#b91c1c', fontWeight: 700 }}>STRICTLY BLOCKED</td>
              </tr>
              <tr>
                <td><TrustBadge level="L1" size="sm" /></td>
                <td style={{ fontWeight: 600 }}>Officer Scrutinized</td>
                <td style={{ textAlign: 'center', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#b45309' }}>{l1Count}</td>
                <td>Regional officer verified physical scan against typed parameters, confirmed AICTE lien clause notation.</td>
                <td style={{ textAlign: 'center', color: '#b91c1c', fontWeight: 700 }}>STRICTLY BLOCKED</td>
              </tr>
              <tr style={{ background: '#f0fdf4' }}>
                <td><TrustBadge level="L2" size="sm" /></td>
                <td style={{ fontWeight: 600, color: '#15803d' }}>Bank Confirmed</td>
                <td style={{ textAlign: 'center', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#15803d' }}>{l2Count}</td>
                <td>Issuing Scheduled Commercial Bank branch independently verified lien endorsement and balance via secure link.</td>
                <td style={{ textAlign: 'center', color: '#15803d', fontWeight: 800 }}>ELIGIBLE FOR NOC</td>
              </tr>
              <tr style={{ background: '#fef2f2' }}>
                <td><TrustBadge level="L-X" size="sm" /></td>
                <td style={{ fontWeight: 600, color: '#b91c1c' }}>Discrepancy / Open Query</td>
                <td style={{ textAlign: 'center', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#b91c1c' }}>{lxCount}</td>
                <td>Automated rule engine or officer flagged defect (Rule R1 shortfall, R4 duplicate, or missing joint holder).</td>
                <td style={{ textAlign: 'center', color: '#b91c1c', fontWeight: 700 }}>LOCKED / EMBARGO</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Official Lifecycle Architecture Poster */}
      <ProcessLifecyclePoster />

      {/* 5. Innovation I6: Seasonal Heatmap Calendar */}
      <HeatmapCalendar
        instruments={instruments}
        onSelectMonth={(m) => {
          // Can filter worklist by month
        }}
      />

      {/* 5. High-Risk Worklist Table */}
      <div className="gov-panel" style={{ marginTop: '16px' }}>
        <div className="gov-panel-header">
          <div className="gov-panel-title">
            <AlertOctagon size={14} style={{ color: '#b91c1c' }} />
            <span>High-Priority Instruments Requiring Scrutiny / Action</span>
          </div>
          <button
            onClick={() => setActiveTab('WORKLIST')}
            className="btn-gov btn-gov-secondary btn-gov-sm"
          >
            <span>View Complete Worklist ({instruments.length})</span>
            <ArrowRight size={11} />
          </button>
        </div>

        <div className="gov-table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>RISK</th>
                <th>FDR NUMBER</th>
                <th>INSTITUTION DETAILS</th>
                <th>ISSUING BANK &amp; BRANCH</th>
                <th style={{ textAlign: 'right' }}>DEPOSIT AMOUNT</th>
                <th>MATURITY DATE</th>
                <th>TRUST LEVEL</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'center', width: '100px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {instruments
                .sort((a, b) => b.riskScore - a.riskScore)
                .slice(0, 5)
                .map((inst) => (
                  <tr key={inst.id}>
                    <td>
                      <span
                        style={{
                          background: inst.riskScore >= 100 ? '#fef2f2' : '#fffbeb',
                          color: inst.riskScore >= 100 ? '#b91c1c' : '#b45309',
                          border: `1px solid ${inst.riskScore >= 100 ? '#fca5a5' : '#fde68a'}`,
                          fontWeight: 700,
                          fontSize: '11px',
                          padding: '1px 5px',
                          borderRadius: '2px',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {inst.riskScore}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#002147' }}>
                      {inst.instrumentNumber}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{inst.institutionName}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>AICTE ID: {inst.institutionAicteId} · Region: {inst.region}</div>
                    </td>
                    <td>
                      <div>{inst.bankName}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>IFSC: {inst.ifscCode} · {inst.branchName}</div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#15803d', fontFamily: 'var(--font-mono)' }}>
                      {inst.formattedAmount}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                      {inst.maturityDate}
                    </td>
                    <td>
                      <TrustBadge level={inst.trustLevel} size="sm" />
                    </td>
                    <td>
                      <StatusBadge status={inst.status} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          setSelectedInstrumentId(inst.id);
                          setActiveTab('CASE_WORKSPACE');
                        }}
                        className="btn-gov btn-gov-primary btn-gov-sm"
                      >
                        Open Case
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="gov-table-footer">
            <span>Showing top 5 high-priority records sorted by statutory risk score under APH 2024-27.</span>
            <button
              onClick={() => setActiveTab('WORKLIST')}
              style={{ background: 'transparent', border: 'none', color: '#003366', fontWeight: 600, cursor: 'pointer', fontSize: '11px' }}
            >
              Go to Scrutiny Worklist →
            </button>
          </div>
        </div>
      </div>

      {/* 6. Scheduled Commercial Bank Network */}
      <BankPartnersRibbon />
    </div>
  );
};
