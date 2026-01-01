import streamlit as st
import sys
import os
import pandas as pd
from datetime import date, timedelta
import plotly.express as px

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from backend.services.simulator import Simulator
from backend.services.price_analysis import PriceAnalyzer
from backend.services.cost_estimation import CostEstimator
# Mock Clients for now (In real integration, these would be the actual clients)
from backend.api_clients.price import PriceClient 
from styles import apply_custom_styles

st.set_page_config(page_title="수익 시뮬레이션", page_icon="📈", layout="wide")
apply_custom_styles()

st.title("📈 수익 최적화 시뮬레이션")
st.markdown("#### 과거 데이터 기반 최적 작기 추천 및 전략 비교")
st.markdown("---")

if "fields" not in st.session_state or not st.session_state["fields"]:
    st.warning("먼저 'Fields' 메뉴에서 필지를 등록해주세요.")
    st.stop()

# --- 1. 설정: 어디에 무엇을? ---
col1, col2 = st.columns(2)
with col1:
    field_options = {f.name: f for f in st.session_state["fields"]}
    selected_field_name = st.selectbox("필지 선택", list(field_options.keys()))
    field = field_options[selected_field_name]

with col2:
    crop = st.selectbox("작물 선택", ["딸기", "토마토", "파프리카", "상추"])

# --- 2. Golden Time 분석 ---
st.divider()
st.subheader("1️⃣ Golden Time 분석 (최적 작기 추천)")

# Analyzer Init
analyzer = PriceAnalyzer(PriceClient()) 
# 실제 서비스에서는 await/async 처리 혹은 캐싱된 데이터 사용
golden_time = analyzer.find_golden_time(crop)

c1, c2 = st.columns(2)
with c1:
    st.info(f"""
    **💡 추천 파종 시기: {golden_time['recommended_planting_month']}**
    - 목표 출하: {golden_time['peak_month']} (연중 최고가 시즌)
    - 예상 최고가: {golden_time['peak_price_avg']:,}원
    """)

import plotly.express as px

# ... (Previous code)

with c2:
    # Monthly Trend Chart (Plotly)
    df_trend = analyzer.get_monthly_trend(crop)
    
    fig = px.line(
        df_trend, 
        x='month', 
        y='price', 
        title=f'{crop} 월별 가격 추이',
        labels={'month': '월', 'price': '평균 도매가(원)'},
        markers=True
    )
    fig.update_layout(height=300)
    st.plotly_chart(fig, use_container_width=True)

# --- 3. 전략 시뮬레이션 설정 ---
st.divider()
st.subheader("2️⃣ 전략 시뮬레이션")

planting_date = st.date_input("파종일 결정", date.today())

if st.button("🚀 시뮬레이션 실행 (Active vs Passive)"):
    simulator = Simulator()
    
    # Mock Weather Data for Simulation
    # In real app, fetch from WeatherClient based on field.region
    mock_weather = {'temp': 5.0} # 겨울 가정
    
    # Mock Current/Target Price (Using peak price for estimation)
    target_price = golden_time['peak_price_avg']
    
    result_compare = simulator.run_simulation(field, crop, planting_date, mock_weather, target_price)
    
    # --- 결과 표시 ---
    st.write("### 📊 전략별 예상 성적표")
    
    cols = st.columns(len(result_compare.results))
    
    best_roi = -999
    best_strategy = None
    
    for idx, res in enumerate(result_compare.results):
        is_best = False
        if res.roi > best_roi:
            best_roi = res.roi
            best_strategy = res.strategy_name
            
    for idx, res in enumerate(result_compare.results):
        with cols[idx]:
            with st.container(border=True):
                st.markdown(f"#### {res.strategy_name}")
                if res.strategy_name == best_strategy:
                    st.caption("✅ 최고 효율 전략")
                
                st.metric("순수익", f"{res.net_profit:,.0f}원", delta=f"{res.roi:.1f}% ROI")
                st.markdown(f"**매출**: {res.expected_revenue:,.0f}원")
                st.markdown(f"**총 비용**: {res.total_cost:,.0f}원")
                
                st.divider()
                st.markdown("**비용 상세**")
                st.text(f"난방비: {res.heating_cost:,.0f}")
                st.text(f"비료비: {res.fertilizer_cost:,.0f}")
                st.text(f"인건비: {res.labor_cost:,.0f}")

    # 최종 제안
    st.success(f"**결론**: '{field.name}'에서 '{crop}' 재배 시 **[{best_strategy}]** 전략이 수익률 측면에서 가장 유리합니다.")
