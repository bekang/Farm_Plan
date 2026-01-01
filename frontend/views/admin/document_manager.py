import streamlit as st
import os
from pathlib import Path

# 페이지 설정
st.set_page_config(
    page_title="프로젝트 문서함",
    page_icon="📚",
    layout="wide"
)

# 문서 경로 설정
DOCS_DIR = Path(__file__).parents[2] / "docs"

def load_document(file_path):
    """지정된 경로의 마크다운 파일을 읽어서 반환합니다."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return f"문서를 불러오는 중 오류가 발생했습니다: {str(e)}"

def main():
    st.title("📚 프로젝트 문서 관리자")
    st.markdown("---")

    # 사이드바: 문서 목록 표시
    if not DOCS_DIR.exists():
        st.error(f"문서 폴더를 찾을 수 없습니다: {DOCS_DIR}")
        return

    # 마크다운 파일만 필터링
    doc_files = sorted([f.name for f in DOCS_DIR.glob("*.md")])

    if not doc_files:
        st.warning("표시할 문서가 없습니다.")
        return

    selected_doc = st.sidebar.radio(
        "📝 문서 목록",
        doc_files,
        index=0
    )

    # 선택된 문서 내용 표시
    if selected_doc:
        file_path = DOCS_DIR / selected_doc
        content = load_document(file_path)
        
        st.subheader(f"📄 {selected_doc}")
        
        # 파일 정보 표시
        file_stat = file_path.stat()
        st.caption(f"마지막 수정: {file_stat.st_mtime}")
        
        st.markdown(content)

if __name__ == "__main__":
    main()
