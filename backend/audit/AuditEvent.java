package org.aicte.fdr.audit;

import java.time.Instant;
import java.util.Map;

public record AuditEvent(
    String id,
    Instant timestamp,
    String actorName,
    String actorRole,
    String eventType,
    String entityType,
    String entityId,
    String details,
    String previousHash,
    String currentHash,
    Map<String, Object> beforeState,
    Map<String, Object> afterState,
    String ipAddress
) {}
