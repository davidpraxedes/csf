@echo off
REM Script para iniciar servidor de desenvolvimento no Windows
chcp 65001 >nul 2>&1
title Carrefour Cartao - Servidor
color 0A
echo.
echo ========================================
echo   INICIANDO SERVIDOR DE DESENVOLVIMENTO
echo ========================================
echo.

REM Navegar para o diretório do script
cd /d "%~dp0"

REM Verificar se package.json existe
if not exist "package.json" (
    echo [ERRO] package.json nao encontrado!
    pause
    exit /b 1
)

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo [AVISO] node_modules nao encontrado!
    echo Executando npm install...
    call npm install
    echo.
)

echo [OK] Iniciando servidor...
echo Quando pronto, abra: http://localhost:5173
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

npm run dev

if errorlevel 1 (
    echo.
    echo Erro ao iniciar o servidor.
    pause
)

