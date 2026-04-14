@echo off
chcp 65001 >nul
cd /d "%~dp0"

if not exist "node_modules\concurrently\" (
  call npm.cmd install
  if errorlevel 1 goto error
)

if not exist "api\node_modules\" (
  call npm.cmd install --prefix api
  if errorlevel 1 goto error
)

if not exist "frontend\node_modules\" (
  call npm.cmd install --prefix frontend
  if errorlevel 1 goto error
)

call npm.cmd run dev
if errorlevel 1 goto error
goto fin

:error
pause
exit /b 1

:fin
pause
