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

