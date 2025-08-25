import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const supabase = getSupabaseAdmin();
  const { eventId, newStatus } = await request.json();

  try {
    // Step 1: Update the main event's status
    const { error: eventError } = await supabase
      .from('workshop_events')
      .update({ is_active: newStatus })
      .eq('id', eventId);
    if (eventError) throw eventError;

    // Step 2: Cascade the update to all child sessions
    const { error: sessionError } = await supabase
      .from('workshop_sessions')
      .update({ is_active: newStatus })
      .eq('event_id', eventId);
    if (sessionError) throw sessionError;

    return NextResponse.json({ message: 'Event and all sessions updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}