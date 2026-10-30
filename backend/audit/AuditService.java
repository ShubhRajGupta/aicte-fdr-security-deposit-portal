package org.aicte.fdr.audit;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedDeque;

/**
 * Service writing audit events within caller's transaction while maintaining SHA-256 hash chaining.
 */
@Service
public class AuditService {

    private final Deque<AuditEvent> ledger = new ConcurrentLinkedDeque<>();
    private volatile String latestHash = "0".repeat(64);

    @Transactional(propagation = Propagation.MANDATORY)
    public AuditEvent recordEvent(
        String actorName,
        String actorRole,
        String eventType,
        String entityType,
        String entityId,
        String details,
        Map<String, Object> beforeState,
        Map<String, Object> afterState
    ) {
        Instant now = Instant.now();
        String prev = latestHash;
        String payloadToHash = prev + "|" + now.toString() + "|" + actorName + "|" + eventType + "|" + entityId + "|" + details;
        String currentHash = sha256(payloadToHash);

        AuditEvent event = new AuditEvent(
            UUID.randomUUID().toString(),
            now,
            actorName,
            actorRole,
            eventType,
            entityType,
            entityId,
            details,
            prev,
            currentHash,
            beforeState,
            afterState,
            "10.0.0.1"
        );

        latestHash = currentHash;
        ledger.add(event);
        return event;
    }

    public List<AuditEvent> getAuditTrail() {
        return new ArrayList<>(ledger);
    }

    public boolean verifyIntegrity() {
        String expectedPrev = "0".repeat(64);
        for (AuditEvent event : ledger) {
            if (!event.previousHash().equals(expectedPrev)) {
                return false;
            }
            String payload = event.previousHash() + "|" + event.timestamp().toString() + "|" +
                event.actorName() + "|" + event.eventType() + "|" + event.entityId() + "|" + event.details();
            String computed = sha256(payload);
            if (!computed.equals(event.currentHash())) {
                return false;
            }
            expectedPrev = event.currentHash();
        }
        return true;
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm unavailable", e);
        }
    }
}
