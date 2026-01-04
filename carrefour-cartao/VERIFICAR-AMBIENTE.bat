@echo off
REM Script para verificar ambiente no Windows
chcp 65001 >nul 2>&1
echo ========================================
echo   Verificacao de Ambiente
echo ========================================
echo.

cd /d "%~dp0"

REM Verificar Node.js
echo Verificando Node.js...
where node >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js instalado: %NODE_VERSION%
) else (
    echo [ERRO] Node.js nao encontrado!
    echo Instale Node.js em: https://nodejs.org/
    pause
    exit /b 1
)

echo.

REM Verificar npm
echo Verificando npm...
where npm >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [OK] npm instalado: v%NPM_VERSION%
) else (
    echo [ERRO] npm nao encontrado!
    pause
    exit /b 1
)

echo.

REM Verificar estrutura
echo Verificando estrutura do projeto...
if exist "package.json" (
    echo [OK] package.json encontrado
) else (
    echo [ERRO] package.json nao encontrado!
    pause
    exit /b 1
)

if exist "src" (
    echo [OK] Pasta src encontrada
) else (
    echo [ERRO] Pasta src nao encontrada!
    pause
    exit /b 1
)

if exist "public\images" (
    echo [OK] Pasta public\images encontrada
) else (
    echo [AVISO] Pasta public\images nao encontrada
)

echo.

REM Verificar dependências
echo Verificando dependencias...
if exist "node_modules" (
    if exist "node_modules\react" (
        echo [OK] react instalado
    ) else (
        echo [AVISO] react nao encontrado
    )
    
    if exist "node_modules\vite" (
        echo [OK] vite instalado
    ) else (
        echo [AVISO] vite nao encontrado
    )
) else (
    echo [AVISO] node_modules nao encontrado
    echo Execute: npm install
)

echo.
echo ========================================
echo   Verificacao concluida!
echo ========================================
echo.
echo Para executar o projeto, use:
echo   EXECUTAR-INTELIGENTE.bat
echo   ou
echo   npm run dev
echo.
pause


