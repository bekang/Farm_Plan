@echo off
REM ============================================
REM NAS 배포 스크립트
REM ============================================
chcp 65001 > nul
echo.
echo ╔══════════════════════════════════════════╗
echo ║   Farm Calculator - NAS 배포 도구      ║
echo ╚══════════════════════════════════════════╝
echo.

REM ============================================
REM 설정 파일 확인
REM ============================================
if not exist "deploy\nas_config.bat" (
    echo [ERROR] NAS 설정 파일이 없습니다.
    echo.
    echo deploy\nas_config.bat 파일을 생성하고 아래 내용을 입력하세요:
    echo.
    echo set NAS_PATH=\\YOUR_NAS_IP\share\farm_calculator
    echo set BACKUP_ENABLED=true
    echo.
    pause
    exit /b 1
)

REM 설정 로드
call deploy\nas_config.bat

if "%NAS_PATH%"=="" (
    echo [ERROR] NAS_PATH가 설정되지 않았습니다.
    pause
    exit /b 1
)

echo [INFO] NAS 경로: %NAS_PATH%
echo.

REM ============================================
REM NAS 연결 확인
REM ============================================
echo [단계 1/5] NAS 연결 확인 중...
if not exist "%NAS_PATH%\" (
    echo [ERROR] NAS에 접근할 수 없습니다: %NAS_PATH%
    echo.
    echo 다음을 확인하세요:
    echo - NAS가 실행 중인지
    echo - 네트워크 연결 상태
    echo - NAS 경로가 정확한지
    echo.
    pause
    exit /b 1
)
echo [OK] NAS 연결 성공
echo.

REM ============================================
REM 프로덕션 폴더 생성
REM ============================================
echo [단계 2/5] 프로덕션 폴더 구조 생성 중...
mkdir "%NAS_PATH%\production" 2>nul
mkdir "%NAS_PATH%\production\app" 2>nul
mkdir "%NAS_PATH%\production\data" 2>nul
mkdir "%NAS_PATH%\production\config" 2>nul
mkdir "%NAS_PATH%\backups" 2>nul
mkdir "%NAS_PATH%\backups\daily" 2>nul
mkdir "%NAS_PATH%\releases" 2>nul
echo [OK] 폴더 구조 생성 완료
echo.

REM ============================================
REM 애플리케이션 파일 동기화
REM ============================================
echo [단계 3/5] 애플리케이션 파일 동기화 중...
robocopy backend "%NAS_PATH%\production\app\backend" /MIR /XD __pycache__ .pytest_cache /XF *.pyc /NFL /NDL /NJH /NJS
robocopy frontend "%NAS_PATH%\production\app\frontend" /MIR /XD __pycache__ /XF *.pyc /NFL /NDL /NJH /NJS
copy requirements.txt "%NAS_PATH%\production\app\" /Y >nul
copy README.md "%NAS_PATH%\production\app\" /Y >nul
copy init_dev.bat "%NAS_PATH%\production\app\" /Y >nul
copy run.bat "%NAS_PATH%\production\app\" /Y >nul
echo [OK] 애플리케이션 동기화 완료
echo.

REM ============================================
REM 데이터 파일 동기화
REM ============================================
echo [단계 4/5] 데이터 파일 동기화 중...
if exist "data\history\" (
    robocopy data\history "%NAS_PATH%\production\data\history" /E /NFL /NDL /NJH /NJS
)
if exist "data\raw\" (
    robocopy data\raw "%NAS_PATH%\production\data\raw" /E /NFL /NDL /NJH /NJS
)
if exist "data\processed\" (
    robocopy data\processed "%NAS_PATH%\production\data\processed" /E /NFL /NDL /NJH /NJS
)
echo [OK] 데이터 동기화 완료
echo.

REM ============================================
REM 설정 파일 동기화 (주의: API 키 포함)
REM ============================================
echo [단계 5/5] 설정 파일 동기화 중...
if exist "config\.env" (
    copy config\.env "%NAS_PATH%\production\config\.env" /Y >nul
    echo [OK] 환경 변수 백업 완료
)
if exist "config\" (
    robocopy config "%NAS_PATH%\production\config" /E /XF nas_config.bat /NFL /NDL /NJH /NJS
)
echo [OK] 설정 동기화 완료
echo.

REM ============================================
REM 백업 생성 (선택사항)
REM ============================================
if "%BACKUP_ENABLED%"=="true" (
    echo [추가] 백업 생성 중...
    set BACKUP_DATE=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
    set BACKUP_DATE=%BACKUP_DATE: =0%
    set BACKUP_FILE=%NAS_PATH%\backups\daily\farm_calculator_%BACKUP_DATE%.zip
    
    REM 7-Zip이 있으면 압축, 없으면 건너뜀
    where 7z >nul 2>&1
    if %errorlevel% equ 0 (
        7z a -tzip "%BACKUP_FILE%" backend frontend data config requirements.txt README.md -xr!__pycache__ -xr!*.pyc >nul
        echo [OK] 백업 완료: %BACKUP_FILE%
    ) else (
        echo [SKIP] 7-Zip이 없어 백업을 건너뜁니다.
    )
    echo.
)

REM ============================================
REM 완료
REM ============================================
echo ╔══════════════════════════════════════════╗
echo ║   NAS 배포 완료!                        ║
echo ╚══════════════════════════════════════════╝
echo.
echo 배포된 위치: %NAS_PATH%\production
echo.
echo 다음 작업:
echo 1. NAS에서 init_dev.bat 실행 (최초 1회)
echo 2. run.bat으로 애플리케이션 시작
echo.
pause
