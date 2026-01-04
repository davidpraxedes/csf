@echo off
REM Script simples para iniciar servidor no Windows
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo ========================================
echo   Iniciando Servidor Vite
echo ========================================
echo.
echo Diretorio: %CD%
echo.

REM Verificar se package.json existe
if not exist "package.json" (
    echo ERRO: package.json nao encontrado!
    pause
    exit /b 1
)

echo [OK] package.json encontrado
echo.

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo [AVISO] node_modules nao encontrado!
    echo Executando npm install...
    call npm install
    echo.
)

echo Iniciando servidor de desenvolvimento...
echo.
echo Quando o servidor estiver pronto, abra:
echo   http://localhost:5173
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

npm run dev

if errorlevel 1 (
    echo.
    echo Erro ao iniciar o servidor.
    pause
)


