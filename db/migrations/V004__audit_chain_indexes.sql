-- V004__audit_chain_indexes.sql: Indexes for High-Speed Hash Chain Verification
-- Optimizes daily verification and audit queries

CREATE INDEX IF NOT EXISTS idx_audit_event_timestamp ON audit_event(timestamp ASC);
CREATE INDEX IF NOT EXISTS idx_audit_event_entity ON audit_event(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_event_hashes ON audit_event(previous_hash, current_hash);
CREATE INDEX IF NOT EXISTS idx_instrument_institution ON instrument(institution_id);
CREATE INDEX IF NOT EXISTS idx_instrument_fdr_num ON instrument(fdr_number);
CREATE INDEX IF NOT EXISTS idx_instrument_status ON instrument(status);
CREATE INDEX IF NOT EXISTS idx_instrument_maturity ON instrument(maturity_date);
