import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const supabase = getSupabaseAdmin();
  const { eventId } = await request.json();

  if (!eventId) {
    return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });
  }

  try {
    // Supabase is configured with cascading deletes, so deleting the event
    // will automatically delete all of its sessions.
    const { error } = await supabase
      .from('workshop_events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;

    return NextResponse.json({ message: 'Workshop event and all its sessions deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}