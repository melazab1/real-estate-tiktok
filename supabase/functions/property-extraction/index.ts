
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { job_id, property_url, user_id } = await req.json()
    console.log('Property extraction triggered for job:', job_id)

    // Get user's webhook settings
    const { data: webhookSettings } = await supabase
      .from('webhook_settings')
      .select('property_extraction_url')
      .eq('user_id', user_id)
      .single()

    if (webhookSettings?.property_extraction_url) {
      console.log('Calling external webhook:', webhookSettings.property_extraction_url)
      
      // Call external webhook
      const webhookResponse = await fetch(webhookSettings.property_extraction_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id,
          property_url,
          user_id,
          timestamp: new Date().toISOString()
        })
      })

      if (!webhookResponse.ok) {
        throw new Error(`Webhook failed: ${webhookResponse.status}`)
      }

      const webhookData = await webhookResponse.json()
      console.log('Webhook response:', webhookData)

      // If webhook returns property data, save it
      if (webhookData.property_data) {
        await supabase
          .from('properties')
          .insert({
            job_id,
            title: webhookData.property_data.title,
            description: webhookData.property_data.description,
            price: webhookData.property_data.price,
            location: webhookData.property_data.location,
            bedrooms: webhookData.property_data.bedrooms,
            bathrooms: webhookData.property_data.bathrooms,
            area: webhookData.property_data.area
          })

        // Update job status
        await supabase
          .from('jobs')
          .update({ 
            status: 'extracted',
            current_step: 2 
          })
          .eq('job_id', job_id)
      }
    } else {
      console.log('No external webhook configured, using mock data')
      
      // Simulate property extraction with mock data
      const mockPropertyData = {
        title: `Property at ${property_url}`,
        description: 'Beautiful property with modern amenities and excellent location.',
        price: 500000,
        location: 'Main Street, City Center',
        bedrooms: 3,
        bathrooms: 2,
        area: 1500
      }

      await supabase
        .from('properties')
        .insert({
          job_id,
          ...mockPropertyData
        })

      // Update job status
      await supabase
        .from('jobs')
        .update({ 
          status: 'extracted',
          current_step: 2 
        })
        .eq('job_id', job_id)
    }

    return new Response(
      JSON.stringify({ success: true, job_id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Property extraction error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
