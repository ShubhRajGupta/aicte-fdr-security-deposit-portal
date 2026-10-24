---
phase: 1
plan: 1
wave: 1
depends_on: [0.1, 0.2]
files_modified:
  - infra/terraform/ (or infra/ansible/)
  - infra/monitoring/
  - .gitlab-ci.yml (or Jenkinsfile)
  - infra/pipeline/sonar-config.xml
  - infra/pipeline/trivy-config.yaml
autonomous: false
user_setup:
  - service: AICTE IT / Hosting Provider
    why: "VM provisioning, network config, firewall rules, S3-compatible store setup"
    action: "Provide: VM specs, OS baseline, allowed outbound IPs (from S7), object store credentials, NTP server address"
  - service: SonarQube
    why: "Static analysis gate"
    action: "Provision SonarQube instance (or confirm NIC/host provides one)"

must_haves:
  truths:
    - "All 5 environments (dev, test, staging, prod, DR) are provisioned from the same IaC — no hand edits"
    - "The full pipeline (pre-commit → build → static → package → integration → staging deploy) runs green on a hello-world commit"
    - "Secret scanning blocks any commit containing a hard-coded credential"
    - "A critical dependency vulnerability fails the build"
    - "Prometheus is scraping metrics; logs are searchable in Loki/OpenSearch"
    - "Drift check runs after every deploy and alerts on differences"
  artifacts:
    - "infra/terraform/ (or ansible/) provisions all environments reproducibly"
    - ".gitlab-ci.yml stages match the pipeline table in the SPEC"
    - "Prometheus + Grafana dashboard shows at least: CPU, memory, disk, app availability"
---

# Plan 1.1: Infrastructure & CI/CD Pipeline

<objective>
Build the foundation that every other phase depends on.
All environments provisioned as code; the full pipeline gates quality from day one.

Purpose: Without a reproducible environment and a working pipeline,
every subsequent plan produces code that cannot be reliably deployed or audited.
Output: 5 environments live; pipeline green; monitoring active.
</objective>

<context>
Load for context:
- .gsd/SPEC.md (tech stack, hosting rules, security rules)
- .gsd/decisions/DECISIONS.md (D2: hosting platform)
- .gsd/spikes/S4-bff-login.md (host network constraints)
- .gsd/spikes/S7-network-reach.md (allowed outbound calls)
- PROJECT_RULES.md (infrastructure rules)
</context>

<tasks>

<task type="auto">
  <name>Provision all environments as Infrastructure as Code</name>
  <files>infra/terraform/ or infra/ansible/</files>
  <action>
    Based on D2 (hosting platform), write IaC that provisions:
    - 5 environments: dev, test, staging, prod, DR
    - Each environment: 2 app VMs (or containers) + PostgreSQL primary + streaming replica + object store buckets (quarantine, vault) + Keycloak VM + log store
    - DR: in a different seismic zone within India, warm standby
    - Network: no open outbound internet from app VMs (use approved proxies from S7)
    - Storage: SSD volumes for DB; object store with versioning enabled; budget ~1–2 TB for 5 years
    - Time sync: NTP from NIC or NPL server (CERT-In requirement)
    - OS baseline: follow the host's mandated baseline (confirm with AICTE IT)

    Run a drift check script (e.g., terraform plan or ansible --check) after every deploy.
    This script must run in CI and alert if the live environment diverges from IaC.

    AVOID: Any hand edit in staging or production. If a change is needed, update IaC first.
    AVOID: Storing credentials or secrets in IaC files. Use the vault or environment variables.
  </action>
  <verify>
    `terraform plan` (or `ansible --check`) shows zero drift on a freshly provisioned environment.
    All 5 environments accessible; each provisioned from the same IaC without modification.
  </verify>
  <done>5 environments up; drift check passes; no secrets in IaC files.</done>
</task>

