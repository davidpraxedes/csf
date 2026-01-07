import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import { Save, Bell, AlertCircle, CheckCircle } from 'lucide-react';

export default function NotificationSettingsPage() {
  const navigate = useNavigate();
  const settings = useAdminStore((state) => state.settings);
  const updateSettings = useAdminStore((state) => state.updateSettings);
  const checkAuth = useAdminStore((state) => state.checkAuth);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [notificationsForm, setNotificationsForm] = useState(settings.notifications);

  useEffect(() => {
    if (!checkAuth()) {
      navigate('/admin/login');
    }
  }, [checkAuth, navigate]);

  useEffect(() => {
    setNotificationsForm(settings.notifications);
  }, [settings.notifications]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      updateSettings('notifications', notificationsForm);
      setSaveMessage('Configurações de notificações salvas com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Configurações de Notificações</h1>
            <p className="text-sm text-gray-600 mt-1">Configure as notificações Pushcut e personalize os templates</p>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {saveMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
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

              <div className="space-y-6">
                {/* Pushcut API Config */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-gray-900">Configurações Pushcut</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base URL</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Notificação</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Template de Texto</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Notificação</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Template de Texto</label>
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

                <button
                  onClick={handleSave}
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
                      Salvar Configurações
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


