-- The points ledger and audit log are append-only. Corrections are made by
-- inserting compensating rows, never by editing or deleting history.
CREATE OR REPLACE FUNCTION reject_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION '% is append-only (% rejected)', TG_TABLE_NAME, TG_OP;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER point_transactions_append_only
  BEFORE UPDATE OR DELETE ON point_transactions
  FOR EACH ROW EXECUTE FUNCTION reject_mutation();
--> statement-breakpoint
CREATE TRIGGER point_transactions_no_truncate
  BEFORE TRUNCATE ON point_transactions
  FOR EACH STATEMENT EXECUTE FUNCTION reject_mutation();
--> statement-breakpoint
CREATE TRIGGER audit_log_append_only
  BEFORE UPDATE OR DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION reject_mutation();
--> statement-breakpoint
CREATE TRIGGER audit_log_no_truncate
  BEFORE TRUNCATE ON audit_log
  FOR EACH STATEMENT EXECUTE FUNCTION reject_mutation();
--> statement-breakpoint
ALTER TABLE point_transactions
  ADD CONSTRAINT point_transactions_reverses_fk
  FOREIGN KEY (reverses_id) REFERENCES point_transactions(id);
