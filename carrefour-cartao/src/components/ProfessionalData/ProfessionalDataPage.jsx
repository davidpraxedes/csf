import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useAdminStore } from '../../store/adminStore';
import ProgressBar from '../Shared/ProgressBar';
import Logo from '../Shared/Logo';
import { Briefcase, DollarSign, ArrowRight, AlertCircle } from 'lucide-react';
import InputMask from 'react-input-mask';

export default function ProfessionalDataPage() {
  const navigate = useNavigate();
  const { setProfissao, setSalario, setEtapaAtual, profissao, salario } = useUserStore();

  const [profissaoLocal, setProfissaoLocal] = useState(profissao || '');
  const [salarioLocal, setSalarioLocal] = useState(salario || '');
  const [erro, setErro] = useState('');

  const profissoesComuns = [
    'Empregado CLT',
    'Autônomo',
    'Empresário',
    'Aposentado',
    'Pensionista',
    'Servidor Público',
    'Militar',
    'Profissional Liberal',
    'Estudante',
    'Desempregado',
    'Outro'
  ];

  const formatarSalario = (valor) => {
    // Remove tudo que não é número
    const numeros = valor.replace(/\D/g, '');

    if (!numeros) return '';

    // Converte para número e divide por 100 para ter decimais
    const valorFloat = parseFloat(numeros) / 100;

    // Formata com vírgula para decimais
    return valorFloat.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleSalarioChange = (e) => {
    const valor = e.target.value;
    const formatado = formatarSalario(valor);
    setSalarioLocal(formatado);
    setErro('');
  };

  const handleContinuar = () => {
    // Validações
    if (!profissaoLocal.trim()) {
      setErro('Por favor, informe sua profissão');
      return;
    }

    if (!salarioLocal.trim()) {
      setErro('Por favor, informe sua renda mensal');
      return;
    }

    // Salvar dados
    setProfissao(profissaoLocal);
    setSalario(salarioLocal);

    // Verificar se KYC está habilitado
    const { settings } = useAdminStore.getState(); // Fetch latest settings
    const kycEnabled = settings?.general?.kycEnabled !== false;

    if (kycEnabled) {
      setEtapaAtual('kyc');
      navigate('/kyc');
    } else {
      console.log('KYC desabilitado, pulando para processamento...');
      setEtapaAtual('processing');
      navigate('/processing');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <ProgressBar etapaAtual="professional-data" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mt-12"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-carrefour-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-carrefour-blue" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Dados Profissionais
              </h2>
              <p className="text-gray-600 text-lg">
                Precisamos de algumas informações para finalizar sua análise de crédito
              </p>
            </div>

            {erro && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{erro}</p>
              </motion.div>
            )}

            <div className="space-y-6">
              {/* Profissão */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline-block mr-2" />
                  Profissão / Ocupação
                </label>
                <select
                  value={profissaoLocal}
                  onChange={(e) => {
                    setProfissaoLocal(e.target.value);
                    setErro('');
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-carrefour-blue focus:ring-2 focus:ring-carrefour-blue/20 outline-none transition-all text-gray-900 bg-white"
                >
                  <option value="">Selecione sua profissão</option>
                  {profissoesComuns.map((prof) => (
                    <option key={prof} value={prof}>
                      {prof}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salário */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline-block mr-2" />
                  Renda Mensal
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    R$
                  </span>
                  <input
                    type="text"
                    value={salarioLocal}
                    onChange={handleSalarioChange}
                    placeholder="0,00"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-carrefour-blue focus:ring-2 focus:ring-carrefour-blue/20 outline-none transition-all text-gray-900 font-semibold"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Informe sua renda mensal bruta (salário + outros rendimentos)
                </p>
              </div>

              {/* Botão Continuar */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinuar}
                className="w-full bg-carrefour-blue hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl"
              >
                Continuar para Análise
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Informação de Segurança */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Suas informações são confidenciais e protegidas.</strong> Utilizamos criptografia de ponta para garantir a segurança dos seus dados.
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


