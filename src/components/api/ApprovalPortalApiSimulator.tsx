import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Code,
  Terminal,
  Play,
  Copy,
  ExternalLink,
  ShieldCheck,
  Server
} from 'lucide-react';

export const ApprovalPortalApiSimulator: React.FC = () => {
  const { institutions, instruments, addToast } = useApp();

  const [selectedInstId, setSelectedInstId] = useState<string>(institutions[0].id);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2026-27');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [latencyMs, setLatencyMs] = useState(38);

  const targetInst = institutions.find((i) => i.id === selectedInstId) || institutions[0];
  const targetInstruments = instruments.filter((i) => i.institutionId === selectedInstId);

  const handleExecuteApi = () => {
    setIsExecuting(true);
    const mockLatency = Math.floor(25 + Math.random() * 30);
    setLatencyMs(mockLatency);

    setTimeout(() => {
      const activeTotal = targetInstruments.reduce((sum, i) => sum + i.amount, 0);
      const isGovt = targetInst.type === 'GOVERNMENT_EXEMPT';
      const required = isGovt ? 0 : targetInst.requiredDepositAmount;
      const isCompliant = isGovt || activeTotal >= required;
      const highestTrust = targetInstruments.some((i) => i.trustLevel === 'L2')
        ? 'L2'
        : targetInstruments.some((i) => i.trustLevel === 'L1')
        ? 'L1'
        : 'L0';

      const responsePayload = {
        meta: {
          service: 'AICTE Central Security Deposit Registry REST API (NIC e-Gov)',
          version: 'v1.4.2',
          timestamp: new Date().toISOString(),
          rateLimitRemaining: 9984,
          signature: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        },
        data: {
          institutionId: targetInst.aictePermanentId,
          institutionName: targetInst.name,
          state: targetInst.state,
          region: targetInst.region,
          institutionType: targetInst.type,
          academicYear: selectedAcademicYear,
          depositStatus: {
            approvalWindowEligible: isCompliant,
            complianceVerdict: isCompliant ? 'COMPLIANT' : 'DEFICIENT',
            requiredDepositAmountInr: required,
            activeCoverageAmountInr: activeTotal,
            shortfallAmountInr: Math.max(0, required - activeTotal),
            highestTrustTier: highestTrust,
            hasActiveAdministrativeHolds: targetInstruments.some((i) => i.isHoldActive)
          },
          registeredInstruments: targetInstruments.map((inst) => ({
            instrumentNumber: inst.instrumentNumber,
            type: inst.instrumentType,
            bankName: inst.bankName,
            branchName: inst.branchName,
            amount: inst.amount,
            issueDate: inst.issueDate,
            maturityDate: inst.maturityDate,
            trustLevel: inst.trustLevel,
            status: inst.status,
            version: inst.version,
            isLienConfirmedByBank: !!inst.evidenceRecord
          }))
        }
      };

      setApiResponse(JSON.stringify(responsePayload, null, 2));
      setIsExecuting(false);
      addToast(
        'success',
        '200 OK — Live API Executed',
        `Retrieved deposit compliance status for ${targetInst.name} in ${mockLatency}ms.`
      );
    }, 350);
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
              <Server size={22} style={{ color: 'var(--gov-navy-medium)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gov-navy-dark)', margin: 0 }}>
                INTER-PORTAL SECURE REST API ENDPOINT (INNOVATION I12)
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.35rem', lineHeight: 1.4 }}>
              OpenAPI 3.1 & OAuth 2.0 microservice facilitating real-time automated verification between the AICTE Central Security Deposit Registry and the core AICTE Approval Portal (EoA/LoA processing).
            </p>
          </div>

          <button 
            onClick={handleExecuteApi} 
            disabled={isExecuting} 
            className="btn-gov btn-gov-primary" 
            style={{ fontWeight: 800, padding: '0.6rem 1.25rem' }}
          >
            <Play size={15} />
            <span>{isExecuting ? 'Querying REST Service...' : 'Send Live API Request'}</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left: Interactive Request Builder */}
        <div className="gov-panel">
          <div className="gov-panel-header">
            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>
              HTTP REST REQUEST BUILDER
            </span>
          </div>

          <div style={{ padding: '1.25rem' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.65rem 0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
              <span style={{ background: 'var(--gov-green-dark)', color: '#ffffff', fontWeight: 800, padding: '2px 6px', fontSize: '0.7rem' }}>
                GET
              </span>
              <code className="font-mono" style={{ color: 'var(--gov-navy-medium)', fontWeight: 700, wordBreak: 'break-all' }}>
                /api/v1/institutions/{targetInst.aictePermanentId}/security-deposit-status
              </code>
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label className="gov-label">Target Technical Institution: <span className="req">*</span></label>
              <select
                value={selectedInstId}
                onChange={(e) => setSelectedInstId(e.target.value)}
                className="gov-select"
              >
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.aictePermanentId})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label className="gov-label">Academic Approval Year Query Param: <span className="req">*</span></label>
              <select
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                className="gov-select"
              >
                <option value="2026-27">2026-27 (Current Approval Cycle)</option>
                <option value="2025-26">2025-26 (Past Year Compliance)</option>
                <option value="2027-28">2027-28 (Advance Projection)</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="gov-label">Statutory Authorization Header:</label>
              <input
                type="text"
                value="Bearer aicte_sec_jwt_token_prod_994182"
                disabled
                className="gov-input font-mono"
                style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#64748b' }}
              />
            </div>

            <div
              className="gov-alert gov-alert-info"
              style={{ fontSize: '0.75rem', lineHeight: 1.4 }}
            >
              <strong>Statutory Binding (ADR-14):</strong> The Approval Portal reads this endpoint synchronously during EoA generation. Zero deposit compliance blocks issuance of the final approval order.
            </div>
          </div>
        </div>

        {/* Right: Response Console (JSON Output) */}
        <div className="gov-panel">
          <div className="gov-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>
              LIVE HTTP JSON RESPONSE BODY
            </span>

            {apiResponse && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem' }}>
                <span style={{ background: 'var(--gov-green-dark)', color: '#ffffff', padding: '2px 8px', fontWeight: 800 }}>
                  HTTP 200 OK
                </span>
                <span style={{ color: '#ffffff' }}>Latency: {latencyMs} ms</span>
              </div>
            )}
          </div>

          <div style={{ padding: '1.25rem', background: '#ffffff' }}>
            {!apiResponse ? (
              <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b' }}>
                <Terminal size={40} style={{ margin: '0 auto 0.75rem', color: '#cbd5e1' }} />
                <div style={{ fontWeight: 700, color: 'var(--gov-navy-dark)' }}>No Request Dispatched Yet</div>
                <p style={{ fontSize: '0.8rem', maxWidth: '380px', margin: '0.35rem auto 1rem' }}>
                  Click "Send Live API Request" above to test the inter-portal schema validation response.
                </p>
                <button onClick={handleExecuteApi} className="btn-gov btn-gov-primary btn-gov-sm">
                  <Play size={13} />
                  <span>Execute Endpoint Test</span>
                </button>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <pre
                  style={{
                    background: '#0f172a',
                    border: '1px solid #1e293b',
                    padding: '1.25rem',
                    color: '#38bdf8',
                    fontFamily: 'monospace',
                    fontSize: '0.78rem',
                    maxHeight: '480px',
                    overflowY: 'auto',
                    lineHeight: 1.45,
                    margin: 0
                  }}
                >
                  {apiResponse}
                </pre>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(apiResponse);
                    addToast('info', 'Copied to Clipboard', 'JSON response payload copied.');
                  }}
                  className="btn-gov btn-gov-secondary btn-gov-sm"
                  style={{ position: 'absolute', top: '10px', right: '10px' }}
                  title="Copy JSON response"
                >
                  <Copy size={12} />
                  <span>Copy JSON</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
