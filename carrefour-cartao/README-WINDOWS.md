# 🪟 Guia de Instalação e Execução no Windows

Este guia foi criado especificamente para usuários do Windows, garantindo que o projeto funcione corretamente após ser desenvolvido no macOS.

## ✅ Pré-requisitos

1. **Node.js 18 ou superior**
   - Baixe em: https://nodejs.org/
   - Verifique a instalação: `node --version`
   - Verifique npm: `npm --version`

2. **PowerShell 5.1 ou superior** (já vem com Windows 10/11)
   - Verifique: `powershell --version`

## 🚀 Instalação Rápida

### Opção 1: Script Automático (Recomendado)

1. Navegue até a pasta do projeto:
   ```powershell
   cd "C:\Users\David\Downloads\Cartão para negativado\carrefour-cartao"
   ```

2. Execute o script de instalação:
   - **Duplo clique** em `INSTALAR-DEPENDENCIAS.bat`
   - OU execute no PowerShell: `.\instalar-dependencias.ps1`

3. Execute o projeto:
   - **Duplo clique** em `EXECUTAR-INTELIGENTE.bat`
   - OU execute no PowerShell: `.\executar-inteligente.ps1`

### Opção 2: Manual

```powershell
# 1. Navegar para o diretório
cd "C:\Users\David\Downloads\Cartão para negativado\carrefour-cartao"

# 2. Instalar dependências
npm install

# 3. Executar projeto
npm run dev
```

## 🔍 Verificação de Ambiente

Antes de executar, você pode verificar se tudo está configurado corretamente:

```powershell
.\verificar-ambiente.ps1
```

Este script verifica:
- ✅ Node.js e npm instalados
- ✅ Estrutura do projeto
- ✅ Dependências instaladas
- ✅ Porta 5173 disponível

## 📝 Scripts Disponíveis

### Scripts PowerShell (.ps1)

| Script | Descrição |
|--------|-----------|
| `verificar-ambiente.ps1` | Verifica se o ambiente está configurado corretamente |
| `instalar-dependencias.ps1` | Instala dependências com múltiplas tentativas |
| `executar-inteligente.ps1` | Executa o projeto com verificações automáticas |
| `executar-projeto.ps1` | Executa o projeto (versão simples) |
| `limpar-e-executar.ps1` | Limpa cache e executa o projeto |
| `start-dev.ps1` | Inicia servidor de desenvolvimento |
| `run-dev.ps1` | Executa em modo desenvolvimento |

### Scripts Batch (.bat)

| Script | Descrição |
|--------|-----------|
| `EXECUTAR-INTELIGENTE.bat` | Executa o projeto (modo inteligente) |
| `EXECUTAR.bat` | Executa o projeto (versão simples) |
| `INSTALAR-DEPENDENCIAS.bat` | Instala dependências |
| `INICIAR-SERVIDOR.bat` | Inicia servidor com verificações |
| `INICIAR-SERVIDOR-SIMPLES.bat` | Inicia servidor (versão simples) |
| `start-dev.bat` | Inicia servidor de desenvolvimento |

## 🛠️ Solução de Problemas

### Erro: "npm não é reconhecido"
- **Solução**: Instale Node.js de https://nodejs.org/
- Reinicie o terminal após instalação

### Erro: "Execution Policy"
- **Solução**: Execute no PowerShell (como Administrador):
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

### Erro: "Porta 5173 já está em uso"
- **Solução**: O script tenta liberar automaticamente
- Ou feche manualmente o processo que está usando a porta

### Erro: "node_modules não encontrado"
- **Solução**: Execute `npm install` ou `.\instalar-dependencias.ps1`

### Problemas com Encoding (caracteres estranhos)
- **Solução**: Os scripts já estão configurados com UTF-8
- Se persistir, execute: `chcp 65001` no CMD

### Erro: "Cannot find module"
- **Solução**: 
  1. Delete a pasta `node_modules`
  2. Delete o arquivo `package-lock.json`
  3. Execute `npm install` novamente

## 🌐 Acessando o Projeto

Após executar o projeto, acesse:
- **URL Local**: http://localhost:5173
- **URL Rede**: http://[SEU-IP]:5173 (se configurado)

## 📦 Estrutura de Pastas

```
carrefour-cartao/
├── src/              # Código fonte
├── public/           # Arquivos estáticos
│   └── images/       # Imagens do projeto
├── node_modules/     # Dependências (gerado)
├── dist/             # Build de produção (gerado)
├── *.ps1             # Scripts PowerShell
├── *.bat             # Scripts Batch
└── package.json      # Configuração do projeto
```

## 🔄 Diferenças macOS vs Windows

Este projeto foi otimizado para funcionar em ambos os sistemas:

| Aspecto | macOS | Windows |
|---------|-------|---------|
| Caminhos | `/` | `/` (funciona em ambos) |
| Encoding | UTF-8 | UTF-8 (configurado) |
| Scripts | `.sh` | `.ps1` e `.bat` |
| Node.js | Funciona | Funciona |

## 💡 Dicas

1. **Use o script inteligente**: `EXECUTAR-INTELIGENTE.bat` faz verificações automáticas
2. **Verifique o ambiente**: Execute `verificar-ambiente.ps1` antes de começar
3. **Mantenha Node.js atualizado**: Use a versão LTS
4. **Use PowerShell**: Prefira PowerShell ao CMD para melhor compatibilidade

## 🆘 Suporte

Se encontrar problemas:
1. Execute `verificar-ambiente.ps1`
2. Verifique os logs de erro
3. Tente limpar cache: `limpar-e-executar.ps1`
4. Reinstale dependências: `npm install`

---

**Desenvolvido com ❤️ para Windows**



