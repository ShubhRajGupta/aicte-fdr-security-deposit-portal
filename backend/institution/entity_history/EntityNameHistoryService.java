package org.aicte.fdr.institution.entity_history;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class EntityNameHistoryService {

    public record NameChangeRecord(
        String id,
        String institutionId,
        String oldName,
        String newName,
        String gazetteRef,
        LocalDate effectiveDate,
        String officerName
    ) {}

    private final Map<String, List<NameChangeRecord>> historyStore = new HashMap<>();

    @Transactional
    public NameChangeRecord recordOfficialRenaming(
        String institutionId,
        String oldName,
        String newName,
        String gazetteRef,
        LocalDate effectiveDate,
        String officerName
    ) {
        NameChangeRecord record = new NameChangeRecord(
            UUID.randomUUID().toString(),
            institutionId,
            oldName,
            newName,
            gazetteRef,
            effectiveDate,
            officerName
        );

        historyStore.computeIfAbsent(institutionId, k -> new ArrayList<>()).add(record);
        return record;
    }

    public List<NameChangeRecord> getHistoricalNames(String institutionId) {
        return historyStore.getOrDefault(institutionId, Collections.emptyList());
    }
}
