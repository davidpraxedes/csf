# 🚀 Deploy em VPS - Guia Completo

## 📋 Pré-requisitos

- VPS com Ubuntu 20.04+ ou Debian 11+
- Acesso SSH ao servidor
- Domínio apontado para o IP do VPS (opcional, mas recomendado)
- Porta 80 e 443 liberadas no firewall

---

## 1️⃣ Configuração Inicial do Servidor

### Conectar via SSH

```bash
ssh root@SEU_IP_VPS
# ou
ssh usuario@SEU_IP_VPS
```

### Atualizar o sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### Instalar dependências básicas

```bash
sudo apt install -y curl wget git build-essential
```

---

## 2️⃣ Instalar Node.js

### Instalar Node.js 18.x (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Verificar instalação

```bash
node --version  # Deve mostrar v18.x.x
npm --version   # Deve mostrar 9.x.x
```

---

## 3️⃣ Instalar Nginx

```bash
sudo apt install -y nginx
```

### Iniciar e habilitar Nginx

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Verificar status

```bash
sudo systemctl status nginx
```

---

## 4️⃣ Instalar PM2 (Gerenciador de Processos)

```bash
sudo npm install -g pm2
```

### Configurar PM2 para iniciar no boot

```bash
pm2 startup
# Execute o comando que aparecer (algo como: sudo env PATH=...)
```

---

## 5️⃣ Configurar o Projeto

### Criar diretório para o projeto

```bash
sudo mkdir -p /var/www
cd /var/www
```

### Clonar o repositório

```bash
sudo git clone https://github.com/davidpraxedes/csf.git
cd csf/carrefour-cartao
```

### Instalar dependências

```bash
sudo npm install
```

### Criar arquivo `.env`

```bash
sudo nano .env
```

Cole o seguinte conteúdo (substitua pelos valores reais):

```env
VITE_VENNOX_SECRET_KEY=sk_live_SUA_CHAVE_REAL_AQUI
VITE_VENNOX_COMPANY_ID=a5d1078f-514b-45c5-a42f-004ab1f19afe
VITE_FACEBOOK_PIXEL_ID=1216763333745021
```

Salve com `Ctrl+O`, `Enter`, `Ctrl+X`

### Ajustar permissões

```bash
sudo chown -R $USER:$USER /var/www/csf
```

---

## 6️⃣ Build do Projeto

### Fazer build de produção

```bash
cd /var/www/csf/carrefour-cartao
npm run build
```

Isso criará a pasta `dist/` com os arquivos estáticos.

---

## 7️⃣ Configurar PM2 para Servir o Build

### Criar arquivo de configuração do PM2

```bash
nano ecosystem.config.js
```

Cole o seguinte conteúdo:

```javascript
module.exports = {
  apps: [{
    name: 'carrefour-cartao',
    script: 'npx',
    args: 'serve -s dist -l 3000',
    cwd: '/var/www/csf/carrefour-cartao',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### Instalar serve globalmente

```bash
sudo npm install -g serve
```

### Iniciar com PM2

```bash
pm2 start ecosystem.config.js
pm2 save
```

### Verificar status

```bash
pm2 status
pm2 logs carrefour-cartao
```

---

## 8️⃣ Configurar Nginx como Reverse Proxy

### Criar configuração do site

```bash
sudo nano /etc/nginx/sites-available/carrefour-cartao
```

Cole o seguinte conteúdo (substitua `seu-dominio.com` pelo seu domínio ou IP):

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    # Se não tiver domínio, use o IP:
    # server_name SEU_IP_VPS;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache para assets estáticos
    location /assets/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Habilitar o site

```bash
sudo ln -s /etc/nginx/sites-available/carrefour-cartao /etc/nginx/sites-enabled/
```

### Testar configuração do Nginx

```bash
sudo nginx -t
```

### Recarregar Nginx

```bash
sudo systemctl reload nginx
```

---

## 9️⃣ Configurar SSL com Let's Encrypt (Opcional mas Recomendado)

### Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Obter certificado SSL

```bash
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

