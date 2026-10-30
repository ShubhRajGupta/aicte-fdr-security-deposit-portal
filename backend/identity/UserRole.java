package org.aicte.fdr.identity;

/**
 * 10 Canonical Roles enforced across the AICTE FDR Security Deposit Portal.
 * Defined in GSD Plan 1.2 and SPEC Section 5.7.
 */
public enum UserRole {
    INSTITUTION_USER("Institution Operator / FDR Submitter"),
    INSTITUTION_SIGNATORY("Institution Principal / Authorized Signatory"),
    REGIONAL_VERIFIER("AICTE Regional Office Scrutiny Officer"),
    BUREAU_OFFICER("AICTE Regulation Bureau HQ Officer"),
    COMPETENT_AUTHORITY("Adviser-I / Member Secretary (Release Authority)"),
    BANK_OFFICER("Scheduled Commercial Bank Branch Manager"),
    ACCOUNTS_OFFICER("AICTE Finance & Accounts Bureau Officer"),
    RULE_OWNER("Regulation Bureau APH Policy Administrator"),
    AUDITOR("CAG / CERT-In Sovereign Independent Auditor"),
    SYSTEM_ADMIN("Central Infrastructure & Security Administrator");

    private final String description;

    UserRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public boolean isOfficer() {
        return this == REGIONAL_VERIFIER || this == BUREAU_OFFICER || 
               this == COMPETENT_AUTHORITY || this == ACCOUNTS_OFFICER || 
               this == RULE_OWNER;
    }

    public boolean requiresStepUpForRelease() {
        return this == COMPETENT_AUTHORITY || this == BUREAU_OFFICER;
    }
}
