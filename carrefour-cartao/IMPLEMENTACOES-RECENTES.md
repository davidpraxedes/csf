# ✅ Implementações Recentes

## 📦 Valores de Frete Atualizados
- **Carta Registrada**: R$ 25,50 (entrega em até 15 dias úteis)
- **Sedex Expresso**: R$ 32,90 (entrega expressa em até 5 dias úteis)

## 🔒 Segurança - Variáveis de Ambiente
As chaves do gateway foram movidas para variáveis de ambiente:

**Arquivo `.env`** (não commitado):
```
VITE_VENNOX_SECRET_KEY=YOUR_SECRET_KEY_HERE
VITE_VENNOX_COMPANY_ID=a5d1078f-514b-45c5-a42f-004ab1f19afe
VITE_FACEBOOK_PIXEL_ID=seu-pixel-id-aqui
```

⚠️ **IMPORTANTE**: Configure o `VITE_FACEBOOK_PIXEL_ID` com seu Pixel ID do Meta Ads!

## 🚫 Prevenção de Transações Duplicadas
- O sistema verifica se já existe uma transação antes de criar nova
- Reutiliza o PIX se já existir uma transação válida
- Evita cobranças duplicadas

## 📊 Facebook Pixel (Meta Ads)

### Eventos Configurados:

1. **PageView** - LandingPage (primeira página)
   - Disparado automaticamente ao carregar a página inicial

2. **InitiateCheckout** - FormsPage (página de CEP)
   - Disparado quando o usuário preenche o CEP

3. **Purchase** - PaymentPage (página de pagamento)
   - Disparado quando o PIX é gerado com sucesso
   - Inclui valor e transaction_id para rastreamento

### Como Funciona:
- O Pixel é inicializado automaticamente no `main.jsx`
- Cada evento é disparado no momento correto do fluxo
- Todos os pedidos são marcados no Facebook com `order_id`

## 🔧 Arquivos Modificados

1. `src/services/pix.js` - Usa variáveis de ambiente e previne duplicação
2. `src/services/facebookPixel.js` - Novo serviço para Facebook Pixel
3. `src/main.jsx` - Inicializa Facebook Pixel
4. `src/components/Landing/LandingPage.jsx` - PageView
5. `src/components/Forms/FormsPage.jsx` - InitiateCheckout
6. `src/components/Payment/PaymentPage.jsx` - Purchase
7. `src/components/Delivery/DeliveryPage.jsx` - Valores atualizados

## 📝 Próximos Passos

1. Configure o `VITE_FACEBOOK_PIXEL_ID` no arquivo `.env`
2. Teste o fluxo completo
3. Verifique os eventos no Facebook Events Manager

