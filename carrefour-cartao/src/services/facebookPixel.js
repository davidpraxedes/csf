// Serviço para Facebook Pixel (Meta Ads)
// Documentação: https://developers.facebook.com/docs/meta-pixel

const PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID;

// Inicializar o Pixel
export const initFacebookPixel = () => {
  if (!PIXEL_ID || PIXEL_ID === 'SEU_PIXEL_ID_AQUI') {
    console.warn('Facebook Pixel ID não configurado');
    return;
  }

  // Verificar se já foi inicializado
  if (window.fbq) {
    return;
  }

  // Carregar script do Facebook Pixel
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  // Inicializar o Pixel
  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
  
  console.log('Facebook Pixel inicializado:', PIXEL_ID);
};

// Evento: PageView (já disparado na inicialização)
export const trackPageView = () => {
  if (window.fbq && PIXEL_ID) {
    window.fbq('track', 'PageView');
    console.log('Facebook Pixel: PageView');
  }
};

// Evento: InitiateCheckout (início do checkout)
export const trackInitiateCheckout = (value = null, currency = 'BRL') => {
  if (window.fbq && PIXEL_ID) {
    const params = {
      content_name: 'Cartão Carrefour',
      content_category: 'Cartão de Crédito',
      currency: currency,
    };
    
    if (value) {
      params.value = value;
    }
    
    window.fbq('track', 'InitiateCheckout', params);
    console.log('Facebook Pixel: InitiateCheckout', params);
  }
};

// Evento: Purchase (compra concluída)
export const trackPurchase = (value, currency = 'BRL', transactionId = null) => {
  if (window.fbq && PIXEL_ID) {
    const params = {
      content_name: 'Cartão Carrefour - Ativação',
      content_category: 'Cartão de Crédito',
      currency: currency,
      value: value,
    };
    
    if (transactionId) {
      params.order_id = transactionId;
    }
    
    window.fbq('track', 'Purchase', params);
    console.log('Facebook Pixel: Purchase', params);
  }
};

// Evento customizado: PIX Gerado
export const trackPixGenerated = (value, transactionId) => {
  if (window.fbq && PIXEL_ID) {
    window.fbq('trackCustom', 'PixGenerated', {
      content_name: 'PIX Gerado',
      value: value,
      currency: 'BRL',
      order_id: transactionId,
    });
    console.log('Facebook Pixel: PixGenerated', { value, transactionId });
  }
};


