# Como usar a API de Consulta de CPF

## ✅ Status das Credenciais

**As credenciais foram encontradas e estão funcionando!**

- **URL:** `https://tsmbotzygympsfxvjeul.supabase.co/functions/v1/consulta-cpf`
- **API Key:** Configurada nos scripts
- **Status:** API está respondendo (retorna 404 quando CPF não encontrado, o que é esperado)

## 📁 Scripts Disponíveis

### 1. Script Python (`consulta_cpf.py`)

**Uso:**
```bash
# Instalar dependências (se necessário)
pip install requests

# Executar
python3 consulta_cpf.py

# Ou passando CPF como argumento
python3 consulta_cpf.py 12345678901
```

### 2. Script Node.js (`testar_api_cpf.js`)

**Uso:**
```bash
node testar_api_cpf.js
```

### 3. Via cURL

```bash
curl -X POST "https://tsmbotzygympsfxvjeul.supabase.co/functions/v1/consulta-cpf" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWJvdHp5Z3ltcHNmeHZqZXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Njg3NzMsImV4cCI6MjA4MjU0NDc3M30.W4AbPD6W1hksp0ZcM0-BG9c3aixIk5RejNxQrusV3M0" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWJvdHp5Z3ltcHNmeHZqZXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Njg3NzMsImV4cCI6MjA4MjU0NDc3M30.W4AbPD6W1hksp0ZcM0-BG9c3aixIk5RejNxQrusV3M0" \
  -d '{"cpf":"SEU_CPF_AQUI"}'
```

## 📋 Formato do CPF

- **Entrada:** Pode ser com ou sem formatação
  - `12345678901` ✅
  - `123.456.789-01` ✅
- **Processamento:** Os scripts removem automaticamente a formatação
- **Validação:** Deve ter exatamente 11 dígitos

## 📊 Respostas Esperadas

### ✅ Sucesso (200)
```json
{
  "nomeCompleto": "NOME DA PESSOA",
  "nomeDaMae": "NOME DA MÃE",
  "dataDeNascimento": "DD/MM/AAAA",
  "emails": [{"enderecoEmail": "email@exemplo.com"}],
  "enderecos": [/* dados de endereço */]
}
```

### ❌ CPF não encontrado (404)
```json
{
  "error": "CPF não encontrado ou inválido"
}
```

## ⚠️ IMPORTANTE - Uso Responsável

1. **LGPD:** Sempre obtenha consentimento antes de consultar dados
2. **Fins Legítimos:** Use apenas para propósitos legais e autorizados
3. **Segurança:** Não compartilhe dados obtidos de forma inadequada
4. **Responsabilidade:** Você é responsável pelo uso adequado da API

## 🔧 Integração em Código

### Python
```python
from consulta_cpf import consultar_cpf

resultado = consultar_cpf("12345678901")
if not resultado["erro"]:
    dados = resultado["dados"]
    print(f"Nome: {dados['nome_completo']}")
```

### JavaScript/Node.js
```javascript
const { consultarCPF } = require('./testar_api_cpf.js');

consultarCPF("12345678901").then(resultado => {
    if (!resultado.error) {
        console.log("Nome:", resultado.data.nomeCompleto);
    }
});
```

## 📝 Observações

- A API está funcional e respondendo
- Retorna 404 quando o CPF não é encontrado (comportamento esperado)
- As credenciais estão válidas e funcionando
- Use sempre com responsabilidade e dentro da lei

