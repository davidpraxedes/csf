# Guia de Deploy no Vercel

## Configuração Inicial

### 1. Conectar o Repositório
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "Add New Project"
4. Selecione o repositório `csf`

### 2. Configurações do Projeto

**IMPORTANTE:** Configure as seguintes opções no painel do Vercel:

#### Root Directory (IMPORTANTE - Isso resolve o 404!)
- Clique em "Settings" → "General" 
- Procure por "Root Directory" (pode estar em "Build & Development Settings" também)
- Se não encontrar, vá em "Settings" → "Build & Development Settings"
- Em "Root Directory", digite: `carrefour-cartao`
- **NÃO é o "Project Name"** - é especificamente o "Root Directory"

#### Build Settings
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 3. Variáveis de Ambiente

Configure as seguintes variáveis em **Settings → Environment Variables**:

```
VITE_VENNOX_SECRET_KEY=sua_chave_secreta_aqui
VITE_VENNOX_COMPANY_ID=a5d1078f-514b-45c5-a42f-004ab1f19afe
VITE_FACEBOOK_PIXEL_ID=1216763333745021
```

### 4. Onde Encontrar o Root Directory?

O "Root Directory" pode estar em um destes lugares:

**Opção 1:**
- Settings → General → Root Directory

**Opção 2:**
- Settings → Build & Development Settings → Root Directory

**Como configurar:**
1. Encontre a opção "Root Directory" (pode ter um botão "Edit" ou "Change")
2. Digite: `carrefour-cartao` (sem barra no início ou fim)
3. Salve as alterações

**IMPORTANTE:** 
- ❌ NÃO é o "Project Name" 
- ✅ É especificamente o "Root Directory"
- Se não encontrar, pode estar oculto - tente clicar em "Show Advanced" ou "More Settings"

### 5. Configuração Manual (Alternativa)

Se o Vercel não detectar automaticamente, configure manualmente:

1. Vá em **Settings → Build & Development Settings**
2. Em **Root Directory**, digite: `carrefour-cartao`
3. Configure também:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 5. Deploy

1. Após configurar tudo, clique em **Deploy**
2. O Vercel irá:
   - Instalar as dependências
   - Fazer o build do projeto
   - Fazer o deploy

### 6. Verificar o Deploy

Após o deploy, acesse a URL fornecida pelo Vercel. Se ainda der 404:

1. Verifique se o **Root Directory** está configurado como `carrefour-cartao`
2. Verifique se o **Output Directory** está como `dist`
3. Verifique os logs do build no painel do Vercel

## Solução de Problemas

### Erro 404
- ✅ Verifique se o Root Directory está como `carrefour-cartao`
- ✅ Verifique se o Output Directory está como `dist`
- ✅ Verifique se o arquivo `vercel.json` está na raiz do repositório

### Erro de Build
- ✅ Verifique se todas as dependências estão no `package.json`
- ✅ Verifique os logs do build no painel do Vercel
- ✅ Certifique-se de que o Node.js está na versão 18 ou superior

### Variáveis de Ambiente
- ✅ Certifique-se de que todas as variáveis começam com `VITE_`
- ✅ Verifique se os valores estão corretos (sem espaços extras)

## Estrutura do Projeto

```
csf/
├── carrefour-cartao/     ← Root Directory no Vercel
│   ├── src/
│   ├── public/
│   ├── dist/              ← Output Directory
│   ├── package.json
│   └── vite.config.js
└── vercel.json           ← Configuração do Vercel
```

## Notas Importantes

- O arquivo `vercel.json` na raiz do repositório ajuda na configuração
- O Vercel detecta automaticamente projetos Vite, mas pode precisar do Root Directory configurado
- As variáveis de ambiente devem começar com `VITE_` para serem acessíveis no frontend
- O Vercel suporta Serverless Functions, mas para este projeto usamos apenas o frontend

