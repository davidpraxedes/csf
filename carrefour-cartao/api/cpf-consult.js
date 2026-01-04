// Vercel Serverless Function para consulta de CPF (resolve CORS)
// Endpoint: /api/cpf-consult

export default async function handler(req, res) {
  // Permitir apenas GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Obter CPF dos query parameters
  const cpf = req.query.cpf_consulta;

  if (!cpf) {
    return res.status(400).json({ error: 'CPF não fornecido' });
  }

  try {
    // Fazer requisição para a API do Aprovado Direto
    const apiUrl = `https://aprovedireto.com/getCpfDataMagma.php?cpf_consulta=${encodeURIComponent(cpf)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`API retornou status ${response.status}`);
    }

    const data = await response.json();

    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao consultar CPF:', error);
    
    // Configurar CORS mesmo em caso de erro
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(500).json({ 
      error: 'Erro ao consultar CPF',
      message: error.message 
    });
  }
}

