# 🔧 Como Corrigir PIX Mock - Gerar PIX Real

## 🎯 Problema

O PIX está gerando um código mock ao invés de usar o gateway real. Isso acontece porque as **variáveis de ambiente não estão configuradas** na Netlify.

## ✅ Solução: Configurar Variáveis de Ambiente na Netlify

### Passo 1: Acessar Configurações do Site

1. Acesse: **https://app.netlify.com**
2. Clique no seu site
3. Vá em: **"Site settings"** (ícone de engrenagem)
4. No menu lateral, clique em: **"Environment variables"**

### Passo 2: Adicionar Variáveis

Clique em **"Add a variable"** e adicione as 3 variáveis:

#### Variável 1: VITE_VENNOX_SECRET_KEY
- **Key**: `VITE_VENNOX_SECRET_KEY`
- **Value**: `sk_live_SUA_CHAVE_REAL_AQUI` (substitua pela sua chave real)
- ⚠️ **IMPORTANTE**: Use a chave real, não o placeholder!

#### Variável 2: VITE_VENNOX_COMPANY_ID
- **Key**: `VITE_VENNOX_COMPANY_ID`
- **Value**: `a5d1078f-514b-45c5-a42f-004ab1f19afe`

#### Variável 3: VITE_FACEBOOK_PIXEL_ID
- **Key**: `VITE_FACEBOOK_PIXEL_ID`
- **Value**: `1216763333745021` (ou seu Pixel ID)

### Passo 3: Fazer Novo Deploy

⚠️ **CRÍTICO**: Após adicionar as variáveis, você **DEVE** fazer um novo deploy!

1. Vá em: **"Deploys"**
2. Clique no menu dos 3 pontos do último deploy
3. Selecione: **"Trigger deploy"** → **"Clear cache and deploy site"**
4. Aguarde o build completar (2-3 minutos)

### Passo 4: Verificar

1. Acesse o site
2. Abra o console do navegador (F12)
3. Vá até a página de pagamento
4. Tente gerar o PIX
5. No console, verifique:
   - ❌ Se aparecer: `⚠️ ERRO: VITE_VENNOX_SECRET_KEY não está configurada!` → Variáveis não foram configuradas corretamente
   - ✅ Se aparecer: `Gerando PIX via VennoxPay:` → Está funcionando!

## 🔍 Como Verificar se Está Funcionando

### No Console do Navegador (F12)

**Se estiver funcionando:**
```
Gerando PIX via VennoxPay: {url: "https://api.vennoxpay.com.br/...", ...}
Resposta do VennoxPay: {status: 200, ...}
Dados recebidos do VennoxPay: {...}
```

**Se NÃO estiver funcionando:**
```
⚠️ ERRO: VITE_VENNOX_SECRET_KEY não está configurada!
❌ Erro de configuração: Chave da API não configurada
```

### Verificar Variáveis no Build

1. Na Netlify, vá em **"Deploys"**
2. Clique no último deploy
3. Veja os logs do build
4. Procure por mensagens de erro relacionadas a variáveis de ambiente

## 🆘 Problemas Comuns

### Problema: "Variável não encontrada"

**Solução:**
- Certifique-se de que o nome da variável está **exatamente** como: `VITE_VENNOX_SECRET_KEY`
- As variáveis devem começar com `VITE_` para serem acessíveis no frontend
- Após adicionar, faça um **novo deploy** (não basta salvar)

### Problema: "Erro 401 Unauthorized"

**Solução:**
- Verifique se a chave `VITE_VENNOX_SECRET_KEY` está correta
- Certifique-se de que não há espaços extras no valor
- Verifique se está usando a chave de produção (não de teste)

### Problema: "Ainda está gerando mock"

**Solução:**
1. Limpe o cache: **"Clear cache and deploy site"**
2. Verifique se as variáveis foram salvas corretamente
3. Verifique os logs do build para ver se as variáveis foram carregadas
4. Teste em uma aba anônima do navegador (para evitar cache)

## ✅ Checklist

- [ ] Variável `VITE_VENNOX_SECRET_KEY` configurada com a chave REAL
- [ ] Variável `VITE_VENNOX_COMPANY_ID` configurada
- [ ] Variável `VITE_FACEBOOK_PIXEL_ID` configurada
- [ ] Novo deploy feito após configurar variáveis
- [ ] Cache limpo antes do deploy
- [ ] Console do navegador não mostra erros de variáveis
- [ ] PIX está sendo gerado corretamente

## 🎉 Pronto!

Após seguir esses passos, o PIX deve ser gerado corretamente pelo gateway real!

Se ainda tiver problemas, me envie:
1. Screenshot das variáveis de ambiente na Netlify
2. Logs do console do navegador
3. Logs do build na Netlify

