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

  // Verificar localStorage ao carregar
  useEffect(() => {
    const pixSalvo = localStorage.getItem('pix_data');
    if (pixSalvo) {
      try {
        const dados = JSON.parse(pixSalvo);
        const agora = new Date().getTime();
        const expiraEm = new Date(dados.expiresAt).getTime();
        
        // Verificar se ainda não expirou (com margem de 1 minuto)
        if (expiraEm > agora + 60000) {
          console.log('Reutilizando PIX salvo do localStorage');
          setPixData(dados.pixCode, dados.pixQrCode, dados.transactionId);
          setPixGerado(true);
          
          // Calcular tempo restante
          const diferenca = Math.max(0, Math.floor((expiraEm - agora) / 1000));
          setTempoRestante(diferenca);
          return; // Não gerar novo PIX
        } else {
          // PIX expirado, remover do localStorage
          localStorage.removeItem('pix_data');
        }
      } catch (e) {
        console.error('Erro ao ler PIX do localStorage:', e);
        localStorage.removeItem('pix_data');
      }
    }

    // Se não tem PIX salvo ou expirou, gerar novo
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
      
      // Calcular tempo de expiração
      const expiresAt = resultado.expiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString();
      const expiraEm = new Date(expiresAt).getTime();
      const agora = new Date().getTime();
      const diferenca = Math.max(0, Math.floor((expiraEm - agora) / 1000));
      setTempoRestante(diferenca);
      
      // Salvar no localStorage para reutilizar ao recarregar
      localStorage.setItem('pix_data', JSON.stringify({
        pixCode: resultado.pixCode,
        pixQrCode: resultado.qrCode,
        transactionId: resultado.transactionId,
        expiresAt: expiresAt,
        valor: dadosPix.amount
      }));
      
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
          className="max-w-2xl mx-auto mt-6 md:mt-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-carrefour-blue to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Finalize seu Pagamento
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
              Complete o pagamento para ativar seu cartão Carrefour
            </p>
          </div>

          {/* PIX */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
              <Loader2 className="w-16 h-16 text-carrefour-blue animate-spin mx-auto mb-6" />
              <p className="text-lg font-semibold text-gray-900 mb-2">Gerando código PIX...</p>
              <p className="text-sm text-gray-600">Aguarde alguns instantes</p>
            </div>
          ) : pixGerado && pixCode ? (
            <>
              {/* Timer de Expiração - Verde para urgência */}
              {tempoRestante > 0 && (
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-5 sm:p-6 text-white mb-6 shadow-lg">
                  <div className="flex items-center justify-center gap-4">
                    <Clock className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse flex-shrink-0" />
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-white/90 mb-1">Tempo restante para pagamento</p>
                      <p className="text-4xl sm:text-5xl font-bold font-mono tracking-wider">
                        {formatarTempo(tempoRestante)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Código PIX - PRIMEIRO (prioridade mobile) */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-carrefour-blue/10 rounded-full mb-4">
                    <CreditCard className="w-7 h-7 text-carrefour-blue" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Pagamento via PIX</h3>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-sm text-gray-600">Valor a pagar:</span>
                    <span className="text-xl font-bold text-carrefour-blue">R$ {(valorEntrega || 25.50).toFixed(2).replace('.', ',')}</span>
                  </div>
                  <p className="text-sm text-gray-600">Copie o código abaixo e cole no app do seu banco</p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 sm:p-5 mb-4 border-2 border-dashed border-carrefour-blue/30">
                  <p className="text-sm sm:text-base text-gray-900 break-all font-mono leading-relaxed select-all text-center">
                    {pixCode}
                  </p>
                </div>
                
                <button
                  onClick={handleCopiarPix}
                  className="w-full bg-carrefour-blue hover:bg-blue-700 text-white font-semibold text-base sm:text-lg py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  {copiado ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Código Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copiar Código PIX
                    </>
                  )}
                </button>
              </div>

              {/* QR Code - EXPANSÍVEL */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
                <button
                  onClick={() => setQrCodeExpandido(!qrCodeExpandido)}
                  className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-carrefour-blue/10 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-carrefour-blue" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">QR Code para Escanear</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Clique para {qrCodeExpandido ? 'ocultar' : 'mostrar'} o QR Code</p>
                    </div>
                  </div>
                  {qrCodeExpandido ? (
                    <ChevronUp className="w-5 h-5 text-carrefour-blue" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-carrefour-blue" />
                  )}
                </button>
                
                {qrCodeExpandido && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-5"
                  >
                    <div className="bg-white p-6 rounded-lg flex justify-center border-2 border-carrefour-blue/20">
                      <QRCodeSVG value={pixCode} size={260} level="H" className="w-full max-w-[260px] h-auto" />
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-3">
                      Escaneie com o app do seu banco
                    </p>
                  </motion.div>
                )}
              </div>
            </>
          ) : null}

          {/* Informação sobre Ativação */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-carrefour-blue/20 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-carrefour-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-carrefour-blue" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2 text-base">Ativação Imediata</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Após a confirmação do pagamento, seu cartão virtual será ativado automaticamente. 
                  O cartão físico será enviado para o endereço cadastrado.
                </p>
              </div>
            </div>
          </div>

          {/* Garantias de Segurança */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
            <div className="flex items-center justify-center gap-2 text-gray-700 mb-4">
              <Shield className="w-5 h-5 text-carrefour-blue" />
              <span className="font-semibold text-base">Pagamento 100% Seguro</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
              <div>
                <Lock className="w-5 h-5 mx-auto mb-2 text-carrefour-blue" />
                <p className="text-xs">Criptografia SSL</p>
              </div>
              <div>
                <Shield className="w-5 h-5 mx-auto mb-2 text-carrefour-blue" />
                <p className="text-xs">Dados Protegidos</p>
              </div>
              <div>
                <CheckCircle className="w-5 h-5 mx-auto mb-2 text-carrefour-blue" />
                <p className="text-xs">Transação Segura</p>
              </div>
            </div>
          </div>

          {/* Botão Continuar */}
          <div className="space-y-3">
            <button
              onClick={handleContinuar}
              className="w-full bg-gradient-to-r from-carrefour-blue to-primary-dark hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg py-5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              Finalizar Ativação
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-sm text-gray-500">
              Após o pagamento, você receberá a confirmação e poderá acessar seu cartão virtual
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
