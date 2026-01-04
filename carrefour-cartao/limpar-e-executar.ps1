# Script para limpar cache e executar o projeto
# Configuração para Windows - Compatibilidade melhorada
$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Navegar para o diretório do projeto (compatível com Windows)
$scriptPath = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
Set-Location $scriptPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Limpando cache e iniciando projeto" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Parar processos do Node/Vite que possam estar rodando na porta 5173
Write-Host "Verificando processos na porta 5173..." -ForegroundColor Yellow
$process = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($process) {
    Write-Host "Processo encontrado na porta 5173. Tentando encerrar..." -ForegroundColor Yellow
    $pid = $process.OwningProcess
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Limpar cache do Vite
Write-Host "Limpando cache do Vite..." -ForegroundColor Yellow
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
    Write-Host "✓ Cache do Vite removido" -ForegroundColor Green
}

# Limpar dist se existir
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
    Write-Host "✓ Pasta dist removida" -ForegroundColor Green
}

Write-Host ""
Write-Host "Iniciando servidor de desenvolvimento..." -ForegroundColor Green
Write-Host "Aguardando servidor iniciar..." -ForegroundColor Yellow
Write-Host ""

# Executar npm run dev
npm run dev




