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
    const razorpay_link = formData.get('razorpay_link');
    const is_active = formData.get('is_active') === 'true'; // Convert string to boolean
    const imageFile = formData.get('image');
    const sessions = JSON.parse(formData.get('sessions'));

    // ... validation ...
    if (!title || !artist_name || !imageFile || !sessions || sessions.length === 0) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    
    // 1. Upload the image to Supabase Storage
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('workshop-posters')
      .upload(fileName, imageFile);
    if (uploadError) throw uploadError;

    // 2. Get the public URL of the uploaded image
    const { data: urlData } = supabase.storage
      .from('workshop-posters')
      .getPublicUrl(fileName);
    const imageUrl = urlData.publicUrl;

    // 3. Insert the main event data, including the new 'is_active' field
    const { data: eventData, error: insertError } = await supabase
      .from('workshop_events')
      .insert([
        { 
          title: title,
          artist_name: artist_name,
          razorpay_link: razorpay_link,
          image_url: imageUrl,
          is_active: is_active, // Add the new field here
        }
      ])
      .select('id')
      .single();
    if (insertError) throw insertError;

    const newEventId = eventData.id;

    // 4. Prepare and insert all the session data, now including the 'time' field
    const sessionsToInsert = sessions.map(session => ({
      ...session, // This will include session_title, date, time, and cost
      event_id: newEventId,
    }));
    
    const { error: sessionsError } = await supabase
      .from('workshop_sessions')
      .insert(sessionsToInsert);
    if (sessionsError) throw sessionsError;

    return NextResponse.json({ message: 'Workshop Event and all Sessions created successfully' });

  } catch (error) {
    console.error('Error creating workshop event:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}