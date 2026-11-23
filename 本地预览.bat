@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   本地预览（不会上线，只有你自己能看）
echo   浏览器：http://127.0.0.1:8321/
echo   关闭本窗口即停止
echo ============================================
start "" "http://127.0.0.1:8321/"
"C:\Users\yu\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe" "%~dp0server.py"
pause
