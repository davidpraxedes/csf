@echo off
REM Script para instalar dependências no Windows
chcp 65001 >nul 2>&1
echo ========================================
echo   Instalando Dependencias
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

REM Executar script PowerShell
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0instalar-dependencias.ps1"

if errorlevel 1 (
    echo.
    echo Erro ao instalar dependencias via PowerShell.
    echo Tentando instalar diretamente com npm...
    call npm install
    if errorlevel 1 (
        echo.
        echo Erro ao instalar dependencias.
        pause
        exit /b 1
    )
) else (
    echo.
    echo Dependencias instaladas com sucesso!
)

echo.
echo Pressione qualquer tecla para continuar...
pause >nul


