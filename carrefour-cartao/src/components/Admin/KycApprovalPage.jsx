import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import {
    FileCheck,
    Search,
    Filter,
    Eye,
    Calendar,
    User,
    CheckCircle,
    XCircle,
    Clock,
    ShieldCheck
} from 'lucide-react';

export default function KycApprovalPage() {
    const navigate = useNavigate();
    const orders = useAdminStore((state) => state.orders);
    const checkAuth = useAdminStore((state) => state.checkAuth);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        if (!checkAuth()) {
            navigate('/admin/login');
        }
    }, [checkAuth, navigate]);

    // Carregar dados
    useEffect(() => {
        const loadData = async () => {
            if (useAdminStore.getState().fetchOrders) {
                await useAdminStore.getState().fetchOrders();
            }
        };
        loadData();
    }, []);

    const filteredOrders = orders
        .filter((order) => {
            // Filtrar apenas pedidos que têm alguma foto de documento ou flag
            // Se não tiver hasPhotoFront mas tiver foto, considera também
            return order.hasPhotoFront || order.documentPhotoFront || order.hasPhotoBack || order.documentPhotoBack;
        })
        .filter((order) => {
            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                return (
                    order.nomeCompleto?.toLowerCase().includes(search) ||
                    order.cpf?.includes(search) ||
                    order.transactionId?.toLowerCase().includes(search)
                );
            }
            return true;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                    <div className="px-4 sm:px-6 lg:px-8 py-4">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <ShieldCheck className="w-8 h-8 text-carrefour-blue" />
                            Aprovação de KYC
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">Verifique os documentos enviados pelos clientes</p>
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
                                    placeholder="Buscar por nome ou CPF..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Grid de Cards KYC */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredOrders.length === 0 ? (
                            <div className="col-span-full p-12 text-center bg-white rounded-xl border border-gray-200">
                                <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">Nenhum documento aguardando verificação</p>
                            </div>
                        ) : (
                            filteredOrders.map((order) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-carrefour-blue" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                                                        {order.nomeCompleto || 'Cliente sem nome'}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{order.cpf}</p>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Pendente
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                                                <p className="text-xs text-gray-500 mb-1">Frente RG</p>
                                                {order.hasPhotoFront || order.documentPhotoFront ? (
                                                    <div className="flex items-center justify-center text-green-600 gap-1 text-sm font-medium">
                                                        <CheckCircle className="w-4 h-4" /> Recebido
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center text-red-400 gap-1 text-sm font-medium">
                                                        <XCircle className="w-4 h-4" /> Pendente
                                                    </div>
                                                )}
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                                                <p className="text-xs text-gray-500 mb-1">Verso RG</p>
                                                {order.hasPhotoBack || order.documentPhotoBack ? (
                                                    <div className="flex items-center justify-center text-green-600 gap-1 text-sm font-medium">
                                                        <CheckCircle className="w-4 h-4" /> Recebido
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center text-red-400 gap-1 text-sm font-medium">
                                                        <XCircle className="w-4 h-4" /> Pendente
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <p className="text-xs text-gray-500">
                                                {formatDate(order.createdAt)}
                                            </p>
                                            <Link
                                                to={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-carrefour-blue text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Verificar
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
