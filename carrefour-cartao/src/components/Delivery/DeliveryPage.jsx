import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import ProgressBar from '../Shared/ProgressBar';
import Logo from '../Shared/Logo';
import { Truck, Package, ArrowRight, CheckCircle } from 'lucide-react';

export default function DeliveryPage() {
  const navigate = useNavigate();
  const { formaEntrega, valorEntrega, setFormaEntrega, setEtapaAtual } = useUserStore();
  const [selecionado, setSelecionado] = useState(formaEntrega);

  const opcoesEntrega = [
    {
      id: 'carta-registrada',
      titulo: 'Carta Registrada',
      descricao: 'Entrega em até 15 dias úteis',
      preco: 25.50,
      icon: Package,
    },
    {
      id: 'sedex',
      titulo: 'Sedex Expresso',
      descricao: 'Entrega expressa em até 5 dias úteis',
      preco: 32.90,
      icon: Truck,
    },
  ];

  const handleSelecionar = (opcao) => {
    setSelecionado(opcao.id);
    setFormaEntrega(opcao.id, opcao.preco);
  };

  const handleContinuar = () => {
    if (selecionado) {
      setEtapaAtual('payment');
      navigate('/payment');
    }
  };

  const opcaoSelecionada = opcoesEntrega.find(o => o.id === selecionado);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        <ProgressBar etapaAtual="delivery" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mt-6 md:mt-12"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="text-center mb-6 md:mb-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-carrefour-blue/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Truck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-carrefour-blue" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3 px-2">
                Entrega do Cartão Físico
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 px-4">
                Escolha a forma de entrega do seu cartão Carrefour
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-6 md:mb-8">
              {opcoesEntrega.map((opcao) => {
                const Icon = opcao.icon;
                const isSelecionado = selecionado === opcao.id;
                
                return (
                  <motion.button
                    key={opcao.id}
                    onClick={() => handleSelecionar(opcao)}
                    className={`w-full p-4 sm:p-5 md:p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                      isSelecionado
                        ? 'border-carrefour-blue bg-carrefour-blue/5 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-carrefour-blue hover:bg-blue-50'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isSelecionado ? 'bg-carrefour-blue text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 flex-wrap">
                            <h3 className={`text-base sm:text-lg md:text-xl font-bold ${isSelecionado ? 'text-carrefour-blue' : 'text-gray-900'}`}>
                              {opcao.titulo}
                            </h3>
                            {isSelecionado && (
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-carrefour-blue flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {opcao.descricao}
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-2 sm:ml-4 flex-shrink-0">
                        <p className={`text-xl sm:text-2xl font-bold ${isSelecionado ? 'text-carrefour-blue' : 'text-gray-900'}`}>
                          R$ {opcao.preco.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Resumo se selecionado */}
            {opcaoSelecionada && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-carrefour-blue to-primary-dark rounded-xl p-4 sm:p-5 md:p-6 text-white mb-4 md:mb-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-white/90 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-1">
                      Forma de Entrega Selecionada
                    </p>
                    <p className="text-xl sm:text-2xl font-bold">{opcaoSelecionada.titulo}</p>
                    <p className="text-white/80 text-xs sm:text-sm mt-1">{opcaoSelecionada.descricao}</p>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className="text-2xl sm:text-3xl font-bold">R$ {opcaoSelecionada.preco.toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <button
              onClick={handleContinuar}
              disabled={!selecionado}
              className="w-full bg-carrefour-blue hover:bg-blue-700 text-white font-semibold text-base sm:text-lg py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
            >
              Continuar
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

