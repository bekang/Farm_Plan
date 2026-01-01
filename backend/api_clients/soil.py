import os
import requests
import json
from dotenv import load_dotenv

load_dotenv(dotenv_path="../../config/.env")

class SoilClient:
    def __init__(self):
        self.api_key = os.getenv("SOIL_API_KEY")
        # Endpoint from image: https://apis.data.go.kr/1390802/SoilEnviron/SoilExam/V2
        self.base_url = "http://apis.data.go.kr/1390802/SoilEnviron/SoilExam/V2"

    def get_soil_data(self, pnu_code: str):
        """
        PNU(필지 고유 번호)를 이용한 토양 정보 조회
        """
        if not self.api_key:
            return None

        params = {
            "serviceKey": self.api_key,
            "PNU_Code": pnu_code,
            "format": "json"
        }

        try:
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            
            # Save raw data
            os.makedirs("../../data/raw", exist_ok=True)
            with open(f"../../data/raw/soil_{pnu_code}.json", "w", encoding="utf-8") as f:
                f.write(response.text)
                
            return response.json()
            
        except Exception as e:
            print(f"Soil API Error: {e}")
            return None
