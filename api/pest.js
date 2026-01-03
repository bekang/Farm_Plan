export default async function handler(req, res) {
  // CORS Handling
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  
  // Inject API Key (Server-side)
  // Key from user screenshot: 20259f2e18caa7a96f5e0df70a4a6fc9b121
  if (!searchParams.has('apiKey')) {
      searchParams.append('apiKey', process.env.PEST_KEY || '20259f2e18caa7a96f5e0df70a4a6fc9b121');
  }

  // Target: NCPMS Pest Forecast
  // Service sends params for pestForecastList
  const targetUrl = `https://ncpms.rda.go.kr/npmsAPI/service/pest/pestForecastList?${searchParams.toString()}`;

  try {
    if (typeof fetch === 'undefined') {
        throw new Error('Global fetch is not defined in this Node environment');
    }

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upstream API responded with ${response.status}: ${text.substring(0, 200)}`);
    }

    const text = await response.text();
    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(text);

  } catch (error) {
    console.error('Pest Forecast Proxy Error:', error);
    res.status(500).json({ 
        error: 'Failed to fetch pest data', 
        details: error.message,
        debug: { targetUrl }
    });
  }
}
