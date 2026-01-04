# Variáveis de Ambiente para Vercel

## Como Adicionar no Vercel

1. Acesse seu projeto no Vercel
2. Vá em **Settings → Environment Variables**
3. Clique em **Add New**
4. Para cada variável abaixo, adicione:
   - **Key**: O nome da variável (ex: `VITE_VENNOX_SECRET_KEY`)
   - **Value**: O valor correspondente
   - **Environment**: Selecione todas (Production, Preview, Development)

## Variáveis Necessárias

### 1. VITE_VENNOX_SECRET_KEY
```
Key: VITE_VENNOX_SECRET_KEY
Value: sua_chave_secreta_vennox_aqui
```
**⚠️ IMPORTANTE:** Substitua `sua_chave_secreta_vennox_aqui` pela sua chave real da VennoxPay

### 2. VITE_VENNOX_COMPANY_ID
```
Key: VITE_VENNOX_COMPANY_ID
Value: a5d1078f-514b-45c5-a42f-004ab1f19afe
```

### 3. VITE_FACEBOOK_PIXEL_ID
```
Key: VITE_FACEBOOK_PIXEL_ID
Value: 1216763333745021
```

## Formato para Copiar e Colar (uma por vez)

**Variável 1:**
```
VITE_VENNOX_SECRET_KEY=sua_chave_secreta_vennox_aqui
```

**Variável 2:**
```
VITE_VENNOX_COMPANY_ID=a5d1078f-514b-45c5-a42f-004ab1f19afe
```

**Variável 3:**
```
VITE_FACEBOOK_PIXEL_ID=1216763333745021
```

## Notas Importantes

- ✅ Todas as variáveis devem começar com `VITE_` para funcionar no frontend
- ✅ Após adicionar, faça um **Redeploy** para aplicar as mudanças
- ✅ As variáveis são sensíveis - não compartilhe sua chave secreta
- ✅ Você pode adicionar uma por vez ou todas de uma vez no painel do Vercel

