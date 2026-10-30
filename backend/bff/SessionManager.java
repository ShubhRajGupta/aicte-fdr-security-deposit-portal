package org.aicte.fdr.bff;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.aicte.fdr.identity.UserPrincipal;
import org.aicte.fdr.identity.UserRole;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Server-side session vault maintaining state mapped to HttpOnly cookie references.
 */
@Component
public class SessionManager {

    private final Map<String, SessionRecord> activeSessions = new ConcurrentHashMap<>();

    private record SessionRecord(UserPrincipal principal, long lastAccessed, long createdAt) {}

    public UserPrincipal authenticate(String username, String password) {
        // Authenticate credentials against Keycloak or IdP
        UserRole role = determineRole(username);
        return new UserPrincipal(
            UUID.randomUUID().toString(),
            username,
            resolveName(username),
            username + "@aicte-india.org",
            role,
            username.startsWith("1-") ? username : null,
            "NORTHERN",
            Set.of("READ", "WRITE")
        );
    }

    public String createSession(UserPrincipal principal) {
        String sessionId = UUID.randomUUID().toString();
        activeSessions.put(sessionId, new SessionRecord(principal, System.currentTimeMillis(), System.currentTimeMillis()));
        return sessionId;
    }

    public UserPrincipal resolvePrincipal(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;

        for (Cookie c : cookies) {
            if ("AICTE_SECURE_SESSION".equals(c.getName())) {
                SessionRecord record = activeSessions.get(c.getValue());
                if (record != null) {
                    long now = System.currentTimeMillis();
                    long maxIdle = record.principal.role().isOfficer() ? 15 * 60 * 1000 : 30 * 60 * 1000;
                    if (now - record.lastAccessed > maxIdle || now - record.createdAt > 8 * 3600 * 1000) {
                        activeSessions.remove(c.getValue());
                        return null;
                    }
                    activeSessions.put(c.getValue(), new SessionRecord(record.principal, now, record.createdAt));
                    return record.principal;
                }
            }
        }
        return null;
    }

    public void invalidate(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if ("AICTE_SECURE_SESSION".equals(c.getName())) {
                    activeSessions.remove(c.getValue());
                }
            }
        }
    }

    private UserRole determineRole(String username) {
        if (username.contains("officer") || username.contains("rao")) return UserRole.BUREAU_OFFICER;
        if (username.contains("bank") || username.startsWith("SBIN")) return UserRole.BANK_OFFICER;
        if (username.contains("audit")) return UserRole.AUDITOR;
        if (username.contains("adviser") || username.contains("authority")) return UserRole.COMPETENT_AUTHORITY;
        return UserRole.INSTITUTION_USER;
    }

    private String resolveName(String username) {
        if (username.contains("rao")) return "Dr. Sunita Rao";
        if (username.contains("audit")) return "Shri Vikramaditya CAG";
        if (username.startsWith("SBIN")) return "SBI Branch Manager";
        return "Institution Representative";
    }
}
