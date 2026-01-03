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
  
  // Target: NCPMS Pest Forecast
  // Service sends params for pestForecastList
  const targetUrl = `https://ncpms.rda.go.kr/npmsAPI/service/pest/pestForecastList?${searchParams.toString()}`;

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    if (!response.ok) {
        throw new Error(`Upstream API responded with ${response.status}`);
    }

    // NCPMS returns XML. We forward it as text/xml so the frontend DOMParser can handle it.
    const text = await response.text();
    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(text);

  } catch (error) {
    console.error('Pest API Proxy Error:', error);
    res.status(500).json({ 
        error: 'Failed to fetch pest data', 
        details: error.message 
    });
  }
}