<task type="auto">
  <name>Build and harden the CI/CD pipeline</name>
  <files>.gitlab-ci.yml (or Jenkinsfile), infra/pipeline/</files>
  <action>
    Wire up the full pipeline in order:
    1. pre-commit: gitleaks (secret scan), code format check — blocks commit
    2. build: compile, unit tests, ArchUnit architecture tests — all green required
    3. static & composition: SonarQube (fail on HIGH), Semgrep, OWASP Dependency-Check (fail on CRITICAL/HIGH without accepted exception), licence scan
    4. package: reproducible container build (Docker --no-cache, pinned base image), CycloneDX SBOM generation, Trivy image scan + signing — unknown component or critical vuln fails build
    5. integration: Testcontainers suite (requires Docker-in-Docker or equivalent) — all pass
    6. deploy to staging: same artefact, same config shape as production — smoke tests pass
    7. end-to-end: Playwright journeys (added in Phase 2+) — all pass
    8. nightly: ZAP scan on staging, dependency refresh check, backup restore test on staging
    9. release candidate gate: load test + security checklist + migration rehearsal — signed by QA/security/PO

    Each stage is a separate job; stages are sequential except integration can parallelize.
    Feature flags: new features default OFF. Flag config stored in DB, not in env vars.

    AVOID: Skipping any stage for a "quick fix" — the pipeline is the definition of done.
    AVOID: Sharing credentials between stages — inject from vault per-stage.
    AVOID: Using the same artefact that was built in dev for a production deploy — the pipeline
    must build a fresh artefact from a pinned git ref.
  </action>
  <verify>
    Push a hello-world Spring Boot app to main → all pipeline stages complete green.
    Add a test secret (e.g., `password=abc123`) to a file → pipeline fails at pre-commit.
    Add a dependency with a known critical CVE → pipeline fails at static/composition stage.
  </verify>
  <done>Full pipeline green on hello-world commit; secret scan and vuln scan gates proven.</done>
</task>

<task type="auto">
  <name>Deploy observability stack (Prometheus, Grafana, Loki/OpenSearch)</name>
  <files>infra/monitoring/</files>
  <action>
    Deploy as part of IaC; all components must be within India (no SaaS export).

    Prometheus: scrape app metrics, PostgreSQL metrics (pg_exporter), node metrics.
    Grafana: dashboard showing CPU, memory, disk, app availability, login success rate,
    upload success rate, queue depth, replication lag, certificate expiry countdown.

    Loki (or OpenSearch): collect all app logs + system logs.
    Log retention: 1 year (exceed 180-day CERT-In minimum for alignment with DPDP).
    Log format: structured JSON with trace ID (W3C traceparent) in every line.

    OpenTelemetry agent: attach to the Spring Boot app; traces go to Grafana Tempo or Jaeger.

    Alert rules to configure from day one:
    - App availability < 99.5%
    - p95 latency > 2 s for 10 min
    - Disk usage > 75%
    - Certificate expiry < 30 days
    - Queue depth > 1,000 items aged > 5 min
    - Failed login rate > 5%
    - ClamAV scanner down > 10 min (critical)
    - Replication lag > 60 s (warn)

    AVOID: Any log line that contains a document content, FDR number in full, or personal data.
    AVOID: Sending logs outside India.
  </action>
  <verify>
    Prometheus shows metrics from the hello-world app.
    A test log line is searchable in Loki/OpenSearch.
    Triggering disk usage alert (mock threshold) fires a Grafana alert.
  </verify>
  <done>Observability stack deployed; metrics scraping; logs searchable; at least one alert fires correctly.</done>
</task>

</tasks>

<verification>
After all tasks:
- [ ] All 5 environments provisioned from IaC; drift check passes
- [ ] Pipeline: all 9 stages defined; secret scan blocks; critical CVE blocks
- [ ] Prometheus, Grafana, Loki deployed in India; log retention ≥ 1 year
- [ ] No secrets in IaC, no credentials in pipeline configs
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
- [ ] Plan 1.2 (Identity) and Plan 1.3 (Schema) can run in parallel
</success_criteria>
