@echo off
chcp 65001 >nul
title Carrefour Cartao - Servidor de Desenvolvimento
color 0A

echo.
echo ========================================
echo   CARREFOUR CARTAO - SERVIDOR DEV
echo ========================================
echo.

REM Navegar para o diretorio do script
cd /d "%~dp0"

REM Verificar se package.json existe
if not exist "package.json" (
    echo [ERRO] package.json nao encontrado!
    echo Certifique-se de que esta no diretorio correto.
    echo.
    pause
    exit /b 1
)

echo [OK] Diretorio correto encontrado
echo [OK] package.json encontrado
echo.

REM Limpar cache se existir
if exist "node_modules\.vite" (
    echo [INFO] Limpando cache do Vite...
    rmdir /s /q "node_modules\.vite" 2>nul
    echo [OK] Cache limpo
    echo.
)

REM Verificar porta 5173
netstat -ano | findstr ":5173" >nul 2>&1
if %errorlevel% == 0 (
    echo [AVISO] Porta 5173 ja esta em uso!
    echo [INFO] Tentando liberar a porta...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
    echo [OK] Porta liberada
    echo.
)

echo ========================================
echo   INICIANDO SERVIDOR...
echo ========================================
echo.
echo Quando o servidor estiver pronto, voce vera:
echo   Local:   http://localhost:5173/
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
echo ========================================
echo.

REM Iniciar servidor
npm run dev

REM Se chegar aqui, o servidor foi encerrado
echo.
echo ========================================
echo   SERVIDOR ENCERRADO
echo ========================================
pause




