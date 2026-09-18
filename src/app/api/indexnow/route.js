import { NextResponse } from 'next/server';

const INDEXNOW_KEY = '880071a12b914116d33f108114587758';
const BASE_URL = 'https://licitai.com.br';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

const URLS_TO_SUBMIT = [
  BASE_URL,
  `${BASE_URL}/login`,
];

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.INDEXNOW_CRON_SECRET;

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = {
      host: 'licitai.com.br',
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: URLS_TO_SUBMIT,
    };

    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    const result = await response.text();

    if (!response.ok) {
      console.error('IndexNow submission failed:', response.status, result);
      return NextResponse.json(
        { error: 'IndexNow submission failed', details: result },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      submitted: URLS_TO_SUBMIT.length,
      urls: URLS_TO_SUBMIT,
      response: result,
    });
  } catch (error) {
    console.error('IndexNow error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to submit URLs to IndexNow',
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urls: URLS_TO_SUBMIT,
  });
}