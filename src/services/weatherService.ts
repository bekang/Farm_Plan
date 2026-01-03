// Using VITE_PUBLIC_DATA_KEY from .env
const API_KEY = import.meta.env.VITE_PUBLIC_DATA_KEY;

export interface WeatherData {
  tmp: string; // temperature
  sky: string; // sky condition
  pop: string; // probability of precipitation
  pty: string; // precipitation type
  reh: string; // humidity
}

export const WeatherService = {
  // Ultra Short Term Forecast (Cho-dan-gi)
  // Ultra Short Term Forecast (Cho-dan-gi)
  async getRealtimeWeather(lat: number, lng: number): Promise<WeatherData | null> {
    
    // 1. Convert Lat/Lng to Grid (NX, NY) for KMA API
    // Note: The hook passes lat/lng, so we rename arguments for clarity
    const grid = dfs_xy_conv("toXY", lat, lng);
    const nx = grid.x;
    const ny = grid.y;

    const today = new Date();
    const baseDate = today.toISOString().slice(0, 10).replace(/-/g, '');

    // Logic to find nearest base time (every hour on the half hour)
    let hours = today.getHours();
    let minutes = today.getMinutes();
    if (minutes < 45) {
      hours = hours - 1;
      if (hours < 0) {
        // Simple fallback for previous day boundary (simplification)
        hours = 23; 
        // Realistically need to adjust date too, but this is a rough 'realtime' fetch
      }
    }
    const baseTime = `${hours.toString().padStart(2, '0')}30`;

    try {
      if (!API_KEY) throw new Error("No API Key");

      // NOTE: Using '/api/public' proxy to avoid CORS
      const url = `/api/public/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${API_KEY}&pageNo=1&numOfRows=60&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const items = data.response?.body?.items?.item;

      if (!items) throw new Error("No items in response");

      // Parse items
      const weather: any = {};
      items.forEach((item: any) => {
        if (item.category === 'T1H') weather.tmp = item.fcstValue;
        if (item.category === 'SKY') weather.sky = item.fcstValue; // 1:Clear, 3:Cloudy, 4:Overcast
        if (item.category === 'RN1') weather.pop = item.fcstValue;
        if (item.category === 'PTY') weather.pty = item.fcstValue; // 0:None, 1:Rain, 2:Sleet, 3:Snow, 4:Shower
        if (item.category === 'REH') weather.reh = item.fcstValue;
      });

      return {
        tmp: weather.tmp || '-',
        sky: weather.sky || '-',
        pop: weather.pop || '-',
        pty: weather.pty || '-',
        reh: weather.reh || '-',
      };

    } catch (error) {
      console.warn('Weather fetch failed:', error);
      return null;
    }
  },
};

// --- KMA Coordinate Conversion Logic (Lambert Conformal Conic) ---
// RE=6371.00877, GRID=5.0, SLAT1=30.0, SLAT2=60.0, OLON=126.0, OLAT=38.0, XO=43, YO=136
function dfs_xy_conv(code: string, v1: number, v2: number) {
    const RE = 6371.00877; // Earth radius (km)
    const GRID = 5.0; // Grid spacing (km)
    const SLAT1 = 30.0 * Math.PI / 180.0;
    const SLAT2 = 60.0 * Math.PI / 180.0;
    const OLON = 126.0 * Math.PI / 180.0;
    const OLAT = 38.0 * Math.PI / 180.0;
    const XO = 43;
    const YO = 136;

    const DEGRAD = Math.PI / 180.0;
    const RADDEG = 180.0 / Math.PI;

    const re = RE / GRID;
    const slat1 = SLAT1;
    const slat2 = SLAT2;
    const olon = OLON;
    const olat = OLAT;

    let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);

    const rs: any = {};
    if (code === "toXY") {
        rs['lat'] = v1;
        rs['lng'] = v2;
        let ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        let theta = v2 * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    }
    return rs;
}
