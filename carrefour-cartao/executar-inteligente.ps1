# Script inteligente para executar o projeto - tenta múltiplas abordagens
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

# Função para verificar se node_modules está completo
function Test-NodeModulesComplete {
    $requiredPackages = @("react", "vite")
    foreach ($package in $requiredPackages) {
        if (-not (Test-Path "node_modules\$package")) {
            return $false
        }
    }
    return $true
}

# Verificar e instalar dependências se necessário
$needsInstall = $false
if (-not (Test-Path "node_modules")) {
    $needsInstall = $true
    Write-Host "⚠ node_modules não encontrado" -ForegroundColor Yellow
} elseif (-not (Test-NodeModulesComplete)) {
    $needsInstall = $true
    Write-Host "⚠ node_modules incompleto" -ForegroundColor Yellow
} else {
    Write-Host "✓ Dependências já instaladas" -ForegroundColor Green
}

if ($needsInstall) {
    Write-Host ""
    Write-Host "Tentando instalar dependências..." -ForegroundColor Yellow
    Write-Host ""
    
    # Executar script de instalação (compatível com Windows)
    $installScript = Join-Path $scriptPath "instalar-dependencias.ps1"
    if (Test-Path $installScript) {
        & $installScript
    } else {
        Write-Host "Script de instalação não encontrado. Tentando npm install diretamente..." -ForegroundColor Yellow
        npm install
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "⚠ Aviso: Instalação de dependências pode ter falhado" -ForegroundColor Yellow
        Write-Host "Mas vamos tentar executar mesmo assim..." -ForegroundColor Yellow
        Write-Host ""
    }
}

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


