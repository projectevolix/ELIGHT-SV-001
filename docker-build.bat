@echo off
REM ELIGHT-SV-001 Frontend Docker Build Script for windows
REM Usage: docker-build.bat [tag] [registry]
REM Example: docker-build.bat latest myregistry.azurecr.io

setlocal enabledelayedexpansion

set TAG=%1
set REGISTRY=%2
set IMAGE_NAME=elight-frontend

if "%TAG%"=="" set TAG=latest
if "%REGISTRY%"=="" (
    set FULL_IMAGE_NAME=%IMAGE_NAME%:%TAG%
) else (
    set FULL_IMAGE_NAME=%REGISTRY%/%IMAGE_NAME%:%TAG%
)

echo ================================
echo ELIGHT-SV-001 Frontend Build
echo ================================
echo Image: %FULL_IMAGE_NAME%
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Docker daemon is not running. Please start Docker.
    exit /b 1
)

echo Building Docker image...
docker build -t "%FULL_IMAGE_NAME%" .

if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    exit /b 1
)

echo.
echo SUCCESS: Build completed!
echo.
echo Next steps:
echo   - Run locally: docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1/sv-backend-service %FULL_IMAGE_NAME%
echo   - Run with Docker Compose: docker-compose up
if not "%REGISTRY%"=="" (
    echo   - Push to registry: docker push %FULL_IMAGE_NAME%
)

endlocal
