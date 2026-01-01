from backend.models.schemas import FarmField, FacilitySpec
from backend.api_clients.soil import SoilClient

class CostEstimator:
    def __init__(self):
        self.soil_client = SoilClient()

    def calculate_heating_cost(self, field: FarmField, target_temp: float, location_weather: dict) -> float:
        """
        난방비 계산 (Degree-Day Method 응용)
        """
        if field.facility.type == "노지":
            return 0.0

        # 1. 평균 외부 기온 (API에서 가져온 평년 기온 활용)
        # location_weather['avg_temp']가 있다고 가정
        avg_outdoor_temp = location_weather.get('temp', 0) # 현재 기온을 평년 기온으로 가정 (단순화)
        
        # 2. 온도차 계산 (목표온도 - 외부온도)
        delta_T = max(0, target_temp - avg_outdoor_temp)
        
        # 3. 시설 열관류율 (U값)
        u_value = field.facility.heat_loss_rate
        
        # 4. 면적
        area = field.area
        
        # 5. 난방 필요 열량 (kcal/hr) = Area * U * delta_T
        heat_load = area * u_value * delta_T
        
        # 6. 에너지 비용 환산 (전기온풍기 예시: 1kWh = 860kcal, 농업용 전기료 약 50원/kWh 가정)
        # 난방 시간: 겨울철 야간 12시간 * 90일 가정
        heating_hours = 12 * 90 
        required_kwh = (heat_load * heating_hours) / 860
        
        electricity_rate = 50 
        cost = required_kwh * electricity_rate
        
        return cost

    def calculate_fertilizer_cost(self, field: FarmField, crop: str, intensity: float) -> float:
        """
        비료 비용 계산
        """
        base_cost_per_m2 = 500 # 표준 시비량 기준 비용
        
        # 토양 분석 결과에 따른 보정
        soil_factor = 1.0
        if field.soil:
            if field.soil.ec < 0.5: # 비료 부족
                soil_factor = 1.2
            elif field.soil.ec > 2.0: # 비료 과다
                soil_factor = 0.8
                
        return field.area * base_cost_per_m2 * intensity * soil_factor
