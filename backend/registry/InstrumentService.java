package org.aicte.fdr.registry;

import org.aicte.fdr.audit.AuditService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class InstrumentService {

    private final Map<String, Instrument> store = new ConcurrentHashMap<>();
    private final AuditService auditService;

    public InstrumentService(AuditService auditService) {
        this.auditService = auditService;
    }

    @Transactional
    public Instrument registerInstrument(Instrument instrument, String actorName, String actorRole) {
        store.put(instrument.id(), instrument);
        auditService.recordEvent(
            actorName,
            actorRole,
            "INSTRUMENT_SUBMITTED",
            "INSTRUMENT",
            instrument.id(),
            "Submitted FDR: " + instrument.fdrNumber() + " for Amount: ₹" + instrument.amount(),
            null,
            Map.of("status", instrument.status(), "fdrNumber", instrument.fdrNumber())
        );
        return instrument;
    }

    public Optional<Instrument> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<Instrument> findAll() {
        return new ArrayList<>(store.values());
    }
}
