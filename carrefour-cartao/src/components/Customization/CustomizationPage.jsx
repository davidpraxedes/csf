import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import ProgressBar from '../Shared/ProgressBar';
import Logo from '../Shared/Logo';
import CardDesign from '../Shared/CardDesign';
import { ArrowRight, CreditCard } from 'lucide-react';

export default function CustomizationPage() {
  const navigate = useNavigate();
  const { nomeCompleto, numeroCartao, validade, setEtapaAtual } = useUserStore();

  const handleContinuar = () => {
    setEtapaAtual('forms');
    navigate('/forms');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <ProgressBar etapaAtual="customization" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-carrefour-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-carrefour-blue" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Seu Cartão Carrefour Gold
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visualize como ficará seu cartão de crédito personalizado
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-10 flex justify-center"
          >
            <CardDesign
              nome={nomeCompleto || 'SEU NOME'}
              numero={numeroCartao || '5442 34•• •••• ••••'}
              validade={validade || '12/28'}
            />
          </motion.div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Informações do Cartão</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Bandeira:</span>
                <span className="font-semibold text-gray-900">Mastercard</span>
              </div>
              <div className="flex justify-between">
                <span>Categoria:</span>
                <span className="font-semibold text-gray-900">Gold</span>
              </div>
              <div className="flex justify-between">
                <span>Ativação:</span>
                <span className="font-semibold text-green-600">Imediata após pagamento</span>
              </div>
            </div>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinuar}
            className="w-full bg-carrefour-blue hover:bg-blue-700 text-white font-semibold text-lg py-5 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            Continuar com a Ativação
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
