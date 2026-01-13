import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Copy,
  Check,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = useAdminStore((state) => state.getOrder(orderId));
  const updateOrder = useAdminStore((state) => state.updateOrder);
  const sendNotification = useAdminStore((state) => state.sendNotification);
  const checkAuth = useAdminStore((state) => state.checkAuth);
  const [copied, setCopied] = useState('');
  const [sendingNotification, setSendingNotification] = useState(false);

  useEffect(() => {
    if (!checkAuth()) {
      navigate('/admin/login');
    }
  }, [checkAuth, navigate]);

  useEffect(() => {
    if (!order) {
      navigate('/admin/dashboard');
      return;
    }

    // Sempre buscar detalhes atualizados (para pegar as fotos que não vem na listagem)
    // Verifica se já tem fotos para evitar refetch desnecessário se já estiver carregado em memória
    if (!order.documentPhotoFront && !order.documentPhotoBack) {
      useAdminStore.getState().fetchOrderDetails(orderId);
    }
  }, [order, navigate, orderId]);

  if (!order) {
    return null;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCPF = (cpf) => {
    if (!cpf) return 'N/A';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleSendNotification = async (type) => {
    setSendingNotification(true);
    try {
      await sendNotification(orderId, type);
      alert(`Notificação ${type === 'pendente' ? 'pendente' : 'aprovado'} enviada com sucesso!`);
    } catch (error) {
      alert('Erro ao enviar notificação');
    } finally {
      setSendingNotification(false);
    }
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
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Detalhes do Pedido
                  <button
                    onClick={() => useAdminStore.getState().fetchOrderDetails(orderId)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                    title="Atualizar dados e fotos"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </h1>
                <p className="text-sm text-gray-600 mt-1">ID: {orderId}</p>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(
                  order.paymentStatus
                )}`}
              >
                {order.paymentStatus === 'pending' && 'Pendente'}
                {order.paymentStatus === 'paid' && 'Pago'}
                {order.paymentStatus === 'failed' && 'Falhou'}
                {order.paymentStatus === 'cancelled' && 'Cancelado'}
              </span>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conteúdo Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dados do Cliente */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-carrefour-blue" />
                  Dados do Cliente
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome Completo</label>
                    <p className="text-gray-900 font-medium mt-1">{order.nomeCompleto || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">CPF</label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-gray-900 font-medium">{formatCPF(order.cpf)}</p>
                      <button
                        onClick={() => handleCopy(order.cpf, 'cpf')}
                        className="text-gray-400 hover:text-carrefour-blue"
                      >
                        {copied === 'cpf' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-gray-900">{order.email || 'N/A'}</p>
                      {order.email && (
                        <button
                          onClick={() => handleCopy(order.email, 'email')}
                          className="text-gray-400 hover:text-carrefour-blue"
                        >
                          {copied === 'email' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Telefone</label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-gray-900">{order.telefone || 'N/A'}</p>
                      {order.telefone && (
                        <button
                          onClick={() => handleCopy(order.telefone, 'telefone')}
                          className="text-gray-400 hover:text-carrefour-blue"
                        >
                          {copied === 'telefone' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Nascimento</label>
                    <p className="text-gray-900 mt-1">{order.dataNascimento || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Profissão</label>
                    <p className="text-gray-900 mt-1">{order.profissao || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Salário</label>
                    <p className="text-gray-900 mt-1">{order.salario || 'N/A'}</p>
                  </div>
                </div>
              </motion.div>

              {/* Dados de Identificação (KYC) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-carrefour-blue" />
                  Dados de Identificação
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">RG</label>
                    <p className="text-gray-900 font-medium text-lg mt-1">{order.rg || 'Não informado'}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Frente */}
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">Frente do Documento</label>
                      {order.hasPhotoFront ? (
                        order.documentPhotoFront ? (
                          <div className="relative aspect-[1.58] w-full rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 shadow-sm transition-transform hover:scale-105">
                            <img
                              src={order.documentPhotoFront}
                              alt="Frente RG"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 text-sm">
                            Imagem não salva
                          </div>
                        )
                      ) : (
                        <div className="p-4 bg-gray-50 text-gray-500 rounded-lg border border-gray-200 flex items-center gap-2 text-sm">
                          <XCircle className="w-4 h-4" /> Não capturada
                        </div>
                      )}
                    </div>

                    {/* Verso */}
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">Verso do Documento</label>
                      {order.hasPhotoBack ? (
                        order.documentPhotoBack ? (
                          <div className="relative aspect-[1.58] w-full rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 shadow-sm transition-transform hover:scale-105">
                            <img
                              src={order.documentPhotoBack}
                              alt="Verso RG"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 text-sm">
                            Imagem não salva
                          </div>
                        )
                      ) : (
                        <div className="p-4 bg-gray-50 text-gray-500 rounded-lg border border-gray-200 flex items-center gap-2 text-sm">
                          <XCircle className="w-4 h-4" /> Não capturada
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Endereço */}
              {order.endereco && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-carrefour-blue" />
                    Endereço
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Logradouro</label>
                      <p className="text-gray-900 mt-1">{order.endereco.logradouro || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Número</label>
                      <p className="text-gray-900 mt-1">{order.endereco.numero || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Complemento</label>
                      <p className="text-gray-900 mt-1">{order.endereco.complemento || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bairro</label>
                      <p className="text-gray-900 mt-1">{order.endereco.bairro || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Cidade</label>
                      <p className="text-gray-900 mt-1">{order.endereco.cidade || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Estado</label>
                      <p className="text-gray-900 mt-1">{order.endereco.estado || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">CEP</label>
                      <p className="text-gray-900 mt-1">{order.endereco.cep || 'N/A'}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Dados do Cartão */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-carrefour-blue" />
                  Dados do Cartão
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Número do Cartão</label>
                    <p className="text-gray-900 font-mono mt-1">{order.numeroCartao || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Validade</label>
                    <p className="text-gray-900 mt-1">{order.validade || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">CVV</label>
                    <p className="text-gray-900 font-mono mt-1">{order.cvv || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Bandeira</label>
                    <p className="text-gray-900 mt-1 uppercase">{order.bandeiraCartao || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Limite</label>
                    <p className="text-gray-900 font-medium mt-1">R$ {order.limite || 'N/A'}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Informações do Pedido */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-carrefour-blue" />
                  Informações do Pedido
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID do Pedido</label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-gray-900 font-mono text-sm">{order.id}</p>
                      <button
                        onClick={() => handleCopy(order.id, 'orderId')}
                        className="text-gray-400 hover:text-carrefour-blue"
                      >
                        {copied === 'orderId' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID da Transação</label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-gray-900 font-mono text-sm">{order.transactionId || 'N/A'}</p>
                      {order.transactionId && (
                        <button
                          onClick={() => handleCopy(order.transactionId, 'transactionId')}
                          className="text-gray-400 hover:text-carrefour-blue"
                        >
                          {copied === 'transactionId' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Valor</label>
                    <p className="text-gray-900 font-bold text-xl mt-1">{formatCurrency(order.valorEntrega || 0)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Criação</label>
                    <p className="text-gray-900 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  {order.updatedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Última Atualização</label>
                      <p className="text-gray-900 mt-1">{formatDate(order.updatedAt)}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Código PIX Copiado</label>
                    <div className="flex items-center gap-2 mt-1">
                      {order.pixCopiado ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 font-medium">Sim</span>
                          {order.pixCopiadoEm && (
                            <span className="text-xs text-gray-500">
                              ({formatDate(order.pixCopiadoEm)})
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-500">Não</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Ações */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-carrefour-blue" />
                  Notificações
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => handleSendNotification('pendente')}
                    disabled={sendingNotification}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingNotification ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar Notificação Pendente
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleSendNotification('aprovado')}
                    disabled={sendingNotification}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingNotification ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar Notificação Aprovado
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

