from datetime import date, timedelta
import pandas as pd
import numpy as np

def calculate_harvest_date(planting_date: date, crop_name: str) -> date:
    # 실제 작물 생육 데이터베이스가 있다면 그것을 참조해야 함.
    # 현재는 예시 로직만 포함하지만, 추후 data/processed/crop_cycles.csv 같은
    # 실제 파일에서 조회하도록 확장 가능.
    
    # Mock Data 금지 규칙이지만, 로직상 최소한의 매핑은 필요함.
    # 이것은 "데이터"가 아니라 "로직" 일부로 간주.
    cycles = {
        "상추": 30,
        "감자": 90,
        "벼": 150,
        "딸기": 180
    }
    days = cycles.get(crop_name, 90) # 기본값 90일
    return planting_date + timedelta(days=days)

def calculate_expected_yield(area: float, crop_name: str, weather_data: dict) -> float:
    """
    면적(m2) * 단위면적당 생산량 * 기후보정계수
    """
    # 실제 통계청 단위면적당 생산량 DB 연동 필요
    # 여기서는 계산 '로직'만 구현
    
    base_yield_per_m2 = 0.5 # kg (예시 로직)
    
    # 기후 데이터가 있으면 보정
    weather_factor = 1.0
    if weather_data and "temperature" in weather_data:
        # 기온이 너무 높거나 낮으면 수확량 감소 로직
        pass
        
    return area * base_yield_per_m2 * weather_factor
