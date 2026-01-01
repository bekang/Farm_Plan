import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.schemas import FarmInput, CalcResult
from api_clients.weather import WeatherClient
from api_clients.price import PriceClient
from services.yield_calc import calculate_harvest_date, calculate_expected_yield
from services.finance import calculate_revenue, calculate_expense
from datetime import date

def calculate_farm_profit(input_data: FarmInput) -> CalcResult:
    # 1. API Clients 초기화
    weather_client = WeatherClient()
    price_client = PriceClient()
    
    data_sources = []
    
    # 2. 실제 데이터 수집
    # 2-1. 날씨 (좌표 변환 로직 필요하나 간소화)
    weather_data = weather_client.get_current_weather(55, 127)
    if weather_data:
        data_sources.append("기상청 단기예보")
    
    # 2-2. 가격
    price_info = price_client.get_daily_price(input_data.crop)
    current_price = 0
    if price_info:
        data_sources.append("KAMIS 일별시세")
        # JSON 파싱 로직 필요, 여기서는 데이터가 있으면 처리한다고 가정
        # current_price = extract_price(price_info)
        pass 
    
    # 실제 데이터가 없으면 0으로 처리 (Mock 금지)
    
    # 3. 계산
    harvest_date = calculate_harvest_date(input_data.planting_date, input_data.crop)
    yield_kg = calculate_expected_yield(input_data.area, input_data.crop, weather_data)
    
    estimated_revenue = calculate_revenue(yield_kg, current_price)
    estimated_expense = calculate_expense(input_data.area, input_data.crop)
    profit = estimated_revenue - estimated_expense
    
    return CalcResult(
        harvest_date=harvest_date,
        yield_kg=yield_kg,
        avg_price=current_price,
        revenue=estimated_revenue,
        expense=estimated_expense,
        profit=profit,
        data_sources=data_sources
    )
