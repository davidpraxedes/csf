// Netlify Function para consulta de CPF (resolve CORS)
// Endpoint: /.netlify/functions/cpf-consult

exports.handler = async (event, context) => {
  // Permitir apenas GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Obter CPF dos query parameters
  const cpf = event.queryStringParameters?.cpf_consulta;

  if (!cpf) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'CPF não fornecido' }),
    };
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Erro ao consultar CPF:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ 
        error: 'Erro ao consultar CPF',
        message: error.message 
      }),
    };
  }
};

