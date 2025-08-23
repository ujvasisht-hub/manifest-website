import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const formData = await request.json();
  const supabase = getSupabaseAdmin();

  try {
    // 1. Save the inquiry to your Supabase table
    const { error: supabaseError } = await supabase
      .from('contact_inquiries')
      .insert([
        {
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          email: formData.email,
          message: formData.message,
        }
      ]);

    if (supabaseError) throw supabaseError;

    // 2. Send the email notification using Resend
    await resend.emails.send({
      from: 'inquiry@manifest.twinmenot.com', // Must be an email from your verified domain
      to: 'ujvasisht@gmail.com', // 👈 **REPLACE WITH YOUR EMAIL**
      subject: `New Inquiry from ${formData.fullName}`,
      html: `
        <p>You have a new contact form submission:</p>
        <ul>
          <li><strong>Name:</strong> ${formData.fullName}</li>
          <li><strong>Phone:</strong> ${formData.phoneNumber}</li>
          <li><strong>Email:</strong> ${formData.email}</li>
        </ul>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
      `,
    });

    return NextResponse.json({ message: 'Inquiry submitted successfully!' });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}