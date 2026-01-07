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


