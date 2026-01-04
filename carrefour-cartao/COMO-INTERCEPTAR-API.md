# 🔍 Como Interceptar a API de CPF do Aprovado Direto

## Método 1: Usando DevTools do Navegador (Recomendado)

### Passo a Passo:

1. **Abra o site**: https://aprovedireto.com/oportunidade/4/

2. **Abra o DevTools**:
   - Pressione `F12` ou
   - Clique com botão direito → "Inspecionar" ou
   - `Ctrl + Shift + I` (Windows) / `Cmd + Option + I` (Mac)

3. **Vá para a aba "Network" (Rede)**:
   - Clique na aba "Network" no DevTools
   - Certifique-se de que está gravando (botão de gravação deve estar vermelho/ativo)

4. **Filtre as requisições**:
   - No campo de filtro, digite: `XHR` ou `Fetch`
   - Isso mostrará apenas requisições AJAX/Fetch

5. **Digite um CPF no site**:
   - No campo CPF do site, digite um CPF de teste
   - Clique em "Continuar"

6. **Encontre a requisição**:
   - Procure por requisições que contenham:
     - `cpf` no nome
     - `consulta` no nome
     - `supabase` no nome
     - Qualquer requisição POST que aparecer

7. **Copie a requisição**:
   - Clique com botão direito na requisição encontrada
   - Selecione "Copy" → "Copy as cURL" ou "Copy as fetch"
   - Cole em um editor de texto

8. **Analise a requisição**:
   - Veja a URL completa
   - Veja os headers (especialmente `apikey` e `Authorization`)
   - Veja o body (deve conter o CPF)

## Método 2: Usando o Console do Navegador

1. **Abra o Console** (aba "Console" no DevTools)

2. **Cole este código** para interceptar todas as requisições fetch:

```javascript
// Interceptar fetch
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🔍 Requisição interceptada:', args[0]);
  if (args[1]) {
    console.log('📋 Método:', args[1].method || 'GET');
    console.log('📋 Headers:', args[1].headers);
    console.log('📋 Body:', args[1].body);
  }
  return originalFetch.apply(this, args).then(response => {
    console.log('✅ Resposta:', response.status, response.statusText);
    response.clone().json().then(data => {
      console.log('📦 Dados:', data);
    }).catch(() => {});
    return response;
  });
};

console.log('✅ Interceptador ativado! Agora digite um CPF no site.');
```

3. **Digite um CPF** no site e clique em "Continuar"

4. **Veja os logs** no console - todas as requisições serão mostradas

## Método 3: Usando a Aba Network (Mais Detalhado)

1. **Abra DevTools → Network**

2. **Configure o filtro**:
   - Filtre por: `consulta` ou `cpf` ou `supabase`

3. **Digite o CPF** e clique em "Continuar"

4. **Clique na requisição** que aparecer

5. **Veja os detalhes**:
   - **Headers**: Veja todos os headers enviados
   - **Payload**: Veja o body da requisição
   - **Response**: Veja a resposta da API
   - **Preview**: Veja a resposta formatada

6. **Copie como cURL**:
   - Clique com botão direito na requisição
   - "Copy" → "Copy as cURL"
   - Cole e analise

## O que procurar:

### URL da API:
- Deve ser algo como: `https://...supabase.co/functions/v1/...`
- Ou: `https://.../api/consulta-cpf`
- Ou: `https://.../consulta`

### Headers importantes:
- `apikey`: Chave da API
- `Authorization`: Token Bearer
- `Content-Type`: `application/json`
- `Accept`: `application/json`

### Body da requisição:
```json
{
  "cpf": "12345678901"
}
```

## Depois de interceptar:

1. **Anote a URL completa**
2. **Anote todos os headers**
3. **Anote o formato do body**
4. **Teste a requisição** usando o código atualizado

## Teste rápido:

Depois de interceptar, você pode testar diretamente no console:

```javascript
// Substitua pelos valores reais interceptados
fetch('URL_AQUI', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'CHAVE_AQUI',
    'Authorization': 'Bearer TOKEN_AQUI'
  },
  body: JSON.stringify({ cpf: '12345678901' })
})
.then(r => r.json())
.then(data => console.log('Dados:', data))
.catch(err => console.error('Erro:', err));
```

---

**Dica**: Se a API estiver em um iframe ou usar CORS, você pode precisar desabilitar CORS temporariamente ou usar uma extensão do navegador.

