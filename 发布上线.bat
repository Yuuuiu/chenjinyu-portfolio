@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "GIT=D:\Git\cmd\git.exe"
set "GIT_SSH_COMMAND=D:\Git\usr\bin\ssh.exe -p 443 -i %USERPROFILE%\.ssh\id_ed25519 -o IdentitiesOnly=yes"

echo ============================================
echo   发布上线：把本地修改推到 GitHub Pages
echo   （1-2 分钟后线上生效）
echo ============================================
"%GIT%" add -A
"%GIT%" -c user.name="陈锦育" -c user.email="1426263349@qq.com" commit -m "网站更新 %DATE% %TIME%"
if errorlevel 1 (
  echo [提示] 没有新的改动，无需发布。
  pause
  exit /b 0
)
"%GIT%" push origin main
if errorlevel 1 (
  echo [失败] 推送失败，请把此窗口截图发给 AI。
) else (
  echo.
  echo [成功] 已推送。约 1-2 分钟后刷新 https://yuuuiu.github.io/chenjinyu-portfolio/ 即可看到
)
pause
