"""
API 데이터 수집 스크립트
"""
import sys
from pathlib import Path

# 경로 설정
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.api_clients.garak import GarakClient
from backend.services.data_pipeline import pipeline
from backend.utils.logger import logger
import pandas as pd


def collect_price_data(crop: str, days_back: int = 7):
    """
    특정 작물의 가격 데이터 수집
    
    Args:
        crop: 작물명
        days_back: 과거 며칠치 데이터 수집
    """
    logger.info(f"=== {crop} 가격 데이터 수집 시작 ===")
    
    client = GarakClient()
    all_data = []
    
    from datetime import datetime, timedelta
    
    for i in range(days_back):
        target_date = (datetime.now() - timedelta(days=i)).strftime("%Y%m%d")
        
        # API 호출
        prices = client.get_daily_price(crop, target_date)
        
        if prices:
            all_data.extend(prices)
            
            # 원본 저장
            pipeline.save_raw(
                {'list': prices}, 
                source='garak', 
                identifier=f"{crop}_{target_date}"
            )
    
    if all_data:
        # DataFrame 변환
        df = pd.DataFrame(all_data)
        
        # 숫자형 변환
        for col in ['price_min', 'price_max', 'price_avg']:
            df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # 가공 데이터 저장
        pipeline.save_processed(df, f"{crop}_recent")
        
        # 과거 데이터와 병합
        pipeline.merge_history(crop, df)
        
        logger.info(f"완료: 총 {len(df)}건 수집")
    else:
        logger.warning("수집된 데이터 없음")


if __name__ == "__main__":
    # 주요 작물 데이터 수집
    crops = ["감자", "딸기", "토마토", "상추"]
    
    for crop in crops:
        try:
            collect_price_data(crop, days_back=30)  # 최근 30일
        except Exception as e:
            logger.error(f"{crop} 수집 실패: {e}")
