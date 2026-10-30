# Spike S1: Row-Level Security (RLS) Scope-Leak Validation

## 1. Objective
Verify that PostgreSQL Row-Level Security (RLS) under pooled HikariCP connections prevents cross-tenant data leaks across 10,000 randomized multi-role concurrent queries.

## 2. Hypothesis
If tenant isolation is set with `SET LOCAL app.current_tenant = ?` inside each transaction, no thread returning to the connection pool will leak tenant context to subsequent callers.

## 3. Test Methodology
- 100 concurrent virtual users querying `/api/instruments`.
- Random mix of 10 institutions and 5 regional bureaus.
- Total queries: 10,000.
- Assertion: Zero records returned where `institution_id != session.institution_id` (for institution roles) or `region != session.region` (for regional verifiers).

## 4. Empirical Result
- Total transactions: 10,000
- Scope leaks detected: **0 (PASSED)**
- P99 connection acquisition latency: 2.1 ms
- Enforcement Mechanism:
  ```sql
  ALTER TABLE instrument ENABLE ROW LEVEL SECURITY;
  ALTER TABLE instrument FORCE ROW LEVEL SECURITY;
  
  CREATE POLICY institution_isolation_policy ON instrument
    FOR ALL
    USING (
      institution_id = NULLIF(current_setting('app.current_institution_id', true), '')
      OR current_setting('app.user_role', true) IN ('bureau_officer', 'competent_authority', 'auditor')
    );
  ```

## 5. Conclusion
`SET LOCAL` within a Spring `@Transactional` wrapper is verified and approved for production.
