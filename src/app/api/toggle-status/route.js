import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const supabase = getSupabaseAdmin();
  const { eventId, newStatus } = await request.json();

  if (eventId === undefined || newStatus === undefined) {
    return NextResponse.json({ error: 'Missing eventId or newStatus' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('workshop_events')
      .update({ is_active: newStatus })
      .eq('id', eventId);

    if (error) throw error;

    return NextResponse.json({ message: 'Status updated successfully' });

  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}