package org.aicte.fdr.timeline;

import org.aicte.fdr.registry.Instrument;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TimelineEngine {

    public record TimelineAlert(String instrumentId, String alertType, String message, LocalDate triggerDate) {}

    public List<TimelineAlert> evaluate(List<Instrument> instruments, LocalDate referenceDate) {
        List<TimelineAlert> alerts = new ArrayList<>();

        for (Instrument inst : instruments) {
            LocalDate mat = inst.maturityDate();
            if (DateCalculator.isWithinAlertWindow(mat, referenceDate, 30)) {
                alerts.add(new TimelineAlert(inst.id(), "ESCALATION_30_DAYS", "Instrument matures in < 30 days. Auto-renewal imminent.", referenceDate));
            } else if (DateCalculator.isWithinAlertWindow(mat, referenceDate, 60)) {
                alerts.add(new TimelineAlert(inst.id(), "WARNING_60_DAYS", "Instrument matures in < 60 days.", referenceDate));
            } else if (DateCalculator.isWithinAlertWindow(mat, referenceDate, 90)) {
                alerts.add(new TimelineAlert(inst.id(), "ADVISORY_90_DAYS", "Instrument enters 90-day maturity advisory window.", referenceDate));
            }
        }
        return alerts;
    }
}
