-- V005__institution_sync_log.sql: Institution Master Sync & Historical Aliases

CREATE TABLE IF NOT EXISTS institution_sync_log (
    id VARCHAR(36) PRIMARY KEY,
    sync_started_at TIMESTAMPTZ NOT NULL,
    sync_finished_at TIMESTAMPTZ,
    records_processed INT NOT NULL DEFAULT 0,
    records_updated INT NOT NULL DEFAULT 0,
    records_failed INT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'RUNNING',
    error_summary TEXT
);

CREATE TABLE IF NOT EXISTS institution_alias_history (
    id VARCHAR(36) PRIMARY KEY,
    institution_id VARCHAR(36) NOT NULL REFERENCES institution(id),
    previous_name VARCHAR(255) NOT NULL,
    new_name VARCHAR(255) NOT NULL,
    gazette_notification_ref VARCHAR(128),
    effective_date DATE NOT NULL,
    verified_by_officer VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alias_history_inst ON institution_alias_history(institution_id);
