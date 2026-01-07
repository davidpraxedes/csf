export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { cep } = req.query;

  if (!cep) {
    return res.status(400).json({ error: 'CEP obrigatório' });
  }

  // Limpar CEP
  const cleanCep = cep.replace(/\D/g, '');

  try {
    // Usar BrasilAPI v2 diretamente
    const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`);

    if (!response.ok) {
      throw new Error(`BrasilAPI Error: ${response.status}`);
    }

    const data = await response.json();

    console.log('📦 [CEP API Vercel] BrasilAPI response:', JSON.stringify(data, null, 2));

    // BrasilAPI retorna: { cep, state, city, neighborhood, street, service }
    // Frontend espera: { logradouro, bairro, localidade/cidade, uf/estado, cep }
    const mappedData = {
      cep: data.cep || cleanCep,
      logradouro: data.street || '',
      bairro: data.neighborhood || '',
      localidade: data.city || '',
      cidade: data.city || '',
      uf: data.state || '',
      estado: data.state || ''
    };

    console.log('✅ [CEP API Vercel] Mapped response:', JSON.stringify(mappedData, null, 2));

    return res.status(200).json(mappedData);

  } catch (error) {
    console.error('Erro CEP:', error);
    return res.status(500).json({ error: 'Erro ao consultar CEP' });
  }
}
