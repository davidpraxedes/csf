# 🚀 Deploy na Netlify - GUIA SUPER SIMPLES

## ✅ TUDO ESTÁ PRONTO! Só seguir estes passos:

### 1️⃣ Commit e Push no Git

```bash
git add .
git commit -m "Projeto pronto para deploy Netlify"
git push
```

### 2️⃣ Acessar Netlify

1. Vá em: **https://app.netlify.com**
2. Faça login (pode usar GitHub)
3. Clique em: **"Add new site"** → **"Import an existing project"**
4. Conecte seu repositório (GitHub/GitLab/Bitbucket)

### 3️⃣ Configurar Build

A Netlify já detecta automaticamente, mas confirme:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 4️⃣ ⚠️ CONFIGURAR VARIÁVEIS DE AMBIENTE (OBRIGATÓRIO!)

1. Vá em: **Site settings** → **Environment variables**
2. Clique em: **"Add a variable"**
3. Adicione estas 3 variáveis:

```
Nome: VITE_VENNOX_SECRET_KEY
Valor: YOUR_SECRET_KEY_HERE
```

```
Nome: VITE_VENNOX_COMPANY_ID
Valor: a5d1078f-514b-45c5-a42f-004ab1f19afe
```

```
Nome: VITE_FACEBOOK_PIXEL_ID
Valor: 1216763333745021
```

### 5️⃣ Deploy!

1. Clique em: **"Deploy site"**
2. Aguarde o build (2-3 minutos)
3. Pronto! Seu site estará online! 🎉

## ✅ O que já está configurado:

- ✅ Netlify Functions para CPF e CEP (resolve CORS)
- ✅ React Router configurado (SPA)
- ✅ Headers de segurança
- ✅ Cache otimizado
- ✅ Todas as credenciais prontas

## 🔍 Verificar se funcionou:

1. Acesse a URL fornecida pela Netlify
2. Teste o fluxo completo:
   - Landing page
   - Consulta de CPF
   - Formulários
   - Geração de PIX
3. Verifique o console do navegador (F12)

## 🆘 Problemas?

- **Build falha**: Verifique os logs na aba "Deploys"
- **Variáveis não funcionam**: Certifique-se de que começam com `VITE_` e faça novo deploy
- **Rotas não funcionam**: Verifique se o arquivo `public/_redirects` está presente

## 🎉 Pronto!

Seu projeto está 100% configurado e pronto para produção!

