package org.aicte.fdr.registry;

import java.math.BigDecimal;
import java.time.LocalDate;

public record Instrument(
    String id,
    String institutionId,
    String fdrNumber,
    String bankName,
    String branchName,
    String ifscCode,
    BigDecimal amount,
    LocalDate depositDate,
    LocalDate maturityDate,
    int tenorYears,
    BigDecimal interestRate,
    String jointHolderName,
    String status,
    String trustLevel,
    boolean lienMarked,
    int riskScore
) {}
