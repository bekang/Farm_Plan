from pydantic import BaseModel, Field
from datetime import date
from typing import Optional, List, Dict, Literal

# --- 필지 및 시설 정보 ---
class FacilitySpec(BaseModel):
    type: Literal["노지", "비닐하우스", "유리온실"]
    insulation_type: str = "이중커튼" # 보온 자재 (비닐, 다겹보온 등)
    heater_type: str = "전기온풍기" # 난방기 종류
    heat_loss_rate: float = 2.5 # 열관류율 (U값, 예시 default)

class SoilSpec(BaseModel):
    ph: float = 6.5
    ec: float = 1.0 # 전기전도도
    type: str = "양토" # 토성

class FarmField(BaseModel):
    id: str
    name: str # "A지구", "제1농장"
    region: str
    area: float # m2
    facility: FacilitySpec
    soil: Optional[SoilSpec] = None

# --- 전략 및 시뮬레이션 ---
class Strategy(BaseModel):
    name: str # "High-Input" or "Low-Input"
    target_temp: float # 겨울철 유지 목표 온도
    fertilizer_intensity: float # 표준 시비량 대비 비율 (1.0 = 표준, 1.2 = 20% 증량)

class PlanResult(BaseModel):
    planting_date: date
    harvest_date: date
    expected_yield: float
    expected_revenue: float
    heating_cost: float
    fertilizer_cost: float
    labor_cost: float
    total_cost: float
    net_profit: float
    roi: float
    strategy_name: str
    peak_price_period: Optional[str] = None # "12월 상순" 등

class SimulationCompareResult(BaseModel):
    field: FarmField
    crop: str
    results: List[PlanResult] # 전략별 결과 리스트
