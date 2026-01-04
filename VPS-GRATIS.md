# 🆓 VPS Grátis - Guia Completo

## 🎯 Melhores Opções de VPS Grátis (2024-2025)

### ⭐ Opção 1: Oracle Cloud Free Tier (RECOMENDADO)

**Por que é a melhor:**
- ✅ 2 VMs sempre grátis (AMD ou ARM)
- ✅ 200GB de armazenamento
- ✅ 10TB de tráfego/mês
- ✅ Sempre grátis (não expira)
- ✅ Performance excelente
- ✅ Sem cartão de crédito necessário (em alguns países)

**Especificações:**
- **AMD**: 1/8 OCPU, 1GB RAM
- **ARM**: 4 OCPU, 24GB RAM (melhor opção!)

**Como conseguir:**
1. Acesse: https://www.oracle.com/cloud/free/
2. Clique em "Start for Free"
3. Preencha o cadastro
4. Escolha a região mais próxima do Brasil (São Paulo ou Ashburn)
5. Crie uma instância ARM (melhor performance)

**Tutorial passo a passo:**
- [Guia completo Oracle Cloud](#oracle-cloud-setup)

---

### 🥈 Opção 2: Google Cloud Platform (GCP) Free Tier

**O que oferece:**
- ✅ $300 de crédito grátis por 90 dias
- ✅ Após 90 dias, ainda tem sempre grátis (limitado)
- ✅ 1 VM e1-micro sempre grátis (limitado por mês)

**Limitações:**
- ⚠️ Requer cartão de crédito
- ⚠️ Crédito expira em 90 dias
- ⚠️ VM sempre grátis tem recursos limitados

**Como conseguir:**
1. Acesse: https://cloud.google.com/free
2. Clique em "Get started for free"
3. Cadastre-se (precisa de cartão)

---

### 🥉 Opção 3: AWS Free Tier

**O que oferece:**
- ✅ 750 horas/mês de EC2 t2.micro (12 meses)
- ✅ 5GB de armazenamento
- ✅ Requer cartão de crédito

**Limitações:**
- ⚠️ Expira após 12 meses
- ⚠️ Recursos limitados

**Como conseguir:**
1. Acesse: https://aws.amazon.com/free/
2. Crie conta (precisa de cartão)

---

### 🆕 Opção 4: Fly.io (Para Apps Web)

**O que oferece:**
- ✅ 3 VMs compartilhadas grátis
- ✅ 160GB de tráfego/mês
- ✅ Ideal para deploy de apps
- ✅ Sem cartão de crédito

**Como conseguir:**
1. Acesse: https://fly.io
2. Cadastre-se com GitHub
3. Instale o CLI: `curl -L https://fly.io/install.sh | sh`

---

### 🆕 Opção 5: Railway

**O que oferece:**
- ✅ $5 de crédito grátis/mês
- ✅ Deploy automático via GitHub
- ✅ Ideal para projetos pequenos
- ✅ Sem cartão de crédito (inicialmente)

**Como conseguir:**
1. Acesse: https://railway.app
2. Cadastre-se com GitHub
3. Conecte seu repositório

---

### 🆕 Opção 6: Render

**O que oferece:**
- ✅ Plano grátis para serviços web
- ✅ Deploy automático via GitHub
- ✅ SSL grátis
- ⚠️ Serviço "dorme" após inatividade

**Como conseguir:**
1. Acesse: https://render.com
2. Cadastre-se com GitHub
3. Conecte seu repositório

---

## 🏆 RECOMENDAÇÃO: Oracle Cloud (Melhor Opção)

### Por que escolher Oracle Cloud:

1. **Sempre grátis** - Não expira
2. **Melhor performance** - ARM com 4 CPUs e 24GB RAM
3. **Mais recursos** - 200GB de armazenamento
4. **Sem cartão** - Em muitos países não precisa
5. **Confiável** - Empresa grande e estável

---

## 📋 Oracle Cloud - Setup Completo

### Passo 1: Criar Conta

1. Acesse: **https://www.oracle.com/cloud/free/**
2. Clique em **"Start for Free"**
3. Preencha:
   - Email
   - Nome
   - País (Brasil)
   - Telefone
4. Escolha uma senha forte
5. Confirme o email

### Passo 2: Criar Instância ARM (Recomendado)

1. Faça login no **Oracle Cloud Console**
2. Vá em: **"Create a VM Instance"**
3. Configure:

   **Nome:**
   ```
   carrefour-cartao
   ```

   **Imagem:**
   ```
   Ubuntu 22.04 (ou 20.04)
   ```

   **Shape (IMPORTANTE!):**
   ```
   VM.Standard.A1.Flex (ARM - 4 OCPU, 24GB RAM)
   ```
   ⚠️ Se não aparecer ARM, escolha AMD (menos recursos)

   **Rede:**
   - Deixe o padrão (cria automaticamente)

   **Chave SSH:**
   - Clique em "Generate SSH Key Pair"
   - Baixe a chave privada (você vai precisar!)

4. Clique em **"Create"**
5. Aguarde 2-3 minutos para criar

### Passo 3: Conectar via SSH

**Windows:**

1. Baixe o PuTTY: https://www.putty.org/
2. Ou use PowerShell (Windows 10+):

```powershell
# Converter chave para formato compatível (se necessário)
ssh-keygen -i -f chave_privada.key > chave_privada_convertida.key

# Conectar
ssh -i chave_privada.key ubuntu@IP_PUBLICO_VPS
```

**Linux/Mac:**

```bash
chmod 400 chave_privada.key
ssh -i chave_privada.key ubuntu@IP_PUBLICO_VPS
```

### Passo 4: Configurar Firewall (Security List)

1. No Oracle Cloud Console, vá em: **"Networking"** → **"Virtual Cloud Networks"**
2. Clique na sua VCN
3. Vá em **"Security Lists"**
4. Clique na security list padrão
5. Clique em **"Add Ingress Rules"**
6. Adicione:

   **Rule 1 - SSH:**
   - Source: `0.0.0.0/0`
   - IP Protocol: `TCP`
   - Destination Port Range: `22`

   **Rule 2 - HTTP:**
   - Source: `0.0.0.0/0`
   - IP Protocol: `TCP`
   - Destination Port Range: `80`

   **Rule 3 - HTTPS:**
   - Source: `0.0.0.0/0`
   - IP Protocol: `TCP`
   - Destination Port Range: `443`

7. Salve

### Passo 5: Seguir o Guia de Deploy

Agora siga o guia **`DEPLOY-VPS.md`** a partir do passo 2 (Instalar Node.js).

---

## 🚀 Alternativa Rápida: Railway ou Render

Se não quiser configurar VPS manualmente:

### Railway (Mais Fácil)

1. Acesse: https://railway.app
2. Cadastre-se com GitHub
3. Clique em **"New Project"** → **"Deploy from GitHub repo"**
4. Selecione o repositório `csf`
5. Configure:
   - **Root Directory**: `carrefour-cartao`
   - **Build Command**: `npm run build`
   - **Start Command**: `npx serve -s dist -l $PORT`
6. Adicione variáveis de ambiente:
   - `VITE_VENNOX_SECRET_KEY`
   - `VITE_VENNOX_COMPANY_ID`
   - `VITE_FACEBOOK_PIXEL_ID`
7. Deploy automático! 🎉

### Render (Similar)

1. Acesse: https://render.com
2. Cadastre-se com GitHub
3. Clique em **"New"** → **"Static Site"**
4. Conecte o repositório `csf`
5. Configure:
   - **Root Directory**: `carrefour-cartao`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
6. Adicione variáveis de ambiente
7. Deploy! 🎉

---

## ⚠️ Dicas Importantes

### Para Oracle Cloud:

1. **Use ARM se possível** - Muito mais recursos
2. **Escolha região próxima** - Menor latência
3. **Configure firewall** - Importante para segurança
4. **Guarde a chave SSH** - Você vai precisar sempre
5. **Monitore uso** - Para não exceder limites grátis

### Para Railway/Render:

1. **Configure variáveis de ambiente** - Essencial!
2. **Root directory correto** - `carrefour-cartao`
3. **Build command** - `npm run build`
4. **Publish directory** - `dist`

---

## 🆘 Problemas Comuns

### Oracle Cloud: "Out of capacity"

- **Solução**: Tente outra região ou horário diferente
- Ou use AMD em vez de ARM

### Não consigo conectar via SSH

- **Solução**: Verifique se o firewall está configurado
- Verifique se a chave SSH está correta

### Railway/Render: Build falha

- **Solução**: Verifique se o `package.json` está correto
- Verifique se o root directory está certo

---

## 📊 Comparação Rápida

| Serviço | Recursos | Sempre Grátis | Cartão | Dificuldade |
|---------|----------|---------------|--------|-------------|
| **Oracle Cloud** | ⭐⭐⭐⭐⭐ | ✅ Sim | ❌ Não | Média |
| **GCP** | ⭐⭐⭐ | ⚠️ Limitado | ✅ Sim | Média |
| **AWS** | ⭐⭐⭐ | ❌ 12 meses | ✅ Sim | Média |
| **Railway** | ⭐⭐⭐ | ⚠️ $5/mês | ❌ Não | Fácil |
| **Render** | ⭐⭐ | ✅ Sim | ❌ Não | Fácil |

---

## 🎯 Minha Recomendação Final

1. **Para aprender/configurar manualmente**: **Oracle Cloud** (melhor)
2. **Para deploy rápido e fácil**: **Railway** ou **Render**

---

## 🚀 Próximos Passos

1. Escolha uma opção acima
2. Crie sua conta
3. Siga o guia de deploy correspondente:
   - **VPS (Oracle/GCP/AWS)**: `DEPLOY-VPS.md`
   - **Railway/Render**: Configure via interface web

Boa sorte! 🎉

