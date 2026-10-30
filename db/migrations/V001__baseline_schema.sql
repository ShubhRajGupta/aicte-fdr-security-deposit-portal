-- V001__baseline_schema.sql: AICTE Central Security Deposit & FDR Management Baseline Schema
-- Enforces ISO standards, exact NUMERIC currency, and UTC timestamps with IST dates

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Institution Master
CREATE TABLE IF NOT EXISTS institution (
    id VARCHAR(36) PRIMARY KEY,
    aicte_permanent_id VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    district VARCHAR(64) NOT NULL,
    regional_office VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Security Deposit Instrument Registry
CREATE TABLE IF NOT EXISTS instrument (
    id VARCHAR(36) PRIMARY KEY,
    institution_id VARCHAR(36) NOT NULL REFERENCES institution(id),
    fdr_number VARCHAR(128) NOT NULL,
    bank_name VARCHAR(128) NOT NULL,
    branch_name VARCHAR(128) NOT NULL,
    ifsc_code VARCHAR(16) NOT NULL,
    amount NUMERIC(18, 2) NOT NULL CHECK (amount > 0),
    deposit_date DATE NOT NULL,
    maturity_date DATE NOT NULL,
    tenor_years INT NOT NULL,
    interest_rate NUMERIC(5, 2) NOT NULL,
    joint_holder_name VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    trust_level VARCHAR(16) NOT NULL DEFAULT 'L0',
    receipt_doc_url TEXT,
    lien_marked BOOLEAN NOT NULL DEFAULT FALSE,
    risk_score INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_dates CHECK (maturity_date > deposit_date)
);

-- 3. Cryptographic Tamper-Evident Audit Ledger
CREATE TABLE IF NOT EXISTS audit_event (
    id VARCHAR(36) PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actor_name VARCHAR(128) NOT NULL,
    actor_role VARCHAR(64) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    details TEXT NOT NULL,
    previous_hash VARCHAR(64) NOT NULL,
    current_hash VARCHAR(64) NOT NULL,
    before_state JSONB,
    after_state JSONB,
    ip_address VARCHAR(45)
);
