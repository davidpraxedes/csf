# 🚀 Guia Completo: Configurar Chaves e Fazer Deploy

## 📋 Índice
1. [Configurar Chaves Localmente (Desenvolvimento)](#1-configurar-chaves-localmente)
2. [Fazer Deploy na Netlify](#2-fazer-deploy-na-netlify)
3. [Configurar Chaves na Netlify](#3-configurar-chaves-na-netlify)
4. [Verificar se Funcionou](#4-verificar-se-funcionou)

---

## 1. Configurar Chaves Localmente (Desenvolvimento)

### Passo 1: Criar arquivo `.env`

No diretório `carrefour-cartao/`, crie um arquivo chamado `.env` (sem extensão):

```bash
cd carrefour-cartao
```

### Passo 2: Copiar o arquivo de exemplo

Copie o arquivo `.env.example` para `.env`:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**Windows (CMD):**
```cmd
copy .env.example .env
```

**Linux/Mac:**
```bash
cp .env.example .env
```

### Passo 3: Editar o arquivo `.env`

Abra o arquivo `.env` e substitua os valores:

```env
# Chave secreta da API VennoxPay (substitua pela sua chave real)
VITE_VENNOX_SECRET_KEY=sk_live_SUA_CHAVE_AQUI

# ID da empresa VennoxPay (já está correto)
VITE_VENNOX_COMPANY_ID=a5d1078f-514b-45c5-a42f-004ab1f19afe

# ID do Facebook Pixel (substitua pelo seu Pixel ID se diferente)
VITE_FACEBOOK_PIXEL_ID=1216763333745021
```

⚠️ **IMPORTANTE**: 
- O arquivo `.env` já está no `.gitignore`, então não será commitado no Git
- Nunca compartilhe suas chaves reais
- Use chaves diferentes para desenvolvimento e produção

### Passo 4: Reiniciar o servidor de desenvolvimento

Após criar/editar o `.env`, reinicie o servidor:

```bash
npm run dev
```

---

## 2. Fazer Deploy na Netlify

### Opção A: Deploy Automático via GitHub (Recomendado) ⭐

#### Passo 1: Garantir que o código está no GitHub

```bash
git add .
git commit -m "Preparar para deploy"
git push
```

#### Passo 2: Conectar repositório na Netlify

1. Acesse: **https://app.netlify.com**
2. Faça login (pode usar sua conta GitHub)
3. Clique em: **"Add new site"** → **"Import an existing project"**
4. Escolha: **"GitHub"**
5. Autorize a Netlify a acessar seus repositórios
6. Selecione o repositório: **`csf`**

#### Passo 3: Configurar Build Settings

A Netlify detecta automaticamente, mas confirme:

- **Base directory**: `carrefour-cartao` (se o projeto estiver dentro desta pasta)
- **Build command**: `npm run build`
- **Publish directory**: `dist`

⚠️ **Se o projeto estiver na raiz do repositório**, deixe "Base directory" vazio.

#### Passo 4: Configurar Variáveis de Ambiente

**ANTES de clicar em "Deploy site"**, configure as variáveis:

1. Clique em: **"Show advanced"** ou vá em **"Site settings"** → **"Environment variables"**
2. Clique em: **"Add a variable"**
3. Adicione cada variável:

   **Variável 1:**
   - Key: `VITE_VENNOX_SECRET_KEY`
   - Value: `sua_chave_secreta_aqui` (a chave real, não o placeholder)

   **Variável 2:**
   - Key: `VITE_VENNOX_COMPANY_ID`
   - Value: `a5d1078f-514b-45c5-a42f-004ab1f19afe`

   **Variável 3:**
   - Key: `VITE_FACEBOOK_PIXEL_ID`
   - Value: `1216763333745021` (ou seu Pixel ID)

4. Clique em **"Deploy site"**

#### Passo 5: Aguardar o Build

- O build leva 2-3 minutos
- Você verá os logs em tempo real
- Quando terminar, você terá uma URL tipo: `https://seu-site.netlify.app`

---

### Opção B: Deploy Manual via Netlify CLI

#### Passo 1: Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

#### Passo 2: Fazer Build Local

```bash
cd carrefour-cartao
npm run build
```

#### Passo 3: Login na Netlify

```bash
netlify login
```

#### Passo 4: Deploy

```bash
netlify deploy --prod
```

⚠️ **Nota**: Com CLI, você ainda precisa configurar as variáveis de ambiente no painel da Netlify.

---

## 3. Configurar Chaves na Netlify (Após Deploy)

Se você já fez o deploy mas esqueceu de configurar as variáveis:

### Passo 1: Acessar Site Settings

1. No painel da Netlify, clique no seu site
2. Vá em: **"Site settings"** (ícone de engrenagem)
3. No menu lateral, clique em: **"Environment variables"**

### Passo 2: Adicionar Variáveis

Clique em **"Add a variable"** e adicione:

```
VITE_VENNOX_SECRET_KEY = sua_chave_secreta_aqui
VITE_VENNOX_COMPANY_ID = a5d1078f-514b-45c5-a42f-004ab1f19afe
VITE_FACEBOOK_PIXEL_ID = 1216763333745021
```

### Passo 3: Fazer Novo Deploy

Após adicionar as variáveis:

1. Vá em: **"Deploys"**
2. Clique no menu dos 3 pontos do último deploy
3. Selecione: **"Trigger deploy"** → **"Clear cache and deploy site"**

Ou simplesmente faça um novo commit e push:

```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

## 4. Verificar se Funcionou

### ✅ Checklist de Verificação

1. **Site está online?**
   - Acesse a URL fornecida pela Netlify
   - A página inicial deve carregar

2. **Variáveis de ambiente funcionam?**
   - Abra o console do navegador (F12)
   - Vá em "Console" e verifique se não há erros de API
   - Teste o fluxo completo:
     - ✅ Landing page carrega
     - ✅ Consulta de CPF funciona
     - ✅ Formulários funcionam
     - ✅ Geração de PIX funciona

3. **Facebook Pixel funciona?**
   - Abra o console (F12)
   - Vá em "Network"
   - Filtre por "facebook"
   - Deve ver requisições para `facebook.com/tr`

4. **Rotas funcionam?**
   - Teste navegar entre as páginas
   - Não deve dar erro 404

---

## 🆘 Troubleshooting

### Problema: Build falha

**Solução:**
- Verifique os logs de build na Netlify
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se o Node.js version está correto (Netlify usa Node 18 por padrão)

### Problema: Variáveis de ambiente não funcionam

**Solução:**
- Certifique-se de que começam com `VITE_`
- Faça um novo deploy após adicionar variáveis
- Verifique se não há espaços extras nos valores
- Limpe o cache: "Clear cache and deploy site"

### Problema: Erro 404 nas rotas

**Solução:**
- Verifique se o arquivo `public/_redirects` está presente
- Verifique se o `netlify.toml` está configurado corretamente

### Problema: Erro de CORS

**Solução:**
- As Netlify Functions já estão configuradas para CPF e CEP
- Se houver erro de CORS com VennoxPay, verifique se a chave está correta
- Verifique os logs do navegador para mais detalhes

---

## 📝 Resumo Rápido

### Para Desenvolvimento Local:
1. Copie `.env.example` para `.env`
2. Preencha com suas chaves reais
3. Execute `npm run dev`

### Para Deploy na Netlify:
1. Faça push do código para GitHub
2. Conecte o repositório na Netlify
3. Configure as variáveis de ambiente
4. Faça o deploy

### Após Deploy:
1. Configure as variáveis de ambiente no painel
2. Faça um novo deploy (ou aguarde o próximo push)
3. Teste o site

---

## 🎉 Pronto!

Seu projeto está configurado e pronto para produção!

**URL do repositório**: https://github.com/davidpraxedes/csf

**Próximos passos:**
- Configure um domínio personalizado (opcional)
- Configure analytics
- Monitore os deploys

