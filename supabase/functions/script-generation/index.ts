
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

    const { job_id, property_data } = await req.json()
    console.log('Script generation triggered for job:', job_id)

    // Get the job info to find user_id
    const { data: job } = await supabase
      .from('jobs')
      .select('user_id')
      .eq('job_id', job_id)
      .single()

    if (!job) {
      throw new Error('Job not found')
    }

    // Get user's webhook settings
    const { data: webhookSettings } = await supabase
      .from('webhook_settings')
      .select('script_generation_url')
      .eq('user_id', job.user_id)
      .single()

    let scriptText = ''

    if (webhookSettings?.script_generation_url) {
      console.log('Calling external webhook:', webhookSettings.script_generation_url)
      
      // Call external webhook
      const webhookResponse = await fetch(webhookSettings.script_generation_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id,
          property_data,
          timestamp: new Date().toISOString()
        })
      })

      if (!webhookResponse.ok) {
        throw new Error(`Webhook failed: ${webhookResponse.status}`)
      }

      const webhookData = await webhookResponse.json()
      console.log('Webhook response:', webhookData)
      scriptText = webhookData.script || ''
    } else {
      console.log('No external webhook configured, generating mock script')
      
      // Generate mock script based on property data
      scriptText = `Welcome to this amazing ${property_data.bedrooms}-bedroom, ${property_data.bathrooms}-bathroom home located at ${property_data.location}. 

This beautiful property spans ${property_data.area} square feet and offers modern living at its finest. Priced at $${property_data.price?.toLocaleString()}, this home features ${property_data.description}

Don't miss this opportunity to own a piece of paradise. Contact us today to schedule a viewing and make this dream home yours!`
    }

    // Create or update video script
    const { data: existingScript } = await supabase
      .from('video_scripts')
      .select('id')
      .eq('job_id', job_id)
      .maybeSingle()

    if (existingScript) {
      await supabase
        .from('video_scripts')
        .update({
          script_text: scriptText,
          language: 'English',
          accent: 'US',
          voice_id: 'en-us-female-1'
        })
        .eq('job_id', job_id)
    } else {
      await supabase
        .from('video_scripts')
        .insert({
          job_id,
          script_text: scriptText,
          language: 'English',
          accent: 'US',
          voice_id: 'en-us-female-1'
        })
    }

    // Update job status
    await supabase
      .from('jobs')
      .update({ 
        status: 'script_ready',
        current_step: 3 
      })
      .eq('job_id', job_id)

    return new Response(
      JSON.stringify({ success: true, job_id, script_text: scriptText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Script generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
