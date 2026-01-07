import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { consultarCEP } from '../../services/api';
import ProgressBar from '../Shared/ProgressBar';
import Logo from '../Shared/Logo';
import InputMask from 'react-input-mask';
import { Loader2, CheckCircle, ArrowRight, Phone, MapPin, Calendar, Lock } from 'lucide-react';

export default function FormsPage() {
  const navigate = useNavigate();
  const {
    telefone,
    email,
    endereco,
    dataVencimento,
    setTelefone,
    setEmail,
    setEndereco,
    setDataVencimento,
    setEtapaAtual
  } = useUserStore();

  const [step, setStep] = useState(1);
  const [loadingCEP, setLoadingCEP] = useState(false);

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const datasVencimento = ['5', '10', '15', '20', '25', '30'];

  const handleBuscarCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    console.log('🏠 [FormsPage] handleBuscarCEP chamado com CEP:', cepLimpo);

    if (cepLimpo.length !== 8) {
      console.log('⚠️ [FormsPage] CEP incompleto, aguardando mais dígitos...');
      return;
    }

    console.log('⏳ [FormsPage] Iniciando busca de CEP...');
    setLoadingCEP(true);

    try {
      console.log('📞 [FormsPage] Chamando consultarCEP...');
      const dados = await consultarCEP(cepLimpo);

      console.log('✅ [FormsPage] CEP consultado com sucesso:', dados);

      setEndereco({
        ...endereco,
        ...dados,
        cep: cepLimpo
      });

      console.log('💾 [FormsPage] Endereço atualizado no state');

      // Disparar InitiateCheckout do Facebook Pixel quando CEP for preenchido
      const { trackInitiateCheckout } = await import('../../services/facebookPixel');
      trackInitiateCheckout();
      console.log('📊 [FormsPage] Facebook Pixel InitiateCheckout disparado');
    } catch (error) {
      console.error('❌ [FormsPage] Erro ao buscar CEP:', error);
      alert(`Erro ao buscar CEP: ${error.message}`);
    } finally {
      setLoadingCEP(false);
      console.log('🏁 [FormsPage] Busca de CEP finalizada');
    }
  };

  const handleContinuar = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setEtapaAtual('contract');
      navigate('/contract');
    }
  };

  const canContinue = () => {
    if (step === 1) return telefone.length >= 10 && email.includes('@') && email.includes('.');
    if (step === 2) {
      return endereco.cep && endereco.logradouro && endereco.numero &&
        endereco.bairro && endereco.cidade && endereco.estado;
    }
    if (step === 3) return dataVencimento;
    return false;
  };

  const steps = [
    { number: 1, title: 'Contato', icon: Phone },
    { number: 2, title: 'Endereço', icon: MapPin },
    { number: 3, title: 'Vencimento', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <ProgressBar etapaAtual="forms" />

        {/* Steps Indicator */}
        <div className="max-w-2xl mx-auto mt-4 md:mt-8 mb-6 md:mb-8">
          <div className="flex items-center justify-between px-2">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all ${step >= s.number
                    ? 'bg-carrefour-blue border-carrefour-blue text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                    {step > s.number ? (
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <s.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-semibold text-center ${step >= s.number ? 'text-carrefour-blue' : 'text-gray-400'}`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 sm:mx-2 ${step > s.number ? 'bg-carrefour-blue' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8 lg:p-10">
            {/* Step 1: Telefone */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6 md:mb-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-carrefour-blue/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Phone className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-carrefour-blue" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3 px-2">
                    Dados de Contato
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 px-4">
                    Informe seu telefone para contato e confirmações
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">
                    Email Pessoal
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-carrefour-blue focus:outline-none transition-colors text-base sm:text-lg mb-4"
                    placeholder="seu@email.com"
                  />

                  <label className="block text-sm font-semibold text-gray-700 mb-2 md:mb-3">
                    Telefone/WhatsApp
                  </label>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-carrefour-blue focus:outline-none transition-colors text-base sm:text-lg"
                    placeholder="(00) 00000-0000"
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Seus dados estão protegidos
                  </p>
                </div>

                <button
                  onClick={handleContinuar}
                  disabled={!canContinue()}
                  className="w-full bg-carrefour-blue hover:bg-blue-700 text-white font-semibold text-base sm:text-lg py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Endereço */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="text-center mb-6 md:mb-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-carrefour-blue/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <MapPin className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-carrefour-blue" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3 px-2">
                    Endereço de Entrega
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 px-4">
                    Onde você deseja receber seu cartão físico
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CEP
                    </label>
                    <div className="relative">
                      <InputMask
                        mask="99999-999"
                        value={endereco.cep}
                        onChange={(e) => {
                          const novoCep = e.target.value.replace(/\D/g, '');
                          setEndereco({ ...endereco, cep: novoCep });
                          if (novoCep.length === 8) {
                            handleBuscarCEP(novoCep);
                          }
                        }}
                        className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-carrefour-blue focus:outline-none transition-colors text-base"
                        placeholder="00000-000"
                      />
                      {loadingCEP && (
                        <div className="absolute right-4 top-0 bottom-0 flex items-center justify-center pointer-events-none">
                          <Loader2 className="w-5 h-5 text-carrefour-blue animate-spin" />
                        </div>
                      )}
                      {endereco.cep.length === 8 && !loadingCEP && endereco.logradouro && (
                        <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={endereco.logradouro}
                      onChange={(e) => setEndereco({ ...endereco, logradouro: e.target.value })}
                      className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-carrefour-blue focus:outline-none transition-colors text-base"
                      placeholder="Rua, Avenida..."
                      disabled={loadingCEP}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Número
                      </label>
                      <input
                        type="text"
                        value={endereco.numero}
                        onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
                        className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-carrefour-blue focus:outline-none transition-colors text-base"
                        placeholder="123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Complemento <span className="text-gray-400 font-normal">(opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={endereco.complemento}
                        onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
                        className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-carrefour-blue focus:outline-none transition-colors text-base"
                        placeholder="Apto, Casa..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={endereco.bairro}
                      onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
                      className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-carrefour-blue focus:outline-none transition-colors text-base"
                      placeholder="Bairro"
                      disabled={loadingCEP}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={endereco.cidade}
                        onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })}
                        className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-carrefour-blue focus:outline-none transition-colors text-base"
                        placeholder="Cidade"
                        disabled={loadingCEP}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Estado
                      </label>
                      <select
                        value={endereco.estado}
                        onChange={(e) => setEndereco({ ...endereco, estado: e.target.value })}
                        className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-carrefour-blue focus:outline-none transition-colors text-base"
                        disabled={loadingCEP}
                      >
                        <option value="">Selecione</option>
                        {estados.map(estado => (
                          <option key={estado} value={estado}>{estado}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 md:mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="w-full sm:flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-base sm:text-lg py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleContinuar}
                    disabled={!canContinue()}
                    className="w-full sm:flex-1 bg-carrefour-blue hover:bg-blue-700 text-white font-semibold text-base sm:text-lg py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Data de Vencimento */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="text-center mb-6 md:mb-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-carrefour-blue/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Calendar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-carrefour-blue" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3 px-2">
                    Data de Vencimento da Fatura
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 px-4">
                    Escolha o melhor dia do mês para o vencimento da sua fatura
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-6 md:mb-8">
                  {datasVencimento.map((dia) => (
                    <button
                      key={dia}
                      onClick={() => setDataVencimento(dia)}
                      className={`w-full p-4 sm:p-4.5 md:p-5 rounded-xl border-2 transition-all duration-300 text-left ${dataVencimento === dia
                        ? 'border-carrefour-blue bg-carrefour-blue text-white shadow-lg'
                        : 'border-gray-200 bg-gray-50 hover:border-carrefour-blue hover:bg-blue-50'
                        }`}
                    >
                      <span className="font-semibold text-base sm:text-lg">Dia {dia} de cada mês</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="w-full sm:flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-base sm:text-lg py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleContinuar}
                    disabled={!canContinue()}
                    className="w-full sm:flex-1 bg-carrefour-blue hover:bg-blue-700 text-white font-semibold text-base sm:text-lg py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
                  >
                    Finalizar
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
