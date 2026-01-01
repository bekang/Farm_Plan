import streamlit as st

# ==========================================
# 1. 페이지 기본 설정 (가장 먼저 실행)
# ==========================================
st.set_page_config(
    page_title="농부 강현 - 스마트팜 관리 시스템",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ==========================================
# 2. 로그인 세션 관리
# ==========================================
if "logged_in" not in st.session_state:
    st.session_state.logged_in = False
if "role" not in st.session_state:
    st.session_state.role = None
if "user_name" not in st.session_state:
    st.session_state.user_name = None

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
# 3. 로그인 화면 (비로그인 시 표시)
# ==========================================
if not st.session_state.logged_in:
    
    # 화면 중앙 정렬을 위한 여백
    _, col, _ = st.columns([1, 2, 1])
    
    with col:
        st.write("")
        st.write("")
        st.markdown("""
        <div style="text-align: center; margin-top: 50px;">
            <h1>🌾 농부 강현</h1>
            <p style="font-size: 1.2em; color: gray;">데이터 기반 스마트 영농 관리 시스템</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.write("")
        st.write("")
        st.write("")
        
        # 로그인 버튼 컨테이너
        login_container = st.container(border=True)
        with login_container:
            st.subheader("로그인")
            st.markdown("서비스 이용을 위해 로그인해주세요.")
            
            st.write("")
            
            # 소셜 로그인 버튼 (Mock)
            # 네이버 로그인 -> 관리자 권한 부여 (개발용)
            if st.button("🇳 Naver로 시작하기 (관리자)", type="primary", use_container_width=True):
                login("admin", "강현 (관리자)")
            
            st.write("")

            # 구글 로그인 -> 일반 사용자 권한 부여 (개발용)
            if st.button("🇬 Google로 시작하기 (사용자)", use_container_width=True):
                login("user", "방문자 (사용자)")

    st.markdown("""
    <style>
    .stButton button {
        height: 50px;
        font-size: 16px;
        font-weight: bold;
    }
    </style>
    """, unsafe_allow_html=True)
    
    # 로그인 상태가 아니면 여기서 실행 중단
    st.stop()

# ==========================================
# 4. 네비게이션 설정 (로그인 후)
# ==========================================

# 사이드바 상단에 사용자 프로필 표시
with st.sidebar:
    st.write("")
    st.subheader(f"👋 반갑습니, {st.session_state.user_name}님")
    if st.session_state.role == "admin":
        st.caption("👑 관리자 모드")
    else:
        st.caption("👤 일반 사용자 모드")
    
    if st.button("로그아웃", type="secondary"):
        logout()
    
    st.divider()

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
    # 관리자는 모든 메뉴 볼 수 있음
    pg = st.navigation({
        "관리자 도구": admin_pages,
        "사용자 메뉴": user_pages
    })
else:
    # 일반 사용자는 사용자 메뉴만
    pg = st.navigation({
        "농장 관리": user_pages
    })

# ==========================================
# 5. 선택된 페이지 실행
# ==========================================
pg.run()
