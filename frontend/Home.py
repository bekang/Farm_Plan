import streamlit as st
import base64
import os

# ==========================================
# 1. 페이지 기본 설정 & 초기화
# ==========================================
st.set_page_config(
    page_title="농부 강현 - 스마트팜 관리",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 세션 상태 초기화
if "logged_in" not in st.session_state:
    st.session_state.logged_in = False
if "role" not in st.session_state:
    st.session_state.role = None
if "user_name" not in st.session_state:
    st.session_state.user_name = None

def get_base64_of_bin_file(bin_file):
    """이미지 파일을 Base64 문자열로 변환합니다."""
    with open(bin_file, 'rb') as f:
        data = f.read()
    return base64.b64encode(data).decode()

def login(role, name):
    st.session_state.logged_in = True
    st.session_state.role = role
    st.session_state.user_name = name
    st.rerun()

def logout():
    st.session_state.logged_in = False
    st.session_state.role = None
    st.session_state.user_name = None
    st.rerun()

# ==========================================
# 2. 로그인 화면 (비로그인 상태)
# ==========================================
if not st.session_state.logged_in:
    
    # ------------------------------------
    # CSS: 배경 & 디자인 적용
    # ------------------------------------
    # 이미지 경로
    img_path = os.path.join(os.path.dirname(__file__), "assets/login_bg.png")
    
    # 이미지 존재 여부 확인 후 적용
    if os.path.exists(img_path):
        bin_str = get_base64_of_bin_file(img_path)
        background_css = f"""
        <style>
        /* 전체 배경 설정 */
        .stApp {{
            background-image: url("data:image/png;base64,{bin_str}");
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
        }}
        
        /* 어두운 오버레이 추가 */
        .stApp::before {{
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            z-index: -1;
        }}
        </style>
        """
        st.markdown(background_css, unsafe_allow_html=True)
    
    # ------------------------------------
    # UI: 글래스모피즘 카드 & 로그인 폼
    # ------------------------------------
    
    # 화면 중앙 배치를 위한 간격
    st.markdown("<br><br><br><br>", unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns([1, 1.2, 1])
    
    with col2:
        # 카드 디자인 컨테이너
        st.markdown("""
        <div style="
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 40px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            text-align: center;
        ">
            <h1 style="color: white; font-family: 'Noto Sans KR', sans-serif; margin-bottom: 0px;">🌾 농부 강현</h1>
            <p style="color: #E0E0E0; font-size: 1.1em; margin-bottom: 30px;">
                데이터로 짓는 미래의 농업
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        # 버튼 영역 (Streamlit 위젯 사용)
        # 카드 내부처럼 보이게 하기 위해 여백 조정 불가능하므로, 아래에 배치
        # 시각적 일체감을 위해 컨테이너 사용
        
        with st.container():
            st.markdown('<div style="height: 20px;"></div>', unsafe_allow_html=True)
            
            # 네이버 로그인 (Green)
            if st.button("🇳 Naver로 시작하기 (Admin)", type="primary", use_container_width=True):
                login("admin", "강현 (관리자)")
                
            st.markdown('<div style="height: 10px;"></div>', unsafe_allow_html=True)
            
            # 구글 로그인 (Default)
            if st.button("🇬 Google로 시작하기 (User)", use_container_width=True):
                login("user", "방문자 (사용자)")

    # 저작권 푸터
    st.markdown("""
    <div style="position: fixed; bottom: 20px; width: 100%; text-align: center; color: rgba(255,255,255,0.7); font-size: 0.8em;">
        © 2026 Farmer Kang Hyon. All rights reserved.
    </div>
    """, unsafe_allow_html=True)
    
    st.stop()

# ==========================================
# 3. 로그인 후 화면 (사이드바 & 라우팅)
# ==========================================

# 사이드바 프로필
with st.sidebar:
    st.markdown("---")
    st.subheader(f"👋 {st.session_state.user_name}님")
    role_badge = "👑 관리자" if st.session_state.role == "admin" else "👤 사용자"
    st.caption(f"접속 권한: {role_badge}")
    
    if st.button("로그아웃", key="logout_btn"):
        logout()

# 페이지 정의
# Path는 Home.py 기준 상대 경로
user_pages = [
    st.Page("views/user/plan.py", title="영농 계획 수립", icon="📅"),
    st.Page("views/user/fields.py", title="내 농지 관리", icon="🌱"),
]

admin_pages = [
    st.Page("views/admin/document_manager.py", title="기획 문서 관리", icon="📚"),
    st.Page("views/admin/design_lab.py", title="디자인 실험실", icon="🎨"),
]

# 권한에 따른 메뉴 구성
if st.session_state.role == "admin":
    pg = st.navigation({
        "관리자 도구": admin_pages,
        "사용자 메뉴": user_pages
    })
else:
    pg = st.navigation({
        "농장 관리": user_pages
    })

pg.run()
