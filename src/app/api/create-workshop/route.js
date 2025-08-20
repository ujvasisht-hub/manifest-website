import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  // Get the form data from the request
  const workshopData = await request.json();

  // Create a Supabase client with the SERVICE_ROLE key for admin actions
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // This is a new, secret key
  );

  // Insert the data into the 'workshops' table
  const { data, error } = await supabase
    .from('workshops')
    .insert([
      { 
        title: workshopData.title,
        artist_name: workshopData.artist_name,
        date: workshopData.date,
        cost: workshopData.cost,
        razorpay_link: workshopData.razorpay_link,
        // We will add image_url later
      }
    ]);

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Workshop created successfully', data: data });
}