import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Helper to create a Supabase admin client
const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const supabase = getSupabaseAdmin();

  try {
    // Fetch all events and a count of their related sessions
    const { data, error } = await supabase
      .from('workshop_events')
      .select(`
        id,
        title,
        artist_name,
        is_active,
        workshop_sessions ( date, time )
      `)
      .order('created_at', { ascending: false }); // Show newest first

    if (error) throw error;

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Error fetching workshops:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}