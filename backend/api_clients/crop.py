import os
import requests
import json
from dotenv import load_dotenv

load_dotenv(dotenv_path="../../config/.env")

class CropClient:
    def __init__(self):
        self.api_key = os.getenv("CROP_API_KEY")
        # 농사로 등 작물 정보 API 엔드포인트 (예시)
        self.base_url = "http://api.nongsaro.go.kr/service/garden/gardenList" 

    def get_crop_info(self, crop_name: str):
        if not self.api_key:
            return None # 키 없으면 None 반환 (Mock 사용 금지)

        params = {
            "apiKey": self.api_key,
            "sType": "s",
            "sText": crop_name
        }

        try:
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            
            # XML to JSON logic might be needed here depending on API
            # For strict compliance, we save whatever we get
            
            os.makedirs("../../data/raw", exist_ok=True)
            with open(f"../../data/raw/crop_{crop_name}.xml", "w", encoding="utf-8") as f:
                f.write(response.text)
                
            return response.text
            
        except Exception as e:
            print(f"Crop API Error: {e}")
            return None
