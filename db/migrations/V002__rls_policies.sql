-- V002__rls_policies.sql: PostgreSQL Row-Level Security Policies
-- Isolates institution tenants and regional jurisdiction

ALTER TABLE instrument ENABLE ROW LEVEL SECURITY;
ALTER TABLE instrument FORCE ROW LEVEL SECURITY;

-- Policy 1: Institution tenants can only view/mutate their own FDR records
CREATE POLICY institution_isolation_policy ON instrument
    FOR ALL
    USING (
        institution_id = NULLIF(current_setting('app.current_institution_id', true), '')
        OR current_setting('app.user_role', true) IN (
            'BUREAU_OFFICER', 
            'COMPETENT_AUTHORITY', 
            'AUDITOR', 
            'SYSTEM_ADMIN'
        )
    );

-- Policy 2: Regional Verifiers can view records in their assigned jurisdiction
CREATE POLICY regional_verifier_policy ON instrument
    FOR SELECT
    USING (
        current_setting('app.user_role', true) != 'REGIONAL_VERIFIER'
        OR institution_id IN (
            SELECT id FROM institution 
            WHERE regional_office = current_setting('app.current_region', true)
        )
    );
