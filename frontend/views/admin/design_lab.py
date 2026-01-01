import streamlit as st
import pandas as pd
import numpy as np

# 페이지 설정
st.set_page_config(
    page_title="디자인 실험실",
    page_icon="🎨",
    layout="wide"
)

def main():
    st.title("🎨 Design Lab")
    st.markdown("UI 요소 및 디자인 스타일을 테스트하는 공간입니다.")
    st.markdown("---")

    # 탭으로 섹션 구분
    tab1, tab2, tab3 = st.tabs(["🌈 Color & Font", "🧩 Components", "📊 Data & Charts"])

    with tab1:
        st.header("Color Palette")
        st.markdown("프로젝트에 사용될 주요 색상 테마입니다.")
        
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.markdown("### Primary")
            st.color_picker("Main Color", "#4CAF50", disabled=True)
            st.code("#4CAF50 (Green)", language="css")
        with col2:
            st.markdown("### Secondary")
            st.color_picker("Sub Color", "#FFC107", disabled=True)
            st.code("#FFC107 (Amber)", language="css")
        with col3:
            st.markdown("### Danger")
            st.color_picker("Alert Color", "#FF5252", disabled=True)
            st.code("#FF5252 (Red)", language="css")
        with col4:
            st.markdown("### Neutral")
            st.color_picker("Text/Bg", "#FAFAFA", disabled=True)
            st.code("#FAFAFA (White)", language="css")

        st.divider()
        st.header("Typography")
        st.markdown("# Heading 1: The quick brown fox")
        st.markdown("## Heading 2: The quick brown fox")
        st.markdown("### Heading 3: The quick brown fox")
        st.markdown("**Bold Text**: 강조된 텍스트입니다.")
        st.markdown("*Italic Text*: 기울임 텍스트입니다.")
        st.caption("Caption: 설명이나 보조 텍스트에 사용됩니다.")

    with tab2:
        st.header("UI Components")
        
        # 버튼 스타일
        st.subheader("Buttons")
        c1, c2, c3 = st.columns(3)
        with c1:
            st.button("Primary Button", type="primary")
        with c2:
            st.button("Secondary Button")
        with c3:
            st.button("Disabled Button", disabled=True)

        st.divider()

        # 알림 메시지
        st.subheader("Alerts")
        st.success("✅ 작업이 성공적으로 완료되었습니다.")
        st.info("ℹ️ 현재 시스템 점검 중입니다.")
        st.warning("⚠️ 입력 값을 다시 확인해주세요.")
        st.error("❌ 오류가 발생했습니다.")

        st.divider()
        
        # 입력 폼
        st.subheader("Input Forms")
        with st.form("design_lab_form"):
            c1, c2 = st.columns(2)
            with c1:
                st.text_input("이름", placeholder="홍길동")
                st.selectbox("작물 선택", ["딸기", "토마토", "파프리카"])
            with c2:
                st.number_input("재배 면적 (평)", min_value=0, value=100)
                st.multiselect("필요 자재", ["비료", "농약", "제초제"])
            
            st.slider("예상 수익률 (%)", 0, 100, 50)
            st.form_submit_button("Submit Form")

    with tab3:
        st.header("Data Visualization")
        
        # 메트릭 표시
        st.subheader("Key Metrics")
        m1, m2, m3, m4 = st.columns(4)
        m1.metric("예상 수익", "₩12,500,000", "+15%")
        m2.metric("작물 상태", "Good", "Normal")
        m3.metric("온도", "24.5 °C", "-1.2 °C")
        m4.metric("습도", "65%", "2%")

        st.divider()

        # 데이터프레임
        st.subheader("Data Table")
        data = pd.DataFrame(
            np.random.randn(10, 5),
            columns=('col %d' % i for i in range(5))
        )
        st.dataframe(data, use_container_width=True)

        st.divider()
        
        # 차트
        st.subheader("Chart")
        chart_data = pd.DataFrame(
            np.random.randn(20, 3),
            columns=['a', 'b', 'c']
        )
        st.line_chart(chart_data)

if __name__ == "__main__":
    main()
