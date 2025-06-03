
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

    // Validate input
    if (!job_id || !property_data) {
      throw new Error('Missing required parameters: job_id or property_data')
    }

    // Get the job info to find user_id
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('user_id')
      .eq('job_id', job_id)
      .single()

    if (jobError || !job) {
      console.error('Job fetch error:', jobError)
      throw new Error('Job not found')
    }

    // Get user's webhook settings
    const { data: webhookSettings, error: webhookError } = await supabase
      .from('webhook_settings')
      .select('script_generation_url')
      .eq('user_id', job.user_id)
      .maybeSingle()

    if (webhookError) {
      console.error('Error fetching webhook settings:', webhookError)
    }

    let scriptText = ''

    if (webhookSettings?.script_generation_url) {
      console.log('Calling external webhook:', webhookSettings.script_generation_url)
      
      try {
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
          throw new Error(`Webhook failed: ${webhookResponse.status} - ${webhookResponse.statusText}`)
        }

        const webhookData = await webhookResponse.json()
        console.log('Webhook response:', webhookData)
        scriptText = webhookData.script || ''
      } catch (webhookError) {
        console.error('Script generation webhook failed:', webhookError)
        // Continue with mock script if webhook fails
      }
    }

    // If no webhook script or webhook failed, generate mock script
    if (!scriptText) {
      console.log('No external webhook configured or webhook failed, generating mock script')
      
      const bedrooms = property_data.bedrooms || 'multiple'
      const bathrooms = property_data.bathrooms || 'multiple'
      const area = property_data.area || 'spacious'
      const price = property_data.price ? `$${property_data.price.toLocaleString()}` : 'competitively priced'
      const location = property_data.location || 'a great location'
      const description = property_data.description || 'modern amenities and excellent features'

      scriptText = `Welcome to this incredible ${bedrooms}-bedroom, ${bathrooms}-bathroom home located in ${location}.

This beautiful property spans ${area} square feet and offers ${description}

At ${price}, this home represents an exceptional opportunity for buyers looking for quality and value. The property features modern updates throughout, making it move-in ready for new owners.

Don't miss your chance to own this outstanding home. The combination of location, features, and price makes this a rare find in today's market.

Contact us today to schedule a viewing and make this dream home yours! This property won't last long in the current market.`
    }

    // Create or update video script
    const { data: existingScript } = await supabase
      .from('video_scripts')
      .select('id')
      .eq('job_id', job_id)
      .maybeSingle()

    if (existingScript) {
      const { error: updateError } = await supabase
        .from('video_scripts')
        .update({
          script_text: scriptText,
          language: 'English',
          accent: 'US',
          voice_id: 'en-us-female-1'
        })
        .eq('job_id', job_id)

      if (updateError) {
        console.error('Error updating script:', updateError)
        throw updateError
      }
    } else {
      const { error: insertError } = await supabase
        .from('video_scripts')
        .insert({
          job_id,
          script_text: scriptText,
          language: 'English',
          accent: 'US',
          voice_id: 'en-us-female-1'
        })

      if (insertError) {
        console.error('Error inserting script:', insertError)
        throw insertError
      }
    }

    // Update job status
    const { error: jobUpdateError } = await supabase
      .from('jobs')
      .update({ 
        status: 'script_ready',
        current_step: 3 
      })
      .eq('job_id', job_id)

    if (jobUpdateError) {
      console.error('Error updating job status:', jobUpdateError)
      throw jobUpdateError
    }

    console.log('Script generation completed successfully for job:', job_id)

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
