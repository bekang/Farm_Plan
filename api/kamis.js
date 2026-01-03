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
    
    if (!searchParams.has('p_cert_key')) {
        searchParams.append('p_cert_key', process.env.KAMIS_KEY || 'e1649e0e-079c-40ca-acb3-aab69df21f7b');
    }
    if (!searchParams.has('p_cert_id')) {
        searchParams.append('p_cert_id', process.env.KAMIS_ID || '7036');
    }
    
    const targetUrl = `https://www.kamis.or.kr/service/price/xml.do?${searchParams.toString()}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(targetUrl, {
        method: "GET",
        headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" },
        signal: controller.signal
    });
    
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Upstream Error: ${response.status}`);

    const text = await response.text();
    try {
        const json = JSON.parse(text);
        res.status(200).json(json);
    } catch {
       // Return raw text if JSON parse fails (KAMIS sometimes returns XML/Text)
       res.status(200).json({ raw: text, error: 'Parsed as non-JSON' });
    }
  } catch (error) {
    console.error('Kamis Proxy Error:', error);
    res.status(200).json({ error: 'Proxy Error', details: error.message, price: [] });
  }
}
