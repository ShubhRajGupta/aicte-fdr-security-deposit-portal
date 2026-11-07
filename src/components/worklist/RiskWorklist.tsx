import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrustBadge } from '../common/TrustBadge';
import { StatusBadge } from '../common/StatusBadge';
import { BankLogo } from '../common/BankLogo';
import { Instrument, TrustLevel, InstrumentStatus } from '../../types';
import {
  ListOrdered,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink,
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';

export const RiskWorklist: React.FC = () => {
  const { instruments, setSelectedInstrumentId, setActiveTab, runScenario, language } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrustFilter, setSelectedTrustFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [expandedScoreId, setExpandedScoreId] = useState<string | null>(null);

  // Filter and sort
  const filtered = instruments
    .filter((inst) => {
      const matchesSearch =
        inst.instrumentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.institutionAicteId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTrust = selectedTrustFilter === 'ALL' || inst.trustLevel === selectedTrustFilter;
      const matchesStatus = selectedStatusFilter === 'ALL' || inst.status === selectedStatusFilter;

      return matchesSearch && matchesTrust && matchesStatus;
    })
    .sort((a, b) => b.riskScore - a.riskScore);

  const toggleScoreBreakdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedScoreId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="gov-container">
      {/* 1. Header Banner */}
      <div className="gov-panel" style={{ borderLeft: '4px solid #003366' }}>
        <div className="gov-panel-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="gov-panel-title" style={{ fontSize: '14px', color: '#002147', fontWeight: 800 }}>
                {language === 'HI' ? 'सांविधिक जोखिम संवीक्षा कार्यसूची' : 'Statutory Risk-Ranked Scrutiny Worklist'}
              </span>
              <span style={{ background: '#003366', color: '#ffffff', fontSize: '10px', fontWeight: 700, padding: '1px 6px' }}>
                PRIORITY QUEUE
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
              {language === 'HI'
                ? 'अधिकारी सबसे उच्च जोखिम वाले मामलों को पहले संसाधित करते हैं। स्कोर = तात्कालिकता + राशि बैंड + विसंगति गंभीरता + बैंक प्रतीक्षा + केस आयु।'
                : 'Scrutiny queues prioritized deterministically under APH 2024-27. Criteria: Urgency + Principal Volume + Discrepancy Severity + Bank Attestation Age.'}
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="btn-gov btn-gov-secondary btn-gov-sm"
            style={{ borderRadius: '0px' }}
            title="Print Scrutiny Register"
          >
            <span>Print Worklist</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="gov-panel" style={{ padding: '10px 14px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '260px' }}>
            <Search size={14} style={{ color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search by FDR No, Institution Name, Bank, or AICTE ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="gov-input"
              style={{ width: '100%' }}
            />
          </div>

          {/* Trust Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>Trust Level:</span>
            <select
              value={selectedTrustFilter}
              onChange={(e) => setSelectedTrustFilter(e.target.value)}
              className="gov-select"
            >
              <option value="ALL">All Trust Levels</option>
              <option value="L0">L0 Submitted (Unverified)</option>
              <option value="L1">L1 Document-Checked</option>
              <option value="L2">L2 Bank-Confirmed</option>
              <option value="L-X">L-X Disputed / Open Query</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="gov-select"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRING">Expiring (&lt;90d)</option>
              <option value="OVERDUE">Overdue</option>
              <option value="UNDER_SCRUTINY">Under Scrutiny</option>
              <option value="QUERY_RAISED">Query Raised</option>
              <option value="RELEASE_REQUESTED">Release Requested</option>
              <option value="NOC_ISSUED">NOC Issued</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>

          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
            {filtered.length} of {instruments.length} cases
          </div>
        </div>
      </div>

      {/* 3. Official Government Worklist Table */}
      <div className="gov-table-wrapper">
        <table className="gov-table">
          <thead>
            <tr>
              <th style={{ width: '70px' }}>RISK SCORE</th>
              <th>FDR CERTIFICATE NO</th>
              <th>INSTITUTION DETAILS</th>
              <th>BANK &amp; BRANCH (IFSC)</th>
              <th style={{ textAlign: 'right' }}>DEPOSIT AMOUNT</th>
              <th>MATURITY DATE</th>
              <th>TRUST</th>
              <th>STATUS</th>
              <th style={{ textAlign: 'center', width: '110px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                  No matching deposit records found for the applied search criteria.
                </td>
              </tr>
            ) : (
              filtered.map((inst) => {
                const isExpanded = expandedScoreId === inst.id;
                return (
                  <React.Fragment key={inst.id}>
                    <tr>
                      {/* Risk Score Pill */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span
                            style={{
                              background:
                                inst.riskScore >= 100 ? '#fef2f2' : inst.riskScore >= 60 ? '#fffbeb' : '#f0f9ff',
                              color:
                                inst.riskScore >= 100 ? '#b91c1c' : inst.riskScore >= 60 ? '#b45309' : '#0369a1',
                              border: `1px solid ${
                                inst.riskScore >= 100 ? '#fca5a5' : inst.riskScore >= 60 ? '#fde68a' : '#bae6fd'
                              }`,
                              fontWeight: 800,
                              fontSize: '11px',
                              padding: '1px 6px',
                              borderRadius: '2px',
                              fontFamily: 'var(--font-mono)'
                            }}
                          >
                            {inst.riskScore}
                          </span>
                          <button
                            onClick={(e) => toggleScoreBreakdown(inst.id, e)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '1px' }}
                            title="View Score Formula Breakdown"
                          >
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        </div>
                      </td>

                      {/* FDR Number */}
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#002147' }}>
                        <div>{inst.instrumentNumber}</div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>Ver {inst.version}</div>
                      </td>

                      {/* Institution Details */}
                      <td>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{inst.institutionName}</div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>
                          AICTE ID: {inst.institutionAicteId} · Region: {inst.region}
                        </div>
                      </td>

                      {/* Bank Details */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <BankLogo bankName={inst.bankName} size="sm" />
                          <div>
                            <div style={{ fontWeight: 600, color: '#002147' }}>{inst.bankName}</div>
                            <div style={{ fontSize: '10px', color: '#64748b' }}>
                              {inst.ifscCode} · {inst.branchName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Deposit Amount */}
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#15803d', fontFamily: 'var(--font-mono)' }}>
                        {inst.formattedAmount}
                      </td>

                      {/* Maturity Date */}
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                        {inst.maturityDate}
                      </td>

                      {/* Trust Badge */}
                      <td>
                        <TrustBadge level={inst.trustLevel} size="sm" />
                      </td>

                      {/* Status Badge */}
                      <td>
                        <StatusBadge status={inst.status} />
                      </td>

                      {/* Action Button */}
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => {
                            setSelectedInstrumentId(inst.id);
                            setActiveTab('CASE_WORKSPACE');
                          }}
                          className="btn-gov btn-gov-primary btn-gov-sm"
                        >
                          <span>Open Case</span>
                          <ExternalLink size={10} />
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Score Breakdown Details */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={9} style={{ background: '#f8fafc', padding: '10px 16px', borderBottom: '1px solid #cbd5e1' }}>
                          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '2px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <strong style={{ color: '#002147', fontSize: '12px' }}>
                                Statutory Risk Index Component Breakdown for FDR #{inst.instrumentNumber}
                              </strong>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>
                                Owned by AICTE Rules Engine (APH 2024-27 Clause 1.4)
                              </span>
                            </div>

                            {/* Stacked Score Bar */}
                            <div style={{ height: '6px', width: '100%', borderRadius: '2px', overflow: 'hidden', display: 'flex', marginBottom: '8px', background: '#e2e8f0' }}>
                              <div style={{ width: `${(inst.riskBreakdown.urgency / Math.max(1, inst.riskScore)) * 100}%`, background: '#b45309' }} title={`Urgency: ${inst.riskBreakdown.urgency} pts`} />
                              <div style={{ width: `${(inst.riskBreakdown.amountBand / Math.max(1, inst.riskScore)) * 100}%`, background: '#0284c7' }} title={`Amount Band: ${inst.riskBreakdown.amountBand} pts`} />
                              <div style={{ width: `${(inst.riskBreakdown.discrepancySeverity / Math.max(1, inst.riskScore)) * 100}%`, background: '#b91c1c' }} title={`Discrepancies: ${inst.riskBreakdown.discrepancySeverity} pts`} />
                              <div style={{ width: `${(inst.riskBreakdown.bankWaitTime / Math.max(1, inst.riskScore)) * 100}%`, background: '#475569' }} title={`Bank Wait: ${inst.riskBreakdown.bankWaitTime} pts`} />
                              <div style={{ width: `${(inst.riskBreakdown.caseAge / Math.max(1, inst.riskScore)) * 100}%`, background: '#7c3aed' }} title={`Case Age: ${inst.riskBreakdown.caseAge} pts`} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '6px', borderRadius: '2px' }}>
                                <div style={{ fontSize: '10px', color: '#92400e', fontWeight: 600 }}>1. MATURITY URGENCY</div>
                                <div style={{ fontSize: '14px', fontWeight: 800, color: '#b45309' }}>
                                  +{inst.riskBreakdown.urgency} pts
                                </div>
                                <div style={{ fontSize: '9px', color: '#78350f' }}>Proximity to expiry date</div>
                              </div>

                              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '6px', borderRadius: '2px' }}>
                                <div style={{ fontSize: '10px', color: '#0369a1', fontWeight: 600 }}>2. AMOUNT BAND</div>
                                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0284c7' }}>
                                  +{inst.riskBreakdown.amountBand} pts
                                </div>
                                <div style={{ fontSize: '9px', color: '#0c4a6e' }}>Exposure band weight</div>
                              </div>

                              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '6px', borderRadius: '2px' }}>
                                <div style={{ fontSize: '10px', color: '#991b1b', fontWeight: 600 }}>3. DISCREPANCY SEVERITY</div>
                                <div style={{ fontSize: '14px', fontWeight: 800, color: '#b91c1c' }}>
                                  +{inst.riskBreakdown.discrepancySeverity} pts
                                </div>
                                <div style={{ fontSize: '9px', color: '#7f1d1d' }}>R1-R10 active violation points</div>
                              </div>

                              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '6px', borderRadius: '2px' }}>
                                <div style={{ fontSize: '10px', color: '#475569', fontWeight: 600 }}>4. BANK WAIT TIME</div>
                                <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155' }}>
                                  +{inst.riskBreakdown.bankWaitTime} pts
                                </div>
                                <div style={{ fontSize: '9px', color: '#64748b' }}>Pending branch confirmation days</div>
                              </div>

                              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '6px', borderRadius: '2px' }}>
                                <div style={{ fontSize: '10px', color: '#475569', fontWeight: 600 }}>5. CASE AGE IN QUEUE</div>
                                <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155' }}>
                                  +{inst.riskBreakdown.caseAge} pts
                                </div>
                                <div style={{ fontSize: '9px', color: '#64748b' }}>SLA queue aging</div>
                              </div>

                              <div style={{ background: '#e0f2fe', border: '1px solid #38bdf8', padding: '6px', borderRadius: '2px' }}>
                                <div style={{ fontSize: '10px', color: '#0369a1', fontWeight: 800 }}>TOTAL RISK SCORE</div>
                                <div style={{ fontSize: '16px', fontWeight: 900, color: '#002147' }}>
                                  {inst.riskScore} PTS
                                </div>
                                <div style={{ fontSize: '9px', color: '#0369a1' }}>Deterministic calculation</div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
        <div className="gov-table-footer">
          <span>Showing {filtered.length} of {instruments.length} total institutional deposit records.</span>
          <span>Ranked automatically under GIGW 3.0 explainable queue rules.</span>
        </div>
      </div>
    </div>
  );
};
