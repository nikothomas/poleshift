/**
 * @cors
 */

import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Or specify your frontend's origin
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  try {
    // Get the JWT token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    const jwt = authHeader?.split(' ')[1];

    if (!jwt) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { licenseKey } = await req.json();

    if (!licenseKey) {
      return new Response(
        JSON.stringify({ error: 'License key is required.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Initialize Supabase client with JWT token
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    // Initialize Supabase Admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get the user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = user.id;

    // Verify the license key using the admin client
    const { data: licenseData, error: licenseError } = await supabaseAdmin
      .from('license_keys')
      .select('organization_id')
      .eq('key', licenseKey)
      .eq('is_active', true)
      .single();

    if (licenseError || !licenseData) {
      return new Response(
        JSON.stringify({ error: 'Invalid or inactive license key.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const organizationId = licenseData.organization_id;

    // Update or Insert into user_profiles using the admin client
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        id: userId,
        organization_id: organizationId,
        user_tier: 'researcher', // Default tier; adjust as needed
      });

    if (profileError) {
      return new Response(JSON.stringify({ error: profileError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return success response
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in processing license key:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
