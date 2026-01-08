// Vercel Serverless Function para consulta de CPF (resolve CORS)
// Endpoint: /api/cpf-consult
import axios from 'axios';

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
    // Fazer requisição para a nova API interceptada
    const apiUrl = `https://simularapido.info/getCpfDataMagma.php?cpf_consulta=${encodeURIComponent(cpf)}`;

    console.log('Consultando API externa:', apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin', // spoofing same-origin
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://simularapido.info/online/4/index.html',
        'X-Requested-With': 'XMLHttpRequest',
        'Host': 'simularapido.info',
        'Origin': 'https://simularapido.info'
      },
      // Axios configuration to validate status
      validateStatus: function (status) {
        return status >= 200 && status < 300; // default
      },
    });

    const data = response.data;

    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao consultar CPF:', error.message);

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


