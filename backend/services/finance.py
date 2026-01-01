def calculate_revenue(yield_kg: float, price_per_kg: float) -> float:
    return yield_kg * price_per_kg

def calculate_expense(area: float, crop_name: str) -> float:
    """
    면적 기반 표준 영농비 계산 (비료, 종자, 인건비 등)
    """
    # 실제 경영비 통계 데이터 활용 필요
    standard_cost_per_m2 = 5000 # 원
    return area * standard_cost_per_m2
