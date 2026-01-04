# 🏗️ Estrutura do Projeto - Cartão Carrefour

## 📁 Organização de Arquivos

```
carrefour-cartao/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Landing/
│   │   │   ├── Quiz/
│   │   │   ├── CPFConsult/
│   │   │   ├── Processing/
│   │   │   ├── Approval/
│   │   │   ├── Benefits/
│   │   │   ├── Customization/
│   │   │   ├── Forms/
│   │   │   ├── Payment/
│   │   │   ├── VirtualCard/
│   │   │   └── Confirmation/
│   │   ├── services/
│   │   │   ├── api.js (consultas CPF/CEP)
│   │   │   ├── pix.js (geração PIX)
│   │   │   └── email.js (envio emails)
│   │   ├── store/
│   │   │   └── userData.js (estado global)
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   └── formatters.js
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
├── backend/ (opcional, se necessário)
│   ├── routes/
│   ├── controllers/
│   └── services/
│
└── docs/
    ├── FLUXO_CARREFOUR.md
    ├── API_CONSULTA_CPF.md
    └── ESTRUTURA_PROJETO.md
```

## 🛠️ Stack Tecnológica Recomendada

### Frontend:
- **React** ou **Next.js** (framework)
- **TailwindCSS** (estilização)
- **Framer Motion** (animações)
- **React Router** (navegação)
- **Zustand/Redux** (estado global)
- **React Hook Form** (formulários)
- **Axios** (HTTP requests)

### Backend (se necessário):
- **Node.js + Express** ou
- **Next.js API Routes** ou
- **Supabase Functions**

### Integrações:
- **API CPF** (já temos)
- **API CEP** (ViaCEP ou similar)
- **Gateway PIX** (Asaas, Gerencianet, etc.)
- **Email Service** (SendGrid, Resend, etc.)
- **SMS** (Twilio, Zenvia, etc.)

## 🎨 Design System

### Cores (Carrefour):
- **Primary:** #0066CC (Azul Carrefour)
- **Secondary:** #FF6600 (Laranja Carrefour)
- **Success:** #28A745
- **Warning:** #FFC107
- **Danger:** #DC3545
- **Dark:** #212529
- **Light:** #F8F9FA

### Tipografia:
- **Headings:** Inter, sans-serif (bold)
- **Body:** Inter, sans-serif (regular)
- **Tamanhos:** 12px, 14px, 16px, 18px, 24px, 32px, 48px

### Componentes Base:
- Buttons (primary, secondary, outline)
- Cards
- Inputs
- Modals
- Loading states
- Progress bar
- Badges

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "framer-motion": "^10.16.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "qrcode.react": "^3.1.0",
    "react-input-mask": "^2.0.4"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

## 🔐 Variáveis de Ambiente

```env
# API CPF
VITE_CPF_API_URL=https://tsmbotzygympsfxvjeul.supabase.co
VITE_CPF_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API CEP
VITE_CEP_API_URL=https://viacep.com.br/ws

# PIX Gateway
VITE_PIX_API_URL=https://api.gateway.com
VITE_PIX_API_KEY=your_key_here

# Email Service
VITE_EMAIL_API_KEY=your_key_here

# Analytics
VITE_GA_ID=your_ga_id
```

## 🚀 Scripts de Desenvolvimento

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src"
  }
}
```

## 📱 Responsividade

- **Mobile First:** Design mobile primeiro
- **Breakpoints:**
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

## ♿ Acessibilidade

- Labels em todos os inputs
- Contraste adequado
- Navegação por teclado
- Screen reader friendly
- ARIA labels

## 🧪 Testes

- Unitários: Jest + React Testing Library
- E2E: Cypress ou Playwright
- Testes de integração das APIs

## 📊 Analytics

- Google Analytics 4
- Hotjar (heatmaps)
- Event tracking customizado
- Conversão funil

## 🔒 Segurança

- Validação de dados no frontend E backend
- HTTPS obrigatório
- Sanitização de inputs
- Rate limiting nas APIs
- CORS configurado corretamente
- Dados sensíveis nunca no localStorage

