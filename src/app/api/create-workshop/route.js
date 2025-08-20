import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Helper to create a Supabase admin client
const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const supabase = getSupabaseAdmin();
  
  try {
    // Vercel automatically parses FormData for us
    const formData = await request.formData();
    const title = formData.get('title');
    const artist_name = formData.get('artist_name');
    const imageFile = formData.get('image');

    if (!title || !artist_name || !imageFile) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    
    // 1. Upload the image to Supabase Storage
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('workshop-posters') // Your bucket name
      .upload(fileName, imageFile);

    if (uploadError) {
      throw uploadError;
    }

    // 2. Get the public URL of the uploaded image
    const { data: urlData } = supabase.storage
      .from('workshop-posters')
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    // 3. Insert the event data into the 'workshop_events' table
    const { data: eventData, error: insertError } = await supabase
      .from('workshop_events')
      .insert([
        { 
          title: title,
          artist_name: artist_name,
          image_url: imageUrl,
        }
      ])
      .select() // Use .select() to get the inserted row back
      .single(); // We expect only one row

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ message: 'Workshop Event created successfully', data: eventData });

  } catch (error) {
    console.error('Error creating workshop event:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}