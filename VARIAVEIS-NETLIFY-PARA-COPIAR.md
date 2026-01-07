# 📋 Variáveis de Ambiente para Netlify - COPIAR E COLAR

## 🎯 Use estes valores EXATOS na Netlify

### ⚠️ IMPORTANTE: Substitua `sk_live_SUA_CHAVE_REAL_AQUI` pela sua chave real do VennoxPay!

---

## 📝 Variável 1: VITE_VENNOX_SECRET_KEY

**Key (nome da variável):**
```
VITE_VENNOX_SECRET_KEY
```

**Value (valor):**
```
sk_live_SUA_CHAVE_REAL_AQUI
```

⚠️ **SUBSTITUA** `sk_live_SUA_CHAVE_REAL_AQUI` pela sua chave real do gateway VennoxPay!

---

## 📝 Variável 2: VITE_VENNOX_COMPANY_ID

**Key (nome da variável):**
```
VITE_VENNOX_COMPANY_ID
```

**Value (valor):**
```
a5d1078f-514b-45c5-a42f-004ab1f19afe
```

---

## 📝 Variável 3: VITE_FACEBOOK_PIXEL_ID

**Key (nome da variável):**
```
VITE_FACEBOOK_PIXEL_ID
```

**Value (valor):**
```
1216763333745021
```

---

## 🚀 Como Adicionar na Netlify

1. Acesse: **https://app.netlify.com**
2. Clique no seu site
3. Vá em: **"Site settings"** → **"Environment variables"**
4. Para cada variável:
   - Clique em **"Add a variable"**
   - Cole o **Key** no campo "Key"
   - Cole o **Value** no campo "Value"
   - Clique em **"Save"**

5. Após adicionar todas as 3 variáveis:
   - Vá em **"Deploys"**
   - Clique no menu dos 3 pontos
   - Selecione: **"Trigger deploy"** → **"Clear cache and deploy site"**

---

## ✅ Checklist

- [ ] Variável `VITE_VENNOX_SECRET_KEY` adicionada com a chave REAL
- [ ] Variável `VITE_VENNOX_COMPANY_ID` adicionada
- [ ] Variável `VITE_FACEBOOK_PIXEL_ID` adicionada
- [ ] Novo deploy feito após adicionar variáveis
- [ ] Cache limpo antes do deploy

---

## 🔍 Como Verificar se Funcionou

1. Acesse o site
2. Abra o console (F12)
3. Vá até a página de pagamento
4. Tente gerar o PIX
5. No console, deve aparecer:
   - ✅ `Gerando PIX via VennoxPay:` → Funcionando!
   - ❌ `⚠️ ERRO: VITE_VENNOX_SECRET_KEY não está configurada!` → Variáveis não configuradas

---

## 📌 Exemplo Completo (para referência)

```
VITE_VENNOX_SECRET_KEY = sk_live_ABC123XYZ789...
VITE_VENNOX_COMPANY_ID = a5d1078f-514b-45c5-a42f-004ab1f19afe
VITE_FACEBOOK_PIXEL_ID = 1216763333745021
```

⚠️ **Lembre-se**: Substitua a chave `sk_live_SUA_CHAVE_REAL_AQUI` pela sua chave real do VennoxPay!


