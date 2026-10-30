import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Instrument } from '../../types';
import {
  Sliders,
  Play,
  RotateCcw,
  FileDiff,
  Download,
  AlertTriangle,
  CheckCircle2,
  Settings
} from 'lucide-react';

interface RuleDiffResult {
  instrument: Instrument;
  previouslyCompliant: boolean;
  currentlyCompliant: boolean;
  previousRequired: number;
  newRequired: number;
  shortfall: number;
}

export const RuleSimulationSandbox: React.FC = () => {
  const { instruments, addToast } = useApp();

  const [activeEdition] = useState('APH 2024-27 (Active)');
  const [candidateEdition, setCandidateEdition] = useState('APH 2027-30 (Draft Policy)');

  // Policy thresholds
  const [enggUgAmount, setEnggUgAmount] = useState<number>(4500000); // Proposed ₹45L (up from ₹35L)
  const [pharmUgAmount, setPharmUgAmount] = useState<number>(3000000); // Proposed ₹30L (up from ₹25L)
  const [tenorRequirement, setTenorRequirement] = useState<number>(120); // Proposed 10 years (up from 8)
  const [nbaDiscount, setNbaDiscount] = useState<boolean>(true); // ₹5L discount if NBA accredited

  const [simulationResults, setSimulationResults] = useState<RuleDiffResult[] | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const results: RuleDiffResult[] = instruments.map((inst) => {
        let proposedRequired = inst.aphRequiredAmount;

        if (inst.institutionType === 'GOVERNMENT_EXEMPT') {
          proposedRequired = 0;
        } else if (inst.aphEdition.includes('2024') || inst.amount >= 3500000) {
          proposedRequired = enggUgAmount;
        } else if (inst.amount >= 2500000) {
          proposedRequired = pharmUgAmount;
        }

        if (nbaDiscount && proposedRequired > 500000) {
          proposedRequired -= 500000;
        }

        const previouslyCompliant = inst.discrepancies.length === 0 && inst.amount >= inst.aphRequiredAmount;
        const currentlyCompliant = inst.institutionType === 'GOVERNMENT_EXEMPT' || inst.amount >= proposedRequired;
        const shortfall = Math.max(0, proposedRequired - inst.amount);

        return {
          instrument: inst,
          previouslyCompliant,
          currentlyCompliant,
          previousRequired: inst.aphRequiredAmount,
          newRequired: proposedRequired,
          shortfall
        };
      });

      setSimulationResults(results);
      setIsSimulating(false);
      addToast(
        'info',
        'Simulation Diff Generated',
        `Simulated ${candidateEdition} on ${instruments.length} active records. Diff report compiled.`
      );
    }, 450);
  };

  const totalNewShortfall = (simulationResults || []).reduce((sum, r) => sum + r.shortfall, 0);
  const newlyDeficientCount = (simulationResults || []).filter((r) => r.previouslyCompliant && !r.currentlyCompliant).length;

  return (
    <div style={{ padding: '1.25rem', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Official Government Banner */}
      <div
        className="gov-panel"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.25rem',
          borderLeft: '5px solid var(--gov-saffron)',
          background: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Settings size={22} style={{ color: 'var(--gov-navy-medium)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gov-navy-dark)', margin: 0 }}>
                APPROVAL PROCESS HANDBOOK (APH) RULE SIMULATION SANDBOX (INNOVATION I3)
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.35rem', lineHeight: 1.4 }}>
              <strong>"Rules as Versioned Data":</strong> Perform pre-gazette impact simulation against all active technical institutions in India prior to Council approval. Prevents unintended non-compliance and assesses sector financial exposure.
            </p>
          </div>

          <button 
            onClick={runSimulation} 
            disabled={isSimulating} 
            className="btn-gov btn-gov-saffron" 
            style={{ fontWeight: 800, padding: '0.6rem 1.25rem' }}
          >
            <Play size={15} />
            <span>{isSimulating ? 'Evaluating Dry-Run On Registry...' : 'Execute Dry-Run On Central Registry'}</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left: Candidate Policy Parameter Controls */}
        <div className="gov-panel">
          <div className="gov-panel-header">
            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>
              PROPOSED REGULATORY AMENDMENT PARAMETERS
            </span>
          </div>

          <div style={{ padding: '1.25rem' }}>
            <div style={{ marginBottom: '0.85rem' }}>
              <label className="gov-label">Active Enforced Rule Edition:</label>
              <input type="text" value={activeEdition} disabled className="gov-input" style={{ background: '#f1f5f9', color: '#475569' }} />
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label className="gov-label">Candidate Draft Rule Edition: <span className="req">*</span></label>
              <input
                type="text"
                value={candidateEdition}
                onChange={(e) => setCandidateEdition(e.target.value)}
                className="gov-input"
              />
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label className="gov-label">Technical / Engg Degree Required Deposit (₹): <span className="req">*</span></label>
              <input
                type="number"
                step={100000}
                value={enggUgAmount}
                onChange={(e) => setEnggUgAmount(Number(e.target.value))}
                className="gov-input font-mono"
              />
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                Current APH: ₹35,00,000 | Proposed: <strong>₹{enggUgAmount.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label className="gov-label">Pharmacy Degree Required Deposit (₹): <span className="req">*</span></label>
              <input
                type="number"
                step={100000}
                value={pharmUgAmount}
                onChange={(e) => setPharmUgAmount(Number(e.target.value))}
                className="gov-input font-mono"
              />
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                Current APH: ₹25,00,000 | Proposed: <strong>₹{pharmUgAmount.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label className="gov-label">Statutory Lock-in Tenor (Months): <span className="req">*</span></label>
              <input
                type="number"
                value={tenorRequirement}
                onChange={(e) => setTenorRequirement(Number(e.target.value))}
                className="gov-input font-mono"
              />
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                Current: 96 Months (8 Years) | Proposed: <strong>{tenorRequirement} Months</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0', fontSize: '0.8rem', color: '#1e293b' }}>
              <input
                type="checkbox"
                id="nba-chk"
                checked={nbaDiscount}
                onChange={(e) => setNbaDiscount(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="nba-chk" style={{ cursor: 'pointer' }}>
                Incentive rebate of ₹5.00 Lakhs for NBA accredited institutions
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setEnggUgAmount(4500000);
                  setPharmUgAmount(3000000);
                  setTenorRequirement(120);
                  setNbaDiscount(true);
                }}
                className="btn-gov btn-gov-secondary btn-gov-sm"
                style={{ width: '100%' }}
              >
                <RotateCcw size={13} />
                <span>Reset to Standard Draft</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Simulation Diff Report */}
        <div className="gov-panel">
          <div className="gov-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>
              REGULATORY IMPACT ASSESSMENT & INSTITUTION DIFF REPORT
            </span>
            {simulationResults && (
              <span style={{ background: 'var(--gov-green-dark)', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px' }}>
                DRY-RUN SIMULATED
              </span>
            )}
          </div>

          <div style={{ padding: '1.25rem' }}>
            {!simulationResults ? (
              <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: '#64748b' }}>
                <Sliders size={44} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
                <div style={{ fontWeight: 800, color: 'var(--gov-navy-dark)', fontSize: '1rem' }}>
                  Awaiting Rule Simulation Execution
                </div>
                <p style={{ fontSize: '0.82rem', maxWidth: '440px', margin: '0.5rem auto 1.25rem', lineHeight: 1.4 }}>
                  Configure draft parameters on the left and click "Execute Dry-Run On Central Registry" to evaluate sector-wide financial and compliance impacts.
                </p>
                <button onClick={runSimulation} className="btn-gov btn-gov-primary btn-gov-sm">
                  <Play size={14} />
                  <span>Execute Dry-Run</span>
                </button>
              </div>
            ) : (
              <div>
                {/* Macro Impact KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderLeft: '4px solid #dc2626', padding: '0.85rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#991b1b', fontWeight: 800 }}>NEWLY DEFICIENT INSTITUTIONS</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626', margin: '2px 0' }}>
                      {newlyDeficientCount} Cases
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Institutions requiring supplementary deposit</div>
                  </div>

                  <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderLeft: '4px solid var(--gov-saffron)', padding: '0.85rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#92400e', fontWeight: 800 }}>TOTAL FINANCIAL SHORTFALL</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309', margin: '2px 0' }}>
                      ₹{(totalNewShortfall / 100000).toFixed(1)} Lakhs
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Aggregate capital mobilization needed</div>
                  </div>

                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '4px solid var(--gov-green-dark)', padding: '0.85rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 800 }}>GOVERNMENT EXEMPT RECORD</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gov-green-dark)', margin: '2px 0' }}>
                      100% Protected
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Statutory zero-deposit status preserved</div>
                  </div>
                </div>

                {/* Institution Impact Breakdown Table */}
                <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
                  <table className="gov-table" style={{ fontSize: '0.8rem' }}>
                    <thead>
                      <tr>
                        <th>Institution Name & PID</th>
                        <th style={{ textAlign: 'right' }}>Deposit Lodged</th>
                        <th style={{ textAlign: 'right' }}>Current Requirement</th>
                        <th style={{ textAlign: 'right' }}>Proposed Requirement</th>
                        <th style={{ textAlign: 'center' }}>Projected Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulationResults.map((r, i) => (
                        <tr key={i}>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--gov-navy-dark)' }}>{r.instrument.institutionName}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              FDR: <span className="font-mono">{r.instrument.instrumentNumber}</span> (PID: {r.instrument.institutionAicteId})
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--gov-navy-dark)' }}>
                            {r.instrument.formattedAmount}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            ₹{r.previousRequired.toLocaleString('en-IN')}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--gov-navy-medium)' }}>
                            ₹{r.newRequired.toLocaleString('en-IN')}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {r.shortfall > 0 ? (
                              <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', fontWeight: 700, fontSize: '0.75rem', border: '1px solid #f87171' }}>
                                Shortfall: ₹{(r.shortfall / 100000).toFixed(1)}L
                              </span>
                            ) : (
                              <span style={{ background: '#f0fdf4', color: '#166534', padding: '2px 8px', fontWeight: 700, fontSize: '0.75rem', border: '1px solid #86efac' }}>
                                ✓ Compliant
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Activation Guardrail Note */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.78rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  <span style={{ color: '#334155' }}>
                    <strong>Statutory Guardrail:</strong> Activation of new rules requires electronic approval from Member Secretary & Legal Cell before Gazette publication.
                  </span>
                  <button
                    onClick={() => addToast('success', 'Dry-Run Report Exported', 'Simulation diff package saved for Legal Council review.')}
                    className="btn-gov btn-gov-secondary btn-gov-sm"
                  >
                    <Download size={13} />
                    <span>Export Council Diff Package</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
