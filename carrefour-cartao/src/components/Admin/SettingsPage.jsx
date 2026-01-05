import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Key,
  DollarSign,
  Bell,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Palette,
  Image as ImageIcon,
  Globe,
} from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const settings = useAdminStore((state) => state.settings);
  const updateGatewaySettings = useAdminStore((state) => state.updateGatewaySettings);
  const updateFeeSettings = useAdminStore((state) => state.updateFeeSettings);
  const updateNotificationSettings = useAdminStore((state) => state.updateNotificationSettings);
  const updateGeneralSettings = useAdminStore((state) => state.updateGeneralSettings);
  const checkAuth = useAdminStore((state) => state.checkAuth);

  const [activeTab, setActiveTab] = useState('gateway');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showSecretKey, setShowSecretKey] = useState(false);

  // Estados para formulários
  const [gatewayForm, setGatewayForm] = useState(settings.gateway);
  const [feesForm, setFeesForm] = useState(settings.fees);
  const [notificationsForm, setNotificationsForm] = useState(settings.notifications);
  const [generalForm, setGeneralForm] = useState(settings.general);

  useEffect(() => {
    if (!checkAuth()) {
      navigate('/admin/login');
    }
  }, [checkAuth, navigate]);

  useEffect(() => {
    setGatewayForm(settings.gateway);
    setFeesForm(settings.fees);
    setNotificationsForm(settings.notifications);
    setGeneralForm(settings.general);
  }, [settings]);

  const handleSaveGateway = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      updateGatewaySettings(gatewayForm);
      setSaveMessage('Configurações do gateway salvas com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFees = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      updateFeeSettings(feesForm);
      setSaveMessage('Configurações de taxas salvas com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      // Atualizar todas as configurações de notificações de uma vez usando updateSettings
      const updateSettings = useAdminStore.getState().updateSettings;
      updateSettings('notifications', notificationsForm);
      setSaveMessage('Configurações de notificações salvas com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGeneral = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      updateGeneralSettings(generalForm);
      setSaveMessage('Configurações gerais salvas com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'gateway', label: 'Gateway', icon: Key },
    { id: 'fees', label: 'Taxas', icon: DollarSign },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'general', label: 'Geral', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 text-gray-700 hover:text-carrefour-blue transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar para Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
            <div className="w-32"></div> {/* Spacer */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-carrefour-blue border-b-2 border-carrefour-blue bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {saveMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
                  saveMessage.includes('sucesso')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {saveMessage.includes('sucesso') ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{saveMessage}</span>
              </motion.div>
            )}

            {/* Gateway Settings */}
            {activeTab === 'gateway' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Configurações do Gateway de Pagamento</h2>
                  <p className="text-gray-600 mb-6">
                    Configure as credenciais do gateway VennoxPay para processar pagamentos PIX.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secret Key
                    </label>
                    <div className="relative">
                      <input
                        type={showSecretKey ? 'text' : 'password'}
                        value={gatewayForm.secretKey}
                        onChange={(e) => setGatewayForm({ ...gatewayForm, secretKey: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue pr-12"
                        placeholder="sk_live_..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showSecretKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Chave secreta da API VennoxPay. Mantenha em segredo.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company ID
                    </label>
                    <input
                      type="text"
                      value={gatewayForm.companyId}
                      onChange={(e) => setGatewayForm({ ...gatewayForm, companyId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                      placeholder="a5d1078f-514b-45c5-a42f-004ab1f19afe"
                    />
                    <p className="mt-1 text-xs text-gray-500">ID da empresa no gateway.</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="gatewayEnabled"
                      checked={gatewayForm.enabled}
                      onChange={(e) => setGatewayForm({ ...gatewayForm, enabled: e.target.checked })}
                      className="w-5 h-5 text-carrefour-blue border-gray-300 rounded focus:ring-carrefour-blue"
                    />
                    <label htmlFor="gatewayEnabled" className="text-sm font-medium text-gray-700">
                      Gateway habilitado
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleSaveGateway}
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3 bg-carrefour-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Salvar Configurações do Gateway
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Fees Settings */}
            {activeTab === 'fees' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Configurações de Taxas</h2>
                  <p className="text-gray-600 mb-6">Configure os valores das taxas de ativação e entrega.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taxa de Ativação (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={feesForm.activationFee}
                      onChange={(e) => setFeesForm({ ...feesForm, activationFee: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                      placeholder="25.50"
                    />
                    <p className="mt-1 text-xs text-gray-500">Valor da taxa de ativação do cartão.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taxa de Entrega - Carta Registrada (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={feesForm.deliveryFeeRegistered}
                      onChange={(e) =>
                        setFeesForm({ ...feesForm, deliveryFeeRegistered: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                      placeholder="10.00"
                    />
                    <p className="mt-1 text-xs text-gray-500">Valor da entrega via carta registrada.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taxa de Entrega - SEDEX (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={feesForm.deliveryFeeSedex}
                      onChange={(e) =>
                        setFeesForm({ ...feesForm, deliveryFeeSedex: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                      placeholder="25.00"
                    />
                    <p className="mt-1 text-xs text-gray-500">Valor da entrega via SEDEX.</p>
                  </div>
                </div>

                <button
                  onClick={handleSaveFees}
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3 bg-carrefour-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Salvar Configurações de Taxas
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Configurações de Notificações</h2>
                  <p className="text-gray-600 mb-6">
                    Configure as notificações Pushcut e personalize os templates de mensagens.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Pushcut API Config */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold text-gray-900">Configurações Pushcut</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <input
                        type="text"
                        value={notificationsForm.pushcutApiKey}
                        onChange={(e) =>
                          setNotificationsForm({ ...notificationsForm, pushcutApiKey: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                        placeholder="XPTr5Kloj05Rr37Saz0D1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base URL
                      </label>
                      <input
                        type="text"
                        value={notificationsForm.pushcutBaseUrl}
                        onChange={(e) =>
                          setNotificationsForm({ ...notificationsForm, pushcutBaseUrl: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                        placeholder="https://api.pushcut.io"
                      />
                    </div>
                  </div>

                  {/* Notification Pendente */}
                  <div className="bg-yellow-50 rounded-lg p-4 space-y-4 border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notificação: Pedido Pendente</h3>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="pendenteEnabled"
                          checked={notificationsForm.notificationPendente.enabled}
                          onChange={(e) =>
                            setNotificationsForm({
                              ...notificationsForm,
                              notificationPendente: {
                                ...notificationsForm.notificationPendente,
                                enabled: e.target.checked,
                              },
                            })
                          }
                          className="w-5 h-5 text-carrefour-blue border-gray-300 rounded focus:ring-carrefour-blue"
                        />
                        <label htmlFor="pendenteEnabled" className="text-sm font-medium text-gray-700">
                          Habilitada
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome da Notificação
                      </label>
                      <input
                        type="text"
                        value={notificationsForm.notificationPendente.name}
                        onChange={(e) =>
                          setNotificationsForm({
                            ...notificationsForm,
                            notificationPendente: {
                              ...notificationsForm.notificationPendente,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                      <input
                        type="text"
                        value={notificationsForm.notificationPendente.title}
                        onChange={(e) =>
                          setNotificationsForm({
                            ...notificationsForm,
                            notificationPendente: {
                              ...notificationsForm.notificationPendente,
                              title: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template de Texto
                      </label>
                      <textarea
                        value={notificationsForm.notificationPendente.textTemplate}
                        onChange={(e) =>
                          setNotificationsForm({
                            ...notificationsForm,
                            notificationPendente: {
                              ...notificationsForm.notificationPendente,
                              textTemplate: e.target.value,
                            },
                          })
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                        placeholder="Use {valor}, {transactionId}, {nome}, {cpf} como variáveis"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Variáveis disponíveis: {'{valor}'}, {'{transactionId}'}, {'{nome}'}, {'{cpf}'}
                      </p>
                    </div>
                  </div>

                  {/* Notification Aprovado */}
                  <div className="bg-green-50 rounded-lg p-4 space-y-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notificação: Pagamento Aprovado</h3>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="aprovadoEnabled"
                          checked={notificationsForm.notificationAprovado.enabled}
                          onChange={(e) =>
                            setNotificationsForm({
                              ...notificationsForm,
                              notificationAprovado: {
                                ...notificationsForm.notificationAprovado,
                                enabled: e.target.checked,
                              },
                            })
                          }
                          className="w-5 h-5 text-carrefour-blue border-gray-300 rounded focus:ring-carrefour-blue"
                        />
                        <label htmlFor="aprovadoEnabled" className="text-sm font-medium text-gray-700">
                          Habilitada
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome da Notificação
                      </label>
                      <input
                        type="text"
                        value={notificationsForm.notificationAprovado.name}
                        onChange={(e) =>
                          setNotificationsForm({
                            ...notificationsForm,
                            notificationAprovado: {
                              ...notificationsForm.notificationAprovado,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                      <input
                        type="text"
                        value={notificationsForm.notificationAprovado.title}
                        onChange={(e) =>
                          setNotificationsForm({
                            ...notificationsForm,
                            notificationAprovado: {
                              ...notificationsForm.notificationAprovado,
                              title: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template de Texto
                      </label>
                      <textarea
                        value={notificationsForm.notificationAprovado.textTemplate}
                        onChange={(e) =>
                          setNotificationsForm({
                            ...notificationsForm,
                            notificationAprovado: {
                              ...notificationsForm.notificationAprovado,
                              textTemplate: e.target.value,
                            },
                          })
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                        placeholder="Use {valor}, {transactionId}, {nome}, {cpf} como variáveis"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Variáveis disponíveis: {'{valor}'}, {'{transactionId}'}, {'{nome}'}, {'{cpf}'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveNotifications}
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3 bg-carrefour-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Salvar Configurações de Notificações
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* General Settings */}
            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Configurações Gerais</h2>
                  <p className="text-gray-600 mb-6">Personalize a aparência e informações gerais do sistema.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Site
                    </label>
                    <input
                      type="text"
                      value={generalForm.siteName}
                      onChange={(e) => setGeneralForm({ ...generalForm, siteName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                      placeholder="Cartão Carrefour"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL do Logo
                    </label>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={generalForm.logoUrl}
                        onChange={(e) => setGeneralForm({ ...generalForm, logoUrl: e.target.value })}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                        placeholder="/images/logocsf.png"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Caminho relativo ou URL completa da imagem.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cor Primária
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={generalForm.primaryColor}
                          onChange={(e) => setGeneralForm({ ...generalForm, primaryColor: e.target.value })}
                          className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={generalForm.primaryColor}
                          onChange={(e) => setGeneralForm({ ...generalForm, primaryColor: e.target.value })}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue font-mono text-sm"
                          placeholder="#0066CC"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cor Secundária
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={generalForm.secondaryColor}
                          onChange={(e) => setGeneralForm({ ...generalForm, secondaryColor: e.target.value })}
                          className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={generalForm.secondaryColor}
                          onChange={(e) => setGeneralForm({ ...generalForm, secondaryColor: e.target.value })}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue font-mono text-sm"
                          placeholder="#00AA44"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveGeneral}
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3 bg-carrefour-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Salvar Configurações Gerais
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

