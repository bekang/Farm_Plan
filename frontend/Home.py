import streamlit as st
import sys
import os
import pandas as pd

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.models.schemas import FarmField
from styles import apply_custom_styles

# In a real app, we'd use a database. For this "Local First" approach, 
# we'll mimic a session-based or file-based store for fields.
if "fields" not in st.session_state:
    st.session_state["fields"] = []

st.set_page_config(
    page_title="영농 수익 최적화 플래너", 
    page_icon="🌾", 
    layout="wide"
)

# Apply custom styles
apply_custom_styles()

st.title("🌾 영농 수익 최적화 대시보드")
st.markdown("#### 데이터 기반 영농 의사결정 지원 시스템")
st.markdown("---")

# --- Summary Metrics ---
total_fields = len(st.session_state["fields"])
total_area = sum([f.area for f in st.session_state["fields"]])

st.markdown("### 📊 주요 현황")
col1, col2, col3 = st.columns(3)
with col1:
    st.metric(
        label="등록 필지",
        value=f"{total_fields}개",
        delta="Ready" if total_fields > 0 else None
    )
with col2:
    st.metric(
        label="총 재배 면적", 
        value=f"{total_area:,.0f} ㎡",
        delta=f"{total_area/3.3:.0f}평" if total_area > 0 else None
    )
with col3:
    st.metric(
        label="올해 예상 순수익", 
        value="준비중",
        delta="시뮬레이션 필요"
    )

st.divider()

# --- Integrated Calendar (Mockup for UI structure) ---
st.subheader("📅 통합 영농 캘린더")
if total_fields == 0:
    st.info("등록된 필지가 없습니다. 좌측 메뉴의 'Fields'에서 필지를 등록해주세요.")
else:
    # Example of how we might show a timeline
    st.markdown("모든 필지의 파종/수확 일정을 한눈에 확인합니다.")
    # Here we would build a Gantt chart dataframe from session_state['plans']
    
st.divider()

# --- Quick Guide ---
st.info("""
**사용 가이드**
1. **Fields 메뉴**: 농장(필지)을 등록하고 토양/시설 정보를 설정하세요.
2. **Plan 메뉴**: 작물을 선택하고 시뮬레이션을 돌려 최적의 시기를 찾으세요.
3. **Dashboard**: 확정된 계획을 모니터링하세요.
""")
