import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrustBadge } from '../common/TrustBadge';
import { StatusBadge } from '../common/StatusBadge';
import { RenewalModal } from './RenewalModal';
import { ReleaseRequestModal } from './ReleaseRequestModal';
import { Instrument } from '../../types';
import {
  Building2,
  FilePlus,
  RefreshCw,
  Award,
  HelpCircle,
  MessageSquare,
  AlertTriangle,
  Info,
  CheckCircle2,
  Search,
  Download
} from 'lucide-react';

export const InstitutionPortal: React.FC = () => {
  const {
    instruments,
    activePersona,
    setSelectedInstrumentId,
    setActiveTab,
    replyToQuery
  } = useApp();

  const [selectedForRenewal, setSelectedForRenewal] = useState<Instrument | null>(null);
  const [selectedForRelease, setSelectedForRelease] = useState<Instrument | null>(null);
  const [filterType, setFilterType] = useState('ALL');

  // Filter instruments for this institution or show all if officer
  const myInstruments = instruments.filter(
    (i) => !activePersona.institutionId || i.institutionId === activePersona.institutionId
  );

  const filteredInstruments = filterType === 'ALL' 
    ? myInstruments 
    : myInstruments.filter(i => i.instrumentType === filterType);

  // Find all open queries across my instruments
  const openQueries = myInstruments.flatMap((inst) =>
    inst.queries
      .filter((q) => q.status === 'OPEN')
      .map((q) => ({ query: q, instrument: inst }))
  );

  const [activeReplyQuery, setActiveReplyQuery] = useState<{ queryId: string; instrumentId: string; field: string } | null>(null);
  const [replyInput, setReplyInput] = useState('');

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReplyQuery || !replyInput.trim()) return;
    replyToQuery(activeReplyQuery.instrumentId, activeReplyQuery.queryId, replyInput);
    setActiveReplyQuery(null);
    setReplyInput('');
  };

  const totalDeposited = myInstruments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div style={{ padding: '1.25rem', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Official Government Institution Profile Header */}
      <div
        className="gov-panel"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.25rem',
          borderLeft: '5px solid var(--gov-navy-medium)',
          background: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: '#f0f4f8',
                border: '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gov-navy-medium)'
              }}
            >
              <Building2 size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                AICTE Approved Technical Institution Profile
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gov-navy-dark)', margin: '2px 0 6px 0' }}>
                {activePersona.institutionName || 'Apex Institute of Technology & Management'}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.82rem', color: '#334155' }}>
                <span><strong>Permanent ID (PID):</strong> <span className="font-mono" style={{ color: 'var(--gov-navy-medium)', fontWeight: 700 }}>1-3829104</span></span>
                <span><strong>Region:</strong> Northern Regional Office (NRO, Kanpur)</span>
                <span><strong>Sanctioned Intake:</strong> 420 Seats</span>
                <span><strong>Total Security Lodged:</strong> <strong style={{ color: 'var(--gov-green-dark)' }}>₹{(totalDeposited / 100000).toFixed(2)} Lakhs</strong></span>
                <span><strong>Required Deposit (APH):</strong> ₹35.00 Lakhs</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('NEW_SUBMISSION')}
            className="btn-gov btn-gov-saffron"
            style={{ fontWeight: 700, padding: '0.65rem 1.25rem' }}
          >
            <FilePlus size={16} />
            <span>Submit New Security Deposit (FDR/BG)</span>
          </button>
        </div>
      </div>

      {/* Action Required: Open Scrutiny Queries Inbox */}
      {openQueries.length > 0 && (
        <div
          className="gov-alert gov-alert-warning"
          style={{
            marginBottom: '1.25rem',
            padding: '1rem 1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <AlertTriangle size={18} style={{ color: 'var(--gov-saffron)' }} />
            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#9a3412' }}>
              Action Required: {openQueries.length} Open Officer Scrutiny Queries Pending Rectification (Scenario 2)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {openQueries.map(({ query, instrument: inst }) => (
              <div
                key={query.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #fed7aa',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span className="font-mono" style={{ fontWeight: 700, color: 'var(--gov-navy-dark)', fontSize: '0.85rem' }}>
                      {inst.instrumentNumber}
                    </span>
                    <span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '2px 6px', fontWeight: 600 }}>
                      Raised by: {query.raisedBy}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.85rem', marginTop: '4px' }}>
                    <strong>Query:</strong> "{query.queryText}"
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#c2410c', marginTop: '2px' }}>
                    <strong>Prescribed Remedy:</strong> {query.remedyAction}
                  </div>
                </div>

                <button
                  onClick={() =>
                    setActiveReplyQuery({
                      queryId: query.id,
                      instrumentId: inst.id,
                      field: query.field
                    })
                  }
                  className="btn-gov btn-gov-saffron btn-gov-sm"
                  style={{ fontWeight: 700 }}
                >
                  <MessageSquare size={13} />
                  <span>Reply & Rectify Defect</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official AICTE Deposit Portfolio Section */}
      <div className="gov-panel">
        <div className="gov-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.3px' }}>
              SECURITY DEPOSIT INSTRUMENTS RECORD (FDR / BANK GUARANTEE)
            </span>
            <div style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.9, marginTop: '2px' }}>
              Official registry under AICTE Approval Process Handbook (APH 2024-27 Clause 1.4 & 1.5)
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>Filter:</span>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="gov-select"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: '#ffffff', color: '#0f172a', width: 'auto' }}
            >
              <option value="ALL">All Instruments ({myInstruments.length})</option>
              <option value="FDR">FDR Only</option>
              <option value="BANK_GUARANTEE">Bank Guarantee Only</option>
            </select>
          </div>
        </div>

        <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderBottom: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#475569' }}>
          <div>
            Showing <strong>{filteredInstruments.length}</strong> of <strong>{myInstruments.length}</strong> recorded instruments for this institution.
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span><strong style={{ color: 'var(--gov-green-dark)' }}>● L2 Confirmed:</strong> {myInstruments.filter(i => i.trustLevel === 'L2').length}</span>
            <span><strong style={{ color: 'var(--gov-navy-medium)' }}>● L1 In Scrutiny:</strong> {myInstruments.filter(i => i.trustLevel === 'L1').length}</span>
            <span><strong style={{ color: '#b45309' }}>● L0 Pending:</strong> {myInstruments.filter(i => i.trustLevel === 'L0').length}</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>S.No</th>
                <th>Instrument No. & Version</th>
                <th>Type</th>
                <th>Issuing Bank & Branch</th>
                <th style={{ textAlign: 'right' }}>Deposit Amount</th>
                <th>Date of Lodgement</th>
                <th>Maturity Date</th>
                <th>Verification Level</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Statutory Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstruments.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No security deposit instruments found for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredInstruments.map((inst, idx) => (
                  <tr key={inst.id}>
                    <td style={{ textAlign: 'center', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                    <td>
                      <div className="font-mono" style={{ fontWeight: 700, color: 'var(--gov-navy-dark)' }}>
                        {inst.instrumentNumber}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        Version: {inst.version || 1}.0 {inst.parentInstrumentId && `(Chained from #${inst.parentInstrumentId})`}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#334155' }}>{inst.instrumentType}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--gov-navy-dark)' }}>{inst.bankName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{inst.branchName} (IFSC: {inst.ifscCode})</div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--gov-navy-dark)' }}>
                      {inst.formattedAmount}
                    </td>
                    <td style={{ fontSize: '0.78rem' }}>
                      {inst.issueDate || '15/01/2026'}
                    </td>
                    <td style={{ fontSize: '0.78rem' }} className="font-mono">
                      {inst.maturityDate}
                    </td>
                    <td>
                      <TrustBadge level={inst.trustLevel} size="sm" />
                    </td>
                    <td>
                      <StatusBadge status={inst.status} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => {
                            setSelectedInstrumentId(inst.id);
                            setActiveTab('CASE_WORKSPACE');
                          }}
                          className="btn-gov btn-gov-secondary btn-gov-sm"
                          title="View complete details and audit trail"
                        >
                          View File
                        </button>

                        {/* Renewal action button (Scenario 4) */}
                        {['EXPIRING', 'OVERDUE', 'MATURED', 'ACTIVE'].includes(inst.status) && (
                          <button
                            onClick={() => setSelectedForRenewal(inst)}
                            className="btn-gov btn-gov-primary btn-gov-sm"
                            title="Renew Instrument (Chains v2 without gap)"
                          >
                            <RefreshCw size={12} />
                            <span>Renew</span>
                          </button>
                        )}

                        {/* Release Request action button (Scenario 5) */}
                        {['ACTIVE', 'MATURED', 'EXPIRING'].includes(inst.status) && (
                          <button
                            onClick={() => setSelectedForRelease(inst)}
                            className="btn-gov btn-gov-saffron btn-gov-sm"
                            title="Apply for Release & NOC"
                          >
                            <Award size={12} />
                            <span>Release</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderTop: '1px solid #cbd5e1', fontSize: '0.75rem', color: '#64748b' }}>
          * Security deposits are held under tripartite joint lien in favor of Member Secretary, AICTE New Delhi as per Council directives.
        </div>
      </div>

      {/* Renewal Modal */}
      {selectedForRenewal && (
        <RenewalModal
          instrument={selectedForRenewal}
          isOpen={!!selectedForRenewal}
          onClose={() => setSelectedForRenewal(null)}
        />
      )}

      {/* Release Request Modal */}
      {selectedForRelease && (
        <ReleaseRequestModal
          instrument={selectedForRelease}
          isOpen={!!selectedForRelease}
          onClose={() => setSelectedForRelease(null)}
        />
      )}

      {/* Reply Modal */}
      {activeReplyQuery && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="gov-panel" style={{ width: '100%', maxWidth: '540px', background: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <div className="gov-panel-header">
              <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                RECTIFICATION OF SCRUTINY DEFECT / QUERY
              </span>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div className="gov-alert gov-alert-warning" style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
                Please submit your official compliance clarification. All responses are cryptographically appended to the audit trail under GIGW guidelines.
              </div>
              <form onSubmit={handleReplySubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="gov-label">
                    Remedy Clarification / Supplementary Instrument Details <span className="req">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    placeholder="Enter official resolution details (e.g. Supplementary FDR #9941 for ₹10.00 Lakhs issued on 15/02/2026 by SBI to fulfill the mandatory ₹35.00 Lakhs intake quota)..."
                    className="gov-textarea"
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button type="button" onClick={() => setActiveReplyQuery(null)} className="btn-gov btn-gov-secondary btn-gov-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn-gov btn-gov-primary btn-gov-sm">
                    Submit Rectification Response
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
