// Supabase Edge Function for creating Razorpay orders
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0"
import { encode as base64Encode } from "https://deno.land/std@0.208.0/encoding/base64.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { productId, email } = await req.json()

        if (!productId || !email) {
            return new Response(
                JSON.stringify({ error: 'productId and email are required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return new Response(
                JSON.stringify({ error: 'Invalid email format' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Create Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Get product details
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single()

        if (productError || !product) {
            return new Response(
                JSON.stringify({ error: 'Product not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (product.is_free) {
            return new Response(
                JSON.stringify({ error: 'This product is free. Use the free download endpoint.' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Create Razorpay order
        const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || Deno.env.get('VITE_RAZORPAY_KEY_ID')
        const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

        if (!razorpayKeyId || !razorpayKeySecret) {
            console.error('Razorpay credentials missing')
            return new Response(
                JSON.stringify({ error: 'Payment system not configured' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const auth = base64Encode(new TextEncoder().encode(`${razorpayKeyId}:${razorpayKeySecret}`))
        const amountInPaise = Math.round(product.price * 100)

        const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amountInPaise,
                currency: 'INR',
                receipt: `order_${Date.now()}`,
                notes: {
                    product_id: product.id,
                    product_name: product.name,
                    email: email,
                },
            }),
        })

        const razorpayOrder = await razorpayResponse.json()

        if (!razorpayResponse.ok) {
            console.error('Razorpay error:', razorpayOrder)
            return new Response(
                JSON.stringify({ error: 'Failed to create payment order' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Save order to database
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{
                product_id: product.id,
                user_email: email,
                amount: product.price,
                razorpay_order_id: razorpayOrder.id,
                status: 'pending',
            }])
            .select()
            .single()

        if (orderError) {
            console.error('Order save error:', orderError)
        }

        return new Response(
            JSON.stringify({
                razorpay_order_id: razorpayOrder.id,
                amount: amountInPaise,
                currency: 'INR',
                order_id: order?.id,
            }),
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
