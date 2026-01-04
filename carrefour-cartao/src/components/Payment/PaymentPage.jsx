import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { gerarPIX } from '../../services/pix';
import { trackPurchase } from '../../services/facebookPixel';
import ProgressBar from '../Shared/ProgressBar';
import Logo from '../Shared/Logo';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, Copy, CheckCircle, Shield, CreditCard, Lock, ArrowRight, ChevronDown, ChevronUp, Clock } from 'lucide-react';

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
  const [qrCodeExpandido, setQrCodeExpandido] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(30 * 60); // 30 minutos em segundos

  useEffect(() => {
    if (!pixGerado && transactionId) {
      // Tentar reutilizar transação existente
      handleGerarPIX();
    } else if (!pixGerado) {
      handleGerarPIX();
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (pixGerado && tempoRestante > 0) {
      const interval = setInterval(() => {
        setTempoRestante((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [pixGerado, tempoRestante]);

  // Formatar tempo restante
  const formatarTempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
  };

  const handleGerarPIX = async () => {
    setLoading(true);
    try {
      const dadosPix = {
        amount: valorEntrega || 25.50, // Valor padrão atualizado
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

      // Verificar se já existe transação antes de criar nova (evita duplicação)
      const resultado = await gerarPIX(dadosPix, transactionId);
      setPixData(resultado.pixCode, resultado.qrCode, resultado.transactionId);
      setPixGerado(true);
      
      // Iniciar timer de 30 minutos
      if (resultado.expiresAt) {
        const expiraEm = new Date(resultado.expiresAt).getTime();
        const agora = new Date().getTime();
        const diferenca = Math.max(0, Math.floor((expiraEm - agora) / 1000));
        setTempoRestante(diferenca);
      } else {
        setTempoRestante(30 * 60); // 30 minutos padrão
      }
      
      // Disparar evento Purchase do Facebook Pixel quando PIX for gerado
      trackPurchase(dadosPix.amount, 'BRL', resultado.transactionId);
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
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-2">
              Finalize seu Cadastro
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Complete a ativação do seu cartão Carrefour e receba seu cartão físico em casa
            </p>
          </div>

          {/* Informações Importantes */}
          <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4 sm:p-5 md:p-6 mb-6 md:mb-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5 sm:mt-1" />
              <div>
                <p className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">O que está incluído:</p>
                <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Ativação imediata do cartão virtual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Envio do cartão físico para seu endereço</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Sem anuidade no primeiro ano</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Taxa única - sem mensalidades</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* PIX */}
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12 text-center">
              <Loader2 className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-green-600 animate-spin mx-auto mb-4 md:mb-6" />
              <p className="text-base sm:text-lg font-semibold text-gray-900">Gerando código PIX...</p>
              <p className="text-sm sm:text-base text-gray-600 mt-2">Aguarde alguns instantes</p>
            </div>
          ) : pixGerado && pixCode ? (
            <>
              {/* Timer de Expiração */}
              {tempoRestante > 0 && (
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-4 sm:p-6 md:p-8 text-white mb-4 md:mb-6 shadow-xl">
                  <div className="flex items-center justify-center gap-3 sm:gap-4">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 animate-pulse" />
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-white/90 mb-1">Tempo restante para pagamento</p>
                      <p className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono">
                        {formatarTempo(tempoRestante)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Código PIX - PRIMEIRO (prioridade mobile) */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8 mb-4 md:mb-6">
                <div className="text-center mb-4">
                  <CreditCard className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-green-600 mx-auto mb-2 md:mb-3" />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Pagamento via PIX</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">Copie o código PIX e cole no app do seu banco</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                    <span className="text-xs sm:text-sm">Valor:</span>
                    <span className="font-semibold text-green-600">R$ {(valorEntrega || 25.50).toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-5 mb-3 md:mb-4 border-2 border-green-200">
                  <p className="text-xs sm:text-sm text-gray-800 break-all font-mono leading-relaxed select-all">
                    {pixCode}
                  </p>
                </div>
                
                <button
                  onClick={handleCopiarPix}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3"
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

              {/* QR Code - EXPANSÍVEL */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-4 md:mb-6 overflow-hidden">
                <button
                  onClick={() => setQrCodeExpandido(!qrCodeExpandido)}
                  className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    <div className="text-left">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">QR Code para Escanear</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Clique para {qrCodeExpandido ? 'ocultar' : 'mostrar'} o QR Code</p>
                    </div>
                  </div>
                  {qrCodeExpandido ? (
                    <ChevronUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-green-600" />
                  )}
                </button>
                
                {qrCodeExpandido && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 sm:px-6 pb-4 sm:pb-6"
                  >
                    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl flex justify-center border-2 border-green-100">
                      <QRCodeSVG value={pixCode} size={240} level="H" className="w-full max-w-[240px] sm:max-w-[280px] h-auto" />
                    </div>
                    <p className="text-center text-xs sm:text-sm text-gray-600 mt-3">
                      Escaneie com o app do seu banco
                    </p>
                  </motion.div>
                )}
              </div>
            </>
          ) : null}

          {/* Informação sobre Ativação */}
          <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4 sm:p-5 md:p-6 mb-4 md:mb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5 sm:mt-1" />
              <div>
                <p className="font-semibold text-green-900 mb-1 sm:mb-2 text-sm sm:text-base">Ativação Imediata</p>
                <p className="text-xs sm:text-sm text-green-800 leading-relaxed">
                  Após a confirmação do pagamento, seu cartão virtual será ativado automaticamente e você poderá começar a usar imediatamente. 
                  O cartão físico será enviado para o endereço cadastrado.
                </p>
              </div>
            </div>
          </div>

          {/* Garantias de Segurança */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-5 md:p-6 mb-6 md:mb-8 border border-gray-200">
            <div className="flex items-center justify-center gap-2 text-gray-700 mb-3 md:mb-4">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="font-semibold text-sm sm:text-base">Pagamento 100% Seguro</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-3 sm:gap-4 text-center text-xs sm:text-sm text-gray-600">
              <div>
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-2 text-green-600" />
                <p>Criptografia SSL</p>
              </div>
              <div>
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-2 text-green-600" />
                <p>Dados Protegidos</p>
              </div>
              <div>
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-2 text-green-600" />
                <p>Transação Segura</p>
              </div>
            </div>
          </div>

          {/* Botão Continuar */}
          <div className="space-y-3">
            <button
              onClick={handleContinuar}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-base sm:text-lg py-4 sm:py-5 px-4 sm:px-6 md:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3"
            >
              Finalizar Ativação
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <p className="text-center text-xs sm:text-sm text-gray-500">
              Após o pagamento, você receberá a confirmação e poderá acessar seu cartão virtual
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
