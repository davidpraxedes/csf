# Script para verificar o ambiente e dependências
# Configuração para Windows - Compatibilidade melhorada
$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Verificação de Ambiente" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
    
    # Verificar versão mínima (18+)
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -lt 18) {
        Write-Host "⚠ Aviso: Recomenda-se Node.js 18 ou superior" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "  Instale Node.js em: https://nodejs.org/" -ForegroundColor White
    exit 1
}

Write-Host ""

# Verificar npm
Write-Host "Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm instalado: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verificar diretório do projeto
Write-Host "Verificando estrutura do projeto..." -ForegroundColor Yellow
$scriptPath = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
Set-Location $scriptPath

if (Test-Path "package.json") {
    Write-Host "✓ package.json encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ package.json não encontrado!" -ForegroundColor Red
    exit 1
}

if (Test-Path "src") {
    Write-Host "✓ Pasta src encontrada" -ForegroundColor Green
} else {
    Write-Host "✗ Pasta src não encontrada!" -ForegroundColor Red
    exit 1
}

if (Test-Path "public/images") {
    Write-Host "✓ Pasta public/images encontrada" -ForegroundColor Green
} else {
    Write-Host "⚠ Pasta public/images não encontrada" -ForegroundColor Yellow
}

Write-Host ""

# Verificar dependências
Write-Host "Verificando dependências..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    $requiredPackages = @("react", "vite", "axios", "zustand")
    $missingPackages = @()
    
    foreach ($package in $requiredPackages) {
        if (Test-Path "node_modules\$package") {
            Write-Host "✓ $package instalado" -ForegroundColor Green
        } else {
            Write-Host "✗ $package não encontrado" -ForegroundColor Red
            $missingPackages += $package
        }
    }
    
    if ($missingPackages.Count -gt 0) {
        Write-Host ""
        Write-Host "⚠ Algumas dependências estão faltando" -ForegroundColor Yellow
        Write-Host "  Execute: npm install" -ForegroundColor Cyan
    }
} else {
    Write-Host "⚠ node_modules não encontrado" -ForegroundColor Yellow
    Write-Host "  Execute: npm install" -ForegroundColor Cyan
}

Write-Host ""

# Verificar porta 5173
Write-Host "Verificando porta 5173..." -ForegroundColor Yellow
$portInUse = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠ Porta 5173 está em uso" -ForegroundColor Yellow
    Write-Host "  Processo ID: $($portInUse.OwningProcess)" -ForegroundColor White
} else {
    Write-Host "✓ Porta 5173 disponível" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Verificação concluída!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

