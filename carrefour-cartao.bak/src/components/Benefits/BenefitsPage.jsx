import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import ProgressBar from '../Shared/ProgressBar';
import Logo from '../Shared/Logo';
import { CreditCard, ShoppingBag, Zap, Gift, Store, Trophy, Star, ArrowRight, CheckCircle } from 'lucide-react';

const beneficios = [
  {
    icon: CreditCard,
    titulo: 'Limite Pré-Aprovado',
    valor: 'Até R$ 5.000,00',
    descricao: 'Crédito disponível conforme seu perfil de aprovação',
    cor: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    icon: ShoppingBag,
    titulo: 'Cashback Exclusivo',
    valor: '5% de volta',
    descricao: 'Receba 5% de cashback em todas as compras realizadas no Carrefour',
    cor: 'text-orange-600 bg-orange-50 border-orange-200'
  },
  {
    icon: Zap,
    titulo: 'Cashback em Combustível',
    valor: '3% de volta',
    descricao: 'Economize em cada abastecimento com cashback automático',
    cor: 'text-yellow-600 bg-yellow-50 border-yellow-200'
  },
  {
    icon: CreditCard,
    titulo: 'Ativação Imediata',
    valor: 'Cartão Virtual',
    descricao: 'Use seu cartão virtual imediatamente após a aprovação',
    cor: 'text-green-600 bg-green-50 border-green-200'
  },
  {
    icon: Gift,
    titulo: 'Programa de Pontos',
    valor: 'Acumule Pontos',
    descricao: 'Ganhe pontos em todas as compras e troque por produtos exclusivos',
    cor: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  {
    icon: Store,
    titulo: 'Aceitação Nacional',
    valor: '500 mil+ estabelecimentos',
    descricao: 'Seu cartão é aceito em mais de 500 mil estabelecimentos no Brasil',
    cor: 'text-red-600 bg-red-50 border-red-200'
  },
  {
    icon: Trophy,
    titulo: 'Sem Anuidade',
    valor: 'Primeiro ano grátis',
    descricao: 'Economize mais de R$ 500 no primeiro ano com isenção de anuidade',
    cor: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  }
];

export default function BenefitsPage() {
  const navigate = useNavigate();
  const { setEtapaAtual } = useUserStore();

  const handleContinuar = () => {
    setEtapaAtual('customization');
    navigate('/customization');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <ProgressBar etapaAtual="benefits" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto mt-12"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Benefícios Exclusivos do Cartão Carrefour
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Além do crédito pré-aprovado, você terá acesso a uma série de vantagens exclusivas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {beneficios.map((beneficio, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-xl p-6 border-2 hover:shadow-xl transition-all duration-300 cursor-pointer"
                style={{ borderColor: beneficio.cor.split(' ')[2]?.replace('border-', '') || '#e5e7eb' }}
              >
                <div className="flex items-start gap-4">
                  <div className={`${beneficio.cor.split(' ').slice(0, 2).join(' ')} p-4 rounded-xl flex-shrink-0 border-2`}
                    style={{ borderColor: beneficio.cor.split(' ')[2]?.replace('border-', '') || '#e5e7eb' }}
                  >
                    <beneficio.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {beneficio.titulo}
                      </h3>
                      <span className="text-sm font-semibold text-carrefour-blue">
                        {beneficio.valor}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {beneficio.descricao}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
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
            Continuar com a Ativação
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