Siga as instruções na tela. O Certbot vai:
- Configurar o SSL automaticamente
- Renovar automaticamente (já configurado)

### Verificar renovação automática

```bash
sudo certbot renew --dry-run
```

---

## 🔟 Configurar Firewall (UFW)

### Habilitar UFW

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Verificar status

```bash
sudo ufw status
```

---

## 🔄 Processo de Deploy (Atualizações)

### Script de deploy automático

Crie um arquivo `deploy.sh`:

```bash
nano /var/www/csf/carrefour-cartao/deploy.sh
```

Cole:

```bash
#!/bin/bash

echo "🚀 Iniciando deploy..."

# Ir para o diretório do projeto
cd /var/www/csf/carrefour-cartao

# Atualizar código do Git
echo "📥 Atualizando código..."
git pull origin main

# Instalar dependências (se houver novas)
echo "📦 Instalando dependências..."
npm install

# Fazer build
echo "🔨 Fazendo build..."
npm run build

# Reiniciar PM2
echo "🔄 Reiniciando aplicação..."
pm2 restart carrefour-cartao

echo "✅ Deploy concluído!"
pm2 logs carrefour-cartao --lines 20
```

### Dar permissão de execução

```bash
chmod +x deploy.sh
```

### Executar deploy

```bash
./deploy.sh
```

---

## 📝 Comandos Úteis

### Ver logs da aplicação
```bash
pm2 logs carrefour-cartao
```

### Reiniciar aplicação
```bash
pm2 restart carrefour-cartao
```

### Parar aplicação
```bash
pm2 stop carrefour-cartao
```

### Ver status
```bash
pm2 status
```

### Ver logs do Nginx
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Recarregar Nginx
```bash
sudo systemctl reload nginx
```

### Verificar se a aplicação está rodando
```bash
curl http://localhost:3000
```

---

## 🆘 Troubleshooting

### Aplicação não inicia

1. Verificar logs do PM2:
```bash
pm2 logs carrefour-cartao
```

2. Verificar se a porta 3000 está livre:
```bash
sudo netstat -tulpn | grep 3000
```

3. Verificar se o build foi feito:
```bash
ls -la /var/www/csf/carrefour-cartao/dist
```

### Nginx retorna 502 Bad Gateway

1. Verificar se a aplicação está rodando:
```bash
pm2 status
curl http://localhost:3000
```

2. Verificar logs do Nginx:
```bash
sudo tail -f /var/log/nginx/error.log
```

3. Verificar configuração do Nginx:
```bash
sudo nginx -t
```

### Variáveis de ambiente não funcionam

1. Verificar se o arquivo `.env` existe:
```bash
cat /var/www/csf/carrefour-cartao/.env
```

2. Verificar se as variáveis começam com `VITE_`

3. Fazer novo build após alterar `.env`:
```bash
npm run build
pm2 restart carrefour-cartao
```

### Erro 404 nas rotas

O Nginx precisa estar configurado para fazer proxy de todas as rotas. Verifique se a configuração do Nginx está correta (passo 8).

---

## ✅ Checklist Final

- [ ] Node.js instalado
- [ ] Nginx instalado e rodando
- [ ] PM2 instalado e configurado
- [ ] Projeto clonado
- [ ] Dependências instaladas
- [ ] Arquivo `.env` configurado
- [ ] Build feito (`npm run build`)
- [ ] PM2 rodando a aplicação
- [ ] Nginx configurado como reverse proxy
- [ ] Firewall configurado
- [ ] SSL configurado (se tiver domínio)
- [ ] Site acessível

---

## 🎉 Pronto!

Seu projeto está rodando no VPS!

**URL**: `http://SEU_IP_VPS` ou `https://seu-dominio.com`

Para atualizar o projeto, execute:
```bash
cd /var/www/csf/carrefour-cartao
./deploy.sh
```

