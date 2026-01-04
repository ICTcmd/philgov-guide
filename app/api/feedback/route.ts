import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const rateLimitMap = new Map<string, { count: number; startTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function getIp(req: Request) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  return forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
}

function checkRateLimit(ip: string) {
  if (ip === 'unknown') return true;
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return true;
  }
  if (now - record.startTime > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return true;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) return false;
  record.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip = getIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    let { name, email, message, rating, page } = body || {};

    if (typeof name !== 'string') name = '';
    if (typeof email !== 'string') email = '';
    if (typeof message !== 'string') message = '';
    if (typeof rating !== 'number') rating = 0;
    if (typeof page !== 'string') page = '';

    name = name.trim().slice(0, 100);
    email = email.trim().slice(0, 200);
    message = message.trim().slice(0, 1000);
    page = page.trim().slice(0, 200);
    rating = Math.min(5, Math.max(0, rating || 0));

    if (!message || message.length < 5) {
      return NextResponse.json({ error: 'Message is too short' }, { status: 400 });
    }

    const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL?.trim();
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

    const sheetsId = process.env.GOOGLE_SHEETS_ID?.trim();
    const svcEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
    const svcKeyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    const svcKey = svcKeyRaw ? svcKeyRaw.replace(/\\n/g, '\n') : undefined;

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
          range: 'A1',
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values },
        });
      } catch (err) {
        console.error('Feedback sheets error', err);
      }
    }

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error('Feedback webhook error', err);
      }
    } else {
      console.log('Feedback received', payload);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
