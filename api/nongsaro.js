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

  // Target: Nongsaro API (RDA)
  // Incoming request: /api/nongsaro?apiKey=...&...
  // Target: http://api.nongsaro.go.kr/service/...
  
  // Note: Nongsaro has various service endpoints (e.g., farmTechService, etc.)
  // The client must provide the full path relative to the base URL or we handle specific services.
  // For flexibility, let's assume the client sends the path as a query param or part of the URL.
  // BUT, to keep it simple and match previous patterns:
  // Let client call: /api/nongsaro/service/... -> we map to http://api.nongsaro.go.kr/service/...
  
  // Vercel path segments: api/nongsaro/[...path] is better for this, but single file handler is easier for now.
  // Let's rely on query param 'path' or just append search params to a hardcoded base if it's a single service.
  // However, Nongsaro has many services.
  
  // Better approach for single file proxy:
  // Client calls: /api/nongsaro?path=/service/varietyInfo/getVarietyList&...
  
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const path = searchParams.get('path');
  
  if (!path) {
      res.status(400).json({ error: 'Missing "path" query parameter' });
      return;
  }
  
  // Remove 'path' from params to forward the rest
  searchParams.delete('path');
  
  // Inject API Key (Server-side)
  // This hides the key from the client and ensures it works without env var configuration for the user
  if (!searchParams.has('apiKey')) {
      searchParams.append('apiKey', process.env.NONGSARO_KEY || '202512319DLUHQN9LGWIOK5EFVGKQ');
  }

  const query = searchParams.toString();

  const targetUrl = `http://api.nongsaro.go.kr${path}?${query}`;

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
    // Nongsaro usually returns XML. Forward as is.
    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(text);

  } catch (error) {
    console.error('Nongsaro API Proxy Error:', error);
    res.status(500).json({ 
        error: 'Failed to fetch Nongsaro data', 
        details: error.message,
        debug: { targetUrl }
    });
  }
}
