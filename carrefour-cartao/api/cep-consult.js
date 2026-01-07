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

    // Normalizar resposta se necessário, mas o front parece flexível
    return res.status(200).json(data);

  } catch (error) {
    console.error('Erro CEP:', error);
    return res.status(500).json({ error: 'Erro ao consultar CEP' });
  }
}
