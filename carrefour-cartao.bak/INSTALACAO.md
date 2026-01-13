# 🚀 Guia de Instalação Rápida

## Passo a Passo

### 1. Instalar Node.js
Certifique-se de ter Node.js 18+ instalado:
```bash
node --version
```

### 2. Instalar Dependências
```bash
cd carrefour-cartao
npm install
```

### 3. Executar Projeto
```bash
npm run dev
```

O projeto estará disponível em: **http://localhost:5173**

### 4. Integrar Gateway PIX

Edite o arquivo `src/services/pix.js` e substitua a função `gerarPIX` pela sua integração real:

```javascript
export const gerarPIX = async (dados) => {
  const response = await fetch('SEU_ENDPOINT_GATEWAY_PIX', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer SEU_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: dados.amount,
      description: 'Taxa de Emissão Cartão Carrefour',
      customer: dados.customer,
      address: dados.address
    })
  });
  
  const result = await response.json();
  return {
    transactionId: result.id,
    qrCode: result.qrCode,
    pixCode: result.pixCode,
    expiresAt: result.expiresAt
  };
};
```

### 5. Build para Produção
```bash
npm run build
```

Os arquivos estarão em `dist/`

## ✅ Pronto!

Seu sistema está completo e funcionando! 🎉


