# 🚀 Deploy na Netlify - Guia Completo

## ✅ Sim, você pode usar a conta GRATUITA!

A Netlify oferece um plano gratuito que é suficiente para este projeto:
- ✅ Build automático
- ✅ Deploy contínuo
- ✅ HTTPS gratuito
- ✅ CDN global
- ✅ 100GB de bandwidth/mês (suficiente para começar)

## 📋 Pré-requisitos

1. **Conta no GitHub/GitLab/Bitbucket** (para conectar com Netlify)
2. **Projeto commitado no repositório**

## 🔧 Passo a Passo

### 1. Preparar o Projeto

O projeto já está configurado com:
- ✅ `netlify.toml` - Configuração de build
- ✅ `public/_redirects` - Suporte para React Router (SPA)

### 2. Fazer Deploy

#### Opção A: Via Interface Web (Mais Fácil)

1. **Acesse**: https://app.netlify.com
2. **Faça login** (pode usar GitHub)
3. **Clique em**: "Add new site" → "Import an existing project"
4. **Conecte seu repositório** (GitHub/GitLab/Bitbucket)
5. **Configure o build**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. **Configure as variáveis de ambiente** (IMPORTANTE!):
   - Vá em: Site settings → Environment variables
   - Adicione:
     ```
     VITE_VENNOX_SECRET_KEY=YOUR_SECRET_KEY_HERE
     VITE_VENNOX_COMPANY_ID=a5d1078f-514b-45c5-a42f-004ab1f19afe
     VITE_FACEBOOK_PIXEL_ID=1216763333745021
     ```
7. **Clique em**: "Deploy site"

#### Opção B: Via Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### 3. Configurar Variáveis de Ambiente

⚠️ **CRÍTICO**: Configure as variáveis de ambiente na Netlify!

1. Vá em: **Site settings** → **Environment variables**
2. Adicione cada variável:
   - `VITE_VENNOX_SECRET_KEY`
   - `VITE_VENNOX_COMPANY_ID`
   - `VITE_FACEBOOK_PIXEL_ID`

**IMPORTANTE**: 
- As variáveis devem começar com `VITE_` para serem acessíveis no frontend
- Após adicionar, faça um novo deploy

### 4. Configurar Domínio Personalizado (Opcional)

1. Vá em: **Site settings** → **Domain management**
2. Clique em: **Add custom domain**
3. Siga as instruções para configurar DNS

## ⚠️ Observações Importantes

### 1. Proxy do Vite
O proxy configurado no `vite.config.js` **NÃO funciona em produção** na Netlify. Ele só funciona no ambiente de desenvolvimento.

**Solução**: As APIs já estão sendo chamadas diretamente no código, então deve funcionar se as APIs permitirem CORS. Se houver problemas de CORS, você precisará:
- Usar Netlify Functions (serverless)
- Ou configurar um backend proxy

### 2. CORS
Se as APIs bloquearem CORS, você pode criar Netlify Functions para fazer proxy das requisições.

### 3. Build
O build será executado automaticamente a cada push no repositório conectado.

## 🔍 Verificar se Funcionou

Após o deploy:
1. Acesse a URL fornecida pela Netlify
2. Teste o fluxo completo:
   - Landing page
   - Consulta de CPF
   - Formulários
   - Geração de PIX
3. Verifique o console do navegador para erros
4. Verifique se o Facebook Pixel está funcionando

## 📊 Monitoramento

- **Deploy logs**: Veja os logs de build na aba "Deploys"
- **Analytics**: Netlify Analytics (pago) ou use Google Analytics
- **Forms**: Netlify Forms (gratuito para até 100 submissions/mês)

## 🆘 Troubleshooting

### Build falha
- Verifique os logs de build
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se o Node.js version está correto (Netlify usa Node 18 por padrão)

### Variáveis de ambiente não funcionam
- Certifique-se de que começam com `VITE_`
- Faça um novo deploy após adicionar variáveis
- Verifique se não há espaços extras nos valores

### Rotas não funcionam (404)
- Verifique se o arquivo `public/_redirects` está presente
- Verifique se o `netlify.toml` está configurado corretamente

## 🎉 Pronto!

Seu projeto estará online e funcionando na Netlify!

