-- =============================================
-- OTP VERIFICATION TABLE
-- Store temporary OTP codes for email verification
-- =============================================

CREATE TABLE IF NOT EXISTS otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  product_id UUID REFERENCES products(id),
  captcha_token TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 minutes'),
  verified BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3
);

-- Enable RLS
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

-- Only service role can manage OTP verifications
CREATE POLICY "Service role can manage OTP verifications"
  ON otp_verifications
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create index for faster lookups
CREATE INDEX idx_otp_email_verified ON otp_verifications(email, verified);
CREATE INDEX idx_otp_expires ON otp_verifications(expires_at);

-- =============================================
-- RATE LIMITING TABLE
-- Track API requests to prevent abuse
-- =============================================

CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can manage rate limits
CREATE POLICY "Service role can manage rate limits"
  ON rate_limits
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create unique index for IP + endpoint combination
CREATE UNIQUE INDEX idx_rate_limit_ip_endpoint ON rate_limits(ip_address, endpoint, window_start);

-- Create index for cleanup
CREATE INDEX idx_rate_limit_window ON rate_limits(window_start);

-- =============================================
-- CLEANUP FUNCTION
-- Automatically delete expired OTPs and old rate limit records
-- =============================================

CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
  -- Delete expired OTPs (older than 1 hour)
  DELETE FROM otp_verifications
  WHERE created_at < NOW() - INTERVAL '1 hour';

  -- Delete old rate limit records (older than 24 hours)
  DELETE FROM rate_limits
  WHERE window_start < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SCHEDULED CLEANUP (Optional - requires pg_cron extension)
-- Run cleanup every hour
-- =============================================

-- Note: Uncomment below if you have pg_cron extension enabled
-- SELECT cron.schedule(
--   'cleanup-expired-data',
--   '0 * * * *',  -- Every hour
--   'SELECT cleanup_expired_data();'
-- );
