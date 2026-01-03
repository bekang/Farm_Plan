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
    const { searchParams } = new URL(req.url, 'http://localhost');
    
    // Inject API Key
    if (!searchParams.has('apiKey')) {
        searchParams.append('apiKey', process.env.PEST_KEY || '20259f2e18caa7a96f5e0df70a4a6fc9b121');
    }

    const targetUrl = `https://ncpms.rda.go.kr/npmsAPI/service/pest/pestForecastList?${searchParams.toString()}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      signal: controller.signal
    });
    
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Upstream Error: ${response.status}`);

    const text = await response.text();
    try {
        const json = JSON.parse(text);
        res.status(200).json(json);
    } catch {
        throw new Error(`Invalid JSON: ${text.substring(0, 100)}`);
    }
  } catch (error) {
    console.error('Pest Proxy Error:', error);
    res.status(200).json({ error: 'Proxy Error', details: error.message });
  }
}
