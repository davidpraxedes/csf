# 🎯 Instruções Rápidas para Interceptar a API

## Passo a Passo Simples:

### 1. Abra o site
Acesse: **https://aprovedireto.com/oportunidade/4/**

### 2. Abra o Console do Navegador
- Pressione **F12**
- Ou: `Ctrl + Shift + I` (Windows) / `Cmd + Option + I` (Mac)
- Vá para a aba **"Console"**

### 3. Cole o Script de Interceptação
- Abra o arquivo `interceptar-api.js` deste projeto
- **Copie TODO o conteúdo**
- **Cole no Console** do navegador
- Pressione **Enter**

### 4. Digite um CPF no Site
- No campo CPF do site, digite qualquer CPF (ex: 12345678901)
- Clique em **"Continuar"**

### 5. Veja a Requisição Interceptada
- No console aparecerá:
  - ✅ URL da API
  - ✅ Headers completos
  - ✅ Body da requisição
  - ✅ Resposta da API
  - ✅ Código pronto para usar

### 6. Copie as Informações
- Copie a URL
- Copie os headers (especialmente `apikey` e `Authorization`)
- Copie o formato do body

### 7. Me Envie as Informações
Envie:
- A URL completa
- Os headers (especialmente apikey e Authorization)
- O formato da resposta

---

## Alternativa: Usar DevTools Network

1. Abra **DevTools** (F12)
2. Vá para aba **"Network"** (Rede)
3. Filtre por **"XHR"** ou **"Fetch"**
4. Digite CPF no site e clique **"Continuar"**
5. Procure a requisição que apareceu
6. Clique com botão direito → **"Copy"** → **"Copy as cURL"**
7. Cole aqui e eu analiso!

---

**Dica**: O script `interceptar-api.js` faz tudo automaticamente! Basta colar no console.



