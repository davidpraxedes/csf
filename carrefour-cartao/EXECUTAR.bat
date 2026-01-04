@echo off
REM Script para executar o projeto no Windows
chcp 65001 >nul 2>&1
echo ========================================
echo   Iniciando Projeto Carrefour Cartao
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

REM Limpar cache do Vite se existir
if exist "node_modules\.vite" (
    echo Limpando cache do Vite...
    rmdir /s /q "node_modules\.vite" 2>nul
    if errorlevel 1 (
        echo [AVISO] Nao foi possivel limpar o cache completamente
    ) else (
        echo [OK] Cache limpo
    )
    echo.
)

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




