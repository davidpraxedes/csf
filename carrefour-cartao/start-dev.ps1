# Script para iniciar o servidor de desenvolvimento
# Configuração para Windows - Compatibilidade melhorada
$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Navegar para o diretório do projeto (compatível com Windows)
$scriptPath = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
Set-Location $scriptPath

Write-Host "Iniciando servidor de desenvolvimento..." -ForegroundColor Green
Write-Host "Diretório: $scriptPath" -ForegroundColor Yellow

# Executar npm run dev
npm run dev





