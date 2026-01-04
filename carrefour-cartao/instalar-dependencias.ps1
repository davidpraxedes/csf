# Script inteligente para instalar dependências com múltiplas abordagens
# Configuração para Windows - Compatibilidade melhorada
$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Navegar para o diretório do projeto (compatível com Windows)
$scriptPath = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
Set-Location $scriptPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Instalando Dependências" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Função para verificar se node_modules está completo
function Test-NodeModulesComplete {
    $requiredPackages = @("react", "vite", "axios", "zustand")
    $allPresent = $true
    
    foreach ($package in $requiredPackages) {
        $packagePath = "node_modules\$package"
        if (-not (Test-Path $packagePath)) {
            $allPresent = $false
            break
        }
    }
    
    return $allPresent
}

# Verificar se node_modules já existe e está completo
if (Test-Path "node_modules") {
    if (Test-NodeModulesComplete) {
        Write-Host "✓ Dependências já instaladas e completas!" -ForegroundColor Green
        Write-Host ""
        return
    } else {
        Write-Host "⚠ node_modules encontrado mas incompleto" -ForegroundColor Yellow
    }
} else {
    Write-Host "📦 node_modules não encontrado. Iniciando instalação..." -ForegroundColor Yellow
    Write-Host ""
}

# Função para tentar instalação com npm
function Install-WithNPM {
    Write-Host "🔹 Tentativa 1: npm install (padrão)..." -ForegroundColor Cyan
    npm install 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Instalação concluída com npm!" -ForegroundColor Green
        return $true
    }
    
    Write-Host "⚠ npm install padrão falhou. Tentando com configurações alternativas..." -ForegroundColor Yellow
    Write-Host ""
    
    # Tentar com registry alternativo e timeout maior
    Write-Host "🔹 Tentativa 2: npm install (registry alternativo + timeout)..." -ForegroundColor Cyan
    npm config set registry https://registry.npmjs.org/
    npm config set fetch-timeout 300000
    npm config set fetch-retries 5
    npm install --verbose 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Instalação concluída com npm (configuração alternativa)!" -ForegroundColor Green
        return $true
    }
    
    return $false
}

# Função para tentar instalação com yarn
function Install-WithYarn {
    Write-Host "🔹 Tentativa 3: Verificando yarn..." -ForegroundColor Cyan
    
    # Verificar se yarn está instalado
    $yarnCheck = Get-Command yarn -ErrorAction SilentlyContinue
    if (-not $yarnCheck) {
        Write-Host "⚠ Yarn não encontrado. Instale com: npm install -g yarn" -ForegroundColor Yellow
        Write-Host ""
        return $false
    }
    
    Write-Host "🔹 Tentativa 3: yarn install..." -ForegroundColor Cyan
    yarn install 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Instalação concluída com yarn!" -ForegroundColor Green
        return $true
    }
    
    return $false
}

# Função para tentar instalação com pnpm
function Install-WithPNPM {
    Write-Host "🔹 Tentativa 4: Verificando pnpm..." -ForegroundColor Cyan
    
    # Verificar se pnpm está instalado
    $pnpmCheck = Get-Command pnpm -ErrorAction SilentlyContinue
    if (-not $pnpmCheck) {
        Write-Host "⚠ PNPM não encontrado. Instale com: npm install -g pnpm" -ForegroundColor Yellow
        Write-Host ""
        return $false
    }
    
    Write-Host "🔹 Tentativa 4: pnpm install..." -ForegroundColor Cyan
    pnpm install 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Instalação concluída com pnpm!" -ForegroundColor Green
        return $true
    }
    
    return $false
}

# Tentar múltiplas abordagens
$success = $false

# Tentativa 1 e 2: npm
if (Install-WithNPM) {
    $success = $true
}

# Tentativa 3: yarn (se npm falhou)
if (-not $success) {
    if (Install-WithYarn) {
        $success = $true
    }
}

# Tentativa 4: pnpm (se yarn falhou)
if (-not $success) {
    if (Install-WithPNPM) {
        $success = $true
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($success) {
    Write-Host "✓ Dependências instaladas com sucesso!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "❌ Todas as tentativas de instalação falharam" -ForegroundColor Red
    Write-Host ""
    Write-Host "Soluções alternativas:" -ForegroundColor Yellow
    Write-Host "1. Verifique sua conexão com a internet" -ForegroundColor White
    Write-Host "2. Verifique se há firewall/proxy bloqueando npm" -ForegroundColor White
    Write-Host "3. Tente instalar yarn: npm install -g yarn" -ForegroundColor White
    Write-Host "4. Tente instalar pnpm: npm install -g pnpm" -ForegroundColor White
    Write-Host "5. Se node_modules já existe, você pode tentar executar o projeto mesmo assim" -ForegroundColor White
    Write-Host ""
    
    # Verificar se node_modules existe mesmo com falha
    if (Test-Path "node_modules") {
        Write-Host "⚠ node_modules existe. Você pode tentar executar o projeto:" -ForegroundColor Yellow
        Write-Host "   npm run dev" -ForegroundColor Cyan
        Write-Host ""
    }
    
    exit 1
}

