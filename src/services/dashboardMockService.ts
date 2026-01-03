export const PEST_DATA: Record<string, string> = {
  seoul: '관심: 미국선녀벌레',
  busan: '주의: 벼멸구',
  daegu: '예보 없음',
  incheon: '관심: 꽃매미',
  gwangju: '주의: 먹노린재',
  daejeon: '예보 없음',
  ulsan: '예보 없음',
  sejong: '관심: 복숭아순나방',
  gyeonggi: '경보: 갈색날개매미충',
  gangwon: '주의: 도열병',
  chungbuk: '관심: 담배나방',
  chungnam: '주의: 벼멸구',
  jeonbuk: '경보: 탄저병',
  jeonnam: '경보: 벼멸구',
  gyeongbuk: '주의: 노균병',
  gyeongnam: '관심: 흰가루병',
  jeju: '주의: 감귤 녹응애'
};

export const WEATHER_ALERTS: Record<string, { type: 'warning' | 'watch' | 'none', title: string }> = {
  gangwon: { type: 'warning', title: '대설 경보' },
  jeonnam: { type: 'watch', title: '호우 주의보' },
  jeju: { type: 'watch', title: '강풍 주의보' },
  // others none
};

export const DashboardMockService = {
  getPestForecast: (province: string) => {
    // Basic mapping or safe default
    const key = Object.keys(PEST_DATA).find(k => province.includes(k) || k.includes(province)) || 'default';
    return PEST_DATA[key as keyof typeof PEST_DATA] || '예보: 특이사항 없음';
  },

  getWeatherAlert: (province: string) => {
    const key = Object.keys(WEATHER_ALERTS).find(k => province.includes(k) || k.includes(province));
    return WEATHER_ALERTS[key as keyof typeof WEATHER_ALERTS] || null;
  }
};
