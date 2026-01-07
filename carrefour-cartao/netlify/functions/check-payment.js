// Netlify Function para verificar status de pagamento
// Endpoint: /.netlify/functions/check-payment

const VENNOX_API_BASE = 'https://api.vennoxpay.com.br/functions/v1';

exports.handler = async (event, context) => {
  // Permitir apenas GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const transactionId = event.queryStringParameters?.transactionId;

  if (!transactionId) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Transaction ID não fornecido' }),
    };
  }

  try {
    // Obter variáveis de ambiente
    const SECRET_KEY = process.env.VITE_VENNOX_SECRET_KEY;
    const COMPANY_ID = process.env.VITE_VENNOX_COMPANY_ID || 'a5d1078f-514b-45c5-a42f-004ab1f19afe';

    if (!SECRET_KEY || SECRET_KEY === 'YOUR_SECRET_KEY_HERE' || SECRET_KEY === '') {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Chave da API não configurada. Verifique as variáveis de ambiente na Netlify.' 
        }),
      };
    }

    // Criar credenciais Basic Auth
    const credentials = Buffer.from(`${SECRET_KEY}:${COMPANY_ID}`).toString('base64');
    const authHeader = `Basic ${credentials}`;

    // Fazer requisição para VennoxPay
    const response = await fetch(`${VENNOX_API_BASE}/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: `Erro ao verificar pagamento: ${response.status}` 
        }),
      };
    }

    const data = await response.json();
    
    // Mapear status da API
    const transactionData = data.data || data;
    const status = transactionData.status || data.status || 'pending';
    const paid = status === 'paid' || status === 'approved' || status === 'completed';
    
    // Retornar resposta com CORS
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: paid ? 'paid' : status === 'expired' ? 'expired' : 'pending',
        paid,
        data: data,
      }),
    };

  } catch (error) {
    console.error('Erro na função check-payment:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Erro interno do servidor',
        message: error.message 
      }),
    };
  }
};


