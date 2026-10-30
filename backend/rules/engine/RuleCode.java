package org.aicte.fdr.rules.engine;

public enum RuleCode {
    RULE_AMT_INSUFFICIENT("R1", "Deposit Amount Below Statutory APH Mandate", "CRITICAL"),
    RULE_INVALID_TENOR("R2", "Maturity Period Under Statutory Tenor", "HIGH"),
    RULE_NON_SCHEDULED_BANK("R3", "Deposit Held in Non-Scheduled / Cooperative Bank", "HIGH"),
    RULE_MISSING_JOINT_LIEN("R4", "AICTE Lien Endorsement Absent on FDR", "CRITICAL"),
    RULE_NAME_MISMATCH("R5", "Institution Name on Receipt Differs from Approval Letter", "MEDIUM");

    private final String code;
    private final String message;
    private final String severity;

    RuleCode(String code, String message, String severity) {
        this.code = code;
        this.message = message;
        this.severity = severity;
    }

    public String getCode() { return code; }
    public String getMessage() { return message; }
    public String getSeverity() { return severity; }
}
