// Vercel Serverless Function para consulta de CEP (resolve CORS) with Fallback
// Endpoint: /api/cep-consult

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responder OPTIONS para preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Obter e limpar CEP
  const rawCep = req.query.cep;
  if (!rawCep) {
    return res.status(400).json({ error: 'CEP não fornecido' });
  }

  const cep = rawCep.replace(/\D/g, ''); // Apenas números
  if (cep.length !== 8) {
    return res.status(400).json({ error: 'Formato de CEP inválido' });
  }

  // Função helper para fetch com timeout
  const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  try {
    console.log(`🔍 [API] Consultando CEP: ${cep}`);

    // TENTATIVA 1: BrasilAPI (Geralmente mais rápida)
    try {
      console.log('Trying BrasilAPI...');
      const response = await fetchWithTimeout(`https://brasilapi.com.br/api/cep/v2/${cep}`, {}, 4000);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ BrasilAPI Success');
        return res.status(200).json(data);
      }
    } catch (e) {
      console.warn('⚠️ BrasilAPI Failed/Timeout:', e.message);
    }

    // TENTATIVA 2: ViaCEP (Fallback)
    try {
      console.log('Trying ViaCEP (Fallback)...');
      const response = await fetchWithTimeout(`https://viacep.com.br/ws/${cep}/json/`, {}, 6000);

      if (response.ok) {
        const data = await response.json();
        if (data.erro) throw new Error('CEP não encontrado no ViaCEP');

        console.log('✅ ViaCEP Success');
        // Normalizar resposta para parecer com BrasilAPI (opcional, ou o front lida)
        // O front atual parece lidar com o formato do ViaCEP também ou espera campos comuns
        // ViaCEP retorna: logradouro, bairro, localidade(cidade), uf(estado)
        // BrasilAPI v2 retorna: street, neighborhood, city, state

        // Vamos normalizar para o formato que o Front espera (verificando PaymentPage, ele usa 'logradouro', 'cidade', 'estado')
        // ViaCEP já retorna chaves compatíveis com o padrão 'logradouro', 'bairro' etc.
        // O código do front usa: endereco.logradouro, endereco.cidade

        return res.status(200).json(data);
      }
    } catch (e) {
      console.error('❌ ViaCEP Failed:', e.message);
    }

    // Se chegou aqui, ambos falharam
    return res.status(404).json({ error: 'CEP não encontrado ou serviços indisponíveis' });

  } catch (error) {
    console.error('🔥 Critical Error in CEP API:', error);
    return res.status(500).json({
      error: 'Erro interno ao consultar CEP',
      message: error.message
    });
  }
}
