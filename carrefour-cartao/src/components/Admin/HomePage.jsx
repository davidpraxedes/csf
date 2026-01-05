import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  Users,
  Eye,
  Activity,
  CreditCard,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  BarChart3,
  Key,
  Bell,
  FileText,
  Palette,
} from 'lucide-react';
import { getAnalytics } from '../../services/analytics';

export default function HomePage() {
  const navigate = useNavigate();
  const orders = useAdminStore((state) => state.orders);
  const checkAuth = useAdminStore((state) => state.checkAuth);
  const [visitors, setVisitors] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [pageViews, setPageViews] = useState(0);

  useEffect(() => {
    if (!checkAuth()) {
      navigate('/admin/login');
    }
  }, [checkAuth, navigate]);

  // Carregar dados reais do analytics
  useEffect(() => {
    const loadAnalytics = () => {
      try {
        const analytics = getAnalytics();
        setVisitors(analytics.totalVisitors);
        setOnlineUsers(analytics.onlineUsers);
        setPageViews(analytics.pageViews);
      } catch (error) {
        console.error('Erro ao carregar analytics:', error);
      }
    };

    // Carregar imediatamente
    loadAnalytics();

    // Atualizar a cada 5 segundos
    const interval = setInterval(loadAnalytics, 5000);

    return () => clearInterval(interval);
  }, []);

  // Estatísticas
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.paymentStatus === 'pending').length,
    paid: orders.filter((o) => o.paymentStatus === 'paid').length,
    totalRevenue: orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.valorEntrega || 0), 0),
    today: orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    }).length,
    thisWeek: orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length,
    thisMonth: orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }).length,
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Visão geral do sistema</p>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Visitantes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total de Visitantes</p>
              <p className="text-3xl font-bold text-gray-900">{visitors.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-green-600 mt-2">+12% este mês</p>
            </motion.div>

            {/* Usuários Online */}
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
              <p className="text-3xl font-bold text-gray-900">{onlineUsers}</p>
              <p className="text-xs text-gray-500 mt-2">Agora</p>
            </motion.div>

            {/* Visualizações */}
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
                <ArrowUpRight className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Visualizações</p>
              <p className="text-3xl font-bold text-gray-900">{pageViews.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-green-600 mt-2">+8% esta semana</p>
            </motion.div>

            {/* Receita Total */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Receita Total</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-green-600 mt-2">+{stats.paid} pagamentos</p>
            </motion.div>
          </div>

          {/* Estatísticas de Pedidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total de Pedidos</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-carrefour-blue" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pendentes</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Aprovados</p>
                  <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hoje</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.today}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Gráficos e Tabelas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Pedidos Recentes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h2>
                <Link
                  to="/admin/orders"
                  className="text-sm text-carrefour-blue hover:text-blue-700 font-medium"
                >
                  Ver todos
                </Link>
              </div>
              <div className="p-6">
                {recentOrders.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Nenhum pedido ainda</p>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{order.nomeCompleto || 'N/A'}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(order.valorEntrega || 0)}
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              order.paymentStatus === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : order.paymentStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {order.paymentStatus === 'paid' && 'Pago'}
                            {order.paymentStatus === 'pending' && 'Pendente'}
                            {order.paymentStatus === 'failed' && 'Falhou'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Estatísticas por Período */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Estatísticas por Período</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Hoje</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Esta Semana</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Este Mês</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Ações Rápidas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Ações Rápidas</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to="/admin/orders"
                  className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Package className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Ver Pedidos</span>
                </Link>
                <Link
                  to="/admin/settings/gateway"
                  className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Key className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Gateway</span>
                </Link>
                <Link
                  to="/admin/settings/notifications"
                  className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <Bell className="w-8 h-8 text-yellow-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Notificações</span>
                </Link>
                <Link
                  to="/admin/settings/appearance"
                  className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Palette className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Aparência</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}

