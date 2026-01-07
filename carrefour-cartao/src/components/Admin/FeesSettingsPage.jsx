import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import { Save, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

export default function FeesSettingsPage() {
  const navigate = useNavigate();
  const settings = useAdminStore((state) => state.settings);
  const updateFeeSettings = useAdminStore((state) => state.updateFeeSettings);
  const checkAuth = useAdminStore((state) => state.checkAuth);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [feesForm, setFeesForm] = useState(settings.fees);

  useEffect(() => {
    if (!checkAuth()) {
      navigate('/admin/login');
    }
  }, [checkAuth, navigate]);

  useEffect(() => {
    setFeesForm(settings.fees);
  }, [settings.fees]);

  const handleSave = async () => {
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

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Taxas</h1>
            <p className="text-sm text-gray-600 mt-1">Configure os valores das taxas de ativação e entrega</p>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
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


