@echo off
chcp 65001 >nul
echo ========================================
echo   Teste de API - Consulta CPF
echo ========================================
echo.
cd /d "%~dp0"
node testar_api_cpf.js
echo.
echo ========================================
pause






