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

    // Step 2: Apply cascading logic
    if (newStatus === true) {
      // If a session is activated, ensure its parent event is also active
      const { error: eventError } = await supabase
        .from('workshop_events')
        .update({ is_active: true })
        .eq('id', eventId);
      if (eventError) throw eventError;
    } else {
      // If a session is deactivated, check if all other sessions for this event are also inactive
      const { data: otherSessions, error: fetchError } = await supabase
        .from('workshop_sessions')
        .select('is_active')
        .eq('event_id', eventId);

      if (fetchError) throw fetchError;

      const allInactive = otherSessions.every(s => s.is_active === false);

      if (allInactive) {
        // If all sessions are inactive, deactivate the parent event
        const { error: eventError } = await supabase
          .from('workshop_events')
          .update({ is_active: false })
          .eq('id', eventId);
        if (eventError) throw eventError;
      }
    }

    return NextResponse.json({ message: 'Session status updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}