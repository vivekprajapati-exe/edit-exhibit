-- Clear email_logs to reset rate limiting for testing
DELETE FROM email_logs;

-- Check remaining entries
SELECT COUNT(*) as remaining_logs FROM email_logs;
