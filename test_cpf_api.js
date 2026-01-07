const https = require('https');

const cpf = '51985786818';
// Tentando na raiz, pois o log mostrou "/getCpfDataMagma.php" (com slash inicial)
const url = `https://simularapido.info/getCpfDataMagma.php?cpf_consulta=${cpf}`;

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://simularapido.info/online/4/index.html',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest'
    }
};

console.log(`Testando API: ${url}`);

https.get(url, options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            if (res.statusCode === 200) {
                console.log('Resposta Bruta:', data);
                const parsed = JSON.parse(data);
                console.log('Dados Parseados:', JSON.stringify(parsed, null, 2));
            } else {
                console.error('Erro na requisição. Status:', res.statusCode);
                console.error('Corpo:', data);
            }
        } catch (e) {
            console.error('Erro ao parsear resposta:', e);
            console.log('Dados recebidos:', data);
        }
    });

}).on('error', (err) => {
    console.error('Erro de conexão:', err.message);
});
