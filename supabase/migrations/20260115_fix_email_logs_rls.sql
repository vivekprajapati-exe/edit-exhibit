-- Fix email_logs table RLS policy for Edge Functions
-- This allows the service role (Edge Functions) to insert logs for ANY email

-- Drop existing restrictive policy if exists
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON email_logs;
DROP POLICY IF EXISTS "Enable insert for service role" ON email_logs;

-- Allow Edge Functions (service role) to insert email logs for any user
CREATE POLICY "Service role can insert email logs"
ON email_logs
FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow users to view their own email logs
CREATE POLICY "Users can view own email logs"
ON email_logs
FOR SELECT
TO authenticated
USING (user_email = auth.email());

-- Allow service role to select all (for admin purposes)
CREATE POLICY "Service role can view all email logs"
ON email_logs
FOR SELECT
TO service_role
USING (true);
