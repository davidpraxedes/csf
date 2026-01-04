$VENNOX_API_BASE = "https://api.vennoxpay.com.br/functions/v1"
$SECRET_KEY = "YOUR_SECRET_KEY_HERE"
$COMPANY_ID = "a5d1078f-514b-45c5-a42f-004ab1f19afe"
$credentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${SECRET_KEY}:${COMPANY_ID}"))

$body = @{
    amount = 100
    description = "csf tax"
    paymentMethod = "PIX"
    customer = @{
        name = "Teste Carrefour"
        email = "teste@carrefour.com"
        phone = "11999999999"
        document = "12345678900"
    }
    shipping = @{
        street = "Rua Teste"
        streetNumber = "123"
        complement = "Apto 45"
        zipCode = "01234567"
        neighborhood = "Centro"
        city = "São Paulo"
        state = "SP"
    }
    items = @(
        @{
            title = "csf tax"
            unitPrice = 100
            quantity = 1
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "🧪 Criando transação PIX de R$ 1,00..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$VENNOX_API_BASE/transactions" `
        -Method Post `
        -Headers @{
            "Authorization" = "Basic $credentials"
            "Content-Type" = "application/json"
        } `
        -Body $body `
        -ErrorAction Stop

    Write-Host "✅ Transação criada!" -ForegroundColor Green
    Write-Host "ID: $($response.id)" -ForegroundColor Yellow
    Write-Host "Status: $($response.status)" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "📊 Resposta completa:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    Write-Host ""
    
    Write-Host "🔍 Verificando código PIX:" -ForegroundColor Yellow
    if ($response.pix) {
        Write-Host "✅ Campo pix encontrado!" -ForegroundColor Green
        Write-Host "qrcode: $($response.pix.qrcode)" -ForegroundColor White
        Write-Host "end2EndId: $($response.pix.end2EndId)" -ForegroundColor White
        
        if ($response.pix.qrcode -and $response.pix.qrcode -like "http*") {
            Write-Host ""
            Write-Host "⚠️  qrcode é uma URL" -ForegroundColor Yellow
            Write-Host "URL: $($response.pix.qrcode)" -ForegroundColor White
        }
    } else {
        Write-Host "❌ Campo pix não encontrado na resposta" -ForegroundColor Red
        Write-Host "Campos disponíveis: $($response.PSObject.Properties.Name -join ', ')" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ ERRO!" -ForegroundColor Red
    Write-Host "Mensagem: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status: $statusCode" -ForegroundColor Yellow
    }
}

