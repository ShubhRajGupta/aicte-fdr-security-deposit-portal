import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  AlertTriangle,
  Clock,
  FileText,
  Printer
} from 'lucide-react';

export const AutomatedReportsPortal: React.FC = () => {
  const { instruments, addToast } = useApp();

  const [activeReport, setActiveReport] = useState<'EXPIRING' | 'OVERDUE' | 'TRUST_BACKLOG' | 'FULL_REGISTRY'>('EXPIRING');

  const expiringList = instruments.filter((i) => i.status === 'EXPIRING');
  const overdueList = instruments.filter((i) => i.status === 'OVERDUE' || i.discrepancies.length > 0);
  const backlogList = instruments.filter((i) => i.trustLevel === 'L0' || i.trustLevel === 'L-X');

  const handleExportCsv = (reportName: string) => {
    let headers = ['Instrument_Number', 'Institution_Name', 'AICTE_PID', 'Bank_Name', 'Amount_INR', 'Maturity_Date', 'Trust_Level', 'Status'];
    let rows: string[][] = [];

    const dataset =
      activeReport === 'EXPIRING'
        ? expiringList
        : activeReport === 'OVERDUE'
        ? overdueList
        : activeReport === 'TRUST_BACKLOG'
        ? backlogList
        : instruments;

    rows = dataset.map((i) => [
      i.instrumentNumber,
      `"${i.institutionName}"`,
      i.institutionAicteId,
      `"${i.bankName}"`,
      i.amount.toString(),
      i.maturityDate,
      i.trustLevel,
      i.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Statutory Report Exported', `${reportName} downloaded successfully.`);
  };

  return (
    <div style={{ padding: '1.25rem', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Official Government Banner */}
      <div
        className="gov-panel"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.25rem',
          borderLeft: '5px solid var(--gov-navy-medium)',
          background: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <FileSpreadsheet size={22} style={{ color: 'var(--gov-navy-medium)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gov-navy-dark)', margin: 0 }}>
                STATUTORY COMPLIANCE REPORTS & REGISTRY EXPORT (PS FEATURE 8)
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.35rem', lineHeight: 1.4 }}>
              Periodic statutory digests compiled for the Approval Bureau, Regional Offices, Central Vigilance Officer (CVO), and Comptroller and Auditor General (CAG) inspection panels.
            </p>
          </div>

          <button
            onClick={() => handleExportCsv('AICTE_Full_Central_Security_Deposit_Registry')}
            className="btn-gov btn-gov-saffron"
            style={{ fontWeight: 800, padding: '0.6rem 1.25rem' }}
          >
            <Download size={15} />
            <span>Export Complete National Registry (CSV)</span>
          </button>
        </div>
      </div>

      {/* Official 4 Statutory Report Category Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div
          onClick={() => setActiveReport('EXPIRING')}
          className="gov-panel"
          style={{
            padding: '1rem',
            cursor: 'pointer',
            border: activeReport === 'EXPIRING' ? '2px solid var(--gov-saffron)' : '1px solid #cbd5e1',
            borderTop: '4px solid var(--gov-saffron)',
            background: activeReport === 'EXPIRING' ? '#fffaf5' : '#ffffff'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9a3412', textTransform: 'uppercase' }}>
              Maturity Window (&lt;90 Days)
            </span>
            <Clock size={18} style={{ color: 'var(--gov-saffron)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gov-navy-dark)', margin: '4px 0' }}>
            {expiringList.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Expiring instruments with automated reminder dispatches active
          </div>
        </div>

        <div
          onClick={() => setActiveReport('OVERDUE')}
          className="gov-panel"
          style={{
            padding: '1rem',
            cursor: 'pointer',
            border: activeReport === 'OVERDUE' ? '2px solid #dc2626' : '1px solid #cbd5e1',
            borderTop: '4px solid #dc2626',
            background: activeReport === 'OVERDUE' ? '#fff5f5' : '#ffffff'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase' }}>
              Overdue & Discrepancies
            </span>
            <AlertTriangle size={18} style={{ color: '#dc2626' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626', margin: '4px 0' }}>
            {overdueList.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Cases pending regulatory show-cause or encashment notice
          </div>
        </div>

        <div
          onClick={() => setActiveReport('TRUST_BACKLOG')}
          className="gov-panel"
          style={{
            padding: '1rem',
            cursor: 'pointer',
            border: activeReport === 'TRUST_BACKLOG' ? '2px solid var(--gov-navy-medium)' : '1px solid #cbd5e1',
            borderTop: '4px solid var(--gov-navy-medium)',
            background: activeReport === 'TRUST_BACKLOG' ? '#f0f4f8' : '#ffffff'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gov-navy-medium)', textTransform: 'uppercase' }}>
              L0 / L1 Scrutiny Backlog
            </span>
            <FileSpreadsheet size={18} style={{ color: 'var(--gov-navy-medium)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gov-navy-dark)', margin: '4px 0' }}>
            {backlogList.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Instruments awaiting regional officer OCR or bank verification
          </div>
        </div>

        <div
          onClick={() => setActiveReport('FULL_REGISTRY')}
          className="gov-panel"
          style={{
            padding: '1rem',
            cursor: 'pointer',
            border: activeReport === 'FULL_REGISTRY' ? '2px solid var(--gov-green-dark)' : '1px solid #cbd5e1',
            borderTop: '4px solid var(--gov-green-dark)',
            background: activeReport === 'FULL_REGISTRY' ? '#f0fdf4' : '#ffffff'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gov-green-dark)', textTransform: 'uppercase' }}>
              National Master Registry
            </span>
            <FileText size={18} style={{ color: 'var(--gov-green-dark)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gov-green-dark)', margin: '4px 0' }}>
            {instruments.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Consolidated live ledger of all security deposits nationwide
          </div>
        </div>
      </div>

      {/* Selected Report Data View */}
      <div className="gov-panel">
        <div className="gov-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>
              REPORT PREVIEW: {activeReport.replace(/_/g, ' ')}
            </span>
            <div style={{ fontSize: '0.72rem', opacity: 0.9, marginTop: '2px' }}>
              Extract generated from official immutable registry ledger
            </div>
          </div>

          <button
            onClick={() => handleExportCsv(activeReport)}
            className="btn-gov btn-gov-primary btn-gov-sm"
          >
            <Download size={13} />
            <span>Export View to CSV</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>S.No</th>
                <th>Instrument Number</th>
                <th>Institution Name & PID</th>
                <th>Issuing Bank & Branch</th>
                <th style={{ textAlign: 'right' }}>Principal Amount</th>
                <th>Maturity Date</th>
                <th>Trust Tier</th>
                <th>Lifecycle Status</th>
              </tr>
            </thead>
            <tbody>
              {(activeReport === 'EXPIRING'
                ? expiringList
                : activeReport === 'OVERDUE'
                ? overdueList
                : activeReport === 'TRUST_BACKLOG'
                ? backlogList
                : instruments
              ).map((inst, idx) => (
                <tr key={inst.id}>
                  <td style={{ textAlign: 'center', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                  <td className="font-mono" style={{ fontWeight: 700, color: 'var(--gov-navy-dark)' }}>
                    {inst.instrumentNumber}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--gov-navy-dark)' }}>{inst.institutionName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>PID: {inst.institutionAicteId}</div>
                  </td>
                  <td>
                    {inst.bankName}
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{inst.branchName}</div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--gov-navy-dark)' }}>
                    {inst.formattedAmount}
                  </td>
                  <td className="font-mono" style={{ fontSize: '0.78rem' }}>
                    {inst.maturityDate}
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: inst.trustLevel === 'L2' ? 'var(--gov-green-dark)' : inst.trustLevel === 'L1' ? 'var(--gov-navy-medium)' : '#b45309' }}>
                      {inst.trustLevel}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: inst.status === 'OVERDUE' ? '#dc2626' : inst.status === 'EXPIRING' ? '#b45309' : 'var(--gov-green-dark)' }}>
                      {inst.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
