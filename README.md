# 농업 수익 최적화 플래너
## Farm Calculator

데이터 기반 영농 의사결정 지원 시스템

---

## 🚀 빠른 시작

### Python 설치
먼저 Python 3.10 이상을 설치하세요: https://www.python.org/downloads/
- 설치 시 **"Add Python to PATH"** 옵션 체크 필수!

### 초기 설정 (최초 1회)
```cmd
init_dev.bat
```

### 실행
```cmd
run.bat
```

브라우저에서 `http://localhost:8501` 자동 실행

---

## 📚 프로젝트 문서

### 종합 문서 (docs/)

프로젝트의 모든 기획, 설계, 사업, 사용자 문서가 준비되어 있습니다.

#### 📖 문서 목록

| 문서 | 설명 | 링크 |
|------|------|------|
| **문서 총람** | 모든 문서의 네비게이션 허브 | [00_index.md](docs/00_index.md) |
| **프로젝트 개요** | 비전, 목표, 핵심 기능 | [01_project_overview.md](docs/01_project_overview.md) |
| **시스템 아키텍처** | 계층 구조, 컴포넌트 다이어그램 | [02_system_architecture.md](docs/02_system_architecture.md) |
| **데이터 구조** | ERD, 스키마, 데이터 흐름 | [03_data_structure.md](docs/03_data_structure.md) |
| **UI/UX 디자인** | 디자인 시스템, 와이어프레임 | [04_ui_ux_design.md](docs/04_ui_ux_design.md) |
| **기능 명세서** | 상세 스펙, 구현 로드맵 | [05_feature_specifications.md](docs/05_feature_specifications.md) |
| **사업계획서** | 시장 분석, 재무 계획 | [06_business_plan.md](docs/06_business_plan.md) |
| **사용자 매뉴얼** | 설치, 사용법, FAQ | [07_user_manual.md](docs/07_user_manual.md) |
| **배포 가이드** | NAS/GitHub 배포, 백업 전략 | [08_deployment_guide.md](docs/08_deployment_guide.md) |

#### 🎯 역할별 추천 문서

- **개발자**: 시스템 아키텍처 → 데이터 구조 → 기능 명세서
- **디자이너**: UI/UX 디자인
- **PM/기획자**: 프로젝트 개요 → 기능 명세서
- **투자자/경영진**: 사업계획서 → 프로젝트 개요
- **사용자**: 사용자 매뉴얼

---

## 📊 API 데이터 수집

### 가격 데이터 수집
```cmd
venv\Scripts\python backend\scripts\collect_data.py
```

이 명령은 자동으로:
- 가락시장 API에서 최근 30일 데이터 수집
- `data/raw/` 폴더에 원본 저장
- `data/processed/` 폴더에 가공 데이터 저장
- `data/history/` 폴더에 과거 데이터 누적

---

## 📁 프로젝트 구조

```
farm_calculator/
├── backend/              # 백엔드 로직
│   ├── api_clients/      # API 클라이언트
│   ├── services/         # 비즈니스 로직
│   ├── models/           # 데이터 모델
│   └── utils/            # 유틸리티
├── frontend/             # Streamlit UI
│   ├── Home.py           # 메인 대시보드
│   └── pages/            # 페이지들
├── data/                 # 데이터 파일
│   ├── raw/              # API 원본 데이터
│   ├── processed/        # 가공 데이터
│   └── history/          # 과거 데이터
├── docs/                 # 📚 프로젝트 문서
│   ├── 00_index.md       # 문서 총람
│   ├── 01_project_overview.md
│   ├── 02_system_architecture.md
│   ├── 03_data_structure.md
│   ├── 04_ui_ux_design.md
│   ├── 05_feature_specifications.md
│   ├── 06_business_plan.md
│   └── 07_user_manual.md
├── logs/                 # 로그 파일
├── tests/                # 테스트 코드
├── config/               # 설정 파일
├── venv/                 # 가상환경
├── init_dev.bat          # 초기 설정
├── run.bat               # 실행 스크립트
├── requirements.txt      # Python 패키지
└── README.md             # 이 파일
```

---

## 🔑 API 설정

`config/.env` 파일에 API 키를 입력하세요:
```
WEATHER_API_KEY=your_key_here
SOIL_API_KEY=your_key_here
PRICE_API_KEY=your_key_here
```

### API 키 발급 방법
- **기상청**: https://www.data.go.kr
- **KAMIS**: https://www.kamis.or.kr
- **농진청**: https://www.rda.go.kr

자세한 내용은 [사용자 매뉴얼](docs/07_user_manual.md#api-키-설정)을 참고하세요.

---

## 🚀 배포 및 버전 관리

### NAS 배포

#### 1. NAS 설정
```cmd
copy deploy\nas_config.bat.template deploy\nas_config.bat
notepad deploy\nas_config.bat
```

`deploy\nas_config.bat`에서 NAS 경로 설정:
```batch
set NAS_PATH=\\YOUR_NAS_IP\share\farm_calculator
set BACKUP_ENABLED=true
```

#### 2. NAS에 배포
```cmd
scripts\deploy_to_nas.bat
```

#### 3. NAS에서 복원
```cmd
scripts\backup_from_nas.bat
```

### Git 버전 관리

#### Git 설치
https://git-scm.com/download/win

#### Git 저장소 초기화
```cmd
scripts\git_init.bat
```

#### 일상 Git 워크플로우
```cmd
# 변경사항 커밋
git add .
git commit -m "feat: 새 기능 추가"
git push origin main

# 최신 변경사항 가져오기
git pull origin main
```

### 통합 워크플로우
```cmd
# 1. 개발
run.bat

# 2. Git 커밋
git add .
git commit -m "변경 내용"
git push origin main

# 3. NAS 배포
scripts\deploy_to_nas.bat
```

자세한 내용은 [배포 가이드](docs/08_deployment_guide.md)를 참고하세요.

---

## 🛠️ 개발 가이드

개발 환경 설정 및 코드 품질 도구에 대한 자세한 내용은:
- [DEV_GUIDE.md](DEV_GUIDE.md) - 개발 환경 가이드
- [시스템 아키텍처](docs/02_system_architecture.md) - 아키텍처 설계

---

## 🎯 핵심 기능

- ✅ **필지 관리**: 다중 필지 등록 및 토양 정보 관리
- ✅ **작물 계획**: 시뮬레이션 기반 최적 파종 시기 추천
- ✅ **재무 분석**: 수익/비용 추정 및 ROI 계산
- 📊 **데이터 분석**: 가격 추이, 골든 타임 분석
- 📅 **통합 캘린더**: 전체 영농 일정 Gantt Chart

자세한 기능은 [기능 명세서](docs/05_feature_specifications.md)를 참고하세요.

---

## 🛠️ 문제 해결

### Python을 찾을 수 없습니다
- PATH에 Python이 등록되었는지 확인
- 새 명령 프롬프트를 열어보세요

### 라이브러리 설치 오류
```cmd
venv\Scripts\pip install -r requirements.txt --upgrade
```

더 많은 문제 해결 방법은 [사용자 매뉴얼](docs/07_user_manual.md#문제-해결)을 참고하세요.

---

## 🤝 기여

이 프로젝트는 오픈소스입니다. 기여를 환영합니다!

1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request

---

## 📄 라이선스

MIT License (예정)

---

## 📞 연락처

- **프로젝트 홈**: https://github.com/your-repo/farm_calculator
- **이슈**: https://github.com/your-repo/farm_calculator/issues
- **문서**: [docs/00_index.md](docs/00_index.md)

---

**버전**: 1.0.0  
**최종 업데이트**: 2026-01-01

