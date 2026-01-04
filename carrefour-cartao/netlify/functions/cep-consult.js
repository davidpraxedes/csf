// Netlify Function para consulta de CEP (resolve CORS)
// Endpoint: /.netlify/functions/cep-consult

exports.handler = async (event, context) => {
  // Permitir apenas GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Obter CEP dos query parameters
  const cep = event.queryStringParameters?.cep;

  if (!cep) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'CEP não fornecido' }),
    };
  }

  try {
    // Fazer requisição para a API ViaCEP
    const cepLimpo = cep.replace(/\D/g, '');
    const apiUrl = `https://viacep.com.br/ws/${cepLimpo}/json/`;
    
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

    // Verificar se CEP é válido (ViaCEP retorna erro quando não encontra)
    if (data.erro) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: 'CEP não encontrado' }),
      };
    }

    // Formatar resposta no formato esperado
    const formattedData = {
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
      cep: cepLimpo,
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(formattedData),
    };
  } catch (error) {
    console.error('Erro ao consultar CEP:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ 
        error: 'Erro ao consultar CEP',
        message: error.message 
      }),
    };
  }
};

