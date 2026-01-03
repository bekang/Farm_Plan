// Native Fetch (Node 18+) - No imports needed

export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 1. Safe URL Parsing
    const { searchParams } = new URL(req.url, 'http://localhost');
    
    // 2. Inject Key
    if (!searchParams.has('serviceKey')) {
        searchParams.append('serviceKey', process.env.WEATHER_KEY || 'b4d6ac2cedc8e95a0e1bdd0d0ac51aa0f5734ca9bd51501c2e9015a87cfd2325');
    }

    const targetUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?${searchParams.toString()}`;

    // 3. Fetch with Timeout limit (5 seconds) to prevent Vercel 504/500 crash
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      },
      signal: controller.signal
    });
    
    clearTimeout(timeout);

    if (!response.ok) {
        throw new Error(`Upstream Error: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    const text = await response.text();

    try {
        const json = JSON.parse(text);
        res.status(200).json(json);
    } catch (e) {
        // XML or HTML response
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
    }

  } catch (error) {
    console.error('Weather Proxy Error:', error);
    // Return 200 with error info so Client handles it cleanly instead of 500
    res.status(200).json({
      response: {
        header: { resultCode: '99', resultMsg: `PROXY_ERROR: ${error.message}` }
      },
      error: true,
      details: error.message
    });
  }
}
