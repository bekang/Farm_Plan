export default async function handler(req, res) {
  const result = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    env: {
      hasWeatherKey: !!process.env.WEATHER_KEY,
    },
    connectivity: {}
  };

  try {
    const start = Date.now();
    const google = await fetch('https://www.google.com', { method: 'HEAD' });
    result.connectivity.google = { ok: google.ok, latency: Date.now() - start };
  } catch (e) {
    result.connectivity.google = { error: e.message };
  }

  try {
    const start = Date.now();
    // Test KMA Weather API connectivity
    const kma = await fetch('https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=TEST', { method: 'HEAD' });
    result.connectivity.kma = { ok: kma.ok, status: kma.status, latency: Date.now() - start };
  } catch (e) {
    result.connectivity.kma = { error: e.message };
  }

  res.status(200).json(result);
}
