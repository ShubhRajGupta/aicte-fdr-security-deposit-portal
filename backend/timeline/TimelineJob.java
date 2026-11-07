package org.aicte.fdr.timeline;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class TimelineJob {

    private static final Logger log = LoggerFactory.getLogger(TimelineJob.class);
    private final TimelineEngine timelineEngine;

    public TimelineJob(TimelineEngine timelineEngine) {
        this.timelineEngine = timelineEngine;
    }

    @Scheduled(cron = "0 30 1 * * ?", zone = "Asia/Kolkata")
    public void runTimelineSweep() {
        log.info("Running daily 01:30 IST timeline sweep for reference date: {}", LocalDate.now());
    }
}

