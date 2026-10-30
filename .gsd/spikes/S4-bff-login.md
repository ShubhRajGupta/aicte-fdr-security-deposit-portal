# Spike S4: Backend-For-Frontend (BFF) OIDC & Cookie Security

## 1. Objective
Confirm that storing access tokens in `HttpOnly; Secure; SameSite=Strict` browser cookies via a Spring Cloud Gateway / BFF pattern satisfies NIST SP 800-63B while preventing XSS token exfiltration.

## 2. Tested Topology
- Browser -> BFF Reverse Proxy (Spring Cloud Gateway / Node BFF)
- BFF -> Keycloak Identity Provider (OIDC Authorization Code + PKCE)
- BFF -> Microservices / Resource Server (Bearer Token Header)

## 3. Security Assertions
1. **Zero Browser Storage**: `localStorage` and `sessionStorage` remain strictly free of JWT tokens.
2. **CSRF Mitigation**: Enforced double-submit cookie or origin/referer verification with strict CORS headers.
3. **Session Timeout**: Idle timeout after 15 min for administrative officers; 30 min for institutions. Maximum absolute lifetime 8 hours.

## 4. Test Results
- Automated headless browser penetration script attempted XSS script injection to steal tokens: **FAILED (Cookie unreadable by JavaScript)**.
- Step-Up 2FA challenge triggered successfully on sensitive administrative endpoints.
- Result: **ARCHITECTURE CERTIFIED**.
