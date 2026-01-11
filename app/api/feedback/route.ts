import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { z } from 'zod';
import { rateLimit, getIp } from '@/lib/rate-limit';

/**
 * @file route.ts
 * @description API endpoint for submitting user feedback.
 * Supports saving to Google Sheets and sending to a Webhook.
 * Protected by Rate Limiting and Zod Validation.
 */

// Zod Schema for Feedback Validation
const FeedbackSchema = z.object({
  name: z.string().trim().max(100).optional().default(""),
  email: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(5, "Message is too short").max(1000),
  rating: z.number().min(0).max(5).optional().default(0),
  page: z.string().trim().max(200).optional().default(""),
});

/**
 * POST handler for feedback submission
 * @param {Request} req - The incoming request object
 * @returns {Promise<NextResponse>} JSON response
 */
export async function POST(req: Request) {
  try {
    const ip = getIp(req);
    const rateLimitResult = rateLimit(ip, 'feedback-api', { windowMs: 60000, maxRequests: 5 });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' }, 
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString()
          }
        }
      );
    }

    const body = await req.json();
    
    const parseResult = FeedbackSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, message, rating, page } = parseResult.data;

    const payload = {
      type: 'feedback',
      ip,
      name: name || 'Anonymous',
      email: email || '',
      message,
      rating,
      page: page || '',
      userAgent: req.headers.get('user-agent') || '',
      timestamp: new Date().toISOString(),
    };

    const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL?.trim();
    const sheetsId = process.env.GOOGLE_SHEETS_ID?.trim();
    const svcEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
    const svcKeyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    const svcKey = svcKeyRaw ? svcKeyRaw.replace(/\\n/g, '\n') : undefined;

    // Save to Google Sheets if configured
    if (sheetsId && svcEmail && svcKey) {
      try {
        const auth = new google.auth.JWT({
          email: svcEmail,
          key: svcKey,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheets = google.sheets({ version: 'v4', auth });
        const values = [[
          payload.timestamp,
          payload.name,
          payload.email,
          payload.message,
          String(payload.rating),
          payload.page,
          payload.ip,
          payload.userAgent,
        ]];
        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetsId,
          range: 'Feedback!A:H', // Assumes a sheet named "Feedback"
          valueInputOption: 'USER_ENTERED',
          requestBody: { values },
        });
      } catch (err) {
        console.error('Error saving to Google Sheets:', err);
        // Don't fail the request if Sheets fails, just log it
      }
    }

    // Send to Webhook if configured (e.g., Discord/Slack/Zapier)
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error('Error sending to webhook:', err);
      }
    }

    return NextResponse.json({ success: true, message: 'Feedback received' });
  } catch (error: unknown) {
    console.error('API Error submitting feedback:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
