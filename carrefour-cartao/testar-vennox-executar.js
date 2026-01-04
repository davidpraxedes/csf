// Script de teste para integração VennoxPay - Execução direta
// Execute com: node testar-vennox-executar.js

import fetch from 'node-fetch';

const VENNOX_API_BASE = 'https://api.vennoxpay.com.br/functions/v1';
const SECRET_KEY = 'YOUR_SECRET_KEY_HERE';
const COMPANY_ID = 'a5d1078f-514b-45c5-a42f-004ab1f19afe';
const PRODUCT_NAME = 'csf tax';

// Criar credenciais Basic Auth
function createAuthHeader() {
  const credentials = Buffer.from(`${SECRET_KEY}:${COMPANY_ID}`).toString('base64');
  return `Basic ${credentials}`;
}

// Dados de teste
const dadosTeste = {
  amount: 1.00, // R$ 1,00 para teste
  customer: {
    name: 'Teste Carrefour',
    email: 'teste@carrefour.com',
    phone: '11999999999',
    document: { number: '12345678900' }
  },
  address: {
    street: 'Rua Teste',
    streetNumber: '123',
    complement: 'Apto 45',
    zipCode: '01234567',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP'
  }
};

async function testarVennoxPay() {
  console.log('🧪 Testando integração VennoxPay...\n');
  console.log('📋 Dados do teste:');
  console.log(`   Valor: R$ ${dadosTeste.amount.toFixed(2)}`);
  console.log(`   Cliente: ${dadosTeste.customer.name}`);
  console.log(`   Produto: ${PRODUCT_NAME}\n`);

  // Preparar payload
  const payload = {
    amount: dadosTeste.amount,
    description: PRODUCT_NAME,
    payment_method: 'pix',
    csf_tax: PRODUCT_NAME,
    customer: {
      name: dadosTeste.customer.name,
      email: dadosTeste.customer.email,
      phone: dadosTeste.customer.phone,
      document: dadosTeste.customer.document.number,
    },
    billing_address: {
      street: dadosTeste.address.street,
      number: dadosTeste.address.streetNumber,
      complement: dadosTeste.address.complement,
      zipcode: dadosTeste.address.zipCode,
      neighborhood: dadosTeste.address.neighborhood,
      city: dadosTeste.address.city,
      state: dadosTeste.address.state,
    },
  };

  console.log('📤 Enviando requisição para VennoxPay...');
  console.log(`   URL: ${VENNOX_API_BASE}/transactions`);
  console.log(`   Método: POST\n`);
  console.log('📦 Payload enviado:');
  console.log(JSON.stringify(payload, null, 2));
  console.log('');

  try {
    const response = await fetch(`${VENNOX_API_BASE}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('📥 Resposta recebida:');
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   OK: ${response.ok}\n`);

    const responseText = await response.text();
    console.log('📄 Resposta completa (texto):');
    console.log(responseText);
    console.log('');

    if (!response.ok) {
      console.error('❌ ERRO NA REQUISIÇÃO!\n');
      console.error(`   Status: ${response.status}`);
      console.error(`   Mensagem: ${responseText}\n`);
      
      try {
        const errorData = JSON.parse(responseText);
        console.error('📊 Detalhes do erro (JSON):');
        console.error(JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.error('   (Resposta não é JSON válido)');
      }
      
      return;
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Erro ao fazer parse da resposta JSON');
      console.error('   Resposta:', responseText);
      return;
    }

    console.log('✅ TRANSAÇÃO CRIADA COM SUCESSO!\n');
    console.log('📊 Dados da transação (JSON formatado):');
    console.log(JSON.stringify(data, null, 2));
    console.log('');

    // Extrair informações importantes
    const transactionId = data.id || data.transaction_id || data.transactionId;
    const pixCode = data.pix_code || data.qr_code || data.pix_qr_code || data.code;
    const status = data.status || data.payment_status;

    console.log('🔑 Informações extraídas:');
    console.log(`   Transaction ID: ${transactionId || 'N/A'}`);
    console.log(`   PIX Code: ${pixCode ? pixCode.substring(0, 50) + '...' : 'N/A'}`);
    console.log(`   Status: ${status || 'N/A'}\n`);

    if (pixCode) {
      console.log('✅ PIX gerado com sucesso!');
      console.log(`   Código PIX completo: ${pixCode}\n`);
    } else {
      console.log('⚠️  PIX Code não encontrado na resposta');
      console.log('   Verifique a estrutura da resposta da API');
      console.log('   Campos disponíveis:', Object.keys(data).join(', '));
    }

  } catch (error) {
    console.error('❌ ERRO AO TESTAR INTEGRAÇÃO:\n');
    console.error(`   Tipo: ${error.name}`);
    console.error(`   Mensagem: ${error.message}\n`);
    
    if (error.stack) {
      console.error('   Stack:');
      console.error(error.stack);
    }
  }
}

// Executar teste
testarVennoxPay();

