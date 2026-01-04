# 🔧 Como Corrigir Erro 404 na Netlify

## 🎯 Problema

O erro 404 acontece porque a Netlify não está encontrando os arquivos. Isso geralmente ocorre porque:

1. **Base directory não está configurado** - O projeto está em `carrefour-cartao/` mas a Netlify está procurando na raiz
2. **Publish directory incorreto** - A Netlify não sabe onde está o build final

## ✅ Solução Rápida

### Opção 1: Configurar na Interface da Netlify (Mais Fácil)

1. Acesse: **https://app.netlify.com**
2. Vá no seu site
3. Clique em: **"Site settings"**
4. Vá em: **"Build & deploy"**
5. Clique em: **"Edit settings"**
6. Configure:

   **Base directory:**
   ```
   carrefour-cartao
   ```

   **Build command:**
   ```
   npm run build
   ```

   **Publish directory:**
   ```
   dist
   ```

7. Clique em **"Save"**
8. Vá em **"Deploys"** → Menu dos 3 pontos → **"Trigger deploy"** → **"Clear cache and deploy site"**

### Opção 2: Usar o netlify.toml na Raiz (Já Criado)

Um arquivo `netlify.toml` foi criado na **raiz do repositório** que já configura tudo automaticamente.

1. Faça commit e push:
   ```bash
   git add netlify.toml
   git commit -m "Adiciona netlify.toml na raiz para corrigir deploy"
   git push
   ```

2. Na Netlify, vá em **"Deploys"** → **"Trigger deploy"** → **"Clear cache and deploy site"**

## 🔍 Verificar se Está Correto

Após o deploy, verifique:

1. **Build logs** - Deve mostrar:
   ```
   Installing dependencies...
   Building site...
   Build complete!
   ```

2. **Publish directory** - Deve mostrar arquivos como:
   - `index.html`
   - `assets/`
   - `images/`

3. **Acesse a URL** - Deve carregar a página inicial, não erro 404

## 🆘 Se Ainda Não Funcionar

### Verificar Build Logs

1. Na Netlify, vá em **"Deploys"**
2. Clique no último deploy
3. Veja os logs completos
4. Procure por erros como:
   - "Cannot find module"
   - "Build failed"
   - "Directory not found"

### Verificar Estrutura do Projeto

O projeto deve estar assim:
```
csf/
├── netlify.toml          ← Na raiz (NOVO)
├── carrefour-cartao/
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── dist/             ← Criado após build
```

### Limpar Cache e Fazer Novo Deploy

1. Na Netlify: **"Deploys"** → Menu → **"Clear cache and deploy site"**
2. Aguarde o build completo
3. Teste novamente

## ✅ Checklist

- [ ] Base directory configurado como `carrefour-cartao`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Arquivo `netlify.toml` na raiz (ou configuração manual)
- [ ] Cache limpo antes do deploy
- [ ] Build completou com sucesso
- [ ] Arquivos aparecem no publish directory

## 🎉 Pronto!

Após seguir esses passos, o site deve funcionar corretamente!

Se ainda tiver problemas, me envie os logs do build que eu ajudo a resolver.

