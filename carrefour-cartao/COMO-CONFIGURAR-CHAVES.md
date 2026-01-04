# 🔑 Como Configurar as Chaves

## 📍 Para Desenvolvimento Local

### Passo 1: Criar arquivo `.env`

No diretório `carrefour-cartao/`, crie um arquivo chamado `.env`:

**Windows PowerShell:**
```powershell
cd carrefour-cartao
Copy-Item .env.example .env
```

**Windows CMD:**
```cmd
cd carrefour-cartao
copy .env.example .env
```

### Passo 2: Editar o arquivo `.env`

Abra o arquivo `.env` e substitua os valores pelos seus valores reais:

```env
VITE_VENNOX_SECRET_KEY=sk_live_SUA_CHAVE_REAL_AQUI
VITE_VENNOX_COMPANY_ID=a5d1078f-514b-45c5-a42f-004ab1f19afe
VITE_FACEBOOK_PIXEL_ID=1216763333745021
```

### Passo 3: Reiniciar o servidor

```bash
npm run dev
```

---

## 🌐 Para Deploy na Netlify

### Passo 1: Acessar Netlify

1. Vá em: **https://app.netlify.com**
2. Faça login (use sua conta GitHub)

### Passo 2: Conectar Repositório

1. Clique em: **"Add new site"** → **"Import an existing project"**
2. Escolha: **"GitHub"**
3. Autorize e selecione o repositório: **`csf`**

### Passo 3: Configurar Build

Na tela de configuração:

- **Base directory**: `carrefour-cartao` ⚠️ **IMPORTANTE!**
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Passo 4: Configurar Variáveis de Ambiente

**ANTES de clicar em "Deploy site"**:

1. Clique em: **"Show advanced"** ou **"Add environment variables"**
2. Adicione as 3 variáveis:

   ```
   VITE_VENNOX_SECRET_KEY = sua_chave_secreta_real
   VITE_VENNOX_COMPANY_ID = a5d1078f-514b-45c5-a42f-004ab1f19afe
   VITE_FACEBOOK_PIXEL_ID = 1216763333745021
   ```

3. Clique em **"Deploy site"**

### Passo 5: Se esqueceu de configurar as variáveis

Se já fez o deploy sem as variáveis:

1. Vá em: **Site settings** → **Environment variables**
2. Adicione as variáveis
3. Vá em: **Deploys** → Menu dos 3 pontos → **"Trigger deploy"** → **"Clear cache and deploy site"**

---

## ✅ Verificar se Funcionou

1. Acesse a URL do site (ex: `https://seu-site.netlify.app`)
2. Abra o console do navegador (F12)
3. Teste o fluxo completo:
   - Landing page
   - Consulta de CPF
   - Formulários
   - Geração de PIX

Se tudo funcionar, está pronto! 🎉

---

## 🆘 Problemas Comuns

### "Variáveis não funcionam"
- Certifique-se de que começam com `VITE_`
- Faça um novo deploy após adicionar
- Limpe o cache: "Clear cache and deploy site"

### "Build falha"
- Verifique se o **Base directory** está como `carrefour-cartao`
- Verifique os logs de build na Netlify

### "Erro 404 nas rotas"
- Verifique se o arquivo `public/_redirects` existe
- Verifique se o `netlify.toml` está correto

