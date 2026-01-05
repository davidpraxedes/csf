import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import {
  Bell,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Package,
  Search,
  Filter,
} from 'lucide-react';
import { notificarPedidoPendente, notificarPagamentoAprovado } from '../../services/pushcut';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const orders = useAdminStore((state) => state.orders);
  const checkAuth = useAdminStore((state) => state.checkAuth);
  const sendNotification = useAdminStore((state) => state.sendNotification);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sendingNotifications, setSendingNotifications] = useState({});

  useEffect(() => {
    if (!checkAuth()) {
      navigate('/admin/login');
    }
  }, [checkAuth, navigate]);

  // Filtrar pedidos
  const filteredOrders = orders
    .filter((order) => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          order.nomeCompleto?.toLowerCase().includes(search) ||
          order.cpf?.includes(search) ||
          order.transactionId?.toLowerCase().includes(search) ||
          order.id?.toLowerCase().includes(search)
        );
      }
      return true;
    })
    .filter((order) => {
      if (statusFilter !== 'all') {
        return order.paymentStatus === statusFilter;
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleSendNotification = async (orderId, type) => {
    setSendingNotifications((prev) => ({ ...prev, [`${orderId}-${type}`]: true }));
    
    try {
      const success = await sendNotification(orderId, type);
      if (success) {
        alert(`Notificação ${type === 'pendente' ? 'pendente' : 'aprovado'} enviada com sucesso!`);
      } else {
        alert('Erro ao enviar notificação. Verifique as configurações.');
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      alert('Erro ao enviar notificação');
    } finally {
      setSendingNotifications((prev) => {
        const newState = { ...prev };
        delete newState[`${orderId}-${type}`];
        return newState;
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return variants[status] || variants.pending;
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
            <p className="text-sm text-gray-600 mt-1">Envie notificações Pushcut para pedidos específicos</p>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Filtros */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nome, CPF, ID ou transação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue appearance-none bg-white"
                >
                  <option value="all">Todos os Status</option>
                  <option value="pending">Pendente</option>
                  <option value="paid">Pago</option>
                  <option value="failed">Falhou</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Pedidos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Pedidos ({filteredOrders.length})
              </h2>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhum pedido encontrado</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Informações do Pedido */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="w-5 h-5 text-gray-400" />
                          <h3 className="font-semibold text-gray-900">{order.nomeCompleto || 'N/A'}</h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                              order.paymentStatus
                            )}`}
                          >
                            {order.paymentStatus === 'pending' && 'Pendente'}
                            {order.paymentStatus === 'paid' && 'Pago'}
                            {order.paymentStatus === 'failed' && 'Falhou'}
                            {order.paymentStatus === 'cancelled' && 'Cancelado'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">CPF:</span> {order.cpf || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Valor:</span> {formatCurrency(order.valorEntrega || 0)}
                          </div>
                          <div>
                            <span className="font-medium">ID:</span> {order.transactionId?.substring(0, 8) || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Data:</span> {formatDate(order.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Ações de Notificação */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleSendNotification(order.id, 'pendente')}
                          disabled={sendingNotifications[`${order.id}-pendente`]}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sendingNotifications[`${order.id}-pendente`] ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Notificar Pendente
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleSendNotification(order.id, 'aprovado')}
                          disabled={sendingNotifications[`${order.id}-aprovado`]}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sendingNotifications[`${order.id}-aprovado`] ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Notificar Aprovado
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Sobre as Notificações</p>
                <p>
                  As notificações são enviadas via Pushcut usando os templates configurados em{' '}
                  <button
                    onClick={() => navigate('/admin/settings/notifications')}
                    className="underline font-medium hover:text-blue-900"
                  >
                    Configurações de Notificações
                  </button>
                  . Certifique-se de que as configurações estão corretas antes de enviar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

