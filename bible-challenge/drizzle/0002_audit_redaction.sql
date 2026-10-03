-- Allow one narrow exception to the append-only audit log: when a student's
-- personal data is removed, the `details` of audit rows about them may be
-- replaced with a redaction marker. This only works inside a transaction that
-- explicitly sets app.redact_audit = 'on', and no other column may change.
CREATE OR REPLACE FUNCTION audit_log_guard() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND current_setting('app.redact_audit', true) = 'on'
     AND NEW.id = OLD.id
     AND NEW.actor_id IS NOT DISTINCT FROM OLD.actor_id
     AND NEW.action = OLD.action
     AND NEW.target_type IS NOT DISTINCT FROM OLD.target_type
     AND NEW.target_id IS NOT DISTINCT FROM OLD.target_id
     AND NEW.created_at = OLD.created_at
     AND NEW.details = '{"redacted": true}'::jsonb THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'audit_log is append-only (% rejected)', TG_OP;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
DROP TRIGGER IF EXISTS audit_log_append_only ON audit_log;
--> statement-breakpoint
CREATE TRIGGER audit_log_append_only
  BEFORE UPDATE OR DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION audit_log_guard();
