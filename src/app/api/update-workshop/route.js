import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const supabase = getSupabaseAdmin();

  try {
    const formData = await request.formData();
    const eventId = formData.get('eventId');
    const title = formData.get('title');
    const artist_name = formData.get('artist_name');
    const razorpay_link = formData.get('razorpay_link');
    const is_active = formData.get('is_active') === 'true';
    const sessions = JSON.parse(formData.get('sessions'));

    // 1. Update the main workshop_event table
    const { error: eventError } = await supabase
      .from('workshop_events')
      .update({ 
        title, 
        artist_name, 
        razorpay_link, 
        is_active 
      })
      .eq('id', eventId);

    if (eventError) throw eventError;

    // 2. Delete all existing sessions for this event to start fresh
    const { error: deleteError } = await supabase
      .from('workshop_sessions')
      .delete()
      .eq('event_id', eventId);

    if (deleteError) throw deleteError;

    // 3. Insert the new, updated list of sessions
    const sessionsToInsert = sessions.map(session => ({
      session_title: session.session_title,
      date: session.date,
      time: session.time,
      cost: session.cost,
      event_id: eventId,
    }));

    const { error: sessionsError } = await supabase
      .from('workshop_sessions')
      .insert(sessionsToInsert);

    if (sessionsError) throw sessionsError;

    return NextResponse.json({ message: 'Workshop updated successfully' });

  } catch (error) {
    console.error('Error updating workshop:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}