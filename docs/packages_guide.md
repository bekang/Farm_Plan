# 패키지 설치 가이드

## 설치된 패키지 카테고리

### 📊 데이터 처리 & 성능
- **pandas** - 데이터 분석의 표준
- **polars** - Pandas보다 10배 빠른 데이터프레임 (대용량 데이터용)
- **pyarrow** - Apache Arrow 백엔드 (고성능 처리)
- **numpy** - 수치 연산

### 🗄️ 데이터베이스 & ORM
- **SQLAlchemy** - 강력한 SQL ORM
- **Alembic** - 데이터베이스 마이그레이션 도구
- **SQLModel** - Pydantic + SQLAlchemy 통합 (타입 안전성)

### 🌐 API & 네트워크
- **requests** - 동기 HTTP 클라이언트
- **httpx** - 비동기 HTTP 클라이언트 (성능 향상)
- **aiohttp** - 비동기 서버/클라이언트

### ✅ 데이터 검증
- **pydantic** - 데이터 검증 및 설정 관리
- **marshmallow** - 데이터 직렬화/검증

### 🎨 UI 컴포넌트
- **streamlit-option-menu** - 네비게이션 메뉴
- **streamlit-extras** - 유용한 추가 컴포넌트 모음
- **streamlit-lottie** - Lottie 애니메이션
- **streamlit-elements** - Material UI 컴포넌트
- **streamlit-card** - 카드 UI
- **streamlit-calendar** - 캘린더 위젯
- **streamlit-aggrid** - 고급 데이터 테이블
- **plotly** - 인터랙티브 차트

### 📈 시각화
- **matplotlib** - 정적 차트
- **seaborn** - 통계 시각화
- **altair** - 선언적 시각화

### 🚀 Git & 버전 관리
- **GitPython** - Python에서 Git 조작
- **watchdog** - 파일 변경 감지

### ⏰ 작업 스케줄링
- **schedule** - 간단한 작업 스케줄러
- **apscheduler** - 고급 스케줄러 (cron-like)

### 💾 캐싱
- **diskcache** - 디스크 기반 캐시
- **cachetools** - 메모리 캐시 유틸리티

### 📝 로깅 & 출력
- **loguru** - 간편한 로깅
- **rich** - 터미널 출력 미화
- **colorama** - 색상 출력 (Windows 호환)

### 🔧 CLI 도구
- **click** - CLI 프레임워크
- **typer** - 현대적 CLI (타입 힌트 기반)

### 🔒 보안
- **cryptography** - 암호화 라이브러리
- **python-jose** - JWT 토큰
- **passlib** - 비밀번호 해싱

### 🌐 배포 & 프로덕션
- **gunicorn** - WSGI 서버 (Linux/Mac)
- **uvicorn** - ASGI 서버 (비동기)

---

## 사용 예시

### 1. Polars로 고성능 데이터 처리
```python
import polars as pl

# CSV 읽기 (Pandas보다 빠름)
df = pl.read_csv("data/large_file.csv")

# 데이터 처리
result = (
    df.filter(pl.col("price") > 1000)
    .groupby("category")
    .agg(pl.col("price").mean())
)
```

### 2. SQLModel로 데이터베이스 관리
```python
from sqlmodel import Field, SQLModel, create_engine, Session

class Field(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    area: float

# 데이터베이스 생성
engine = create_engine("sqlite:///database.db")
SQLModel.metadata.create_all(engine)

# 데이터 삽입
with Session(engine) as session:
    field = Field(name="밭1", area=1000)
    session.add(field)
    session.commit()
```

### 3. GitPython으로 자동 커밋
```python
from git import Repo

repo = Repo(".")
repo.index.add(["data/*"])
repo.index.commit("Auto commit: data backup")
repo.remote("origin").push()
```

### 4. Schedule로 정기 백업
```python
import schedule
import time

def backup_to_nas():
    # NAS 백업 로직
    pass

# 매일 오후 6시에 백업
schedule.every().day.at("18:00").do(backup_to_nas)

while True:
    schedule.run_pending()
    time.sleep(60)
```

### 5. Streamlit-Option-Menu로 네비게이션
```python
from streamlit_option_menu import option_menu

selected = option_menu(
    menu_title="메인 메뉴",
    options=["홈", "필지 관리", "작물 계획"],
    icons=["house", "geo-alt", "calendar"],
    default_index=0,
    orientation="horizontal"
)
```

### 6. Rich로 터미널 출력 미화
```python
from rich.console import Console
from rich.table import Table

console = Console()

table = Table(title="작물 현황")
table.add_column("작물명")
table.add_column("면적")
table.add_row("토마토", "500평")

console.print(table)
```

---

## 설치 방법

### 전체 설치
```bash
pip install -r requirements.txt
```

### 개발 도구 추가 설치
```bash
pip install -r requirements-dev.txt
```

### 선택적 설치
```bash
# UI 컴포넌트만
pip install streamlit-option-menu streamlit-extras streamlit-lottie

# 데이터베이스만
pip install sqlalchemy alembic sqlmodel

# 성능 향상만
pip install polars pyarrow
```

---

## 프로젝트별 권장사항

### 소규모 프로젝트
- Pandas, Streamlit, SQLite
- 기본 UI 컴포넌트

### 중규모 프로젝트
- ✅ 현재 설치된 패키지 모두
- Polars (성능), SQLModel (타입 안전성)
- GitPython (자동화)

### 대규모 프로덕션
- 모든 패키지
- Redis (캐싱)
- Gunicorn/Uvicorn (배포)
- 모니터링 도구 추가

---

**버전**: 1.0.0  
**최종 업데이트**: 2026-01-01
