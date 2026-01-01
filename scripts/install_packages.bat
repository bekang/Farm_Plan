@echo off
REM ============================================
REM 패키지 설치 스크립트
REM ============================================
chcp 65001 > nul
echo.
echo ╔══════════════════════════════════════════╗
echo ║   Farm Calculator - 패키지 설치        ║
echo ╚══════════════════════════════════════════╝
echo.

REM ============================================
REM 가상환경 확인
REM ============================================
if not exist "venv\Scripts\activate.bat" (
    echo [ERROR] 가상환경이 없습니다.
    echo.
    echo 먼저 다음 중 하나를 실행하세요:
    echo   - init_dev.bat
    echo   - scripts\setup_dev.bat
    echo.
    pause
    exit /b 1
)

REM ============================================
REM 가상환경 활성화
REM ============================================
echo [단계 1/3] 가상환경 활성화 중...
call venv\Scripts\activate.bat
echo [OK] 가상환경 활성화 완료
echo.

REM ============================================
REM pip 업그레이드
REM ============================================
echo [단계 2/3] pip 업그레이드 중...
python -m pip install --upgrade pip --quiet
if %errorlevel% neq 0 (
    echo [ERROR] pip 업그레이드 실패
    pause
    exit /b 1
)
echo [OK] pip 업그레이드 완료
echo.

REM ============================================
REM 패키지 설치
REM ============================================
echo [단계 3/3] 패키지 설치 중...
echo 시간이 걸릴 수 있습니다. 잠시만 기다려주세요...
echo.

python -m pip install -r requirements.txt --upgrade

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] 패키지 설치 중 오류 발생
    echo.
    echo 문제 해결:
    echo 1. 인터넷 연결 확인
    echo 2. pip 버전 확인: python -m pip --version
    echo 3. 개별 설치: pip install streamlit pandas
    echo.
    pause
    exit /b 1
)

echo.
echo ╔══════════════════════════════════════════╗
echo ║   패키지 설치 완료!                     ║
echo ╚══════════════════════════════════════════╝
echo.
echo 설치된 주요 패키지:
pip list --format=columns | findstr /i "streamlit pandas plotly polars sqlalchemy"
echo.
echo 개발 도구 설치 (선택사항):
echo   pip install -r requirements-dev.txt
echo.
pause
