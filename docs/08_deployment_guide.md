# Farm Calculator - 배포 및 운영 가이드

## 목차
1. [배포 전략 개요](#배포-전략-개요)
2. [NAS 배포](#nas-배포)
3. [GitHub 버전 관리](#github-버전-관리)
4. [개발 환경 구축](#개발-환경-구축)
5. [백업 및 복구](#백업-및-복구)
6. [트러블슈팅](#트러블슈팅)

---

## 배포 전략 개요

### 하이브리드 전략

Farm Calculator는 **GitHub**와 **NAS**를 동시에 활용하는 하이브리드 배포 전략을 사용합니다.

```mermaid
graph LR
    A[로컬 개발] --> B[Git Commit]
    A --> C[NAS 배포]
    B --> D[GitHub Push]
    C --> E[NAS 백업]
    D --> F[협업/버전관리]
    E --> G[운영/데이터백업]
```

| 용도 | GitHub | NAS |
|------|--------|-----|
| **소스 코드 관리** | ✅ | ❌ |
| **버전 관리** | ✅ | ❌ |
| **협업** | ✅ | ❌ |
| **프로덕션 배포** | ❌ | ✅ |
| **데이터 백업** | ❌ | ✅ |
| **API 키 보관** | ❌ | ✅ |
| **대용량 파일** | ❌ | ✅ |

---

## NAS 배포

### 1. NAS 설정

#### 1.1 설정 파일 생성

```batch
# 1. 템플릿 복사
copy deploy\nas_config.bat.template deploy\nas_config.bat

# 2. nas_config.bat 편집
notepad deploy\nas_config.bat
```

#### 1.2 NAS 경로 설정

`deploy\nas_config.bat` 파일에서 실제 NAS 경로를 입력:

```batch
# NAS IP 주소 사용
set NAS_PATH=\\192.168.1.100\share\farm_calculator

# 또는 NAS 이름 사용
set NAS_PATH=\\MYNAS\backup\farm_calculator

# 또는 매핑된 드라이브 사용
set NAS_PATH=Z:\farm_calculator

# 백업 활성화
set BACKUP_ENABLED=true
```

### 2. NAS 폴더 구조

배포 시 NAS에 자동으로 생성되는 구조:

```
NAS/farm_calculator/
├── production/              # 프로덕션 환경
│   ├── app/                # 실행 파일
│   │   ├── backend/
│   │   ├── frontend/
│   │   ├── requirements.txt
│   │   └── run.bat
│   ├── data/               # 운영 데이터
│   │   ├── raw/
│   │   ├── processed/
│   │   └── history/
│   └── config/             # 설정 (API 키 포함)
│       └── .env
├── backups/                # 자동 백업
│   ├── daily/              # 일일 백업
│   ├── weekly/             # 주간 백업 (수동)
│   └── monthly/            # 월간 백업 (수동)
└── releases/               # 릴리스 아카이브
    ├── v1.0.0/
    └── v1.0.1/
```

### 3. NAS 배포 실행

#### 3.1 첫 배포

```batch
# NAS에 배포
scripts\deploy_to_nas.bat
```

스크립트가 자동으로:
1. NAS 연결 확인
2. 폴더 구조 생성
3. 애플리케이션 파일 동기화
4. 데이터 파일 동기화
5. 설정 파일 백업
6. (선택) 압축 백업 생성

#### 3.2 일상 배포

개발 후 변경사항을 NAS에 반영:

```batch
scripts\deploy_to_nas.bat
```

**robocopy**를 사용하여 변경된 파일만 효율적으로 동기화합니다.

### 4. NAS에서 실행

#### 4.1 NAS 접속

```batch
# 네트워크 드라이브로 이동
\\YOUR_NAS_IP\share\farm_calculator\production\app
```

#### 4.2 최초 설정 (1회만)

```batch
# NAS의 production/app 폴더에서
init_dev.bat
```

#### 4.3 애플리케이션 실행

```batch
run.bat
```

브라우저에서 `http://localhost:8501` 자동 실행

---

## GitHub 버전 관리

### 1. Git 설치

#### Windows
https://git-scm.com/download/win

설치 후 컴퓨터 재시작

### 2. Git 저장소 초기화

#### 자동 설정 (권장)

```batch
scripts\git_init.bat
```

대화형 스크립트가 자동으로:
1. Git 설치 확인
2. 사용자 정보 설정
3. 저장소 초기화
4. 초기 커밋 생성
5. GitHub 연결 (선택)

#### 수동 설정

```batch
# 1. Git 초기화
git init

# 2. 사용자 정보 설정
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 3. 파일 추가
git add .

# 4. 초기 커밋
git commit -m "Initial commit: Farm Calculator v1.0.0"

# 5. 브랜치 이름 변경
git branch -M main
```

### 3. GitHub Repository 생성

#### 3.1 GitHub에서

1. https://github.com 로그인
2. **New Repository** 클릭
3. 저장소 이름: `farm_calculator`
4. **Private** 선택 (API 키 보호)
5. **Create Repository**

#### 3.2 로컬에서 연결

```batch
# 원격 저장소 연결
git remote add origin https://github.com/USERNAME/farm_calculator.git

# 첫 푸시
git push -u origin main
```

### 4. 일상 Git 워크플로우

#### 4.1 변경사항 커밋

```batch
# 1. 변경된 파일 확인
git status

# 2. 파일 추가
git add .

# 3. 커밋
git commit -m "feat: 새로운 기능 추가"

# 4. GitHub에 업로드
git push origin main
```

#### 4.2 커밋 메시지 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가
chore: 빌드/설정 변경
```

#### 4.3 변경사항 가져오기

```batch
# GitHub에서 최신 변경사항 가져오기
git pull origin main
```

### 5. 브랜치 전략 (선택사항)

#### 기본 전략

```batch
# 기능 개발 브랜치 생성
git checkout -b feature/new-feature

# 개발 및 커밋
git add .
git commit -m "feat: implement new feature"

# main 브랜치로 돌아가기
git checkout main

# 병합
git merge feature/new-feature

# 브랜치 삭제
git branch -d feature/new-feature
```

---

## 개발 환경 구축

### 1. 완전 자동 설정

```batch
scripts\setup_dev.bat
```

이 스크립트는:
- Python 설치 확인
- 가상환경 생성
- 패키지 설치
- 개발 도구 설치 (Black, Ruff, Pytest)
- 환경 변수 파일 생성
- 폴더 구조 생성
- Git 초기화 (선택)

### 2. 수동 설정

#### 2.1 가상환경 생성

```batch
python -m venv venv
venv\Scripts\activate.bat
```

#### 2.2 패키지 설치

```batch
pip install -r requirements.txt
```

#### 2.3 개발 도구 설치 (선택)

```batch
pip install black ruff mypy pytest pytest-cov pre-commit
```

#### 2.4 환경 변수 설정

```batch
# 템플릿 복사
copy config\.env.template config\.env

# 편집
notepad config\.env
```

### 3. API 키 설정

`config\.env` 파일에 실제 API 키 입력:

```env
WEATHER_API_KEY=actual_key_here
SOIL_API_KEY=actual_key_here
PRICE_API_KEY=actual_key_here
```

#### API 키 발급처
- **기상청**: https://www.data.go.kr
- **KAMIS**: https://www.kamis.or.kr
- **농진청**: https://www.rda.go.kr

---

## 백업 및 복구

### 1. NAS에서 로컬로 복원

```batch
scripts\backup_from_nas.bat
```

#### 복원 옵션

1. **전체 복원**: 애플리케이션 + 데이터 + 설정
2. **애플리케이션만**: 소스 코드만 복원
3. **데이터만**: 데이터 파일만 복원
4. **설정만**: 환경 변수 및 설정만 복원

### 2. 수동 백업

#### 2.1 로컬 백업

```batch
# 날짜별 백업 폴더 생성
mkdir backups\%date:~0,4%%date:~5,2%%date:~8,2%

# 중요 파일 복사
xcopy /E /I /Y backend backups\%date%\backend
xcopy /E /I /Y frontend backups\%date%\frontend
xcopy /E /I /Y data backups\%date%\data
```

#### 2.2 GitHub 백업

```batch
# 모든 변경사항 커밋
git add .
git commit -m "backup: %date%"
git push origin main
```

### 3. 자동 백업 (Windows 작업 스케줄러)

#### 3.1 스케줄러 열기

```
시작 → 작업 스케줄러
```

#### 3.2 새 작업 만들기

1. **일반** 탭
   - 이름: Farm Calculator NAS 백업
   - 설명: 매일 자동 NAS 백업

2. **트리거** 탭
   - 새로 만들기 → 매일 오후 6시

3. **동작** 탭
   - 프로그램: `z:\test\test06\scripts\deploy_to_nas.bat`
   - 시작 위치: `z:\test\test06`

---

## 트러블슈팅

### Git 관련

#### Git을 찾을 수 없습니다

```
Solution:
1. Git 설치: https://git-scm.com/download/win
2. 컴퓨터 재시작
3. 명령 프롬프트 새로 열기
```

#### Permission denied (publickey)

```
Solution:
1. HTTPS URL 사용 (추천)
   git remote set-url origin https://github.com/USERNAME/farm_calculator.git

2. 또는 SSH 키 생성
   ssh-keygen -t rsa -b 4096
   # 생성된 키를 GitHub에 등록
```

#### .env 파일이 Git에 추적됨

```
Solution:
# 추적 중지
git rm --cached config/.env

# .gitignore 확인
echo config/.env >> .gitignore
```

### NAS 관련

#### NAS에 접근할 수 없습니다

```
Solution:
1. NAS 전원 및 네트워크 확인
2. ping YOUR_NAS_IP
3. 네트워크 드라이브 매핑 확인
4. NAS 공유 폴더 권한 확인
```

#### robocopy 오류

```
Solution:
# 권한 오류
- NAS 폴더 쓰기 권한 확인

# 경로 오류
- nas_config.bat의 NAS_PATH 재확인
```

### Python 관련

#### venv를 활성화할 수 없습니다

```
Solution:
# PowerShell 실행 정책 변경
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 또는 CMD 사용
cmd
venv\Scripts\activate.bat
```

#### 패키지 설치 오류

```
Solution:
# pip 업그레이드
python -m pip install --upgrade pip

# 개별 설치
pip install streamlit
pip install pandas
```

---

## 통합 워크플로우 예시

### 일상 개발 프로세스

```batch
# 1. 최신 코드 가져오기
git pull origin main

# 2. 개발 환경 활성화
venv\Scripts\activate.bat

# 3. 애플리케이션 실행 및 개발
run.bat

# 4. 변경사항 커밋
git add .
git commit -m "feat: 새 기능 추가"
git push origin main

# 5. NAS에 배포
scripts\deploy_to_nas.bat
```

### 새 컴퓨터에서 시작

```batch
# 1. Git 설치
# https://git-scm.com/download/win

# 2. 저장소 클론
git clone https://github.com/USERNAME/farm_calculator.git
cd farm_calculator

# 3. 개발 환경 구축
scripts\setup_dev.bat

# 4. API 키 설정
notepad config\.env

# 5. 실행
run.bat
```

### NAS에서 프로덕션 실행

```batch
# 1. NAS 접속
\\YOUR_NAS_IP\share\farm_calculator\production\app

# 2. 최초 설정 (1회만)
init_dev.bat

# 3. 실행
run.bat
```

---

## 보안 체크리스트

- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] GitHub Repository가 Private인지 확인
- [ ] API 키가 코드에 하드코딩되지 않았는지 확인
- [ ] NAS 접근 권한이 적절히 설정되었는지 확인
- [ ] 정기 백업이 자동화되었는지 확인

---

**버전**: 1.0.0  
**최종 업데이트**: 2026-01-01
