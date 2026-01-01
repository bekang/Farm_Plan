@echo off
chcp 65001 >nul
cls
echo ========================================
echo   농업 수익 최적화 플래너
echo ========================================
echo.

cd /d "%~dp0"

REM Python 확인
echo [1단계] Python 확인 중...
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [오류] Python이 설치되어 있지 않거나 PATH에 등록되지 않았습니다.
    echo.
    echo 해결 방법:
    echo 1. Python을 설치하세요: https://www.python.org/downloads/
    echo 2. 설치 시 "Add Python to PATH" 옵션을 체크하세요.
    echo.
    echo 또는 이미 Python이 설치되어 있다면:
    echo - 시스템 환경변수 PATH에 Python 경로를 추가하세요.
    echo.
    pause
    exit /b 1
)

python --version
echo.


REM 가상환경 이름 설정 (잠금 문제 해결을 위해 이름 변경 가능)
set VENV_NAME=venv_fix

REM 가상환경 확인 및 생성
if not exist "%VENV_NAME%" (
    echo [2단계] 가상환경 생성 중...
    python -m venv %VENV_NAME%
    if %errorlevel% neq 0 (
        echo [오류] 가상환경 생성 실패
        pause
        exit /b 1
    )
    echo 가상환경 생성 완료!
    echo.
)

REM 가상환경 활성화
echo [3단계] 가상환경 활성화...
call %VENV_NAME%\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo [오류] 가상환경 활성화 실패
    pause
    exit /b 1
)

REM 의존성 설치
echo [4단계] 필요한 라이브러리 설치 중...
echo (처음 실행 시 시간이 걸릴 수 있습니다)
echo.
pip install -r requirements.txt --quiet --disable-pip-version-check
if %errorlevel% neq 0 (
    echo.
    echo [경고] 일부 라이브러리 설치 실패
    echo 계속 진행합니다...
    echo.
)

REM 애플리케이션 실행
echo ========================================
echo [5단계] 애플리케이션 시작!
echo ========================================
echo.
echo 브라우저에서 http://localhost:8501 을 열어주세요.
echo 종료하려면 Ctrl+C를 누르세요.
echo.

streamlit run frontend/Home.py --server.port 8501
pause
