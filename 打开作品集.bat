@echo off
setlocal
cd /d "%~dp0"
set "PY="
if exist "C:\Users\yu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe" set "PY=C:\Users\yu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe"
if not defined PY where py >nul 2>nul && set "PY=py -3"
if not defined PY where python >nul 2>nul && set "PY=python"
if not defined PY (
  echo [ERROR] Python not found. Please install Python 3 first.
  pause
  exit /b 1
)
echo ============================================
echo   Chen Jinyu Portfolio
echo   Local:   http://127.0.0.1:8321/
echo   Phone:   http://^<this-computer-LAN-IP^>:8321/  ^(same Wi-Fi^)
echo   (Close this window to stop the server)
echo ============================================
start "" "http://127.0.0.1:8321/"
%PY% "%~dp0server.py"
