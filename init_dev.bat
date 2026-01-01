@echo off
chcp 65001 >nul
cls
echo ========================================
echo   농업 수익 최적화 플래너 - 초기화
echo ========================================
echo.

cd /d "%~dp0"

REM Python 확인
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] Python이 설치되어 있지 않습니다.
    echo https://www.python.org/downloads/ 에서 설치 후 다시 실행하세요.
    pause
    exit /b 1
)

echo [1/3] 가상환경 생성...
if exist venv rmdir /s /q venv
python -m venv venv
call venv\Scripts\activate.bat

echo.
echo [2/3] 라이브러리 설치 중... (5-10분 소요)
python -m pip install --upgrade pip --quiet
pip install -r requirements.txt

echo.
echo [3/3] 디렉토리 생성...
mkdir logs 2>nul
mkdir data\raw 2>nul
mkdir data\processed 2>nul
mkdir data\history 2>nul

echo.
echo ========================================
echo   초기화 완료!
echo ========================================
echo.
echo 실행: run.bat
echo 데이터 수집: venv\Scripts\python backend\scripts\collect_data.py
echo.
pause
