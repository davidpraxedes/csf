import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import { Save, Palette, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';

export default function AppearanceSettingsPage() {
  const navigate = useNavigate();
  const settings = useAdminStore((state) => state.settings);
  const updateGeneralSettings = useAdminStore((state) => state.updateGeneralSettings);
  const checkAuth = useAdminStore((state) => state.checkAuth);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [generalForm, setGeneralForm] = useState(settings.general);

  useEffect(() => {
    if (!checkAuth()) {
      navigate('/admin/login');
    }
  }, [checkAuth, navigate]);

  useEffect(() => {
    setGeneralForm(settings.general);
  }, [settings.general]);

  const handleSave = async () => {
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

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Aparência</h1>
            <p className="text-sm text-gray-600 mt-1">Personalize a aparência e informações gerais do sistema</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Site</label>
                  <input
                    type="text"
                    value={generalForm.siteName}
                    onChange={(e) => setGeneralForm({ ...generalForm, siteName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-carrefour-blue focus:border-carrefour-blue"
                    placeholder="Cartão Carrefour"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL do Logo</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cor Primária</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cor Secundária</label>
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

