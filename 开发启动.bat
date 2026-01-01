@echo off
chcp 65001 >nul
echo ========================================
echo   농업 수익 최적화 플래너 - 개발 모드
echo ========================================
echo.

cd /d "%~dp0"

if not exist "venv\Scripts\activate.bat" (
    echo [오류] 가상환경이 없습니다.
    echo run.bat을 먼저 실행해주세요.
    pause
    exit /b
)

call venv\Scripts\activate.bat

echo [시작] Streamlit 서버 실행 중...
echo.
echo 브라우저가 자동으로 열립니다.
echo 종료하려면 Ctrl+C를 누르세요.
echo.

start http://localhost:8501

streamlit run frontend/Home.py --server.port 8501 --server.headless false

pause
