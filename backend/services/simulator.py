from backend.models.schemas import FarmField, Strategy, PlanResult, SimulationCompareResult
from backend.services.cost_estimation import CostEstimator
from backend.services.yield_calc import calculate_expected_yield
from backend.services.price_analysis import PriceAnalyzer
from datetime import date, timedelta

class Simulator:
    def __init__(self):
        self.cost_estimator = CostEstimator()
        # PriceAnalyzer, YieldCalc 등은 stateless 함수 혹은 인스턴스로 사용
        
    def run_simulation(self, field: FarmField, crop: str, planting_date: date, weather_data: dict, current_price: float) -> SimulationCompareResult:
        strategies = [
            Strategy(name="적극 투자형 (Active)", target_temp=20.0, fertilizer_intensity=1.2),
            Strategy(name="비용 절감형 (Passive)", target_temp=8.0, fertilizer_intensity=0.8)
        ]
        
        results = []
        
        for strat in strategies:
            # 1. 예상 수확량 (전략에 따라 변동)
            # 적극 투자형은 생육 환경이 좋아 수확량 증가 가정
            yield_factor = 1.2 if strat.name == "적극 투자형 (Active)" else 0.9
            expected_yield = calculate_expected_yield(field.area, crop, weather_data) * yield_factor
            
            # 2. 비용 계산
            heating_cost = self.cost_estimator.calculate_heating_cost(field, strat.target_temp, weather_data)
            fertilizer_cost = self.cost_estimator.calculate_fertilizer_cost(field, crop, strat.fertilizer_intensity)
            labor_cost = field.area * 1000 # 평당 인건비 단순 가정
            
            total_cost = heating_cost + fertilizer_cost + labor_cost
            
            # 3. 매출 및 순수익
            # 적극 투자형은 품질이 좋아 가격도 높게 받을 가능성 (여기서는 가격 10% 프리미엄 가정)
            price_factor = 1.1 if strat.name == "적극 투자형 (Active)" else 1.0
            expected_revenue = expected_yield * current_price * price_factor
            
            net_profit = expected_revenue - total_cost
            roi = (net_profit / total_cost * 100) if total_cost > 0 else 0
            
            results.append(PlanResult(
                planting_date=planting_date,
                harvest_date=planting_date + timedelta(days=90), # 작물별 로직 필요
                expected_yield=expected_yield,
                expected_revenue=expected_revenue,
                heating_cost=heating_cost,
                fertilizer_cost=fertilizer_cost,
                labor_cost=labor_cost,
                total_cost=total_cost,
                net_profit=net_profit,
                roi=roi,
                strategy_name=strat.name
            ))
            
        return SimulationCompareResult(field=field, crop=crop, results=results)
