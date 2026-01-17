import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface RequestBody {
  email: string;
  otp: string;
  productId: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate signed URL for download (valid for 7 days)
async function generateDownloadLink(supabase: any, filePath: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('products')
      .createSignedUrl(filePath, 7 * 24 * 60 * 60); // 7 days

    if (error) {
      console.error('Signed URL error:', error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Download link generation error:', error);
    return null;
  }
}

// Send download link via email
async function sendDownloadEmail(email: string, productName: string, downloadLink: string): Promise<boolean> {
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
        subject: `Your Download Link - ${productName}`,
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
                .product-box { background-color: #2a2a2a; border: 1px solid #444; border-radius: 8px; padding: 20px; margin: 20px 0; }
                .product-name { font-size: 24px; font-weight: bold; color: #ffffff; margin-bottom: 10px; }
                .download-btn { display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; text-align: center; }
                .download-btn:hover { background-color: #e0e0e0; }
                .message { font-size: 16px; line-height: 1.6; color: #cccccc; margin-bottom: 20px; }
                .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #666; }
                .info-box { background-color: #1a3a1a; border-left: 4px solid #44ff44; padding: 15px; margin: 20px 0; border-radius: 4px; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">VIVEK CUTS</div>
                </div>
                <div class="content">
                  <h2 style="color: #ffffff; margin-top: 0;">🎉 Your Download is Ready!</h2>
                  <p class="message">
                    Thank you for choosing Vivek Cuts! Your download link for <strong>${productName}</strong> is ready.
                  </p>
                  
                  <div class="product-box">
                    <div class="product-name">${productName}</div>
                    <p style="color: #999; margin: 0;">Free Digital Asset</p>
                  </div>

                  <div style="text-align: center;">
                    <a href="${downloadLink}" class="download-btn">⬇️ DOWNLOAD NOW</a>
                  </div>

                  <div class="info-box">
                    <strong>📌 Important Information:</strong>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                      <li>This download link is valid for <strong>7 days</strong></li>
                      <li>File format may be ZIP, RAR, or 7Z</li>
                      <li>Extract files after downloading</li>
                      <li>Check the included README for usage instructions</li>
                    </ul>
                  </div>

                  <p class="message">
                    Need help or have questions? Reply to this email and we'll be happy to assist you.
                  </p>

                  <p class="message" style="font-size: 14px; color: #999;">
                    If you didn't request this download, you can safely ignore this email.
                  </p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Vivek Cuts. All rights reserved.</p>
                  <p>Professional video editing assets for creators</p>
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

    const { email, otp, productId }: RequestBody = await req.json();

    // Validate input
    if (!email || !otp || !productId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Find valid OTP
    const { data: otpRecords, error: otpError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('email', email)
      .eq('product_id', productId)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (otpError || !otpRecords || otpRecords.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired verification code' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const otpRecord = otpRecords[0];

    // Check max attempts
    if (otpRecord.attempts >= otpRecord.max_attempts) {
      return new Response(
        JSON.stringify({ error: 'Maximum verification attempts exceeded. Please request a new code.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify OTP
    if (otpRecord.otp_code !== otp) {
      // Increment attempts
      await supabase
        .from('otp_verifications')
        .update({ attempts: otpRecord.attempts + 1 })
        .eq('id', otpRecord.id);

      const remainingAttempts = otpRecord.max_attempts - otpRecord.attempts - 1;
      return new Response(
        JSON.stringify({
          error: 'Invalid verification code',
          remainingAttempts,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Mark OTP as verified
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', otpRecord.id);

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
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

    // Generate download link
    const downloadLink = await generateDownloadLink(supabase, product.file_path_in_storage);
    if (!downloadLink) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate download link' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Send download email
    const emailSent = await sendDownloadEmail(email, product.name, downloadLink);
    if (!emailSent) {
      return new Response(
        JSON.stringify({
          error: 'Failed to send email, but here is your download link',
          downloadLink,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Log email
    await supabase.from('email_logs').insert({
      user_email: email,
      product_name: product.name,
      status: 'sent',
    });

    // Create order record for free product
    await supabase.from('orders').insert({
      user_email: email,
      product_id: productId,
      status: 'completed',
      amount: 0,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Download link sent to your email',
        downloadLink,
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
