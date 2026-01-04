// Service para gerar PIX via VennoxPay Gateway
// Documentação: https://vennox.readme.io/reference/introdu%C3%A7%C3%A3o

const VENNOX_API_BASE = 'https://api.vennoxpay.com.br/functions/v1';
// Usar variáveis de ambiente para segurança
const SECRET_KEY = import.meta.env.VITE_VENNOX_SECRET_KEY;
const COMPANY_ID = import.meta.env.VITE_VENNOX_COMPANY_ID || 'a5d1078f-514b-45c5-a42f-004ab1f19afe';
const PRODUCT_NAME = 'csf tax';

// Validar se as variáveis de ambiente estão configuradas
if (!SECRET_KEY || SECRET_KEY === 'YOUR_SECRET_KEY_HERE' || SECRET_KEY === '') {
  console.error('⚠️ ERRO: VITE_VENNOX_SECRET_KEY não está configurada!');
  console.error('Configure a variável de ambiente VITE_VENNOX_SECRET_KEY na Netlify.');
}

// Criar credenciais Basic Auth
const createAuthHeader = () => {
  const credentials = btoa(`${SECRET_KEY}:${COMPANY_ID}`);
  return `Basic ${credentials}`;
};

/**
 * Gera um PIX através do gateway VennoxPay
 * @param {Object} dados - Dados do pagamento
 * @param {number} dados.amount - Valor do pagamento
 * @param {Object} dados.customer - Dados do cliente
 * @param {Object} dados.address - Endereço do cliente
 * @returns {Promise<Object>} Dados do PIX gerado
 */
