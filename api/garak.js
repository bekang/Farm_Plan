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

  // Inject Credentials (Server-side)
  // ID: 5775, PW: *suoho1004
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  if (!searchParams.has('id')) {
      searchParams.append('id', process.env.GARAK_ID || '5775');
  }
  if (!searchParams.has('passwd')) {
      searchParams.append('passwd', process.env.GARAK_PW || '*suoho1004');
  }

  // Use HTTPS
  const targetUrl = `https://www.garak.co.kr/homepage/publicdata/dataJsonOpen.do?${searchParams.toString()}`;

  try {
    // node-fetch is imported, no check needed

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
        const text = await response.text();
        throw new Error(`Upstream API responded with ${response.status}: ${text.substring(0, 200)}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
         const data = await response.json();
         res.status(200).json(data);
    } else {
         const text = await response.text();
         // If it's not JSON, it might be an HTML error page from the target
         throw new Error(`Expected JSON but got ${contentType}: ${text.substring(0, 100)}`);
    }

  } catch (error) {
    console.error('Garak API Proxy Error:', error);
    res.status(500).json({ 
        error: 'Failed to fetch data from Garak Market', 
        details: error.message,
        stack: error.stack,
        targetUrl // Debugging aid (be careful with logs, but targetUrl here is internal proxy const)
    });
  }
}
