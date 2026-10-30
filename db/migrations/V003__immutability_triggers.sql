-- V003__immutability_triggers.sql: Database-level Immutability Guards
-- Forbids UPDATE and DELETE on accepted instruments and audit ledger rows

CREATE OR REPLACE FUNCTION prevent_audit_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'SECURITY BREACH DETECTED: Modification or deletion of audit_event is prohibited by sovereign statute.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_ledger_immutable_guard
BEFORE UPDATE OR DELETE ON audit_event
FOR EACH ROW EXECUTE FUNCTION prevent_audit_tampering();

-- Protect approved/released instruments from retroactive modification
CREATE OR REPLACE FUNCTION protect_released_instruments()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IN ('RELEASE_APPROVED', 'NOC_ISSUED') THEN
        IF TG_OP = 'DELETE' THEN
            RAISE EXCEPTION 'Cannot delete instrument with issued NOC.';
        END IF;
        IF OLD.amount != NEW.amount OR OLD.fdr_number != NEW.fdr_number THEN
            RAISE EXCEPTION 'Financial terms of an endorsed/released instrument are immutable.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER instrument_protection_guard
BEFORE UPDATE OR DELETE ON instrument
FOR EACH ROW EXECUTE FUNCTION protect_released_instruments();
