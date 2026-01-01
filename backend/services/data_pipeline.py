"""
API 데이터 처리 파이프라인
"""
import os
import json
import pandas as pd
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional
from backend.utils.logger import logger


class DataPipeline:
    """API 데이터 수집 -> 가공 -> 저장 파이프라인"""
    
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent.parent / "data"
        self.raw_dir = self.base_dir / "raw"
        self.processed_dir = self.base_dir / "processed"
        self.history_dir = self.base_dir / "history"
        
        # 디렉토리 생성
        for dir_path in [self.raw_dir, self.processed_dir, self.history_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
    
    def save_raw(self, data: Dict[str, Any], source: str, identifier: str) -> Path:
        """
        API 원본 데이터 저장
        
        Args:
            data: API 응답 데이터
            source: 데이터 소스 (예: 'garak', 'kamis', 'weather')
            identifier: 식별자 (예: 작물명, 날짜)
        
        Returns:
            저장된 파일 경로
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{source}_{identifier}_{timestamp}.json"
        filepath = self.raw_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"원본 데이터 저장: {filepath}")
        return filepath
    
    def process_price_data(self, raw_data: Dict, crop: str) -> pd.DataFrame:
        """
        가격 데이터 가공
        
        Args:
            raw_data: 원본 API 데이터
            crop: 작물명
        
        Returns:
            가공된 DataFrame
        """
        # 데이터 구조에 따라 파싱 로직 구현
        # 예시: Garak API 응답 가정
        
        records = []
        
        # XML 또는 JSON 구조에서 가격 정보 추출
        if isinstance(raw_data, dict):
            # JSON 형식 처리
            items = raw_data.get('list', [])
            for item in items:
                records.append({
                    'date': item.get('date'),
                    'crop': crop,
                    'grade': item.get('grade'),
                    'unit': item.get('unit'),
                    'price_min': item.get('price_min'),
                    'price_max': item.get('price_max'),
                    'price_avg': item.get('price_avg'),
                })
        
        df = pd.DataFrame(records)
        
        # 숫자형 변환
        numeric_cols = ['price_min', 'price_max', 'price_avg']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        return df
    
    def save_processed(self, df: pd.DataFrame, name: str) -> Path:
        """
        가공 데이터 저장
        
        Args:
            df: 가공된 DataFrame
            name: 파일명 (확장자 제외)
        
        Returns:
            저장된 파일 경로
        """
        filepath = self.processed_dir / f"{name}.csv"
        df.to_csv(filepath, index=False, encoding='utf-8-sig')
        
        logger.info(f"가공 데이터 저장: {filepath} ({len(df)}건)")
        return filepath
    
    def load_processed(self, name: str) -> Optional[pd.DataFrame]:
        """
        가공 데이터 로드
        
        Args:
            name: 파일명 (확장자 제외)
        
        Returns:
            DataFrame 또는 None
        """
        filepath = self.processed_dir / f"{name}.csv"
        if filepath.exists():
            logger.info(f"기존 데이터 로드: {filepath}")
            return pd.read_csv(filepath)
        return None
    
    def merge_history(self, crop: str, new_data: pd.DataFrame) -> pd.DataFrame:
        """
        과거 데이터와 신규 데이터 병합
        
        Args:
            crop: 작물명
            new_data: 신규 데이터
        
        Returns:
            병합된 DataFrame
        """
        history_file = self.history_dir / f"{crop}_history.csv"
        
        if history_file.exists():
            history_df = pd.read_csv(history_file)
            merged = pd.concat([history_df, new_data], ignore_index=True)
            
            # 중복 제거 (날짜+등급 기준)
            if 'date' in merged.columns and 'grade' in merged.columns:
                merged = merged.drop_duplicates(subset=['date', 'grade'], keep='last')
            
            merged = merged.sort_values('date')
        else:
            merged = new_data
        
        # 저장
        merged.to_csv(history_file, index=False, encoding='utf-8-sig')
        logger.info(f"과거 데이터 업데이트: {history_file} ({len(merged)}건)")
        
        return merged


# 싱글톤 인스턴스
pipeline = DataPipeline()
