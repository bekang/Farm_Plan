import streamlit as st
import streamlit_shadcn_ui as ui
import streamlit_antd_components as sac
from streamlit_extras.metric_cards import style_metric_cards

st.set_page_config(page_title="디자인 쇼케이스", page_icon="🎨", layout="wide")

st.title("🎨 UI 디자인 컴포넌트 쇼케이스")
st.markdown("""
피그마 없이도 **코드로 구현하는 모던한 디자인** 예시입니다.
새로 설치한 `shadcn-ui`와 `antd-components`를 활용했습니다.
""")

st.divider()

# ==========================================
# 1. Shadcn UI Examples (모던/깔끔)
# ==========================================
st.subheader("1. Shadcn UI 스타일 (Modern & Clean)")

col1, col2, col3 = st.columns(3)

with col1:
    ui.card(title="총 매출액", content="₩150,000,000", description="전년 대비 +15%", key="card1").render()

with col2:
    ui.card(title="활성 필지", content="12개", description="가동률 95%", key="card2").render()
    
with col3:
    ui.metric_card(title="수확 진행률", content="78%", description="목표 달성 임박", key="card3").render()

st.write("")
ui.badges(badge_list=[("토마토", "default"), ("딸기", "secondary"), ("재배중", "outline"), ("수확기", "destructive")], key="badges").render()

# ==========================================
# 2. Ant Design Components (고급 메뉴/탭)
# ==========================================
st.divider()
st.subheader("2. Ant Design 스타일 (고급 네비게이션)")

# 탭 메뉴
tab = sac.tabs([
    sac.TabsItem(label='재배 현황', icon='flower1'),
    sac.TabsItem(label='환경 제어', icon='thermometer-sun'),
    sac.TabsItem(label='설정', icon='gear'),
], align='center', variant='outline')

if tab == '재배 현황':
    st.info("현재 재배 중인 작물의 상태를 모니터링합니다.")
    
    # 스텝 진행도
    sac.steps(
        items=[
            sac.StepsItem(title='파종', description='3월 1일'),
            sac.StepsItem(title='생육', description='진행 중'),
            sac.StepsItem(title='수확', description='6월 예정'),
            sac.StepsItem(title='출하', disabled=True),
        ],
        format="title"
    )

elif tab == '환경 제어':
    st.warning("하우스 온도가 설정 범위보다 높습니다.")
    
    # 스위치
    col_a, col_b = st.columns(2)
    with col_a:
        sac.switch(label='자동 환기 시스템', value=True, align='start')
    with col_b:
        sac.switch(label='스마트 관수', value=False, align='start', size='lg')

# ==========================================
# 3. Alert & Callouts
# ==========================================
st.divider()
st.subheader("3. 알림 및 강조 (Alerts)")

sac.alert(label='주의: 내일 오전 강수 확률 80%', description='외부 시설물을 점검하세요.', color='warning', icon='cloud-rain')
sac.alert(label='시스템 정상 가동 중', color='success', icon='check-circle-fill', banner=True)

st.divider()
st.markdown("### 💡 결론")
st.markdown("""
- 별도의 디자인 툴을 설치하지 않아도, **전용 라이브러리**를 사용하면 프로페셔널한 디자인이 가능합니다.
- 위 컴포넌트들은 모바일에서도 깔끔하게 보입니다.
""")
