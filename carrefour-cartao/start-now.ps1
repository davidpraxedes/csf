# Configuração para Windows - Compatibilidade melhorada
$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Navegar para o diretório do projeto (compatível com Windows)
$scriptPath = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
Set-Location $scriptPath
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Servidor Vite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Diretorio: $scriptPath" -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path "package.json")) {
    Write-Host "ERRO: package.json nao encontrado!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "Iniciando servidor..." -ForegroundColor Green
Write-Host ""
npm run dev


