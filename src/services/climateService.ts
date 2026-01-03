// Monthly Average Temperatures (℃) - Mock Data based on KMA (Korea Meteorological Administration) 30-year averages
// Format: 0 (Jan) ~ 11 (Dec)
const REGIONAL_TEMP: Record<string, number[]> = {
  '서울/경기': [-2.4, 0.4, 5.7, 12.5, 17.8, 22.2, 24.9, 25.7, 21.2, 14.8, 7.2, 0.4],
  '강원 (영서)': [-5.0, -2.0, 4.0, 11.0, 16.5, 21.0, 24.0, 24.5, 19.5, 12.5, 5.0, -2.0], // Colder
  '강원 (영동)': [0.5, 2.5, 7.0, 13.0, 17.5, 21.0, 24.5, 25.0, 20.5, 15.5, 9.0, 3.0], // Warmer due to ocean
  충청북도: [-2.0, 0.5, 6.0, 13.0, 18.5, 22.5, 25.0, 25.5, 20.5, 14.0, 6.5, -0.5],
  충청남도: [-1.0, 1.0, 6.0, 12.5, 18.0, 22.0, 25.0, 25.5, 21.0, 14.5, 7.5, 1.0],
  전라북도: [0.0, 2.0, 7.0, 13.0, 18.5, 22.5, 25.5, 26.0, 21.5, 15.5, 8.5, 2.0],
  전라남도: [2.0, 4.0, 8.5, 14.0, 19.0, 22.5, 26.0, 26.5, 22.5, 17.0, 10.5, 4.5], // Warmer
  경상북도: [0.0, 2.5, 7.5, 13.5, 18.5, 22.0, 25.5, 26.0, 21.0, 15.0, 8.5, 2.0],
  경상남도: [3.0, 5.0, 9.5, 14.5, 19.5, 23.0, 26.0, 26.5, 22.5, 17.5, 11.0, 5.5],
  제주도: [6.0, 7.0, 10.0, 15.0, 19.0, 22.5, 26.5, 27.5, 24.0, 19.0, 13.5, 8.5], // Very Warm
};

export class ClimateService {
  /**
   * Get monthly average temperatures for a region.
   * If region not found, returns mild Seoul-like data.
   */
  static getMonthlyTemps(location: string): number[] {
    // Simple fuzzy matching
    const key = Object.keys(REGIONAL_TEMP).find((k) => location.includes(k.substring(0, 2)));
    // Default to Gyeonggi if not found
    return REGIONAL_TEMP[key || '서울/경기'];
  }

  /**
   * Calculate average external temperature during the cultivation period.
   * @param startMonth 0-indexed month (0=Jan)
   * @param durationMonths
   */
  static getAverageTempDuringPeriod(
    location: string,
    startDate: Date,
    durationDays: number,
  ): number {
    const temps = this.getMonthlyTemps(location);
    let currentMonth = startDate.getMonth();
    let daysRemaining = durationDays;
    let totalTemp = 0;
    let count = 0;

    // Simple monthly averaging
    while (daysRemaining > 0) {
      // Assume 30 days per month for simplicity in this loop or take remaining days
      const daysInThisMonth = Math.min(daysRemaining, 30);
      totalTemp += temps[currentMonth % 12] * daysInThisMonth;

      daysRemaining -= daysInThisMonth;
      currentMonth++;
      count += daysInThisMonth;
    }

    return totalTemp / count;
  }

  /**
   * Calculate Degree Days required for heating.
   * Sum of (TargetTemp - AmbientTemp) for days where Ambient < Target.
   * @param location Region
   * @param startDate Planting date
   * @param durationDays Duration
   * @param targetTemp Target indoor temperature
   */
  static calculateHeatingDegreeDays(
    location: string,
    startDate: Date,
    durationDays: number,
    targetTemp: number,
  ): number {
    const temps = this.getMonthlyTemps(location);
    let currentMonth = startDate.getMonth();
    let daysRemaining = durationDays;
    let totalDegreeDays = 0;

    while (daysRemaining > 0) {
      const ambientTemp = temps[currentMonth % 12];
      const diff = targetTemp - ambientTemp;

      // Only add if heating is needed (Target > Ambient)
      if (diff > 0) {
        const daysInThisMonth = Math.min(daysRemaining, 30);
        totalDegreeDays += diff * daysInThisMonth;
      }

      daysRemaining -= 30; // Approximation
      currentMonth++;
    }

    return totalDegreeDays;
  }
}
