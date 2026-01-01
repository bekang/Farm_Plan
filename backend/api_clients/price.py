import os
import requests
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv(dotenv_path="../../config/.env")

class PriceClient:
    def __init__(self):
        self.api_key = os.getenv("PRICE_API_KEY")
        self.cert_key = os.getenv("PRICE_API_KEY") # KAMIS uses cert_key/cert_id usually
        self.id = os.getenv("PRICE_API_ID") # KAMIS needs ID too sometimes
        self.base_url = "http://www.kamis.or.kr/service/price/xml.do"

    def get_daily_price(self, crop_name: str, date_str: str = None):
        """
        KAMIS 일별 가격 조회
        """
        if not self.api_key:
            return None

        if not date_str:
            date_str = datetime.now().strftime("%Y-%m-%d")

        # KAMIS typically requires category codes, etc. 
        # For this implementation, we attempt a generic fetch structure
        params = {
            "action": "dailySalesList",
            "p_cert_key": self.api_key,
            "p_cert_id": self.id, # If needed
            "p_returntype": "json",
            "p_regday": date_str
        }

        try:
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            os.makedirs("../../data/raw", exist_ok=True)
            with open(f"../../data/raw/price_{date_str}.json", "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
                
            return data
            
        except Exception as e:
            print(f"Price API Error: {e}")
            return None
