@echo off
setlocal
cd /d "%~dp0"
set "PY="
if exist "C:\Users\yu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe" set "PY=C:\Users\yu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe"
if not defined PY where py >nul 2>nul && set "PY=py -3"
if not defined PY where python >nul 2>nul && set "PY=python"
if not defined PY (
  echo [ERROR] Python not found.
  pause
  exit /b 1
)
set "CF=%~dp0..\工具\cloudflared.exe"
echo ============================================================
echo   Portfolio: local  http://127.0.0.1:8321/
echo   Public link will appear below (takes ~10s):
echo ============================================================
start "portfolio-local" cmd /c ""%PY%" "%~dp0server.py""
if exist "%CF%" (
  echo Starting public tunnel...
  "%CF%" tunnel --url http://127.0.0.1:8321 --no-autoupdate
) else (
  echo [WARN] cloudflared.exe not found, public link disabled.
  echo        Local preview: http://127.0.0.1:8321/
  pause
)
