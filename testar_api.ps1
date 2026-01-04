# Script PowerShell para testar a API de CPF
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Teste de API - Consulta CPF" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navega para o diretório do script
Set-Location $PSScriptRoot

# Executa o script Node.js
node testar_api_cpf.js

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")




