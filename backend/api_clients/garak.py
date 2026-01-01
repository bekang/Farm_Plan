import requests
import os
from datetime import datetime
import xml.etree.ElementTree as ET
from typing import Optional, List, Dict
from backend.utils.logger import logger

class GarakClient:
    """가락시장 API 클라이언트"""
    
    def __init__(self):
        # 실제 계정 정보
        self.base_url = "http://www.garak.co.kr/homepage/publicdata/dataXmlOpen.do" 
        self.id = "5775"
        self.passwd = "*suoho1004"
        self.dataid = "data36"

    def get_daily_price(self, crop_name: str, target_date: Optional[str] = None) -> Optional[List[Dict]]:
        """
        일별 경락가 조회
        
        Args:
            crop_name: 작물명 (예: '감자')
            target_date: 조회 날짜 (YYYYMMDD), None이면 오늘
        
        Returns:
            가격 정보 리스트 또는 None
        """
        if not target_date:
            target_date = datetime.now().strftime("%Y%m%d")
        
        params = {
            "id": self.id,
            "passwd": self.passwd,
            "dataid": self.dataid,
            "pagesize": 100,
            "pageidx": 1,
            "portal.templet": "false",
            "s_date": target_date, 
            "s_pummok": crop_name,
        }

        try:
            logger.info(f"가락시장 API 호출: {crop_name} ({target_date})")
            response = requests.get(self.base_url, params=params, timeout=10)
            response.raise_for_status()
            
            # XML 파싱
            try:
                root = ET.fromstring(response.text)
                prices = []
                
                for item in root.findall(".//list"):
                    price_data = {
                        "date": target_date,
                        "crop": crop_name,
                        "grade": item.findtext("G_NAME"),
                        "unit": item.findtext("U_NAME"),
                        "price_min": item.findtext("MI_P"),
                        "price_max": item.findtext("MA_P"),
                        "price_avg": item.findtext("AV_P"),
                    }
                    prices.append(price_data)
                
                logger.info(f"데이터 수신 성공: {len(prices)}건")
                return prices
                
            except ET.ParseError as e:
                logger.error(f"XML 파싱 오류: {e}")
                logger.debug(f"응답 내용: {response.text[:500]}")
                return None

        except requests.exceptions.RequestException as e:
            logger.error(f"API 호출 실패: {e}")
            return None
