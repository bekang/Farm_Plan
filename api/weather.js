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

  // Construct target URL
  // Matches: /api/weather -> http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst
  // Note: The service currently constructs the full path. We should simplify the service or handle it here.
  // Strategy: The service will point to /api/weather, and we append the query params.
  // The service was using: /getUltraSrtFcst...
  // Let's make this proxy endpoint specific to 'getUltraSrtFcst' for simplicity, or generic.
  // Service sends: /api/public/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?...
  
  // Let's make the service call /api/weather?.... and we rewrite to the specific endpoint.
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  
  // Inject API Key (Server-side)
  // Key from user screenshot: b4d6ac2cedc8e95a0e1bdd0d0ac51aa0f5734ca9bd51501c2e9015a87cfd2325
  if (!searchParams.has('serviceKey')) {
      searchParams.append('serviceKey', process.env.WEATHER_KEY || 'b4d6ac2cedc8e95a0e1bdd0d0ac51aa0f5734ca9bd51501c2e9015a87cfd2325');
  }
  
  // Decoding the key if it's already encoded can be tricky, but usually these keys are passed as is or URI encoded.
  // The Public Data Portal key often contains special chars like /, +, =. 
  // The screenshot key looks alphanumeric (hex-like), so it might not need encoding. 
  // 'b4d6...' is purely hex, so it's safe.
  
  const targetUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?${searchParams.toString()}`;

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
         // Some public APIs reject requests without a User-Agent or Referer
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    if (!response.ok) {
        throw new Error(`Upstream API responded with ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Weather API Proxy Error:', error);
    res.status(500).json({ 
        error: 'Failed to fetch weather data', 
        details: error.message 
    });
  }
}
