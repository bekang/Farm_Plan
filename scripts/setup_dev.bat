@echo off
REM ============================================
REM 개발 환경 완전 자동 설정 스크립트
REM ============================================
chcp 65001 > nul
echo.
echo ╔══════════════════════════════════════════╗
echo ║   Farm Calculator - 개발 환경 설정     ║
echo ╚══════════════════════════════════════════╝
echo.

REM ============================================
REM Python 설치 확인
REM ============================================
echo [단계 1/6] Python 설치 확인 중...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python이 설치되어 있지 않습니다.
    echo.
    echo 다운로드: https://www.python.org/downloads/
    echo 설치 시 "Add Python to PATH" 옵션을 체크하세요!
    echo.
    pause
    exit /b 1
)
python --version
echo [OK] Python 설치됨
echo.

REM ============================================
REM 가상환경 생성
REM ============================================
echo [단계 2/6] 가상환경 생성 중...
if exist "venv\" (
    echo [WARNING] 가상환경이 이미 존재합니다.
    set /p RECREATE="다시 생성하시겠습니까? (y/N): "
    if /i not "!RECREATE!"=="y" (
        echo [SKIP] 기존 가상환경 사용
        goto AFTER_VENV
    )
    rd /s /q venv
)

python -m venv venv
if %errorlevel% neq 0 (
    echo [ERROR] 가상환경 생성 실패
    pause
    exit /b 1
)
echo [OK] 가상환경 생성 완료
echo.

:AFTER_VENV

REM ============================================
REM 패키지 설치
REM ============================================
echo [단계 3/6] Python 패키지 설치 중...
echo 잠시만 기다려주세요...
echo.
call venv\Scripts\activate.bat
python -m pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo [ERROR] 패키지 설치 실패
    pause
    exit /b 1
)
echo [OK] 패키지 설치 완료
echo.

REM ============================================
REM 개발 도구 설치 (선택사항)
REM ============================================
echo [단계 4/6] 개발 도구 설치
echo.
set /p INSTALL_DEV="개발 도구 (Black, Ruff, Pytest 등)를 설치하시겠습니까? (Y/n): "
if /i "!INSTALL_DEV!"=="n" (
    echo [SKIP] 개발 도구 건너뜀
    goto AFTER_DEV_TOOLS
)

echo 개발 도구 설치 중...
pip install black ruff mypy pytest pytest-cov pre-commit --quiet
echo [OK] 개발 도구 설치 완료
echo.

:AFTER_DEV_TOOLS

REM ============================================
REM 환경 변수 파일 생성
REM ============================================
echo [단계 5/6] 환경 설정 파일 확인 중...
if not exist "config\" mkdir config
if not exist "config\.env" (
    echo [INFO] 환경 변수 템플릿 생성 중...
    (
        echo # Farm Calculator 환경 변수
        echo # API Keys
        echo WEATHER_API_KEY=your_key_here
        echo SOIL_API_KEY=your_key_here
        echo PRICE_API_KEY=your_key_here
        echo.
        echo # Database
        echo DATABASE_PATH=data/farm_calculator.db
        echo.
        echo # Streamlit
        echo STREAMLIT_SERVER_PORT=8501
        echo STREAMLIT_SERVER_HEADLESS=true
    ) > config\.env
    echo [OK] config\.env 파일 생성 완료
    echo [ACTION] config\.env 파일에 실제 API 키를 입력하세요!
) else (
    echo [OK] config\.env 파일 존재
)
echo.

REM ============================================
REM 데이터 폴더 구조 생성
REM ============================================
echo [단계 6/6] 데이터 폴더 구조 생성 중...
mkdir data 2>nul
mkdir data\raw 2>nul
mkdir data\processed 2>nul
mkdir data\history 2>nul
mkdir logs 2>nul

REM .gitkeep 파일 생성
echo. > data\raw\.gitkeep
echo. > data\processed\.gitkeep
echo. > data\history\.gitkeep
echo. > logs\.gitkeep

echo [OK] 폴더 구조 생성 완료
echo.

REM ============================================
REM Git 초기화 (선택사항)
REM ============================================
if not exist ".git\" (
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo Git 저장소 초기화
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
    set /p INIT_GIT="Git 저장소를 초기화하시겠습니까? (y/N): "
    if /i "!INIT_GIT!"=="y" (
        call scripts\git_init.bat
    )
)

REM ============================================
REM 완료
REM ============================================
deactivate 2>nul
echo.
echo ╔══════════════════════════════════════════╗
echo ║   개발 환경 설정 완료!                  ║
echo ╚══════════════════════════════════════════╝
echo.
echo 다음 단계:
echo.
echo 1. API 키 설정:
echo    - config\.env 파일을 열어 실제 API 키 입력
echo.
echo 2. 애플리케이션 실행:
echo    run.bat
echo.
echo 3. 개발 가이드:
echo    DEV_GUIDE.md 문서 참고
echo.
echo 4. NAS 배포:
echo    scripts\deploy_to_nas.bat
echo    (먼저 deploy\nas_config.bat 설정 필요)
echo.
pause