// Gerar PIX mock para desenvolvimento local
const gerarPIXMock = (dados) => {
  const mockPixCode = '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540525.505802BR5925CARREFOUR SOLUCOES FINAN6009SAO PAULO62070503***6304';
  const mockTransactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
  
  return {
    transactionId: mockTransactionId,
    pixCode: mockPixCode,
    qrCode: mockPixCode,
    end2EndId: 'E' + Date.now(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    status: 'pending',
    rawResponse: { mock: true }
  };
};

export const gerarPIX = async (dados, existingTransactionId = null) => {
  // Em desenvolvimento local, usar PIX mock se a chave não estiver configurada
  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if ((!SECRET_KEY || SECRET_KEY === 'YOUR_SECRET_KEY_HERE' || SECRET_KEY === '') && isDevelopment) {
    console.warn('⚠️ Modo de desenvolvimento: Usando PIX mock para visualização');
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay da API
    return gerarPIXMock(dados);
  }
  
  // Validar se a chave está configurada antes de fazer requisição
  if (!SECRET_KEY || SECRET_KEY === 'YOUR_SECRET_KEY_HERE' || SECRET_KEY === '') {
    const errorMsg = 'Erro de configuração: Chave da API não configurada. Verifique as variáveis de ambiente na Netlify.';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  try {
    // Verificar se já existe uma transação (evitar duplicação)
    if (existingTransactionId) {
      console.log('Verificando transação existente:', existingTransactionId);
      try {
        const existingTransaction = await verificarPagamento(existingTransactionId);
        if (existingTransaction && existingTransaction.data) {
          const transactionData = existingTransaction.data.data || existingTransaction.data;
          const pixData = transactionData.pix || {};
          if (pixData.qrcode) {
            console.log('Reutilizando transação existente');
            return {
              transactionId: existingTransactionId,
              qrCode: pixData.qrcode,
              pixCode: pixData.qrcode,
              end2EndId: pixData.end2EndId,
              expiresAt: pixData.expirationDate || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
              status: transactionData.status || 'pending',
              rawResponse: existingTransaction.data,
            };
          }
        }
      } catch (error) {
        console.log('Transação não encontrada ou inválida, criando nova');
      }
    }

    // Preparar payload para o VennoxPay
    // O valor deve ser em centavos (1.00 = 100 centavos)
    const amountInCents = Math.round(dados.amount * 100);
    
    const payload = {
      amount: amountInCents,
      description: PRODUCT_NAME,
      paymentMethod: 'PIX',
      customer: {
        name: dados.customer.name,
        email: dados.customer.email || '',
        phone: dados.customer.phone,
        document: dados.customer.document.number,
      },
      shipping: {
        street: dados.address.street,
        streetNumber: dados.address.streetNumber,
        complement: dados.address.complement || '',
        zipCode: dados.address.zipCode,
        neighborhood: dados.address.neighborhood,
        city: dados.address.city,
        state: dados.address.state,
      },
      items: [
        {
          title: PRODUCT_NAME,
          unitPrice: amountInCents,
          quantity: 1,
        }
      ],
    };

    console.log('Gerando PIX via VennoxPay:', {
      url: `${VENNOX_API_BASE}/transactions`,
      payload: { ...payload, customer: { ...payload.customer, document: '***' } }
    });

    // Usar Serverless Function em produção para resolver CORS
    const isProduction = import.meta.env.PROD;
    const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
    const apiUrl = isProduction 
      ? (isVercel ? '/api/pix-generate' : '/.netlify/functions/pix-generate')
      : `${VENNOX_API_BASE}/transactions`;

    // Preparar dados para enviar (formato diferente para Netlify Function)
    const requestData = isProduction ? {
      amount: amountInCents,
      description: PRODUCT_NAME,
      customer: {
        name: dados.customer.name,
        email: dados.customer.email || '',
        phone: dados.customer.phone,
        document: dados.customer.document.number,
      },
      address: {
        street: dados.address.street,
        streetNumber: dados.address.streetNumber,
        complement: dados.address.complement || '',
        zipCode: dados.address.zipCode,
        neighborhood: dados.address.neighborhood,
        city: dados.address.city,
        state: dados.address.state,
      },
      items: [
        {
          title: PRODUCT_NAME,
          unitPrice: amountInCents,
          quantity: 1,
        }
      ],
    } : payload;

    // Fazer requisição para criar transação PIX
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: isProduction ? {
        'Content-Type': 'application/json',
      } : {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('Resposta do VennoxPay:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta do VennoxPay:', errorText);
      
      let errorMessage = 'Erro ao gerar PIX';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || `Erro ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Dados recebidos do VennoxPay:', data);

    // Extrair dados do PIX da resposta
    // Estrutura: { id, type, objectId, data: { id, pix: { qrcode, end2EndId, expirationDate } } }
    const transactionData = data.data || data;
    const transactionId = data.id || transactionData.id || data.objectId;
    const pixData = transactionData.pix || {};
    
    // O qrcode pode ser uma URL ou o código PIX direto
    const qrCodeUrl = pixData.qrcode;
    const end2EndId = pixData.end2EndId;
    
    // Se qrcode é uma URL, precisamos extrair o código PIX dela ou usar end2EndId
    // Por enquanto, vamos usar end2EndId se disponível, senão a URL
    const pixCode = end2EndId || qrCodeUrl;

    if (!transactionId) {
      console.error('Resposta incompleta do VennoxPay:', data);
      throw new Error('Resposta incompleta do gateway de pagamento');
    }

    // Se não tiver código PIX direto, vamos usar a URL do QR Code
    // O componente QRCodeSVG pode usar a URL ou precisaremos fazer uma requisição adicional
    const expirationDate = pixData.expirationDate || transactionData.pix?.expirationDate;

    return {
      transactionId,
      qrCode: qrCodeUrl || pixCode,
      pixCode: pixCode,
      end2EndId: end2EndId,
      expiresAt: expirationDate || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      status: transactionData.status || 'pending',
      rawResponse: data, // Manter resposta completa para debug
    };
  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    
    // Tratar erros específicos
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      throw new Error('Erro de autenticação com o gateway. Verifique as credenciais.');
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
    }
    
    throw error;
  }
};

/**
 * Verifica o status de um pagamento
 * @param {string} transactionId - ID da transação
 * @returns {Promise<Object>} Status do pagamento
 */
export const verificarPagamento = async (transactionId) => {
  try {
    // Detectar se está em produção e qual plataforma (Vercel ou Netlify)
    const isProduction = import.meta.env.PROD;
    const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
    
    // Em produção, usar Serverless Function; em dev, usar API direta
    const apiUrl = isProduction 
      ? (isVercel 
          ? `/api/check-payment?transactionId=${encodeURIComponent(transactionId)}`
          : `/.netlify/functions/check-payment?transactionId=${encodeURIComponent(transactionId)}`)
      : `${VENNOX_API_BASE}/transactions/${transactionId}`;

    const headers = isProduction 
      ? {
          'Accept': 'application/json',
        }
      : {
          'Authorization': createAuthHeader(),
          'Content-Type': 'application/json',
        };

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`Erro ao verificar pagamento: ${response.status}`);
    }

    const data = await response.json();
    
    // Se já vem formatado da função serverless
    if (data.paid !== undefined) {
      return data;
    }
    
    // Mapear status da API para nosso formato (quando vem direto da API)
    const transactionData = data.data || data;
    const status = transactionData.status || data.status || 'pending';
    const paid = status === 'paid' || status === 'approved' || status === 'completed';
    
    return {
      status: paid ? 'paid' : status === 'expired' ? 'expired' : 'pending',
      paid,
      data: data,
    };
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    return {
      status: 'pending',
      paid: false,
      error: error.message,
    };
  }
};

/**
 * Lista transações (útil para debug)
 * @param {Object} filters - Filtros opcionais
 * @returns {Promise<Array>} Lista de transações
 */
export const listarTransacoes = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${VENNOX_API_BASE}/transactions${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao listar transações: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.transactions || data.data || [];
  } catch (error) {
    console.error('Erro ao listar transações:', error);
    throw error;
  }
};
