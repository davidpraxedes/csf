@echo off
REM Script para executar o projeto no Windows
chcp 65001 >nul 2>&1
echo ========================================
echo   Iniciando Projeto Carrefour Cartao
echo   (Modo Inteligente)
echo ========================================
echo.

REM Navegar para o diretório do script
cd /d "%~dp0"

REM Verificar se package.json existe
if not exist "package.json" (
    echo ERRO: package.json nao encontrado!
    echo Certifique-se de que esta no diretorio correto.
    pause
    exit /b 1
)

echo [OK] package.json encontrado
echo.

REM Executar script PowerShell
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0executar-inteligente.ps1"

if errorlevel 1 (
    echo.
    echo Erro ao executar o script.
    echo.
    echo Tentando executar diretamente com npm...
    npm run dev
    pause
)


