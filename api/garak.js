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
    
    if (!searchParams.has('id')) {
        searchParams.append('id', process.env.GARAK_ID || '5775');
    }
    if (!searchParams.has('passwd')) {
        searchParams.append('passwd', process.env.GARAK_PW || '*suoho1004');
    }

    const targetUrl = `https://www.garak.co.kr/homepage/publicdata/dataJsonOpen.do?${searchParams.toString()}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "application/json",
        "Host": "www.garak.co.kr",
        "Origin": "http://www.garak.co.kr",
        "Referer": "http://www.garak.co.kr/"
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
        throw new Error(`Upstream Error: ${response.status}`);
    }

    const text = await response.text();
    try {
         const data = JSON.parse(text);
         res.status(200).json(data);
    } catch (e) {
         throw new Error(`Invalid JSON: ${text.substring(0, 100)}`);
    }

  } catch (error) {
    console.error('Garak Proxy Error:', error);
    res.status(200).json({ error: 'Proxy Error', details: error.message, list: [] });
  }
}
