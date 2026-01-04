// Vercel Serverless Function para verificar status de pagamento
// Endpoint: /api/check-payment

const VENNOX_API_BASE = 'https://api.vennoxpay.com.br/functions/v1';

export default async function handler(req, res) {
  // Permitir apenas GET
  if (req.method !== 'GET') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transactionId } = req.query;

  if (!transactionId) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).json({ error: 'Transaction ID não fornecido' });
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

    // Fazer requisição para VennoxPay
    const response = await fetch(`${VENNOX_API_BASE}/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(response.status).json({ 
        error: `Erro ao verificar pagamento: ${response.status}` 
      });
    }

    const data = await response.json();
    
    // Mapear status da API
    const transactionData = data.data || data;
    const status = transactionData.status || data.status || 'pending';
    const paid = status === 'paid' || status === 'approved' || status === 'completed';
    
    // Retornar resposta com CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(200).json({
      status: paid ? 'paid' : status === 'expired' ? 'expired' : 'pending',
      paid,
      data: data,
    });

  } catch (error) {
    console.error('Erro na função check-payment:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
}

