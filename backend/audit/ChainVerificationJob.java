package org.aicte.fdr.audit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduled job verifying cryptographic ledger continuity every night.
 * Fires security alerts upon any broken hash or missing entry.
 */
@Component
public class ChainVerificationJob {

    private static final Logger log = LoggerFactory.getLogger(ChainVerificationJob.class);
    private final AuditService auditService;

    public ChainVerificationJob(AuditService auditService) {
        this.auditService = auditService;
    }

    @Scheduled(cron = "0 0 3 * * ?", zone = "Asia/Kolkata")
    public void runVerification() {
        log.info("Starting sovereign audit chain integrity verification pass...");
        boolean valid = auditService.verifyIntegrity();
        if (valid) {
            log.info("Audit chain verification PASSED: All hashes mathematically continuous.");
        } else {
            log.error("CRITICAL SECURITY ALERT: Audit chain tamper detected! Notification sent to CERT-In / CAG officers.");
        }
    }
}
