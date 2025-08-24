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
    const title = formData.get('title');
    const artist_name = formData.get('artist_name');
    const is_active = formData.get('is_active') === 'true';
    const imageFile = formData.get('image');
    const sessions = JSON.parse(formData.get('sessions'));

    // 1. Upload Image (same as before)
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage.from('workshop-posters').upload(fileName, imageFile);
    if (uploadError) throw uploadError;

    // 2. Get public URL (same as before)
    const { data: urlData } = supabase.storage.from('workshop-posters').getPublicUrl(fileName);
    const imageUrl = urlData.publicUrl;

    // 3. Insert main event (without razorpay_link)
    const { data: eventData, error: insertError } = await supabase
      .from('workshop_events')
      .insert([{ title, artist_name, is_active, image_url: imageUrl }])
      .select('id')
      .single();
    if (insertError) throw insertError;

    const newEventId = eventData.id;

    // 4. Prepare and insert sessions with new inventory and pricing data
    const sessionsToInsert = sessions.map(session => ({
      session_title: session.session_title,
      date: session.date,
      time: session.time,
      total_seats: parseInt(session.total_seats, 10),
      seats_sold: 0,
      use_tiered_pricing: session.use_tiered_pricing,
      cost: session.use_tiered_pricing ? null : session.cost, // Only save cost if not tiered
      pricing_tiers: session.use_tiered_pricing ? session.pricing_tiers : null, // Only save tiers if tiered
      event_id: newEventId,
    }));

    const { error: sessionsError } = await supabase.from('workshop_sessions').insert(sessionsToInsert);
    if (sessionsError) throw sessionsError;

    return NextResponse.json({ message: 'Workshop created successfully' });
  } catch (error) {
    console.error('Error creating workshop event:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}