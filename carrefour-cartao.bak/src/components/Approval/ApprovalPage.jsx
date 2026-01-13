import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import ProgressBar from '../Shared/ProgressBar';
import Logo from '../Shared/Logo';
import CardDesign from '../Shared/CardDesign';
import { CheckCircle, Sparkles, Award, TrendingUp, ArrowRight } from 'lucide-react';
import { gerarNumeroCartao, gerarCVV, gerarValidade } from '../../services/api';
import { useEffect } from 'react';

export default function ApprovalPage() {
  const navigate = useNavigate();
  const { nomeCompleto, setEtapaAtual, setNumeroCartao, setCvv, setValidade, numeroCartao, cvv, validade } = useUserStore();
  const limite = useUserStore(state => state.limite);

  useEffect(() => {
    if (!numeroCartao) {
      setNumeroCartao(gerarNumeroCartao());
      setCvv(gerarCVV());
      setValidade(gerarValidade());
    }
  }, [numeroCartao, setNumeroCartao, setCvv, setValidade]);

  const handleContinuar = () => {
    setEtapaAtual('benefits');
    navigate('/benefits');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <ProgressBar etapaAtual="approval" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-5xl mx-auto mt-12"
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Parabéns! <span className="text-green-600">Aprovação Confirmada</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-2"
            >
              Seu cartão de crédito Carrefour foi pré-aprovado
            </motion.p>
            <p className="text-gray-500">
              Análise concluída com sucesso
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardDesign
                nome={nomeCompleto || 'SEU NOME'}
                numero={numeroCartao || '5442 34•• •••• ••••'}
                validade={validade || '12/28'}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-carrefour-blue to-carrefour-purple rounded-2xl p-8 text-white shadow-xl">
                <div className="text-center mb-6">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  <p className="text-white/90 mb-2 text-sm font-semibold uppercase tracking-wide">Limite Pré-Aprovado</p>
                  <p className="text-5xl font-bold mb-4">R$ {limite}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center justify-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">Aprovação sem consulta SPC/Serasa</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Próximos Passos</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-carrefour-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <p className="text-gray-600 text-sm">Conheça os benefícios exclusivos do seu cartão</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-carrefour-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <p className="text-gray-600 text-sm">Complete seus dados para ativação</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-carrefour-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <p className="text-gray-600 text-sm">Ative seu cartão virtual imediatamente</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinuar}
            className="w-full bg-carrefour-blue hover:bg-blue-700 text-white font-semibold text-lg py-5 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            Ver Benefícios do Cartão
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
