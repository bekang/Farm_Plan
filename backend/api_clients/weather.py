import os
import requests
import json
from datetime import datetime
from dotenv import load_dotenv

load_dotenv(dotenv_path="../../config/.env")

class WeatherClient:
    def __init__(self):
        self.api_key = os.getenv("WEATHER_API_KEY")
        self.base_url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst"

    def get_current_weather(self, nx: int, ny: int):
        """
        초단기실황조회 API 호출
        """
        if not self.api_key:
            raise ValueError("WEATHER_API_KEY가 설정되지 않았습니다.")

        # 오늘 날짜와 현재 시간 계산 (Mock 데이터 사용 금지 규칙 준수)
        now = datetime.now()
        base_date = now.strftime("%Y%m%d")
        base_time = now.strftime("%H00") # 정시 기준

        params = {
            "serviceKey": self.api_key,
            "pageNo": 1,
            "numOfRows": 1000,
            "dataType": "JSON",
            "base_date": base_date,
            "base_time": base_time,
            "nx": nx,
            "ny": ny
        }

        try:
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            # API 응답 원본 저장 (Local First 규칙)
            os.makedirs("../../data/raw", exist_ok=True)
            with open(f"../../data/raw/weather_{base_date}_{base_time}.json", "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
                
            return data
            
        except Exception as e:
            print(f"Weather API Error: {e}")
            return None
