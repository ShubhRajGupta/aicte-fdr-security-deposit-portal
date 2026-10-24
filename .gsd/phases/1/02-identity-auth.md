---
phase: 1
plan: 2
wave: 1
depends_on: [0.1, 0.2, 1.1]
files_modified:
  - backend/identity/
  - infra/keycloak/realm-export.json
  - backend/bff/
  - frontend/src/auth/
autonomous: true

must_haves:
  truths:
    - "All 10 roles can log in with correct credentials"
    - "Wrong credentials trigger lockout after 5 failed attempts"
    - "Tokens are never visible in browser localStorage or sessionStorage"
    - "Officer sessions time out after 15 min idle; institution sessions after 30 min idle"
    - "Absolute session limit of 8 hours enforced"
    - "Step-up (second factor) is required for release and approval actions"
    - "Keycloak admin console is not accessible from the public internet"
    - "BFF login flow works in the host's network (Spike S4 confirmed)"
  artifacts:
    - "infra/keycloak/realm-export.json: exportable, version-controlled Keycloak config"
    - "backend/bff/: BFF middleware wiring OIDC + PKCE to HttpOnly cookie sessions"
    - "backend/identity/: Spring method security + role enum definitions"
---

# Plan 1.2: Identity & Authentication

<objective>
Set up Keycloak and the backend-for-frontend (BFF) middleware.
All 10 roles authenticated; sessions managed correctly; tokens never in browser storage.

Purpose: Everything else builds on identity. Getting this wrong is a security failure.
Output: Working login/logout/step-up for all roles; Keycloak config exported and version-controlled.
</objective>

<context>
Load for context:
- .gsd/SPEC.md (Section 5.7: authentication and authorisation design; role list)
- .gsd/decisions/DECISIONS.md (D1: standalone; D2: hosting)
- .gsd/spikes/S4-bff-login.md (host network constraints confirmed)
- PROJECT_RULES.md (security rules: no custom crypto, no tokens in browser)
</context>

<tasks>

<task type="auto">
  <name>Configure Keycloak realm, clients, roles, and session policies</name>
  <files>infra/keycloak/realm-export.json</files>
  <action>
    Configure Keycloak for the FDR portal:

    Realm: aicte-fdr
    Client: fdr-portal-bff (confidential, OIDC, authorization code + PKCE)
    Redirect URIs: only the portal's staging and production domains
    Admin console: bind to internal network interface only — never public internet

    Roles (map to Spring authorities):
    - institution_user
    - institution_signatory
    - regional_verifier
    - bureau_officer
    - competent_authority
    - accounts_officer
    - rule_owner
    - auditor
    - helpdesk
    - system_admin

    Session policy:
    - SSO session idle: 30 min (institution roles), 15 min (officer roles)
    - SSO session max: 8 hours
    - Access token lifespan: 5 min (short — BFF refreshes via httpOnly cookie)

    Password policy (NIST SP 800-63B):
    - Minimum length: 15 characters (length-based, not complexity rules)
    - Breached-password check: Keycloak Haven PwnedPasswords policy or equivalent
    - No password expiry (NIST guidance); force reset on suspected compromise

    OTP/TOTP:
    - OTP enabled for all roles (SMS OTP for institution users, TOTP for officers)
    - Lockout: 5 failed attempts → 30 min lockout

    Step-up authentication client scope:
    - Configure a step-up scope used for: release approvals, role changes, competent authority decisions

    Export the full realm config as JSON → version-controlled.
    AVOID: Any manual Keycloak config that is not reflected in the export file.
    AVOID: Storing the admin password in any config file.
  </action>
  <verify>
    Each of the 10 roles logs in successfully with test credentials.
    Wrong password triggers lockout after 5 attempts.
    Keycloak admin console returns 403 from the public-facing IP.
    Realm export JSON applies cleanly to a fresh Keycloak instance.
  </verify>
  <done>All 10 roles confirmed; lockout confirmed; admin console not public; export version-controlled.</done>
</task>

<task type="auto">
  <name>Build Backend-for-Frontend (BFF) middleware</name>
  <files>backend/bff/, backend/identity/, frontend/src/auth/</files>
  <action>
    Implement the BFF pattern so the React SPA never handles tokens directly:

    BFF responsibilities:
    1. Initiate OIDC authorization code + PKCE flow (redirect to Keycloak)
    2. Exchange the code for tokens (server-side only)
    3. Store access token + refresh token in memory (not in browser)
    4. Set a session cookie (HttpOnly, Secure, SameSite=Strict) that identifies the server-side session
    5. On each frontend API call: look up the server-side session, attach the Bearer token, proxy to the backend
    6. Refresh the access token transparently when it expires
    7. On logout: revoke tokens at Keycloak, destroy the server-side session, clear the cookie

    Step-up flow:
    - When a frontend action requires step-up (release, approval): the BFF initiates a new OIDC flow with the step-up scope
    - The fresh second factor is confirmed before the action proceeds

    Spring method security:
    - Annotate service methods with @PreAuthorize("hasRole('...')")
    - Define role constants in an enum (Role.INSTITUTION_USER, etc.)
    - These are enforced in addition to Keycloak's role check

    Frontend auth:
    - React app calls /api/session-info to get the current user's name, role, and institution
    - No JWT parsing in the browser; no localStorage/sessionStorage usage for auth

    AVOID: Storing tokens in browser localStorage or sessionStorage (XSS steals them)
    AVOID: Using OIDC implicit flow (deprecated, insecure)
    AVOID: Long-lived refresh tokens in browser storage
  </action>
  <verify>
    Login → inspect browser storage → no tokens (only the session cookie, HttpOnly flag set)
    Session idle timeout: after 15 min (officer role) of no activity, next API call returns 401
    Step-up: calling /api/instruments/{id}/release without step-up → 403; after step-up → proceeds
    Logout: session cookie cleared; subsequent API calls return 401
    Spike S4 confirmed: these flows work in the actual host network environment
  </verify>
  <done>BFF proven; no tokens in browser storage; step-up works; session timeout enforced.</done>
</task>

</tasks>

<verification>
After all tasks:
- [ ] All 10 roles: login, correct data scope, logout
- [ ] Lockout after 5 failed attempts
- [ ] No tokens in browser storage (verified with browser dev tools)
- [ ] Idle timeout: 15 min officers, 30 min institutions
- [ ] Step-up required for release and approval
- [ ] Keycloak admin console not accessible publicly
- [ ] Realm export JSON in version control; applies to fresh instance
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
- [ ] Plan 1.3 (Schema + RLS + Audit) can begin
</success_criteria>
