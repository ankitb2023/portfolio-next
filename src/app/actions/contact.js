'use server';

import { Resend } from 'resend';

export async function submitContactForm(formData) {
  const name = formData.get('name')?.trim();
  const email = formData.get('email')?.trim();
  const phone = formData.get('phone')?.trim() || '';
  const message = formData.get('message')?.trim();

  // ── Input validation ──
  if (!name || !email || !message) {
    return { success: false, message: 'Please fill in all required fields.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  // ── Read API key from environment ──
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured.');
    return { success: false, message: 'Server configuration error. Please try again later.' };
  }

  const resend = new Resend(apiKey);

  // ── Send email via Resend ──
  try {
    const { data, error } = await resend.emails.send({
      from: `Portfolio Contact <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: [process.env.RESEND_TO_EMAIL || 'ankitbhujeja@gmail.com'],
      subject: `Portfolio Contact: ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #842be2;">You're Contacted by ${name}</h2>
          <hr style="border: 1px solid #eee;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <hr style="border: 1px solid #eee;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
      replyTo: email,
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, message: 'Failed to send message. Please try again.' };
    }

    return { success: true, message: 'Message sent successfully!' };
  } catch (error) {
    console.error('Resend error:', error);
    return { success: false, message: 'Network error. Please check your connection.' };
  }
}
