import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import {
  Users,
  Eye,
  Activity,
  TrendingUp,
  Clock,
  Globe,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { getAnalytics, getPeriodStats, getStoredOnlineUsers } from '../../services/analytics';

export default function StatisticsPage() {
  const navigate = useNavigate();
  const checkAuth = useAdminStore((state) => state.checkAuth);
  const [analytics, setAnalytics] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    onlineUsers: 0,
    pageViews: 0,
    lastVisit: 0,
  });
  const [periodStats, setPeriodStats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!checkAuth()) {
      navigate('/admin/login');
      return;
    }
    
    loadAnalytics();
    
    // Atualizar a cada 5 segundos
    const interval = setInterval(() => {
      loadAnalytics();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [checkAuth, navigate]);

  const loadAnalytics = () => {
    setRefreshing(true);
    try {
      const stats = getAnalytics();
      const period = getPeriodStats(7);
      const online = getStoredOnlineUsers();
      
      setAnalytics(stats);
      setPeriodStats(period);
      setOnlineUsers(online);
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'N/A';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  const maxVisits = Math.max(...periodStats.map((s) => s.visits), 1);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Estatísticas</h1>
                <p className="text-sm text-gray-600 mt-1">Análise em tempo real de visitantes e tráfego</p>
              </div>
              <button
                onClick={loadAnalytics}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-carrefour-blue hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total de Visitantes</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalVisitors.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-500 mt-2">Última visita: {formatTimeAgo(analytics.lastVisit)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Usuários Online</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.onlineUsers}</p>
              <p className="text-xs text-gray-500 mt-2">Em tempo real</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Visitas Hoje</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.todayVisitors.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-500 mt-2">Últimas 24 horas</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Visualizações</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.pageViews.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-500 mt-2">Total de páginas vistas</p>
            </motion.div>
          </div>

          {/* Gráfico de Visitas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Visitas dos Últimos 7 Dias</h2>
            <div className="space-y-4">
              {periodStats.map((stat, index) => {
                const date = new Date(stat.date);
                const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
                const dayNumber = date.getDate();
                
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-20 text-sm text-gray-600">
                      {dayName}, {dayNumber}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.visits / maxVisits) * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        className="bg-gradient-to-r from-carrefour-blue to-blue-600 h-full rounded-full flex items-center justify-end pr-2"
                      >
                        {stat.visits > 0 && (
                          <span className="text-xs font-medium text-white">{stat.visits}</span>
                        )}
                      </motion.div>
                    </div>
                    <div className="w-16 text-right text-sm font-medium text-gray-900">
                      {stat.visits}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Usuários Online Detalhados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-carrefour-blue" />
              Usuários Online Agora ({analytics.onlineUsers})
            </h2>
            {analytics.onlineUsers === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum usuário online no momento</p>
            ) : (
              <div className="space-y-3">
                {Object.values(onlineUsers).map((user, index) => {
                  const sessionDuration = Math.floor((Date.now() - user.startTime) / 1000 / 60);
                  return (
                    <div
                      key={user.sessionId}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Activity className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Sessão #{index + 1}</p>
                          <p className="text-sm text-gray-500">
                            Online há {sessionDuration} min
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-sm text-gray-600">Ativo</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Última atividade: {formatTimeAgo(user.lastActivity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}


