import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const supabase = getSupabaseAdmin();
  const { sessionId, newStatus, eventId } = await request.json();

  try {
    // Step 1: Update the individual session's status
    const { error: sessionError } = await supabase
      .from('workshop_sessions')
      .update({ is_active: newStatus })
      .eq('id', sessionId);
    if (sessionError) throw sessionError;

    // Step 2: If we just activated a session, ensure its parent event is also active
    if (newStatus === true) {
      const { error: eventError } = await supabase
        .from('workshop_events')
        .update({ is_active: true })
        .eq('id', eventId);
      if (eventError) throw eventError;
    }

    return NextResponse.json({ message: 'Session status updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}