@echo off
REM ============================================
REM NAS 백업 복원 스크립트
REM ============================================
chcp 65001 > nul
echo.
echo ╔══════════════════════════════════════════╗
echo ║   Farm Calculator - NAS 복원 도구      ║
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
echo [단계 1/4] NAS 연결 확인 중...
if not exist "%NAS_PATH%\" (
    echo [ERROR] NAS에 접근할 수 없습니다: %NAS_PATH%
    pause
    exit /b 1
)
echo [OK] NAS 연결 성공
echo.

REM ============================================
REM 복원 대상 선택
REM ============================================
echo [단계 2/4] 복원 대상 선택
echo.
echo 무엇을 복원하시겠습니까?
echo 1. 전체 복원 (애플리케이션 + 데이터 + 설정)
echo 2. 애플리케이션만
echo 3. 데이터만
echo 4. 설정만
echo.
set /p RESTORE_CHOICE="선택 (1-4): "

REM ============================================
REM 복원 실행
REM ============================================
echo.
echo [단계 3/4] 복원 중...

if "%RESTORE_CHOICE%"=="1" goto RESTORE_ALL
if "%RESTORE_CHOICE%"=="2" goto RESTORE_APP
if "%RESTORE_CHOICE%"=="3" goto RESTORE_DATA
if "%RESTORE_CHOICE%"=="4" goto RESTORE_CONFIG
goto INVALID_CHOICE

:RESTORE_ALL
echo [INFO] 전체 복원을 시작합니다...
robocopy "%NAS_PATH%\production\app\backend" backend /MIR /NFL /NDL /NJH /NJS
robocopy "%NAS_PATH%\production\app\frontend" frontend /MIR /NFL /NDL /NJH /NJS
copy "%NAS_PATH%\production\app\requirements.txt" . /Y >nul
copy "%NAS_PATH%\production\app\README.md" . /Y >nul
robocopy "%NAS_PATH%\production\data" data /MIR /NFL /NDL /NJH /NJS
robocopy "%NAS_PATH%\production\config" config /MIR /NFL /NDL /NJH /NJS
echo [OK] 전체 복원 완료
goto RESTORE_DONE

:RESTORE_APP
echo [INFO] 애플리케이션 복원을 시작합니다...
robocopy "%NAS_PATH%\production\app\backend" backend /MIR /NFL /NDL /NJH /NJS
robocopy "%NAS_PATH%\production\app\frontend" frontend /MIR /NFL /NDL /NJH /NJS
copy "%NAS_PATH%\production\app\requirements.txt" . /Y >nul
copy "%NAS_PATH%\production\app\README.md" . /Y >nul
echo [OK] 애플리케이션 복원 완료
goto RESTORE_DONE

:RESTORE_DATA
echo [INFO] 데이터 복원을 시작합니다...
robocopy "%NAS_PATH%\production\data" data /MIR /NFL /NDL /NJH /NJS
echo [OK] 데이터 복원 완료
goto RESTORE_DONE

:RESTORE_CONFIG
echo [INFO] 설정 복원을 시작합니다...
robocopy "%NAS_PATH%\production\config" config /MIR /NFL /NDL /NJH /NJS
echo [OK] 설정 복원 완료
goto RESTORE_DONE

:INVALID_CHOICE
echo [ERROR] 잘못된 선택입니다.
pause
exit /b 1

:RESTORE_DONE
echo.

REM ============================================
REM 완료
REM ============================================
echo [단계 4/4] 복원 완료!
echo.
echo ╔══════════════════════════════════════════╗
echo ║   NAS 복원 완료!                        ║
echo ╚══════════════════════════════════════════╝
echo.
echo 다음 작업:
echo 1. 가상환경 재생성: init_dev.bat
echo 2. 애플리케이션 실행: run.bat
echo.
pause
