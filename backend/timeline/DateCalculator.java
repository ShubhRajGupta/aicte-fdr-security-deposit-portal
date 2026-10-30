package org.aicte.fdr.timeline;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;

/**
 * Pure date calculation component ensuring financial leap-year and month-end conventions.
 */
public class DateCalculator {

    public static LocalDate computeMaturityDate(LocalDate depositDate, int tenorYears) {
        LocalDate rawMaturity = depositDate.plusYears(tenorYears);
        if (depositDate.getDayOfMonth() == depositDate.lengthOfMonth()) {
            return rawMaturity.with(TemporalAdjusters.lastDayOfMonth());
        }
        return rawMaturity;
    }

    public static boolean isWithinAlertWindow(LocalDate maturityDate, LocalDate simulatedDate, int daysThreshold) {
        return !simulatedDate.isAfter(maturityDate) && 
               !simulatedDate.isBefore(maturityDate.minusDays(daysThreshold));
    }
}
