export default async function handler(req, res) {
  // CORS Handling
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Construct target URL
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const query = searchParams.toString();
  const targetUrl = `http://www.garak.co.kr/homepage/publicdata/dataJsonOpen.do?${query}`;

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "application/json",
        "Host": "www.garak.co.kr",
        "Origin": "http://www.garak.co.kr",
        "Referer": "http://www.garak.co.kr/"
      }
    });

    if (!response.ok) {
        throw new Error(`Upstream API responded with ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Garak API Proxy Error:', error);
    res.status(500).json({ 
        error: 'Failed to fetch data from Garak Market', 
        details: error.message,
        mockFallback: true
    });
  }
}
