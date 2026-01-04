import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import ProgressBar from '../Shared/ProgressBar';
import Logo from '../Shared/Logo';
import CardDesign from '../Shared/CardDesign';
import { Eye, EyeOff, Download, CreditCard, CheckCircle, Package, ArrowRight, Shield, Lock } from 'lucide-react';
import { useState } from 'react';

export default function VirtualCardPage() {
  const navigate = useNavigate();
  const { 
    nomeCompleto,
    numeroCartao,
    cvv,
    validade,
    limite,
    setEtapaAtual
  } = useUserStore();

  const [mostrarCvv, setMostrarCvv] = useState(false);
  const [mostrarNumero, setMostrarNumero] = useState(false);

  const handleContinuar = () => {
    setEtapaAtual('confirmation');
    navigate('/confirmation');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <ProgressBar etapaAtual="virtual" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto mt-12"
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cartão Virtual Ativado
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Seu cartão está pronto para uso. Utilize-o imediatamente para compras online e pagamentos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Card Preview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardDesign
                nome={nomeCompleto || 'SEU NOME'}
                numero={mostrarNumero ? numeroCartao : '5442 34•• •••• ••••'}
                validade={validade}
                cvv={mostrarCvv ? cvv : null}
                mostrarCvv={mostrarCvv}
              />
            </motion.div>

            {/* Informações */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Limite */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-xl">
                <p className="text-white/90 mb-2 text-sm font-semibold uppercase tracking-wide">Limite Disponível</p>
                <p className="text-5xl font-bold mb-4">R$ {limite}</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold text-sm">Cartão ativo e pronto para uso</span>
                </div>
              </div>

              {/* Informações do Cartão */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-carrefour-blue" />
                  Dados do Cartão
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Número do Cartão</p>
                      <p className="font-mono text-lg font-semibold text-gray-900">
                        {mostrarNumero ? numeroCartao : '5442 34•• •••• ••••'}
                      </p>
                    </div>
                    <button
                      onClick={() => setMostrarNumero(!mostrarNumero)}
                      className="text-carrefour-blue hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      {mostrarNumero ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">CVV</p>
                      <p className="font-mono text-lg font-semibold text-gray-900">
                        {mostrarCvv ? cvv : '•••'}
                      </p>
                    </div>
                    <button
                      onClick={() => setMostrarCvv(!mostrarCvv)}
                      className="text-carrefour-blue hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      {mostrarCvv ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Validade</p>
                    <p className="font-semibold text-lg text-gray-900">{validade}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Status */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-7 h-7 text-green-600" />
                <span className="font-bold text-green-900 text-lg">Cartão Virtual: ATIVO</span>
              </div>
              <p className="text-sm text-green-800 leading-relaxed">
                Seu cartão virtual está ativo e pode ser utilizado imediatamente para compras online e pagamentos digitais.
              </p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Package className="w-7 h-7 text-blue-600" />
                <span className="font-bold text-blue-900 text-lg">Cartão Físico: Em Produção</span>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                Seu cartão físico está sendo produzido e será enviado por SEDEX. Chegará em 5-7 dias úteis.
              </p>
            </div>
          </div>

          {/* Segurança */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
            <div className="flex items-center justify-center gap-2 text-gray-700 mb-4">
              <Shield className="w-5 h-5 text-carrefour-blue" />
              <span className="font-semibold">Seus dados estão protegidos</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-center text-sm text-gray-600">
              <div>
                <Lock className="w-5 h-5 mx-auto mb-2 text-carrefour-blue" />
                <p>Criptografia de ponta a ponta</p>
              </div>
              <div>
                <Shield className="w-5 h-5 mx-auto mb-2 text-carrefour-blue" />
                <p>Conformidade LGPD</p>
              </div>
              <div>
                <CheckCircle className="w-5 h-5 mx-auto mb-2 text-carrefour-blue" />
                <p>Transações seguras</p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinuar}
            className="w-full bg-carrefour-blue hover:bg-blue-700 text-white font-semibold text-lg py-5 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            Finalizar Ativação
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
