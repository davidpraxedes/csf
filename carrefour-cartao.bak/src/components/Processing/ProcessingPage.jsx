import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import ProgressBar from '../Shared/ProgressBar';
import Logo from '../Shared/Logo';
import { CheckCircle, Loader2, Shield, Database, TrendingUp, Award } from 'lucide-react';

const etapas = [
  { id: 1, texto: 'Recebimento e validação dos dados', icon: Database },
  { id: 2, texto: 'Análise de perfil creditício', icon: TrendingUp },
  { id: 3, texto: 'Verificação de elegibilidade', icon: Shield },
  { id: 4, texto: 'Aprovação confirmada', icon: Award }
];

export default function ProcessingPage() {
  const navigate = useNavigate();
  const { setAprovado, setLimite, setEtapaAtual } = useUserStore();
  const [etapaAtual, setEtapaAtualIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEtapaAtualIndex((prev) => {
        if (prev < etapas.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);

    const timeout = setTimeout(() => {
      setAprovado(true);
      setLimite('2.500,00');
      setEtapaAtual('approval');
      navigate('/approval');
    }, etapas.length * 2000 + 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate, setAprovado, setLimite, setEtapaAtual]);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <ProgressBar etapaAtual="processing" />
        
        <div className="max-w-3xl mx-auto mt-20">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 text-center">
            <div className="relative mb-12">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-carrefour-blue to-carrefour-purple rounded-full flex items-center justify-center shadow-xl">
                <Loader2 className="w-16 h-16 text-white animate-spin" />
              </div>
              <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-carrefour-blue/20 animate-ping"></div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Análise de Crédito em Andamento
            </h2>
            <p className="text-gray-600 text-lg mb-12 max-w-xl mx-auto">
              Estamos processando sua solicitação através do nosso sistema automatizado de análise.
              Este processo leva apenas alguns instantes.
            </p>

            <div className="space-y-4 max-w-2xl mx-auto">
              <AnimatePresence>
                {etapas.map((etapa, index) => (
                  <motion.div
                    key={etapa.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: etapaAtual >= index ? 1 : 0.4,
                      x: etapaAtual >= index ? 0 : -20
                    }}
                    className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: etapaAtual >= index ? '#1E5AFF' : '#e5e7eb',
                      backgroundColor: etapaAtual >= index ? '#f0f4ff' : '#f9fafb'
                    }}
                  >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: etapaAtual > index ? '#10b981' : etapaAtual === index ? '#1E5AFF' : '#e5e7eb',
                        color: etapaAtual >= index ? 'white' : '#9ca3af'
                      }}
                    >
                      {etapaAtual > index ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : etapaAtual === index ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <etapa.icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className={`text-lg font-semibold flex-1 text-left ${etapaAtual >= index ? 'text-gray-900' : 'text-gray-400'}`}>
                      {etapa.texto}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <Shield className="w-4 h-4 inline mr-2" />
                Análise realizada por sistema automatizado e seguro
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
