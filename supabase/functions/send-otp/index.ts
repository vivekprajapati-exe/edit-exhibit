import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const TURNSTILE_SECRET_KEY = Deno.env.get('TURNSTILE_SECRET_KEY') || '1x0000000000000000000000000000000AA'; // Test key

// Rate limit: 3 requests per hour per IP
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

interface RequestBody {
  email: string;
  productId: string;
  captchaToken: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Verify Cloudflare Turnstile token
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

// Check rate limit
async function checkRateLimit(supabase: any, ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW).toISOString();

  // Count requests in current window
  const { data: existingLimits, error } = await supabase
    .from('rate_limits')
    .select('request_count')
    .eq('ip_address', ip)
    .eq('endpoint', 'send-otp')
    .gte('window_start', windowStart);

  if (error) {
    console.error('Rate limit check error:', error);
    return { allowed: true, remaining: RATE_LIMIT_MAX }; // Fail open
  }

  const totalRequests = existingLimits?.reduce((sum: number, record: any) => sum + record.request_count, 0) || 0;
  const remaining = Math.max(0, RATE_LIMIT_MAX - totalRequests);

  return {
    allowed: totalRequests < RATE_LIMIT_MAX,
    remaining,
  };
}

// Record rate limit
async function recordRateLimit(supabase: any, ip: string): Promise<void> {
  const now = new Date().toISOString();

  await supabase
    .from('rate_limits')
    .insert({
      ip_address: ip,
      endpoint: 'send-otp',
      request_count: 1,
      window_start: now,
    });
}

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send email via Resend
async function sendOTPEmail(email: string, otp: string, productName: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Vivek Cuts <noreply@mail.vivekcuts.in>',
        to: [email],
        subject: `Your Verification Code: ${otp}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: 'Arial', sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                .header { text-align: center; margin-bottom: 40px; }
                .logo { font-size: 32px; font-weight: bold; letter-spacing: 2px; color: #ffffff; }
                .content { background-color: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 40px; }
                .otp-box { background-color: #ffffff; color: #000000; font-size: 36px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; margin: 30px 0; letter-spacing: 8px; }
                .message { font-size: 16px; line-height: 1.6; color: #cccccc; margin-bottom: 20px; }
                .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #666; }
                .warning { background-color: #331a1a; border-left: 4px solid #ff4444; padding: 15px; margin: 20px 0; border-radius: 4px; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">VIVEK CUTS</div>
                </div>
                <div class="content">
                  <h2 style="color: #ffffff; margin-top: 0;">Verification Code</h2>
                  <p class="message">
                    You requested to download <strong>${productName}</strong>. 
                    Use this verification code to complete your request:
                  </p>
                  <div class="otp-box">${otp}</div>
                  <p class="message">
                    This code will expire in <strong>10 minutes</strong>.
                    If you didn't request this, please ignore this email.
                  </p>
                  <div class="warning">
                    ⚠️ Never share this code with anyone. We will never ask for this code.
                  </div>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Vivek Cuts. All rights reserved.</p>
                  <p>This is an automated email. Please do not reply.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Resend API error:');
      console.error('Status:', response.status);
      console.error('Response:', JSON.stringify(errorData, null, 2));
      return false;
    }

    const successData = await response.json();
    console.log('✅ Email sent successfully:', successData);
    return true;
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get client IP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';

    // Check rate limit
    const rateLimit = await checkRateLimit(supabase, ip);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests. Please try again later.',
          remaining: 0,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { email, productId, captchaToken }: RequestBody = await req.json();

    // Validate input
    if (!email || !productId || !captchaToken) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify CAPTCHA
    const captchaValid = await verifyTurnstile(captchaToken, ip);
    if (!captchaValid) {
      return new Response(
        JSON.stringify({ error: 'CAPTCHA verification failed. Please try again.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('name, is_free')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify it's a free product
    if (!product.is_free) {
      return new Response(
        JSON.stringify({ error: 'This product requires purchase' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in database
    const { error: insertError } = await supabase
      .from('otp_verifications')
      .insert({
        email,
        otp_code: otp,
        product_id: productId,
        captcha_token: captchaToken,
        ip_address: ip,
      });

    if (insertError) {
      console.error('OTP insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate verification code' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Send email
    const emailSent = await sendOTPEmail(email, otp, product.name);
    if (!emailSent) {
      return new Response(
        JSON.stringify({ error: 'Failed to send verification email. Please try again.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Record rate limit
    await recordRateLimit(supabase, ip);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Verification code sent to your email',
        remaining: rateLimit.remaining - 1,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
