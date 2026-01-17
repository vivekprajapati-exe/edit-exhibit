// Supabase Edge Function for sending free assets via email
// Uses Deno runtime (production-ready, used by Supabase, Netlify, etc.)
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        console.log('🚀 STARTING SEND-FREE-ASSET FUNCTION')

        const requestBody = await req.json()
        console.log('📦 Request body:', JSON.stringify(requestBody))

        const { email, productId } = requestBody

        if (!email || !productId) {
            console.error('❌ Missing email or productId')
            return new Response(
                JSON.stringify({ error: 'Email and productId are required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log('✅ STEP 1: Email:', email, 'ProductId:', productId)

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            console.error('❌ Invalid email format:', email)
            return new Response(
                JSON.stringify({ error: 'Invalid email format' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log('✅ STEP 2: Email format valid')

        // Create Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        console.log('🔑 Supabase URL:', supabaseUrl)
        console.log('🔑 Service Key exists:', !!supabaseServiceKey)

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('❌ Missing Supabase credentials')
            return new Response(
                JSON.stringify({ error: 'Server configuration error' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        console.log('✅ STEP 3: Supabase client created')

        // Get product details
        console.log('📦 Fetching product:', productId)
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single()

        if (productError) {
            console.error('❌ Product fetch error:', productError)
            return new Response(
                JSON.stringify({ error: 'Product fetch failed: ' + productError.message }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (!product) {
            console.error('❌ Product not found')
            return new Response(
                JSON.stringify({ error: 'Product not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log('✅ STEP 4: Product found:', product.name)

        // Verify it's a free product
        if (!product.is_free) {
            console.error('❌ Product is not free')
            return new Response(
                JSON.stringify({ error: 'This product is not free' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log('✅ STEP 5: Product is free')

        // Generate signed URL (24 hours)
        console.log('🔗 Generating signed URL for:', product.file_path_in_storage)
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('products')
            .createSignedUrl(product.file_path_in_storage, 86400)

        if (signedUrlError) {
            console.error('❌ Signed URL error:', signedUrlError)
            return new Response(
                JSON.stringify({ error: 'Signed URL failed: ' + signedUrlError.message }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (!signedUrlData) {
            console.error('❌ No signed URL data returned')
            return new Response(
                JSON.stringify({ error: 'Failed to generate download link' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log('✅ STEP 6: Signed URL generated')

        // Send email via Resend
        const resendApiKey = Deno.env.get('RESEND_API_KEY')
        const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'onboarding@resend.dev'

        console.log('📧 Resend API Key exists:', !!resendApiKey)
        console.log('📧 From email:', fromEmail)

        if (!resendApiKey) {
            console.error('❌ Missing Resend API key')
            return new Response(
                JSON.stringify({ error: 'Email service not configured' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log('✅ STEP 7: Sending email...')

        const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: fromEmail,
                to: email,
                subject: `Your Free Download: ${product.name}`,
                html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; padding: 40px; margin: 0;">
              <div style="max-width: 600px; margin: 0 auto; background: #1a1a1a; padding: 40px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                <h1 style="font-size: 28px; letter-spacing: 2px; margin-bottom: 20px; text-transform: uppercase;">YOUR FREE ASSET IS READY</h1>
                <p style="color: #ccc; font-size: 16px;">Thanks for downloading <strong>${product.name}</strong>!</p>
                <p style="color: #999; font-size: 14px; margin-bottom: 30px;">${product.description}</p>
                <a href="${signedUrlData.signedUrl}" style="display: inline-block; background: #ffffff; color: #000000; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Download Now</a>
                <p style="color: #666; font-size: 12px; margin-top: 30px;">⏱️ This link expires in 24 hours</p>
                <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;">
                <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Vivek Cuts. All rights reserved.</p>
              </div>
            </body>
          </html>
        `,
            }),
        })

        const emailResult = await emailResponse.json()
        console.log('📧 Email response status:', emailResponse.status)
        console.log('📧 Email result:', JSON.stringify(emailResult))

        if (!emailResponse.ok) {
            console.error('❌ Email send failed:', emailResult)
            return new Response(
                JSON.stringify({ error: 'Email send failed: ' + (emailResult.message || 'Unknown error') }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log('✅ STEP 8: Email sent successfully!')

        // Log email
        try {
            await supabase.from('email_logs').insert([{
                user_email: email,
                product_name: product.name,
                status: 'sent',
                error_message: null,
            }])
            console.log('✅ STEP 9: Email log saved')
        } catch (logError: any) {
            console.error('⚠️ Failed to log email (non-critical):', logError)
        }

        console.log('🎉 SUCCESS: All steps completed!')
        return new Response(
            JSON.stringify({ success: true, message: 'Check your email for the download link!' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error: any) {
        console.error('💥 FATAL ERROR:', error)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
        return new Response(
            JSON.stringify({
                error: 'Server error: ' + error.message,
                stack: error.stack?.split('\n')[0]
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
