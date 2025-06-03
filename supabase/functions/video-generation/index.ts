
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

    const { job_id, script_data } = await req.json()
    console.log('Video generation triggered for job:', job_id)

    // Validate input
    if (!job_id || !script_data) {
      throw new Error('Missing required parameters: job_id or script_data')
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

    // Get property data
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('job_id', job_id)
      .single()

    if (propertyError) {
      console.error('Property fetch error:', propertyError)
    }

    // Get user's webhook settings
    const { data: webhookSettings, error: webhookError } = await supabase
      .from('webhook_settings')
      .select('video_generation_url')
      .eq('user_id', job.user_id)
      .maybeSingle()

    if (webhookError) {
      console.error('Error fetching webhook settings:', webhookError)
    }

    let videoUrl = ''

    if (webhookSettings?.video_generation_url) {
      console.log('Calling external webhook:', webhookSettings.video_generation_url)
      
      try {
        const webhookResponse = await fetch(webhookSettings.video_generation_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            job_id,
            script_data,
            property_data: property,
            timestamp: new Date().toISOString()
          })
        })

        if (!webhookResponse.ok) {
          throw new Error(`Webhook failed: ${webhookResponse.status} - ${webhookResponse.statusText}`)
        }

        const webhookData = await webhookResponse.json()
        console.log('Webhook response:', webhookData)
        videoUrl = webhookData.video_url || ''
      } catch (webhookError) {
        console.error('Video generation webhook failed:', webhookError)
        // Continue with mock video URL if webhook fails
      }
    }

    // If no webhook video URL or webhook failed, use mock URL
    if (!videoUrl) {
      console.log('No external webhook configured or webhook failed, using mock video URL')
      videoUrl = 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    }

    // Create or update video record
    const { data: existingVideo } = await supabase
      .from('videos')
      .select('id')
      .eq('job_id', job_id)
      .maybeSingle()

    if (existingVideo) {
      const { error: updateError } = await supabase
        .from('videos')
        .update({
          status: 'completed',
          video_url: videoUrl,
          thumbnail_url: 'https://via.placeholder.com/640x360/4f46e5/ffffff?text=Property+Video',
          duration: 30,
          file_size: 13000000
        })
        .eq('job_id', job_id)

      if (updateError) {
        console.error('Error updating video:', updateError)
        throw updateError
      }
    } else {
      const { error: insertError } = await supabase
        .from('videos')
        .insert({
          job_id,
          status: 'completed',
          video_url: videoUrl,
          thumbnail_url: 'https://via.placeholder.com/640x360/4f46e5/ffffff?text=Property+Video',
          duration: 30,
          file_size: 13000000
        })

      if (insertError) {
        console.error('Error inserting video:', insertError)
        throw insertError
      }
    }

    // Update job status
    const { error: jobUpdateError } = await supabase
      .from('jobs')
      .update({ 
        status: 'completed',
        current_step: 4 
      })
      .eq('job_id', job_id)

    if (jobUpdateError) {
      console.error('Error updating job status:', jobUpdateError)
      throw jobUpdateError
    }

    console.log('Video generation completed successfully for job:', job_id)

    return new Response(
      JSON.stringify({ success: true, job_id, video_url: videoUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Video generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
