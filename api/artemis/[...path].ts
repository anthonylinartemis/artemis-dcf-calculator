import type { VercelRequest, VercelResponse } from '@vercel/node';

const ARTEMIS_BASE_URL = 'https://data-svc.artemisxyz.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const apiKey = process.env.ARTEMIS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ARTEMIS_API_KEY not configured' });
  }

  // Get the proxy path from the route's captured group
  const proxyPath = (req.query.proxyPath as string) || '';

  // Collect all other query params (excluding proxyPath and Vercel internals)
  const searchParams = new URLSearchParams();
  searchParams.set('APIKey', apiKey);
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'proxyPath' || key === 'path' || key === '...path') continue;
    if (typeof value === 'string') {
      searchParams.set(key, value);
    }
  }

  const fullUrl = `${ARTEMIS_BASE_URL}/${proxyPath}?${searchParams.toString()}`;

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Artemis API error:', response.status, errorText.slice(0, 200));
      return res.status(response.status).json({
        error: 'Artemis API error',
        status: response.status,
      });
    }

    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Artemis proxy error:', error);
    return res.status(500).json({
      error: 'Failed to fetch from Artemis',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
