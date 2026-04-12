@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo  Parcial2 - instalacion y arranque
echo ========================================
echo.

if not exist "node_modules\concurrently\" (
  echo [1/3] Instalando herramienta para arrancar todo junto...
  call npm.cmd install
  if errorlevel 1 goto error
)

if not exist "api\node_modules\" (
  echo [2/3] Instalando dependencias de la API...
  call npm.cmd install --prefix api
  if errorlevel 1 goto error
)

if not exist "frontend\node_modules\" (
  echo [2/3] Instalando dependencias del frontend...
  call npm.cmd install --prefix frontend
  if errorlevel 1 goto error
)

echo [3/3] Arrancando API (puerto 3000) y frontend (Vite)...
echo Cierra esta ventana o pulsá Ctrl+C para detener ambos.
echo.
call npm.cmd run dev
if errorlevel 1 goto error
goto fin

:error
echo.
echo Hubo un error. Revisá los mensajes de arriba.
pause
exit /b 1

:fin
pause
