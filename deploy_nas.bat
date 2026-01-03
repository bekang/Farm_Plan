@echo off
chcp 65001 >nul
echo ========================================================
echo       ipTIME NAS 배포 도구 (Build & Deploy)
echo ========================================================
echo.

echo [1/3] 프로젝트 빌드 중... (npm run build)
echo.
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [오류] 빌드에 실패했습니다. npm install을 먼저 했는지 확인하세요.
    pause
    exit /b
)
echo.
echo [성공] 빌드 완료! (dist 폴더 생성됨)
echo.

echo [2/3] NAS 웹 폴더 경로를 입력하세요.
echo (예: N:\web  또는  \\192.168.0.4\HDD1\public_html)
echo.
set /p NAS_PATH="경로 입력: "

if not exist "%NAS_PATH%" (
    echo.
    echo [오류] 입력하신 경로를 찾을 수 없습니다: %NAS_PATH%
    echo 탐색기에서 해당 폴더가 열리는지 먼저 확인해 주세요.
    pause
    exit /b
)

echo.
echo [3/3] 파일을 NAS로 동기화합니다... (Robocopy 사용)
echo 원본: %~dp0dist
echo 대상: %NAS_PATH%
echo.

:: Robocopy Options
:: /MIR : Mirror a directory tree (equivalent to /E plus /PURGE)
:: /R:3 : Retry 3 times on failed copies
:: /W:2 : Wait 2 seconds between retries
:: /NJH : No Job Header
:: /NJS : No Job Summary
:: /NP  : No Progress - don't show percentage copied
:: /MT:8 : Multi-threaded copy (8 threads)

robocopy "%~dp0dist" "%NAS_PATH%" /MIR /R:3 /W:2 /MT:8

:: Robocopy exit codes:
:: 0 = No errors occurred, and no copying was done. (Source and destination are in sync)
:: 1 = One or more files were copied successfully.
:: 2 = Some Extra files or directories were detected.
:: 3 = (2+1) Some files were copied. Additional files were present.
:: 4 = Mismatched files or directories were detected.
:: 5 = (4+1) Some files were copied. Some files were mismatched.
:: 6 = (4+2) Additional files and mismatched files exist.
:: 7 = (4+1+2) Files were copied, a file mismatch was present, and additional files were present.
:: 8 = Some files or directories could not be copied. (Copy errors occurred)

if %ERRORLEVEL% GEQ 8 (
    echo.
    echo [오류] 파일 복사 중 문제가 발생했습니다. (Robocopy Exit Code: %ERRORLEVEL%)
    echo 권한이나 네트워크 연결을 확인하세요.
    pause
    exit /b
)

echo.
echo ========================================================
echo           배포가 성공적으로 완료되었습니다!
echo ========================================================
echo 이제 브라우저에서 NAS 주소로 접속해 보세요.
pause
