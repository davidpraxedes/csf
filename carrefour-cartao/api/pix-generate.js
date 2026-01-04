// Vercel Serverless Function para gerar PIX via VennoxPay (resolve CORS)
// Endpoint: /api/pix-generate

const VENNOX_API_BASE = 'https://api.vennoxpay.com.br/functions/v1';

export default async function handler(req, res) {
  // Lidar com preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Permitir apenas POST
  if (req.method !== 'POST') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Obter variáveis de ambiente
    const SECRET_KEY = process.env.VITE_VENNOX_SECRET_KEY;
    const COMPANY_ID = process.env.VITE_VENNOX_COMPANY_ID || 'a5d1078f-514b-45c5-a42f-004ab1f19afe';

    if (!SECRET_KEY || SECRET_KEY === 'YOUR_SECRET_KEY_HERE' || SECRET_KEY === '') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(500).json({ 
        error: 'Chave da API não configurada. Verifique as variáveis de ambiente no Vercel.' 
      });
    }

    // Criar credenciais Basic Auth
    const credentials = Buffer.from(`${SECRET_KEY}:${COMPANY_ID}`).toString('base64');
    const authHeader = `Basic ${credentials}`;

    // Obter dados do body da requisição
    const requestData = req.body;

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
    const response = await fetch(`${VENNOX_API_BASE}/transactions`, {
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
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(500).json({ 
        error: 'Erro ao processar resposta da API',
        details: responseText 
      });
    }

    if (!response.ok) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(response.status).json({ 
        error: responseData.message || responseData.error || 'Erro ao gerar PIX',
        details: responseData 
      });
    }

    // Retornar resposta com CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Erro na função pix-generate:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
}

