import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const supabase = getSupabaseAdmin();
  const { sessionId, newStatus } = await request.json();

  if (sessionId === undefined || newStatus === undefined) {
    return NextResponse.json({ error: 'Missing sessionId or newStatus' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('workshop_sessions')
      .update({ is_active: newStatus })
      .eq('id', sessionId);

    if (error) throw error;

    return NextResponse.json({ message: 'Session status updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}