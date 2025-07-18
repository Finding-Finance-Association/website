import { NextResponse } from 'next/server';
import mailchimp from '@mailchimp/mailchimp_marketing';


interface MailchimpErrorResponse {
  response?: {
    body?: {
      title?: string;
      detail?: string;
    };
  };
}


mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER,
});


export async function POST(request: Request) {
  try {
    const { email } = (await request.json());

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID!,
      {
        email_address: email,
        status: 'subscribed',
      }
    );

    console.log('Mailchimp API Response:', response);
    return NextResponse.json({ message: 'Successfully subscribed to the newsletter!' }, { status: 200 });
  
  } catch (error: unknown) {
    console.error('Mailchimp API Error:', error);

    const mailchimpError = error as MailchimpErrorResponse;

    if (mailchimpError.response && mailchimpError.response.body && mailchimpError.response.body.title) {
      if (mailchimpError.response.body.title === 'Member Exists') {
        return NextResponse.json({ error: 'This email is already subscribed.' }, { status: 409 });
      }
      return NextResponse.json(
        { error: mailchimpError.response.body.detail || 'Failed to subscribe.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: 'Internal server error. Failed to subscribe.' }, { status: 500 });
  }
}