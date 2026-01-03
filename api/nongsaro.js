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
    const path = searchParams.get('path');
    
    if (!path) {
        res.status(400).json({ error: 'Missing path' });
        return;
    }
    
    searchParams.delete('path');
    if (!searchParams.has('apiKey')) {
        searchParams.append('apiKey', process.env.NONGSARO_KEY || '202512319DLUHQN9LGWIOK5EFVGKQ');
    }

    const query = searchParams.toString();
    const targetUrl = `https://api.nongsaro.go.kr${path}?${query}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: controller.signal
    });
    
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Upstream Error: ${response.status}`);

    const contentType = response.headers.get('content-type');
    const text = await response.text();

    if (contentType && (contentType.includes('xml') || path.includes('xml'))) {
         res.setHeader('Content-Type', 'application/xml');
         res.status(200).send(text);
    } else {
         try {
             // Try parsing JSON
             const json = JSON.parse(text);
             res.status(200).json(json);
         } catch {
             // Fallback to XML/Text
             res.setHeader('Content-Type', 'application/xml');
             res.status(200).send(text);
         }
    }
  } catch (error) {
    console.error('Nongsaro Proxy Error:', error);
    res.status(200).json({ error: 'Proxy Error', details: error.message });
  }
}
