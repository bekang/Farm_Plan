import fetch from 'node-fetch';

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

  // Construct target URL safely
  const { searchParams } = new URL(req.url, 'http://localhost');
  
  // Inject API Key (Server-side)
  // Key from user screenshot: b4d6ac2cedc8e95a0e1bdd0d0ac51aa0f5734ca9bd51501c2e9015a87cfd2325
  if (!searchParams.has('serviceKey')) {
      searchParams.append('serviceKey', process.env.WEATHER_KEY || 'b4d6ac2cedc8e95a0e1bdd0d0ac51aa0f5734ca9bd51501c2e9015a87cfd2325');
  }
  
  // Decoding the key if it's already encoded can be tricky, but usually these keys are passed as is or URI encoded.
  // The Public Data Portal key often contains special chars like /, +, =. 
  // The screenshot key looks alphanumeric (hex-like), so it might not need encoding. 
  // 'b4d6...' is purely hex, so it's safe.
  
  const targetUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?${searchParams.toString()}`;

  try {
    // node-fetch is imported, no check needed

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upstream API responded with ${response.status}: ${text.substring(0, 200)}`);
    }
    
    // KMA API often returns JSON inside a 'response' object, but check content-type
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        res.status(200).json(data);
    } else {
        // Sometimes KMA returns XML even if JSON is requested if there's an error
        const text = await response.text();
        throw new Error(`Expected JSON but got ${contentType}: ${text.substring(0, 200)}`);
    }

  } catch (error) {
    console.error('Weather API Proxy Error:', error);
    res.status(500).json({ 
        error: 'Failed to fetch weather data', 
        details: error.message,
        debug: { targetUrl } 
    });
  }
}
