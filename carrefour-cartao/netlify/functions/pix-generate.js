// Netlify Function para gerar PIX via VennoxPay (resolve CORS)
// Endpoint: /.netlify/functions/pix-generate

exports.handler = async (event, context) => {
  // Permitir apenas requisições POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Lidar com preflight (OPTIONS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
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

    // Obter dados do body da requisição
    const requestData = JSON.parse(event.body);

    // Preparar payload para VennoxPay
    const payload = {
      amount: requestData.amount,
      description: requestData.description || 'csf tax',
      paymentMethod: 'PIX',
      customer: {
        name: requestData.customer.name,
        email: requestData.customer.email || '',
        phone: requestData.customer.phone,
        document: typeof requestData.customer.document === 'string' 
          ? requestData.customer.document 
          : requestData.customer.document?.number || requestData.customer.document,
      },
      shipping: {
        street: requestData.address.street,
        number: requestData.address.streetNumber,
        complement: requestData.address.complement || '',
        zipCode: requestData.address.zipCode,
        neighborhood: requestData.address.neighborhood,
        city: requestData.address.city,
        state: requestData.address.state,
      },
      items: requestData.items || [
        {
          title: 'csf tax',
          unitPrice: requestData.amount,
          quantity: 1,
        }
      ],
    };

    // Fazer requisição para VennoxPay
    const response = await fetch('https://api.vennoxpay.com.br/functions/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Erro ao processar resposta da API',
          details: responseText 
        }),
      };
    }

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: responseData.message || responseData.error || 'Erro ao gerar PIX',
          details: responseData 
        }),
      };
    }

    // Retornar resposta com CORS
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responseData),
    };

  } catch (error) {
    console.error('Erro na função pix-generate:', error);
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

