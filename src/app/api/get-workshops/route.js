import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const supabase = getSupabaseAdmin();

  try {
    // Fetch all sessions and include their parent event's details
    const { data, error } = await supabase
      .from('workshop_sessions')
      .select(`
        id,
        session_title,
        date,
        time,
        cost,
        workshop_events (
          id,
          title,
          artist_name,
          is_active
        )
      `)
      .order('date', { ascending: false }); // Show newest sessions first

    if (error) throw error;

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Error fetching workshop sessions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}