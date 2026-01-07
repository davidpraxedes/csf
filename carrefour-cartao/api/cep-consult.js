// Vercel Serverless Function para consulta de CEP (resolve CORS)
// Endpoint: /api/cep-consult

export default async function handler(req, res) {
  // Permitir apenas GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Obter CEP dos query parameters
  const cep = req.query.cep;

  if (!cep) {
    return res.status(400).json({ error: 'CEP não fornecido' });
  }

  try {
    // Fazer requisição para a API ViaCEP
    const apiUrl = `https://viacep.com.br/ws/${encodeURIComponent(cep)}/json/`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API retornou status ${response.status}`);
    }

    const data = await response.json();

    if (data.erro) {
      return res.status(404).json({ error: 'CEP não encontrado' });
    }

    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao consultar CEP:', error);
    
    // Configurar CORS mesmo em caso de erro
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(500).json({ 
      error: 'Erro ao consultar CEP',
      message: error.message 
    });
  }
}


