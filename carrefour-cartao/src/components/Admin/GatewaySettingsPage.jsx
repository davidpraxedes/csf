import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import { Save, Key, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function GatewaySettingsPage() {
  const navigate = useNavigate();
  const settings = useAdminStore((state) => state.settings);
  const updateGatewaySettings = useAdminStore((state) => state.updateGatewaySettings);
  const checkAuth = useAdminStore((state) => state.checkAuth);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showSecretKey, setShowSecretKey] = useState(false);

  // Form initial state
  const [gatewayForm, setGatewayForm] = useState(settings.gateway);

  useEffect(() => {
    if (!checkAuth()) {
      navigate('/admin/login');
    }
  }, [checkAuth, navigate]);

  useEffect(() => {
    // Ensure form has all necessary nested structures if they don't exist yet
    setGatewayForm({
      ...settings.gateway,
      activeProvider: settings.gateway.activeProvider || 'vennox',
      bestfy: settings.gateway.bestfy || { secretKey: '' }
    });
  }, [settings.gateway]);

  const handleSave = async () => {
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

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Gateway de Pagamento</h1>
            <p className="text-sm text-gray-600 mt-1">Configure o provedor de pagamento PIX</p>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {saveMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${saveMessage.includes('sucesso')
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

                {/* Seleção do Provedor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provedor de Pagamento
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setGatewayForm({ ...gatewayForm, activeProvider: 'vennox' })}
                      className={`px-4 py-3 rounded-lg border-2 text-center transition-all ${gatewayForm.activeProvider === 'vennox'
                          ? 'border-carrefour-blue bg-blue-50 text-carrefour-blue font-semibold'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                      VennoxPay
                    </button>
                    <button
                      type="button"
                      onClick={() => setGatewayForm({ ...gatewayForm, activeProvider: 'bestfy' })}
                      className={`px-4 py-3 rounded-lg border-2 text-center transition-all ${gatewayForm.activeProvider === 'bestfy'
                          ? 'border-carrefour-blue bg-blue-50 text-carrefour-blue font-semibold'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                      Bestfy
                    </button>
                  </div>
                </div>

                <div className="h-px bg-gray-200 my-6"></div>

                {/* Campos VennoxPay */}
                {gatewayForm.activeProvider === 'vennox' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vennox Secret Key
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
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vennox Company ID
                      </label>
                      <input
                        type="text"
                        value={gatewayForm.companyId}
                        onChange={(e) => setGatewayForm({ ...gatewayForm, companyId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                        placeholder="a5d1078f..."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Campos Bestfy */}
                {gatewayForm.activeProvider === 'bestfy' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bestfy Secret Key
                      </label>
                      <div className="relative">
                        <input
                          type={showSecretKey ? 'text' : 'password'}
                          value={gatewayForm.bestfy?.secretKey || ''}
                          onChange={(e) => setGatewayForm({
                            ...gatewayForm,
                            bestfy: { ...gatewayForm.bestfy, secretKey: e.target.value }
                          })}
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
                        Chave obtida no dashboard da Bestfy.
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="flex items-center gap-3 mt-6">
                  <input
                    type="checkbox"
                    id="gatewayEnabled"
                    checked={gatewayForm.enabled}
                    onChange={(e) => setGatewayForm({ ...gatewayForm, enabled: e.target.checked })}
                    className="w-5 h-5 text-carrefour-blue border-gray-300 rounded focus:ring-carrefour-blue"
                  />
                  <label htmlFor="gatewayEnabled" className="text-sm font-medium text-gray-700">
                    Habilitar Pagamentos
                  </label>
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


