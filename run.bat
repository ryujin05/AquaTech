@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"

echo [AquaWeb] Workspace: %cd%
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install Node.js and try again.
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm not found. Install Node.js and try again.
  exit /b 1
)

if not exist "package.json" (
  echo [ERROR] package.json not found in "%cd%".
  exit /b 1
)

if not exist ".env" (
  if exist ".env.example" (
    echo [AquaWeb] .env not found. Creating from .env.example...
    copy /y ".env.example" ".env" >nul
  ) else (
    echo [WARN] .env and .env.example are missing. Using defaults.
  )
)

if not exist "node_modules" (
  echo [AquaWeb] node_modules not found. Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    exit /b 1
  )
)

set "BASE_PORT=8080"
if exist ".env" (
  for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    set "K=%%A"
    set "V=%%B"
    if /I "!K!"=="PORT" (
      for /f "tokens=*" %%P in ("!V!") do set "BASE_PORT=%%P"
    )
  )
)

for /f "delims=0123456789" %%X in ("%BASE_PORT%") do set "BASE_PORT=8080"
if "%BASE_PORT%"=="" set "BASE_PORT=8080"

call :EnsureDocker
if errorlevel 1 (
  echo [WARN] Docker is not ready. Skipping PostgreSQL bootstrap.
) else (
  echo [AquaWeb] Starting PostgreSQL container...
  call npm run db:up
  if errorlevel 1 (
    echo [WARN] Could not start PostgreSQL container.
  ) else (
    echo [AquaWeb] Syncing Prisma schema...
    call npm run db:push
    if errorlevel 1 (
      echo [WARN] db:push failed. Trying db:generate then db:push again...
      call npm run db:generate
      call npm run db:push
      if errorlevel 1 (
        echo [WARN] Prisma schema sync still failed. App will continue to start.
      )
    )
  )
)

set "RUN_PORT=%BASE_PORT%"
call :PickFreePort RUN_PORT
if errorlevel 1 exit /b 1

if not "%RUN_PORT%"=="%BASE_PORT%" (
  echo [INFO] Port %BASE_PORT% is busy. Using %RUN_PORT% instead.
)

set "PORT=%RUN_PORT%"
set "SITE_URL=http://localhost:%RUN_PORT%"

echo.
echo [AquaWeb] Starting backend at %SITE_URL%
echo [AquaWeb] Press Ctrl+C to stop.
echo.

if /I not "%AQUA_NO_BROWSER%"=="1" (
  start "" "%SITE_URL%/"
)

node server/index.mjs
set "APP_EXIT=%ERRORLEVEL%"

echo.
if not "%APP_EXIT%"=="0" (
  echo [ERROR] Backend exited with code %APP_EXIT%.
)

exit /b %APP_EXIT%

:IsPortInUse
setlocal
set "P=%~1"
netstat -ano -p TCP | findstr /R /C:":%P% .*LISTENING" >nul
if not errorlevel 1 (
  endlocal & exit /b 1
)
endlocal & exit /b 0

:PickFreePort
setlocal EnableDelayedExpansion
set "C=!%~1!"
if not defined C set "C=8080"
set /a T=0

:PickLoop
call :IsPortInUse !C!
if errorlevel 1 (
  set /a C+=1
  set /a T+=1
  if !T! geq 30 (
    endlocal
    echo [ERROR] Could not find a free port near %BASE_PORT%.
    exit /b 1
  )
  goto PickLoop
)

endlocal & set "%~1=%C%" & exit /b 0

:EnsureDocker
where docker >nul 2>&1
if errorlevel 1 (
  echo [WARN] Docker CLI not found.
  exit /b 1
)

docker info >nul 2>&1
if not errorlevel 1 exit /b 0

if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
  echo [AquaWeb] Docker daemon not ready. Launching Docker Desktop...
  start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
  call :WaitForDocker 20
  if not errorlevel 1 exit /b 0
)

echo [WARN] Docker daemon is still not ready.
exit /b 1

:WaitForDocker
setlocal EnableDelayedExpansion
set /a MAX=%~1
if "%MAX%"=="" set /a MAX=15
set /a I=0

:WaitLoop
docker info >nul 2>&1
if not errorlevel 1 (
  endlocal & exit /b 0
)

timeout /t 1 /nobreak >nul
set /a I+=1
if !I! lss !MAX! goto WaitLoop

endlocal & exit /b 1
