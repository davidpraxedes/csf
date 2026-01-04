# Script de teste para integração VennoxPay
# Execute com: .\testar-vennox.ps1

$VENNOX_API_BASE = "https://api.vennoxpay.com.br/functions/v1"
$SECRET_KEY = "YOUR_SECRET_KEY_HERE"
$COMPANY_ID = "a5d1078f-514b-45c5-a42f-004ab1f19afe"
$PRODUCT_NAME = "csf tax"

# Criar credenciais Basic Auth
$credentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${SECRET_KEY}:${COMPANY_ID}"))

# Preparar payload
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
Write-Host ""
Write-Host "📋 Dados do teste:" -ForegroundColor Yellow
Write-Host "   Valor: R$ 1,00"
Write-Host "   Cliente: Teste Carrefour"
Write-Host "   Produto: $PRODUCT_NAME"
Write-Host ""
Write-Host "📤 Enviando requisição para VennoxPay..." -ForegroundColor Yellow
Write-Host "   URL: $VENNOX_API_BASE/transactions"
Write-Host "   Método: POST"
Write-Host ""

try {
    $headers = @{
        "Authorization" = "Basic $credentials"
        "Content-Type" = "application/json"
    }

    $response = Invoke-RestMethod -Uri "$VENNOX_API_BASE/transactions" `
        -Method Post `
        -Headers $headers `
        -Body $payload `
        -ErrorAction Stop

    Write-Host "✅ TRANSAÇÃO CRIADA COM SUCESSO!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Dados da transação:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    Write-Host ""

    # Extrair informações importantes
    $transactionId = $response.id
    $pixCode = $response.pix_code
    if (-not $pixCode) { $pixCode = $response.qr_code }
    if (-not $pixCode) { $pixCode = $response.pix_qr_code }
    if (-not $pixCode) { $pixCode = $response.code }
    $status = $response.status

    Write-Host "🔑 Informações extraídas:" -ForegroundColor Yellow
    $txId = if ($transactionId) { $transactionId } else { "N/A" }
    $pixDisplay = if ($pixCode) { $pixCode.Substring(0, [Math]::Min(50, $pixCode.Length)) + "..." } else { "N/A" }
    $statusDisplay = if ($status) { $status } else { "N/A" }
    Write-Host "   Transaction ID: $txId"
    Write-Host "   PIX Code: $pixDisplay"
    Write-Host "   Status: $statusDisplay"
    Write-Host ""

    if ($pixCode) {
        Write-Host "✅ PIX gerado com sucesso!" -ForegroundColor Green
        Write-Host "   Código PIX completo: $pixCode" -ForegroundColor White
    } else {
        Write-Host "⚠️  PIX Code não encontrado na resposta" -ForegroundColor Yellow
        Write-Host "   Campos disponíveis: $($response.PSObject.Properties.Name -join ', ')" -ForegroundColor Yellow
    }

} catch {
    Write-Host "❌ ERRO NA REQUISIÇÃO!" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status: $statusCode" -ForegroundColor Yellow
        
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "   Mensagem: $responseBody" -ForegroundColor Yellow
            
            try {
                $errorData = $responseBody | ConvertFrom-Json
                Write-Host ""
                Write-Host "📊 Detalhes do erro:" -ForegroundColor Cyan
                $errorData | ConvertTo-Json -Depth 10
            } catch {
                Write-Host "   (Resposta não é JSON válido)"
            }
        } catch {
            Write-Host "   Mensagem: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Stack trace:" -ForegroundColor Gray
    if ($_.Exception.StackTrace) {
        Write-Host $_.Exception.StackTrace -ForegroundColor Gray
    }
}

