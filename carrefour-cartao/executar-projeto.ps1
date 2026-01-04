# Script para executar o projeto - resolve problemas de codificação
# Configuração para Windows - Compatibilidade melhorada
$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Obter o diretório do script (compatível com Windows)
$scriptPath = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando projeto Carrefour Cartão" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Diretório: $scriptPath" -ForegroundColor Yellow
Write-Host ""

# Navegar para o diretório do projeto
Set-Location $scriptPath

# Verificar se package.json existe
if (-not (Test-Path "package.json")) {
    Write-Host "ERRO: package.json não encontrado!" -ForegroundColor Red
    Write-Host "Certifique-se de que está no diretório correto do projeto." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✓ package.json encontrado" -ForegroundColor Green
Write-Host ""

# Limpar cache do Vite se existir
if (Test-Path "node_modules\.vite") {
    Write-Host "Limpando cache do Vite..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
    Write-Host "✓ Cache limpo" -ForegroundColor Green
    Write-Host ""
}

# Verificar se a porta 5173 está em uso
$portInUse = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "AVISO: Porta 5173 já está em uso!" -ForegroundColor Yellow
    Write-Host "Tentando encerrar processo..." -ForegroundColor Yellow
    $pid = $portInUse.OwningProcess
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "✓ Processo encerrado" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Iniciando servidor de desenvolvimento..." -ForegroundColor Green
Write-Host "Aguardando servidor iniciar..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Quando o servidor estiver pronto, abra:" -ForegroundColor Cyan
Write-Host "  http://localhost:5173" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Gray
Write-Host ""

# Executar npm run dev
npm run dev




