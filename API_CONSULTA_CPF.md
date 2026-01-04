# API de Consulta de CPF - meucartaocadastro.com

## Endpoint

**URL:** `https://tsmbotzygympsfxvjeul.supabase.co/functions/v1/consulta-cpf`

**Método:** `POST`

## Headers

```http
Accept: application/json
Content-Type: application/json
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWJvdHp5Z3ltcHNmeHZqZXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Njg3NzMsImV4cCI6MjA4MjU0NDc3M30.W4AbPD6W1hksp0ZcM0-BG9c3aixIk5RejNxQrusV3M0
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWJvdHp5Z3ltcHNmeHZqZXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Njg3NzMsImV4cCI6MjA4MjU0NDc3M30.W4AbPD6W1hksp0ZcM0-BG9c3aixIk5RejNxQrusV3M0
```

## Body Request

```json
{
  "cpf": "12345678901"
}
```

**Nota:** O CPF deve ser enviado apenas com números (sem pontos, traços ou espaços), com 11 dígitos.

## Exemplo de Requisição (cURL)

```bash
curl -X POST "https://tsmbotzygympsfxvjeul.supabase.co/functions/v1/consulta-cpf" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWJvdHp5Z3ltcHNmeHZqZXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Njg3NzMsImV4cCI6MjA4MjU0NDc3M30.W4AbPD6W1hksp0ZcM0-BG9c3aixIk5RejNxQrusV3M0" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWJvdHp5Z3ltcHNmeHZqZXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Njg3NzMsImV4cCI6MjA4MjU0NDc3M30.W4AbPD6W1hksp0ZcM0-BG9c3aixIk5RejNxQrusV3M0" \
  -d '{"cpf":"12345678901"}'
```

## Exemplo de Requisição (JavaScript/Fetch)

```javascript
const cpf = "12345678901"; // CPF apenas números

const response = await fetch("https://tsmbotzygympsfxvjeul.supabase.co/functions/v1/consulta-cpf", {
  method: "POST",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWJvdHp5Z3ltcHNmeHZqZXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Njg3NzMsImV4cCI6MjA4MjU0NDc3M30.W4AbPD6W1hksp0ZcM0-BG9c3aixIk5RejNxQrusV3M0",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWJvdHp5Z3ltcHNmeHZqZXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Njg3NzMsImV4cCI6MjA4MjU0NDc3M30.W4AbPD6W1hksp0ZcM0-BG9c3aixIk5RejNxQrusV3M0"
  },
  body: JSON.stringify({ cpf })
});

const data = await response.json();
console.log(data);
```

## Resposta Esperada

Com base no código JavaScript do site, a resposta esperada deve conter os seguintes campos:

```json
{
  "nomeCompleto": "NOME DA PESSOA",
  "nomeMae": "NOME DA MÃE",
  "nomeDaMae": "NOME DA MÃE",
  "dataDeNascimento": "DD/MM/AAAA",
  "dataNascimento": "DD/MM/AAAA",
  "emails": [
    {
      "enderecoEmail": "email@exemplo.com"
    }
  ],
  "enderecos": [
    {
      // Dados de endereço
    }
  ]
}
```

**Nota:** A API retornou status 404 durante os testes, o que pode indicar que:
1. A função pode não estar ativa/disponível no momento
2. Pode ser necessário autenticação adicional
3. A função pode ter sido desativada ou movida

## O que podemos fazer com essa API?

### 📋 **Funcionalidades Principais:**

1. **Consultar Dados Pessoais por CPF**
   - Obter nome completo da pessoa
   - Obter nome da mãe (importante para validações de segurança)
   - Obter data de nascimento

2. **Obter Informações de Contato**
   - Lista de emails associados ao CPF
   - Endereços cadastrados

3. **Validação de Identidade**
   - Verificar se um CPF existe e está ativo
   - Validar dados pessoais em processos de cadastro
   - Confirmar identidade em transações

### ⚠️ **Aplicações Práticas (com ressalvas legais):**

1. **Sistemas de Cadastro**
   - Pré-preenchimento de formulários com dados da API
   - Validação automática de informações fornecidas pelo usuário

2. **Processos de Onboarding**
   - Verificação de identidade em abertura de contas
   - Validação em processos de crédito (como no site analisado)

3. **Autenticação e Segurança**
   - Verificação de identidade em transações
   - Confirmação de dados em processos sensíveis

4. **Integração com Sistemas Financeiros**
   - Validação de dados em solicitações de cartão de crédito
   - Verificação em processos de empréstimo

### ⚠️ **IMPORTANTE - Considerações Legais e Éticas:**

**ATENÇÃO:** O uso desta API deve seguir rigorosamente as leis de proteção de dados:

1. **LGPD (Lei Geral de Proteção de Dados)**
   - Você precisa de consentimento expresso do titular dos dados
   - Dados pessoais só podem ser coletados para fins específicos e informados
   - O titular tem direito de acesso, correção e exclusão de seus dados

2. **Uso Legítimo Apenas:**
   - ✅ Com consentimento explícito do titular
   - ✅ Para finalidades legítimas e informadas
   - ✅ Com medidas de segurança adequadas
   - ❌ NÃO usar para coleta indiscriminada de dados
   - ❌ NÃO usar para spam, fraude ou atividades ilegais
   - ❌ NÃO violar privacidade de terceiros

3. **Responsabilidades:**
   - Você é responsável pelo uso adequado da API
   - Deve garantir segurança e confidencialidade dos dados obtidos
   - Deve seguir as políticas de uso do provedor da API

### 🔒 **Recomendações de Segurança:**

- Sempre valide e sanitize os dados recebidos
- Não armazene dados sensíveis sem criptografia
- Implemente logs de auditoria para rastreabilidade
- Use HTTPS para todas as comunicações
- Implemente rate limiting para evitar abuso

## Informações Técnicas

- **Plataforma:** Supabase (Edge Functions)
- **Base URL:** `https://tsmbotzygympsfxvjeul.supabase.co`
- **Tipo:** Supabase Edge Function
- **CORS:** Habilitado (requisições OPTIONS são suportadas)

## Outras APIs Relacionadas

O site também utiliza:

- **Consulta CEP:** `https://tsmbotzygympsfxvjeul.supabase.co/functions/v1/consulta-cep`
- **Geração PIX:** `https://tsmbotzygympsfxvjeul.supabase.co/functions/v1/generate-pix`

## Observações Importantes

⚠️ **Atenção:** Esta API utiliza serviços do Supabase e requer autenticação. O uso não autorizado pode violar termos de serviço. Use apenas para fins legítimos e com autorização adequada.

⚠️ **Segurança:** A chave de API (apikey) e o token de autorização expostos no código JavaScript são públicos, mas o uso inadequado pode resultar em bloqueio ou ação legal.

