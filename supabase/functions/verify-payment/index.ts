// Supabase Edge Function for verifying Razorpay payment
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Verify HMAC signature
async function verifySignature(
    orderId: string,
    paymentId: string,
    signature: string,
    secret: string
): Promise<boolean> {
    const body = `${orderId}|${paymentId}`
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

    return expectedSignature === signature
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json()

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return new Response(
                JSON.stringify({ error: 'Missing payment details' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Verify signature
        const razorpaySecret = Deno.env.get('RAZORPAY_KEY_SECRET')!
        const isValid = await verifySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            razorpaySecret
        )

        if (!isValid) {
            return new Response(
                JSON.stringify({ error: 'Invalid payment signature' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Create Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Get order details
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*, products(*)')
            .eq('razorpay_order_id', razorpay_order_id)
            .single()

        if (orderError || !order) {
            console.error('Order not found:', orderError)
            return new Response(
                JSON.stringify({ error: 'Order not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Update order status
        await supabase
            .from('orders')
            .update({
                status: 'completed',
                razorpay_payment_id: razorpay_payment_id,
            })
            .eq('id', order.id)

        // Generate signed URL (7 days for paid products)
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('products')
            .createSignedUrl(order.products.file_path_in_storage, 604800) // 7 days

        if (signedUrlError || !signedUrlData) {
            console.error('Signed URL error:', signedUrlError)
            return new Response(
                JSON.stringify({ error: 'Failed to generate download link' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Send email via Resend
        const resendApiKey = Deno.env.get('RESEND_API_KEY')
        const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'onboarding@resend.dev'

        const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: fromEmail,
                to: order.user_email,
                subject: `Your Purchase: ${order.products.name}`,
                html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You For Your Purchase</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #ffffff;">
  <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 2px solid #000000;">
    
    <!-- Header - Black background with white text -->
    <div style="background-color: #000000; color: #ffffff; padding: 48px 32px;">
      <div style="display: table; width: 100%; margin-bottom: 32px;">
        <div style="display: table-cell;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">VIVEK CUTS</h1>
        </div>
        <div style="display: table-cell; text-align: right; vertical-align: middle;">
          <div style="width: 8px; height: 8px; background-color: #ffffff; border-radius: 50%; display: inline-block;"></div>
        </div>
      </div>
      <p style="margin: 0; font-size: 14px; opacity: 0.9; font-weight: 300; letter-spacing: 0.5px;">
        Premium Editing Presets & Templates
      </p>
    </div>

    <!-- Main Content -->
    <div style="padding: 48px 32px; background-color: #ffffff;">
      
      <!-- Thank You Section -->
      <div style="margin-bottom: 48px;">
        <h2 style="font-size: 36px; font-weight: bold; margin: 0 0 24px 0; line-height: 1.2; color: #000000;">
          Your edits just went<span style="font-style: italic;"> hard.</span>
        </h2>
        <p style="font-size: 16px; color: rgba(0,0,0,0.8); line-height: 1.6; font-weight: 300; margin: 0;">
          yo, thanks for the love! your preset pack is literally about to transform your workflow. no cap—your content's about to hit different fr fr.
        </p>
      </div>

      <!-- Divider -->
      <div style="height: 2px; background-color: rgba(0,0,0,0.2); margin: 40px 0;"></div>

      <!-- Product Details Section -->
      <div style="margin-bottom: 48px;">
        <h3 style="font-size: 12px; font-weight: bold; letter-spacing: 2px; color: rgba(0,0,0,0.6); margin: 0 0 24px 0; text-transform: uppercase;">What You Got</h3>
        <div style="margin-bottom: 16px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-size: 14px; color: rgba(0,0,0,0.7);">Order ID</td>
              <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right; color: #000000;">#${order.id.slice(0, 8).toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 14px; color: rgba(0,0,0,0.7);">Product</td>
              <td style="padding: 8px 0; font-size: 14px; font-weight: 600; text-align: right; color: #000000;">${order.products.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 14px; color: rgba(0,0,0,0.7);">Total Amount</td>
              <td style="padding: 8px 0; font-size: 18px; font-weight: 600; text-align: right; color: #000000;">₹${order.products.price}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Divider -->
      <div style="height: 2px; background-color: rgba(0,0,0,0.2); margin: 40px 0;"></div>

      <!-- Download Resources -->
      <div style="margin-bottom: 48px;">
        <h3 style="font-size: 12px; font-weight: bold; letter-spacing: 2px; color: rgba(0,0,0,0.6); margin: 0 0 24px 0; text-transform: uppercase;">Access Your Products</h3>
        
        <!-- Download Button -->
        <a href="${signedUrlData.signedUrl}" style="display: block; background-color: rgba(0,0,0,0.05); border: 2px solid rgba(0,0,0,0.3); padding: 20px; text-decoration: none; margin-bottom: 16px; transition: all 0.2s;">
          <table style="width: 100%;">
            <tr>
              <td>
                <p style="margin: 0 0 4px 0; font-weight: bold; color: #000000; font-size: 14px;">DOWNLOAD PRESETS</p>
                <p style="margin: 0; font-size: 12px; color: rgba(0,0,0,0.6);">All files + installation guide</p>
              </td>
              <td style="text-align: right; vertical-align: middle; width: 20px;">
                <span style="color: #000000; font-size: 20px;">→</span>
              </td>
            </tr>
          </table>
        </a>

        <!-- Portfolio Link -->
        <a href="https://vivekcuts.in/portfolio" style="display: block; background-color: rgba(0,0,0,0.05); border: 2px solid rgba(0,0,0,0.3); padding: 20px; text-decoration: none; transition: all 0.2s;">
          <table style="width: 100%;">
            <tr>
              <td>
                <p style="margin: 0 0 4px 0; font-weight: bold; color: #000000; font-size: 14px;">VIEW PORTFOLIO</p>
                <p style="margin: 0; font-size: 12px; color: rgba(0,0,0,0.6);">Before & after showcase</p>
              </td>
              <td style="text-align: right; vertical-align: middle; width: 20px;">
                <span style="color: #000000; font-size: 20px;">→</span>
              </td>
            </tr>
          </table>
        </a>
      </div>

      <!-- Divider -->
      <div style="height: 2px; background-color: rgba(0,0,0,0.2); margin: 40px 0;"></div>

      <!-- CTA Buttons -->
      <div style="margin-bottom: 48px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding-right: 8px; width: 50%;">
              <a href="${signedUrlData.signedUrl}" style="display: block; text-align: center; background-color: #000000; color: #ffffff; padding: 16px 24px; font-weight: bold; font-size: 14px; letter-spacing: 0.5px; text-decoration: none; border: 2px solid #000000;">
                START DOWNLOADING
              </a>
            </td>
            <td style="padding-left: 8px; width: 50%;">
              <a href="https://vivekcuts.in/portfolio" style="display: block; text-align: center; background-color: #ffffff; color: #000000; padding: 16px 24px; font-weight: bold; font-size: 14px; letter-spacing: 0.5px; text-decoration: none; border: 2px solid #000000;">
                SEE THE MAGIC
              </a>
            </td>
          </tr>
        </table>
      </div>

      <!-- Tutorial Section -->
      <div style="background-color: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.2); padding: 24px; margin-bottom: 48px;">
        <p style="margin: 0; font-size: 13px; color: rgba(0,0,0,0.7); font-weight: 300; line-height: 1.6;">
          <span style="font-weight: 600; color: #000000;">real quick:</span> check out our youtube for installation tutorials + editing breakdown videos. we show you exactly how to get the most out of your presets. subscribe so you don't miss the new drops fr.
        </p>
      </div>

      <!-- Support CTA -->
      <div style="text-align: center; margin-bottom: 32px;">
        <p style="color: rgba(0,0,0,0.6); font-size: 14px; font-weight: 300; margin: 0 0 24px 0;">something not working? we got you</p>
        <a href="mailto:support@vivekcuts.in" style="display: inline-block; padding: 12px 24px; border: 2px solid #000000; color: #000000; font-weight: 600; font-size: 13px; letter-spacing: 0.5px; text-decoration: none; transition: all 0.2s;">
          GET HELP
        </a>
      </div>

      <!-- Divider -->
      <div style="height: 2px; background-color: rgba(0,0,0,0.2); margin: 40px 0;"></div>

      <!-- Footer -->
      <div style="text-align: center;">
        <p style="font-size: 13px; color: rgba(0,0,0,0.6); font-weight: 300; margin: 0 0 16px 0;">
          thanks for supporting the grind. appreciate it so much fr fr
        </p>
        <div style="padding-top: 16px;">
          <a href="#" style="color: rgba(0,0,0,0.6); text-decoration: none; font-size: 13px; margin: 0 12px;">Instagram</a>
          <a href="#" style="color: rgba(0,0,0,0.6); text-decoration: none; font-size: 13px; margin: 0 12px;">TikTok</a>
          <a href="#" style="color: rgba(0,0,0,0.6); text-decoration: none; font-size: 13px; margin: 0 12px;">YouTube</a>
        </div>
        <p style="padding-top: 16px; font-size: 12px; color: rgba(0,0,0,0.4); margin: 0;">
          © ${new Date().getFullYear()} Vivek Cuts. All rights reserved.
        </p>
        <p style="font-size: 11px; color: rgba(0,0,0,0.4); margin: 8px 0 0 0;">
          Download link expires in 7 days
        </p>
      </div>

    </div>
  </div>
</body>
</html>
        `,
            }),
        })

        // Log email
        await supabase.from('email_logs').insert([{
            user_email: order.user_email,
            product_name: order.products.name,
            status: emailResponse.ok ? 'sent' : 'failed',
        }])

        return new Response(
            JSON.stringify({ success: true, message: 'Payment verified. Check your email!' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error: any) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message || 'Something went wrong' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
