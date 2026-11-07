import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { TimeTravelModal } from './components/layout/TimeTravelModal';
import { ScenarioGuideModal } from './components/layout/ScenarioGuideModal';
import { ToastContainer } from './components/common/ToastContainer';
import { Footer } from './components/layout/Footer';

// Auth Components (GSD Phase 1 Plan 1.2)
import { LoginPage } from './components/auth/LoginPage';
import { StepUpAuthModal } from './components/auth/StepUpAuthModal';
import { SessionTimeoutModal } from './components/auth/SessionTimeoutModal';

import { BureauDashboard } from './components/dashboard/BureauDashboard';
import { RiskWorklist } from './components/worklist/RiskWorklist';
import { CaseWorkspace } from './components/worklist/CaseWorkspace';
import { InstitutionPortal } from './components/institution/InstitutionPortal';
import { SubmissionWizard } from './components/institution/SubmissionWizard';
import { AuditExplorer } from './components/audit/AuditExplorer';
import { PublicNocVerify } from './components/noc/PublicNocVerify';
import { BankConfirmationPortal } from './components/bank/BankConfirmationPortal';
import { RuleSimulationSandbox } from './components/sandbox/RuleSimulationSandbox';
import { ApprovalPortalApiSimulator } from './components/api/ApprovalPortalApiSimulator';
import { AutomatedReportsPortal } from './components/reports/AutomatedReportsPortal';
import { MeasurableImpact } from './components/analytics/MeasurableImpact';
import { EvaluatorDock } from './components/common/EvaluatorDock';

export const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    login,
    logout,
    activeTab,
    stepUpAction,
    clearStepUp,
    isTimeoutWarningOpen,
    sessionRemainingSeconds,
    extendSession
  } = useApp();

  // If not authenticated, render the official AICTE Portal Login Page
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLoginSuccess={login} />
        <ToastContainer />
      </>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return <BureauDashboard />;
      case 'WORKLIST':
        return <RiskWorklist />;
      case 'CASE_WORKSPACE':
        return <CaseWorkspace />;
      case 'INSTITUTION_PORTAL':
        return <InstitutionPortal />;
      case 'NEW_SUBMISSION':
        return <SubmissionWizard />;
      case 'AUDIT_EXPLORER':
        return <AuditExplorer />;
      case 'PUBLIC_NOC':
        return <PublicNocVerify />;
      case 'BANK_CONFIRM':
        return <BankConfirmationPortal />;
      case 'RULE_SANDBOX':
        return <RuleSimulationSandbox />;
      case 'API_EXPLORER':
        return <ApprovalPortalApiSimulator />;
      case 'REPORTS':
        return <AutomatedReportsPortal />;
      case 'ROI_SLIDES':
        return <MeasurableImpact />;
      case 'LOGIN_DEMO':
        return <LoginPage onLoginSuccess={login} />;
      default:
        return <BureauDashboard />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Navigation />
      <main id="main-content" style={{ flex: 1, paddingBottom: '2rem' }}>
        {renderActiveTab()}
      </main>
      <Footer />

      {/* Global Modals & Notifications */}
      <TimeTravelModal />
      <ScenarioGuideModal />
      <ToastContainer />

      {/* Step-Up 2FA Modal for Sensitive Actions (GSD Plan 1.2) */}
      {stepUpAction && (
        <StepUpAuthModal
          isOpen={!!stepUpAction}
          actionTitle={stepUpAction.title}
          onConfirm={() => {
            stepUpAction.callback();
            clearStepUp();
          }}
          onCancel={clearStepUp}
        />
      )}

      {/* Session Timeout Warning Modal (NIST SP 800-63B) */}
      <SessionTimeoutModal
        isOpen={isTimeoutWarningOpen}
        secondsRemaining={sessionRemainingSeconds}
        onExtend={extendSession}
        onLogout={logout}
      />

      {/* Floating Evaluator Console for Hackathon Evaluation */}
      <EvaluatorDock />
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
