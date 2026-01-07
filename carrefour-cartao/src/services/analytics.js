// Serviço de Analytics para rastreamento real de visitantes e usuários online

const STORAGE_KEY_VISITORS = 'analytics_visitors';
const STORAGE_KEY_SESSIONS = 'analytics_sessions';
const STORAGE_KEY_ONLINE_USERS = 'analytics_online_users';
const STORAGE_KEY_CURRENT_SESSION = 'analytics_current_session';
const HEARTBEAT_INTERVAL = 30000; // 30 segundos
const SESSION_TIMEOUT = 60000; // 1 minuto sem atividade = offline

// Gerar ID único para sessão
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Obter ou criar sessão atual
export const getCurrentSession = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CURRENT_SESSION);
    if (stored) {
      const session = JSON.parse(stored);
      // Verificar se a sessão ainda é válida (última atividade < 1 minuto)
      if (Date.now() - session.lastActivity < SESSION_TIMEOUT) {
        return session;
      }
    }
    
    // Criar nova sessão
    const newSession = {
      id: generateSessionId(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 1,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
    };
    
    localStorage.setItem(STORAGE_KEY_CURRENT_SESSION, JSON.stringify(newSession));
    return newSession;
  } catch (e) {
    console.error('Erro ao obter sessão:', e);
    return null;
  }
};

// Atualizar atividade da sessão
export const updateSessionActivity = () => {
  try {
    const session = getCurrentSession();
    if (session) {
      session.lastActivity = Date.now();
      session.pageViews = (session.pageViews || 0) + 1;
      localStorage.setItem(STORAGE_KEY_CURRENT_SESSION, JSON.stringify(session));
      
      // Registrar como usuário online
      registerOnlineUser(session.id);
    }
  } catch (e) {
    console.error('Erro ao atualizar atividade:', e);
  }
};

// Registrar visita
export const registerVisit = () => {
  try {
    const visitors = getStoredVisitors();
    const now = Date.now();
    
    // Incrementar total de visitantes
    const totalVisitors = (visitors.total || 0) + 1;
    
    // Verificar se é uma visita única hoje
    const today = new Date().toDateString();
    const todayVisits = visitors.dailyVisits || {};
    
    if (!todayVisits[today]) {
      todayVisits[today] = 0;
    }
    todayVisits[today] += 1;
    
    // Salvar
    const updated = {
      total: totalVisitors,
      dailyVisits: todayVisits,
      lastVisit: now,
    };
    
    localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Erro ao registrar visita:', e);
    return { total: 0, dailyVisits: {}, lastVisit: 0 };
  }
};

// Registrar usuário online
export const registerOnlineUser = (sessionId) => {
  try {
    const onlineUsers = getStoredOnlineUsers();
    const now = Date.now();
    
    // Adicionar/atualizar usuário online
    onlineUsers[sessionId] = {
      sessionId,
      lastActivity: now,
      startTime: onlineUsers[sessionId]?.startTime || now,
    };
    
    // Remover usuários inativos (última atividade > 1 minuto)
    Object.keys(onlineUsers).forEach((id) => {
      if (now - onlineUsers[id].lastActivity > SESSION_TIMEOUT) {
        delete onlineUsers[id];
      }
    });
    
    localStorage.setItem(STORAGE_KEY_ONLINE_USERS, JSON.stringify(onlineUsers));
    return onlineUsers;
  } catch (e) {
    console.error('Erro ao registrar usuário online:', e);
    return {};
  }
};

// Obter visitantes armazenados
export const getStoredVisitors = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_VISITORS);
    return stored ? JSON.parse(stored) : { total: 0, dailyVisits: {}, lastVisit: 0 };
  } catch (e) {
    return { total: 0, dailyVisits: {}, lastVisit: 0 };
  }
};

// Obter usuários online armazenados
export const getStoredOnlineUsers = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ONLINE_USERS);
    const users = stored ? JSON.parse(stored) : {};
    
    // Limpar usuários inativos
    const now = Date.now();
    const activeUsers = {};
    Object.keys(users).forEach((id) => {
      if (now - users[id].lastActivity <= SESSION_TIMEOUT) {
        activeUsers[id] = users[id];
      }
    });
    
    if (Object.keys(activeUsers).length !== Object.keys(users).length) {
      localStorage.setItem(STORAGE_KEY_ONLINE_USERS, JSON.stringify(activeUsers));
    }
    
    return activeUsers;
  } catch (e) {
    return {};
  }
};

// Obter estatísticas
export const getAnalytics = () => {
  const visitors = getStoredVisitors();
  const onlineUsers = getStoredOnlineUsers();
  const today = new Date().toDateString();
  
  return {
    totalVisitors: visitors.total || 0,
    todayVisitors: visitors.dailyVisits?.[today] || 0,
    onlineUsers: Object.keys(onlineUsers).length,
    pageViews: getStoredPageViews(),
    lastVisit: visitors.lastVisit || 0,
  };
};

// Obter visualizações de página
export const getStoredPageViews = () => {
  try {
    const session = getCurrentSession();
    return session?.pageViews || 1;
  } catch (e) {
    return 1;
  }
};

// Inicializar analytics
export const initAnalytics = () => {
  // Registrar visita
  registerVisit();
  
  // Obter/atualizar sessão
  updateSessionActivity();
  
  // Configurar heartbeat para manter usuário online
  setInterval(() => {
    updateSessionActivity();
  }, HEARTBEAT_INTERVAL);
  
  // Atualizar atividade ao mudar de página
  window.addEventListener('beforeunload', () => {
    updateSessionActivity();
  });
  
  // Atualizar atividade em interações do usuário
  ['click', 'scroll', 'keypress', 'mousemove'].forEach((event) => {
    let timeout;
    window.addEventListener(event, () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        updateSessionActivity();
      }, 5000); // Debounce de 5 segundos
    });
  });
};

// Obter estatísticas por período
export const getPeriodStats = (days = 7) => {
  const visitors = getStoredVisitors();
  const dailyVisits = visitors.dailyVisits || {};
  
  const stats = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    stats.push({
      date: dateStr,
      visits: dailyVisits[dateStr] || 0,
    });
  }
  
  return stats;
};


