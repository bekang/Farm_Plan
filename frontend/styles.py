"""
공통 스타일 설정
"""
import streamlit as st

def apply_custom_styles():
    """
    전체 애플리케이션에 적용할 커스텀 CSS
    """
    st.markdown("""
    <style>
    /* 한글 폰트 */
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Noto Sans KR', sans-serif;
    }
    
    /* 메인 타이틀 */
    h1 {
        font-size: 2.5rem !important;
        font-weight: 700 !important;
        color: #1e3a8a !important;
        margin-bottom: 0.5rem !important;
    }
    
    /* 서브타이틀 */
    h2 {
        font-size: 1.8rem !important;
        font-weight: 600 !important;
        color: #334155 !important;
        margin-top: 2rem !important;
    }
    
    h3 {
        font-size: 1.3rem !important;
        font-weight: 600 !important;
        color: #475569 !important;
    }
    
    /* 본문 텍스트 크기 증가 */
    p, .stMarkdown {
        font-size: 1.05rem !important;
        line-height: 1.7 !important;
        color: #334155 !important;
    }
    
    /* 메트릭 카드 스타일 개선 */
    [data-testid="stMetricValue"] {
        font-size: 2.2rem !important;
        font-weight: 700 !important;
    }
    
    [data-testid="stMetricLabel"] {
        font-size: 1.1rem !important;
        font-weight: 500 !important;
        color: #64748b !important;
    }
    
    /* 버튼 스타일 */
    .stButton > button {
        font-size: 1.05rem !important;
        font-weight: 500 !important;
        padding: 0.6rem 1.5rem !important;
        border-radius: 0.5rem !important;
        transition: all 0.2s !important;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
    }
    
    /* 입력 필드 */
    .stTextInput > div > div > input,
    .stNumberInput > div > div > input,
    .stSelectbox > div > div > select {
        font-size: 1.05rem !important;
        padding: 0.6rem !important;
    }
    
    /* 정보 박스 */
    .stAlert {
        font-size: 1.05rem !important;
        padding: 1rem 1.2rem !important;
    }
    
    /* 사이드바 */
    [data-testid="stSidebar"] {
        background-color: #f8fafc !important;
    }
    
    [data-testid="stSidebar"] .stMarkdown {
        font-size: 1rem !important;
    }
    
    /* 구분선 */
    hr {
        margin: 2rem 0 !important;
        border-color: #e2e8f0 !important;
    }
    
    /* 카드형 컨테이너 */
    [data-testid="stVerticalBlock"] > [data-testid="stVerticalBlock"] {
        background-color: white;
        padding: 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    /* 테이블 */
    .dataframe {
        font-size: 1rem !important;
    }
    
    .dataframe th {
        background-color: #f1f5f9 !important;
        font-weight: 600 !important;
        color: #334155 !important;
    }
    </style>
    """, unsafe_allow_html=True)
