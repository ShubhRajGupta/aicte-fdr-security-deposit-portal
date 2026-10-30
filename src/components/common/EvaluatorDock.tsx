import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Terminal,
  Play,
  Calendar,
  ChevronUp,
  ChevronDown,
  X,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const EvaluatorDock: React.FC = () => {
  const { runScenario, simulatedDate, setSimulatedDate, setIsTimeTravelOpen, setIsScenarioGuideOpen } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // Global Hotkey Ctrl+Shift+D to toggle evaluator drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    const handleCustomToggle = () => {
      setIsVisible((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-evaluator-dock', handleCustomToggle);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-evaluator-dock', handleCustomToggle);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '12px',
        right: '12px',
        zIndex: 9999,
        fontFamily: 'var(--font-sans)',
        fontSize: '11px'
      }}
    >
      {/* Collapsed Bar / Trigger Button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: '#002147',
            color: '#ffffff',
            border: '1px solid #003366',
            boxShadow: '0 2px 8px rgba(0, 33, 71, 0.3)',
            padding: '6px 12px',
            borderRadius: '2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 700
          }}
          title="Open SIH 2026 Evaluator & Test Scenario Console"
        >
          <Terminal size={13} style={{ color: '#f37022' }} />
          <span>SIH Jury Console</span>
          <span
            style={{
              background: '#f37022',
              color: '#ffffff',
              fontSize: '9px',
              padding: '1px 5px',
              fontWeight: 800
            }}
          >
            DEMO
          </span>
          <ChevronUp size={12} />
        </button>
      ) : (
        /* Expanded Console Panel */
        <div
          style={{
            width: '340px',
            background: '#ffffff',
            border: '1px solid #003366',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: '#002147',
              color: '#ffffff',
              padding: '8px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <Terminal size={14} style={{ color: '#f37022' }} />
              <span>SIH 2026 Evaluator Console</span>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '10px 12px', maxHeight: '380px', overflowY: 'auto' }}>
            <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '8px' }}>
              Quick triggers for statutory scenarios &amp; timeline engine evaluation:
            </div>

            {/* Scenarios List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' }}>
              <button
                onClick={() => { runScenario(1); setIsOpen(false); }}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  padding: '5px 8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '2px'
                }}
              >
                <div>
                  <strong style={{ color: '#002147' }}>Scenario 1: Shortfall Defect (R1)</strong>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Apex Inst lodges ₹25L vs ₹35L required</div>
                </div>
                <Play size={10} style={{ color: '#003366' }} />
              </button>

              <button
                onClick={() => { runScenario(2); setIsOpen(false); }}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  padding: '5px 8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '2px'
                }}
              >
                <div>
                  <strong style={{ color: '#002147' }}>Scenario 2: Multi-Branch Collision (R4)</strong>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Identical FDR pledged across 2 campuses</div>
                </div>
                <Play size={10} style={{ color: '#003366' }} />
              </button>

              <button
                onClick={() => { runScenario(3); setIsOpen(false); }}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  padding: '5px 8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '2px'
                }}
              >
                <div>
                  <strong style={{ color: '#002147' }}>Scenario 3: T-90 Expiry Cascade</strong>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Time-travels to 2034-07-26, triggers T-90</div>
                </div>
                <Play size={10} style={{ color: '#003366' }} />
              </button>

              <button
                onClick={() => { runScenario(4); setIsOpen(false); }}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  padding: '5px 8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '2px'
                }}
              >
                <div>
                  <strong style={{ color: '#002147' }}>Scenario 4: Lapsed Overdue Escalation</strong>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Time-travels past maturity, flags OVERDUE</div>
                </div>
                <Play size={10} style={{ color: '#003366' }} />
              </button>

              <button
                onClick={() => { runScenario(5); setIsOpen(false); }}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  padding: '5px 8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '2px'
                }}
              >
                <div>
                  <strong style={{ color: '#002147' }}>Scenario 5: L2 Bank Release &amp; QR NOC</strong>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Verifies bank evidence &amp; generates QR NOC</div>
                </div>
                <Play size={10} style={{ color: '#003366' }} />
              </button>

              <button
                onClick={() => { runScenario(6); setIsOpen(false); }}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  padding: '5px 8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '2px'
                }}
              >
                <div>
                  <strong style={{ color: '#002147' }}>Scenario 6: Sub-L2 Block Enforcement</strong>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Deterministic release lock if not at L2</div>
                </div>
                <Play size={10} style={{ color: '#003366' }} />
              </button>
            </div>

            {/* Quick Tools */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', display: 'flex', gap: '6px' }}>
              <button
                onClick={() => { setIsTimeTravelOpen(true); setIsOpen(false); }}
                className="btn-gov btn-gov-secondary btn-gov-sm"
                style={{ flex: 1, padding: '4px' }}
              >
                <Clock size={11} />
                <span>Calendar Engine</span>
              </button>
              <button
                onClick={() => { setIsScenarioGuideOpen(true); setIsOpen(false); }}
                className="btn-gov btn-gov-secondary btn-gov-sm"
                style={{ flex: 1, padding: '4px' }}
              >
                <Sparkles size={11} />
                <span>Full Guide Modal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
