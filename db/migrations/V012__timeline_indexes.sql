-- V012__timeline_indexes.sql: Timeline Query Optimization & Escalation Indexes

CREATE INDEX IF NOT EXISTS idx_timeline_maturity_status ON instrument(maturity_date, status);
CREATE INDEX IF NOT EXISTS idx_timeline_lien_trust ON instrument(lien_marked, trust_level);
