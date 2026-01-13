import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { gerarPIX } from '../../services/pix';
import ProgressBar from '../Shared/ProgressBar';
import Logo from '../Shared/Logo';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, Copy, CheckCircle, Clock, Shield, CreditCard, Lock, ArrowRight } from 'lucide-react';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { 
    nomeCompleto,
    telefone,
    cpf,
    endereco,
    valorEntrega,
    setPixData,
    setEtapaAtual,
    pixCode,
    pixQrCode,
    transactionId
  } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [pixGerado, setPixGerado] = useState(!!pixCode);
  const [copiado, setCopiado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(30 * 60);

  useEffect(() => {
    if (!pixGerado) {
      handleGerarPIX();
    }
  }, []);

  useEffect(() => {
    if (pixGerado && tempoRestante > 0) {
      const timer = setInterval(() => {
        setTempoRestante((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [pixGerado, tempoRestante]);

  const handleGerarPIX = async () => {
    setLoading(true);
    try {
      const dadosPix = {
        amount: valorEntrega || 29.90,
        customer: {
          name: nomeCompleto || 'Cliente',
          email: '',
          phone: telefone.replace(/\D/g, ''),
          document: { number: cpf }
        },
        address: {
          street: endereco.logradouro,
          streetNumber: endereco.numero,
          complement: endereco.complemento,
          zipCode: endereco.cep,
          neighborhood: endereco.bairro,
          city: endereco.cidade,
          state: endereco.estado
        }
      };

      const resultado = await gerarPIX(dadosPix);
      setPixData(resultado.pixCode, resultado.qrCode, resultado.transactionId);
      setPixGerado(true);
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      alert('Erro ao gerar PIX. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopiarPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const formatarTempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleContinuar = () => {
    setEtapaAtual('virtual');
    navigate('/virtual');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        <ProgressBar etapaAtual="payment" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mt-6 md:mt-12"
        >
          <div className="text-center mb-6 md:mb-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-carrefour-blue/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-carrefour-blue" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-2">
              Pagamento da Entrega
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Realize o pagamento para ativar seu cartão virtual imediatamente e enviar o cartão físico
            </p>
          </div>

          {/* Valor */}
          <div className="bg-gradient-to-br from-carrefour-blue to-carrefour-purple rounded-2xl p-6 md:p-8 text-white text-center mb-4 md:mb-6 shadow-xl">
            <p className="text-white/90 mb-2 text-xs sm:text-sm font-semibold uppercase tracking-wide">Valor da Entrega</p>
            <p className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 md:mb-3">R$ {(valorEntrega || 29.90).toFixed(2).replace('.', ',')}</p>
            <p className="text-white/80 text-xs sm:text-sm">Ativação do cartão virtual • Entrega do cartão físico</p>
          </div>

          {/* Timer */}
          <div className="bg-carrefour-purple rounded-xl p-4 md:p-6 text-white text-center mb-6 md:mb-8 shadow-lg">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-2xl sm:text-3xl font-bold">{formatarTempo(tempoRestante)}</span>
            </div>
            <p className="text-xs sm:text-sm opacity-90">Tempo restante para realizar o pagamento</p>
          </div>

          {/* PIX */}
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12 text-center">
              <Loader2 className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-carrefour-blue animate-spin mx-auto mb-4 md:mb-6" />
              <p className="text-base sm:text-lg font-semibold text-gray-900">Gerando código PIX...</p>
              <p className="text-sm sm:text-base text-gray-600 mt-2">Aguarde alguns instantes</p>
            </div>
          ) : pixGerado && pixCode ? (
            <>
              {/* QR Code */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8 mb-4 md:mb-6">
                <div className="text-center mb-4 md:mb-6">
                  <CreditCard className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-carrefour-blue mx-auto mb-2 md:mb-3" />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Pagamento via PIX</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Escaneie o QR Code com o app do seu banco</p>
                </div>
                <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl flex justify-center mb-4 md:mb-6 border-2 border-gray-100">
                  <QRCodeSVG value={pixCode} size={240} level="H" className="w-full max-w-[240px] sm:max-w-[280px] h-auto" />
                </div>
              </div>

              {/* Código PIX */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8 mb-4 md:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 md:mb-4 text-center">
                  Ou copie o código PIX
                </h3>
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-5 mb-3 md:mb-4 border-2 border-gray-200">
                  <p className="text-xs text-gray-600 break-all font-mono leading-relaxed">
                    {pixCode.substring(0, window.innerWidth < 640 ? 50 : 100)}...
                  </p>
                </div>
                <button
                  onClick={handleCopiarPix}
                  className="w-full bg-carrefour-blue hover:bg-blue-700 text-white font-semibold text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3"
                >
                  {copiado ? (
                    <>
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Código Copiado com Sucesso!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                      Copiar Código PIX
                    </>
                  )}
                </button>
              </div>
            </>
          ) : null}

          {/* Benefícios do Pagamento */}
          <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4 sm:p-5 md:p-6 mb-4 md:mb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5 sm:mt-1" />
              <div>
                <p className="font-semibold text-green-900 mb-1 sm:mb-2 text-sm sm:text-base">Ativação Automática</p>
                <p className="text-xs sm:text-sm text-green-800 leading-relaxed">
                  Seu cartão virtual será ativado automaticamente assim que o pagamento for confirmado. 
                  Você poderá usar imediatamente após a confirmação.
                </p>
              </div>
            </div>
          </div>

          {/* Garantias de Segurança */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-5 md:p-6 mb-6 md:mb-8 border border-gray-200">
            <div className="flex items-center justify-center gap-2 text-gray-700 mb-3 md:mb-4">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-carrefour-blue" />
              <span className="font-semibold text-sm sm:text-base">Pagamento 100% Seguro</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-3 sm:gap-4 text-center text-xs sm:text-sm text-gray-600">
              <div>
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-2 text-carrefour-blue" />
                <p>Criptografia SSL</p>
              </div>
              <div>
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-2 text-carrefour-blue" />
                <p>Dados Protegidos</p>
              </div>
              <div>
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-2 text-carrefour-blue" />
                <p>Transação Segura</p>
              </div>
            </div>
          </div>

          {/* Botão Continuar */}
          <button
            onClick={handleContinuar}
            className="w-full border-2 border-carrefour-blue text-carrefour-blue hover:bg-carrefour-blue hover:text-white font-semibold text-base sm:text-lg py-4 sm:py-5 px-4 sm:px-6 md:px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3"
          >
            Já realizei o pagamento
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
