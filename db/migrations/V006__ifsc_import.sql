-- V006__ifsc_import.sql: RBI Scheduled Bank & Branch Directory Master

CREATE TABLE IF NOT EXISTS bank_branch_directory (
    ifsc_code VARCHAR(16) PRIMARY KEY,
    bank_name VARCHAR(128) NOT NULL,
    branch_name VARCHAR(128) NOT NULL,
    address TEXT,
    city VARCHAR(64) NOT NULL,
    district VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    is_scheduled_commercial BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bank_branch_name ON bank_branch_directory(bank_name);
CREATE INDEX IF NOT EXISTS idx_bank_branch_scheduled ON bank_branch_directory(is_scheduled_commercial);
