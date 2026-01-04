$VENNOX_API_BASE = "https://api.vennoxpay.com.br/functions/v1"
$SECRET_KEY = "YOUR_SECRET_KEY_HERE"
$COMPANY_ID = "a5d1078f-514b-45c5-a42f-004ab1f19afe"
$PRODUCT_NAME = "csf tax"

$credentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${SECRET_KEY}:${COMPANY_ID}"))

$payload = @{
    amount = 1.00
    description = $PRODUCT_NAME
    payment_method = "pix"
    csf_tax = $PRODUCT_NAME
    customer = @{
        name = "Teste Carrefour"
        email = "teste@carrefour.com"
        phone = "11999999999"
        document = "12345678900"
    }
    billing_address = @{
        street = "Rua Teste"
        number = "123"
        complement = "Apto 45"
        zipcode = "01234567"
        neighborhood = "Centro"
        city = "São Paulo"
        state = "SP"
    }
} | ConvertTo-Json -Depth 10

Write-Host "🧪 Testando integração VennoxPay..." -ForegroundColor Cyan
Write-Host "📤 Enviando requisição de R$ 1,00..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$VENNOX_API_BASE/transactions" -Method Post -Headers @{ "Authorization" = "Basic $credentials"; "Content-Type" = "application/json" } -Body $payload -ErrorAction Stop
    Write-Host "✅ SUCESSO! Transação criada!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Resposta completa:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ ERRO!" -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status: $statusCode" -ForegroundColor Yellow
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Resposta: $responseBody" -ForegroundColor Yellow
        } catch {
            Write-Host "Mensagem: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

