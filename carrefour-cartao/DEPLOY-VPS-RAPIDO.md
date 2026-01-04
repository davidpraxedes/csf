# 🚀 Deploy VPS - Guia Rápido

## ⚡ Setup Rápido (5 minutos)

### 1. Conectar no VPS
```bash
ssh root@SEU_IP_VPS
```

### 2. Instalar dependências
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# Instalar PM2 e serve
sudo npm install -g pm2 serve
pm2 startup
```

### 3. Clonar e configurar projeto
```bash
cd /var/www
sudo git clone https://github.com/davidpraxedes/csf.git
cd csf/carrefour-cartao
sudo npm install

# Criar .env
sudo nano .env
# Cole suas chaves:
# VITE_VENNOX_SECRET_KEY=sk_live_SUA_CHAVE
# VITE_VENNOX_COMPANY_ID=a5d1078f-514b-45c5-a42f-004ab1f19afe
# VITE_FACEBOOK_PIXEL_ID=1216763333745021

# Ajustar permissões
sudo chown -R $USER:$USER /var/www/csf
```

### 4. Build e iniciar
```bash
npm run build
pm2 start ecosystem.config.js
pm2 save
```

### 5. Configurar Nginx
```bash
sudo cp nginx-config-example.conf /etc/nginx/sites-available/carrefour-cartao
sudo nano /etc/nginx/sites-available/carrefour-cartao
# Ajuste o server_name com seu domínio ou IP

sudo ln -s /etc/nginx/sites-available/carrefour-cartao /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Configurar firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 7. SSL (opcional, mas recomendado)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

## 🔄 Atualizar projeto (deploy)
```bash
cd /var/www/csf/carrefour-cartao
./deploy.sh
```

## ✅ Pronto!
Acesse: `http://SEU_IP_VPS` ou `https://seu-dominio.com`

