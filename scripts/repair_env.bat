@echo off
chcp 65001 > nul
cls
echo ╔══════════════════════════════════════════╗
echo ║   Farm Calculator - 환경 복구 도구     ║
echo ╚══════════════════════════════════════════╝
echo.
echo [알림] 실행 환경(가상환경)이 꼬여서 오류가 발생했습니다.
echo 기존 환경을 삭제하고 깨끗하게 다시 설치합니다.
echo.
echo ⚠️  주의: 시간이 몇 분 걸릴 수 있습니다.
echo.

REM 1. 기존 가상환경 삭제
if not exist "venv" goto CREATE_VENV

echo [단계 1/4] 기존 가상환경(venv) 삭제 중...
rmdir /s /q venv
if %errorlevel% neq 0 (
    echo [오류] venv 폴더를 삭제할 수 없습니다.
    echo 다른 터미널을 모두 닫고 다시 시도해주세요.
    pause
    exit /b 1
)
echo [OK] 삭제 완료

:CREATE_VENV
REM 2. 가상환경 재생성
echo.
echo [단계 2/4] 가상환경 다시 만들기...
python -m venv venv
if %errorlevel% neq 0 (
    echo [오류] Python을 찾을 수 없거나 가상환경 생성 실패.
    pause
    exit /b 1
)
echo [OK] 생성 완료

REM 3. 패키지 재설치
echo.
echo [단계 3/4] 라이브러리 다시 설치 중...
echo (화면이 멈춘 것처럼 보여도 기다려주세요!)
echo.
call venv\Scripts\activate.bat
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

REM 4. 실행 테스트
echo.
echo [단계 4/4] 복구 완료! 앱을 실행합니다.
echo.
echo ========================================
echo 잠시 후 브라우저가 열립니다...
echo ========================================
streamlit run frontend/Home.py
pause
