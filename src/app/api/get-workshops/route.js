import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  
  // Get query parameters for pagination and filtering
  const page = parseInt(searchParams.get('page') || '1', 10);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const SESSIONS_PER_PAGE = 10;
  const from = (page - 1) * SESSIONS_PER_PAGE;
  const to = from + SESSIONS_PER_PAGE - 1;

  try {
    // Start building the query
    let query = supabase
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
      `, { count: 'exact' }); // Get total count for pagination

    // Add date filters if they exist
    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }
    
    // Add sorting and pagination
    query = query.order('date', { ascending: false }).range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ data, count });

  } catch (error) {
    console.error('Error fetching workshop sessions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}