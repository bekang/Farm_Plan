import os
import pandas as pd
import glob

def convert_history():
    history_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "history")
    xlsx_files = glob.glob(os.path.join(history_dir, "*.xlsx"))
    
    print(f"Found {len(xlsx_files)} Excel files in {history_dir}")
    
    mapping = {
        "감자": "potato",
        "고구마": "sweet_potato",
        "딸기": "strawberry",
        "상추": "lettuce",
        "토마토": "tomato",
        "파프리카": "paprika",
        "쌀": "rice"
    }

    for file_path in xlsx_files:
        try:
            filename = os.path.basename(file_path)
            print(f"Processing {filename}...")
            
            # 파일명에서 작물 이름 추출 (예: "감자(2020...).xlsx" -> "감자")
            crop_kr = filename.split('(')[0].strip()
            
            df = pd.read_excel(file_path)
            
            # 가락시장 데이터포맷에 맞춘 전처리
            # 보통 날짜 컬럼, 가격 컬럼 등이 있음.
            # 여기서는 단순 변환만 수행하고, 컬럼 매핑은 나중에 필요 시 추가.
            
            # 영문 작물명 매핑 (없으면 한글 그대로 사용)
            crop_en = mapping.get(crop_kr, crop_kr)
            
            csv_path = os.path.join(history_dir, f"{crop_en}_history.csv")
            df.to_csv(csv_path, index=False, encoding='utf-8-sig')
            print(f"Saved to {csv_path}")
            
        except Exception as e:
            print(f"Error converting {file_path}: {e}")

if __name__ == "__main__":
    convert_history()
