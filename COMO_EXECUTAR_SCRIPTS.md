# Como Executar os Scripts de Teste Localmente

Este guia explica como executar os scripts de teste da API diretamente no seu computador, **sem passar pelo Cursor**, evitando problemas de conexão.

## ⚠️ Problema Comum

Quando você tenta executar scripts que fazem requisições HTTP através do Cursor, ele pode bloquear essas requisições por questões de segurança, mostrando mensagens como:
- "Erro de conexão"
- "Sua conexão está ruim"
- "Você está usando VPN"

**Isso NÃO é um problema da sua conexão!** É uma limitação do Cursor ao executar comandos que fazem requisições HTTP.

## ✅ Solução: Executar Localmente

### Opção 1: Script Python (Recomendado)

1. **Abra o PowerShell ou Terminal** diretamente (não pelo Cursor)

2. **Navegue até a pasta do projeto:**
   ```powershell
   cd "C:\Users\David\Downloads\Cartão para negativado"
   ```

3. **Execute o script Python:**
   ```powershell
   python consulta_cpf.py
   ```

4. **Ou passe o CPF como argumento:**
   ```powershell
   python consulta_cpf.py 12345678901
   ```

### Opção 2: Script Node.js

1. **Abra o PowerShell ou Terminal** diretamente

2. **Navegue até a pasta do projeto:**
   ```powershell
   cd "C:\Users\David\Downloads\Cartão para negativado"
   ```

3. **Execute o script Node.js:**
   ```powershell
   node testar_api_cpf.js
   ```

### Opção 3: Usar cURL (Windows PowerShell)

1. **Abra o PowerShell** diretamente

2. **Execute o comando cURL:**
   ```powershell
   curl -X POST "https://tsmbotzygympsfxvjeul.supabase.co/functions/v1/consulta-cpf" `
     -H "Accept: application/json" `
     -H "Content-Type: application/json" `
     -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWJvdHp5Z3ltcHNmeHZqZXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Njg3NzMsImV4cCI6MjA4MjU0NDc3M30.W4AbPD6W1hksp0ZcM0-BG9c3aixIk5RejNxQrusV3M0" `
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWJvdHp5Z3ltcHNmeHZqZXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Njg3NzMsImV4cCI6MjA4MjU0NDc3M30.W4AbPD6W1hksp0ZcM0-BG9c3aixIk5RejNxQrusV3M0" `
     -d '{\"cpf\":\"12345678901\"}'
   ```

## 🔧 Requisitos

### Para Python:
- Python 3.6 ou superior instalado
- Biblioteca `requests` instalada:
  ```powershell
  pip install requests
  ```

### Para Node.js:
- Node.js instalado (versão 14 ou superior)

## 📝 Notas Importantes

1. **Execute sempre fora do Cursor** - Use o PowerShell, CMD ou Terminal do Windows diretamente

2. **Verifique sua conexão** - Se ainda der erro, teste acessando o site no navegador:
   ```
   https://tsmbotzygympsfxvjeul.supabase.co
   ```

3. **Firewall/Antivírus** - Alguns podem bloquear conexões. Tente desabilitar temporariamente para testar

4. **VPN/Proxy** - Se estiver usando VPN, tente desabilitar temporariamente

## 🧪 Teste Rápido de Conexão

Para verificar se o problema é realmente do Cursor ou da sua conexão, execute no PowerShell:

```powershell
Test-NetConnection -ComputerName tsmbotzygympsfxvjeul.supabase.co -Port 443
```

Se mostrar `TcpTestSucceeded : True`, sua conexão está funcionando e o problema é do Cursor.

## 💡 Dica

Crie um arquivo `.bat` ou `.ps1` para executar mais facilmente:

**testar_api.bat:**
```batch
@echo off
cd /d "%~dp0"
python consulta_cpf.py
pause
```

Depois é só dar duplo clique no arquivo `.bat`!




