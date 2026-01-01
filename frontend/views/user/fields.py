import streamlit as st
import pandas as pd
import uuid
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from backend.models.schemas import FarmField, FacilitySpec, SoilSpec
from styles import apply_custom_styles

st.set_page_config(page_title="필지 관리", page_icon="🚜", layout="wide")
apply_custom_styles()

st.title("🚜 필지 및 시설 관리")
st.markdown("#### 농장의 세부 환경 설정으로 정밀한 비용 산출 기반 마련")
st.markdown("---")

if "fields" not in st.session_state:
    st.session_state["fields"] = []

# --- 필지 등록 폼 ---
with st.expander("➕ 새 필지 등록하기", expanded=True):
    with st.form("add_field_form"):
        col1, col2 = st.columns(2)
        with col1:
            name = st.text_input("필지 이름 (예: 제1농장)", value=f"농장 #{len(st.session_state['fields'])+1}")
            region = st.selectbox("지역", ["전북 익산", "경기 이천", "경남 진주", "강원 평창"])
            area = st.number_input("면적 (㎡)", min_value=330.0, value=1000.0, step=100.0)
        
        with col2:
            f_type = st.selectbox("시설 유형", ["비닐하우스", "유리온실", "노지"])
            
            # 시설 세부 설정 (Conditional)
            insulation = "없음"
            heater = "없음"
            loss_rate = 5.0 # 노지 기본값
            
            if f_type != "노지":
                insulation = st.selectbox("보온 자재", ["단동비닐", "이중커튼", "다겹보온커튼"])
                heater = st.selectbox("난방기 종류", ["전기온풍기", "경유온풍기", "수막시설"])
                
                # 열관류율(U값) 추정 로직 (Mock logic)
                if insulation == "다겹보온커튼": loss_rate = 1.8
                elif insulation == "이중커튼": loss_rate = 2.5
                else: loss_rate = 4.5
            
        st.markdown("---")
        st.markdown("**토양 정보 (선택)**")
        soil_ph = st.slider("토양 산도 (pH)", 4.0, 9.0, 6.5)
        soil_ec = st.slider("전기전도도 (EC)", 0.0, 5.0, 1.0)
        
        submitted = st.form_submit_button("필지 저장")
        
        if submitted:
            new_field = FarmField(
                id=str(uuid.uuid4())[:8],
                name=name,
                region=region,
                area=area,
                facility=FacilitySpec(
                    type=f_type,
                    insulation_type=insulation,
                    heater_type=heater,
                    heat_loss_rate=loss_rate
                ),
                soil=SoilSpec(ph=soil_ph, ec=soil_ec)
            )
            st.session_state["fields"].append(new_field)
            st.success(f"'{name}' 등록 완료! (열관류율: {loss_rate})")

from st_aggrid import AgGrid, GridOptionsBuilder, GridUpdateMode

# --- 등록된 필지 목록 (AgGrid) ---
st.divider()
st.subheader(f"등록된 필지 ({len(st.session_state['fields'])})")

if st.session_state["fields"]:
    # Convert Pydantic models to dicts for DataFrame
    data = [f.dict() for f in st.session_state["fields"]]
    
    # Flatten facility info for display
    display_data = []
    for d in data:
        row = {
            "ID": d['id'],
            "이름": d['name'],
            "지역": d['region'],
            "면적(㎡)": d['area'],
            "시설유형": d['facility']['type'],
            "보온자재": d['facility']['insulation_type'],
            "난방기": d['facility']['heater_type']
        }
        display_data.append(row)
        
    df_fields = pd.DataFrame(display_data)

    gb = GridOptionsBuilder.from_dataframe(df_fields)
    gb.configure_selection('single', use_checkbox=True)
    gb.configure_column("ID", hide=True)
    gridOptions = gb.build()

    grid_response = AgGrid(
        df_fields,
        gridOptions=gridOptions,
        update_mode=GridUpdateMode.SELECTION_CHANGED,
        fit_columns_on_grid_load=True,
        theme='balham' # 'streamlit', 'alpine', 'balham', 'material'
    )
    
    selected = grid_response['selected_rows']
    if selected:
        # selected is a list of dictionaries (rows)
        # Note: st_aggrid returns a list even for single selection
        # Wait, the return structure might depend on version, safest is to check length
        if len(selected) > 0:
            # selected_row is likely the first element if single selection
            # But converting back to a DataFrame Row or Dict
             st.info(f"선택된 필지: {selected[0]['이름']}")
             if st.button("선택한 필지 삭제"):
                # Find and remove
                target_id = selected[0]['ID']
                st.session_state['fields'] = [f for f in st.session_state['fields'] if f.id != target_id]
                st.rerun()

else:
    st.info("등록된 필지가 없습니다.")
