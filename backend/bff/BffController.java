package org.aicte.fdr.bff;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.aicte.fdr.identity.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Backend-For-Frontend (BFF) Auth & Session Controller
 * Ensures tokens are never stored in browser storage.
 */
@RestController
@RequestMapping("/api/auth")
public class BffController {

    private final SessionManager sessionManager;

    public BffController(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletResponse response) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // Authenticate against Keycloak OIDC provider
        UserPrincipal principal = sessionManager.authenticate(username, password);

        // Issue HttpOnly session cookie
        Cookie cookie = new Cookie("AICTE_SECURE_SESSION", sessionManager.createSession(principal));
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(principal.role().isOfficer() ? 900 : 1800); // NIST idle timeout
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of(
            "message", "Authenticated successfully",
            "user", principal
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        sessionManager.invalidate(request);

        Cookie cookie = new Cookie("AICTE_SECURE_SESSION", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("message", "Session terminated"));
    }

    @GetMapping("/session")
    public ResponseEntity<?> checkSession(HttpServletRequest request) {
        UserPrincipal principal = sessionManager.resolvePrincipal(request);
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("authenticated", false));
        }
        return ResponseEntity.ok(Map.of("authenticated", true, "user", principal));
    }
}
