# Farm Calculator - 개발 환경 가이드

## 🚀 빠른 시작

### 1. 초기 설정 (최초 1회만)
```bash
init_dev.bat
```
이 명령은 다음을 자동으로 수행합니다:
- 가상환경 생성
- 모든 라이브러리 설치
- 개발 도구 설정 (black, ruff, pytest)
- 데이터베이스 초기화

### 2. 실행
```bash
run.bat
```

## 📦 설치된 도구

### 코드 품질
- **Black**: 자동 코드 포맷팅
- **Ruff**: 빠른 린터 (Flake8 + isort 통합)
- **MyPy**: 타입 체크
- **Pre-commit**: Git 커밋 전 자동 검사

### 테스팅
- **Pytest**: 테스트 프레임워크
- **Coverage**: 코드 커버리지 측정

### 개발 편의
- **Loguru**: 강력한 로깅
- **Rich**: 터미널 출력 미화
- **Watchdog**: 파일 변경 자동 감지

## 🛠️ 개발 명령어

### 코드 포맷팅
```bash
# 자동 포맷
venv\Scripts\black.exe backend frontend

# 체크만 (변경 안 함)
venv\Scripts\black.exe --check backend frontend
```

### 린팅
```bash
venv\Scripts\ruff.exe check backend frontend
```

### 테스트 실행
```bash
venv\Scripts\pytest.exe
```

### 커버리지 확인
```bash
venv\Scripts\pytest.exe --cov=backend --cov-report=html
```
결과는 `htmlcov/index.html`에서 확인

## 📁 프로젝트 구조
```
farm_calculator/
├── backend/          # 백엔드 로직
│   ├── api_clients/  # API 클라이언트
│   ├── services/     # 비즈니스 로직
│   ├── models/       # 데이터 모델
│   └── utils/        # 유틸리티
├── frontend/         # Streamlit UI
│   └── pages/        # 페이지들
├── data/             # 데이터 파일
│   ├── raw/          # API 원본 데이터
│   ├── processed/    # 가공 데이터
│   └── history/      # 과거 데이터
├── logs/             # 로그 파일
├── tests/            # 테스트 코드
└── venv/             # 가상환경
```

## 🔧 설정 파일
- `pyproject.toml`: Black, Ruff, MyPy, Pytest 설정
- `.pre-commit-config.yaml`: Git 훅 설정
- `requirements.txt`: Python 패키지 목록

## 💡 팁

### 자동 포맷팅 훅 활성화
커밋 전 자동으로 코드를 포맷팅하려면:
```bash
venv\Scripts\pre-commit.exe install
```

### VS Code 설정
`.vscode/settings.json` 추가:
```json
{
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "python.linting.enabled": true,
  "python.linting.ruffEnabled": true
}
```

---

## 🚀 배포 및 버전 관리

### Git 워크플로우

#### Git 초기 설정 (최초 1회)
```bash
scripts\git_init.bat
```

#### 일상 개발 흐름
```bash
# 1. 최신 코드 가져오기
git pull origin main

# 2. 개발 작업 수행
# ...

# 3. 변경사항 확인
git status

# 4. 파일 추가
git add .

# 5. 커밋
git commit -m "feat: 새 기능 추가"

# 6. GitHub에 업로드
git push origin main
```

#### 커밋 메시지 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가
chore: 빌드/설정 변경
```

### NAS 배포

#### NAS 설정 (최초 1회)
```bash
# 템플릿 복사
copy deploy\nas_config.bat.template deploy\nas_config.bat

# 설정 파일 편집
notepad deploy\nas_config.bat
# set NAS_PATH=\\YOUR_NAS_IP\share\farm_calculator 설정
```

#### NAS에 배포
```bash
scripts\deploy_to_nas.bat
```

#### NAS에서 복원
```bash
scripts\backup_from_nas.bat
```

### 통합 워크플로우
```bash
# 1. 개발 및 테스트
run.bat

# 2. Git 커밋
git add .
git commit -m "변경 내용"
git push origin main

# 3. NAS 배포
scripts\deploy_to_nas.bat
```

---

## 📚 추가 리소스

- **배포 가이드**: [docs/08_deployment_guide.md](docs/08_deployment_guide.md)
- **시스템 아키텍처**: [docs/02_system_architecture.md](docs/02_system_architecture.md)
- **문서 총람**: [docs/00_index.md](docs/00_index.md)
