import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { consultarCPF, formatarCPF, limparCPF } from '../../services/api';
import ProgressBar from '../Shared/ProgressBar';
import Logo from '../Shared/Logo';
import { Loader2, CheckCircle, AlertCircle, Shield, Lock } from 'lucide-react';
import InputMask from 'react-input-mask';

export default function CPFConsultPage() {
  const navigate = useNavigate();
  const { setCPF, setDadosPessoais, setEtapaAtual } = useUserStore();
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dadosEncontrados, setDadosEncontrados] = useState(null);

  const handleConsultar = async () => {
    const cpfLimpo = limparCPF(cpf);
    
    if (cpfLimpo.length !== 11) {
      setError('CPF deve conter 11 dígitos');
      return;
    }

    setLoading(true);
    setError('');
    setDadosEncontrados(null);

    try {
      const dados = await consultarCPF(cpfLimpo);
      setCPF(cpfLimpo);
      
      // Salvar dados pessoais mesmo se vazios (permite continuar)
      setDadosPessoais({
        nomeCompleto: dados.nomeCompleto || '',
        nomeMae: dados.nomeMae || '',
        dataNascimento: dados.dataNascimento || '',
        email: dados.email || '',
      });
      
      // Verificar se há dados retornados
      if (dados.nomeCompleto || dados.dataNascimento) {
        // Dados encontrados com sucesso
        setDadosEncontrados(dados);
        setError(''); // Limpar qualquer erro anterior
      } else {
        // API respondeu mas sem dados
        setError('Não foi possível validar os dados automaticamente. Você pode continuar mesmo assim.');
        setDadosEncontrados(null);
      }
    } catch (err) {
      // Log do erro para debug
      console.error('Erro na consulta de CPF:', err);
      
      // Salvar CPF mesmo com erro (permite continuar)
      setCPF(cpfLimpo);
      
      // Mostrar mensagem de erro amigável
      const errorMessage = err.message || 'Não foi possível consultar os dados. Você pode continuar mesmo assim.';
      setError(errorMessage);
      setDadosEncontrados(null);
    } finally {
      setLoading(false);
    }
  };

  const handleContinuar = () => {
    setEtapaAtual('processing');
    navigate('/processing');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <ProgressBar etapaAtual="cpf" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mt-12"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-carrefour-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-carrefour-blue" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Validação de Dados
              </h2>
              <p className="text-gray-600 text-lg">
                Informe seu CPF para iniciarmos a análise de crédito
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Seus dados estão protegidos e criptografados</span>
              </div>
            </div>

            {!dadosEncontrados && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    CPF
                  </label>
                  <InputMask
                    mask="999.999.999-99"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-carrefour-blue focus:outline-none transition-colors text-2xl text-center tracking-widest font-mono"
                    placeholder="000.000.000-00"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 mb-6 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-amber-800 font-medium mb-1">{error}</p>
                      <p className="text-amber-700 text-sm">Não se preocupe, você pode continuar o cadastro normalmente.</p>
                    </div>
                  </motion.div>
                )}

                <button
                  onClick={handleConsultar}
                  disabled={loading || limparCPF(cpf).length !== 11}
                  className="w-full bg-carrefour-blue hover:bg-blue-700 text-white font-semibold text-lg py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Validando dados...
                    </>
                  ) : (
                    <>
                      Validar e Continuar
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              </>
            )}

            {dadosEncontrados && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-6">
                    Dados validados com sucesso
                  </h3>
                  <div className="text-left space-y-4 bg-white rounded-xl p-5 border border-gray-200">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Nome Completo</span>
                      <p className="font-semibold text-gray-900 text-lg mt-1">{dadosEncontrados.nomeCompleto}</p>
                    </div>
                    {dadosEncontrados.dataNascimento && (
                      <div className="border-t pt-4">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Data de Nascimento</span>
                        <p className="font-semibold text-gray-900 text-lg mt-1">{dadosEncontrados.dataNascimento}</p>
                      </div>
                    )}
                    {dadosEncontrados.nomeMae && (
                      <div className="border-t pt-4">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Nome da Mãe</span>
                        <p className="font-semibold text-gray-900 text-lg mt-1">{dadosEncontrados.nomeMae}</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleContinuar}
                  className="w-full bg-carrefour-blue hover:bg-blue-700 text-white font-semibold text-lg py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  Continuar Análise
                  <CheckCircle className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {error && !dadosEncontrados && !loading && (
              <div className="mt-4">
                <button
                  onClick={handleContinuar}
                  className="w-full border-2 border-carrefour-blue text-carrefour-blue hover:bg-carrefour-blue hover:text-white font-semibold text-lg py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Continuar Cadastro
                  <CheckCircle className="w-5 h-5" />
                </button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  Seus dados serão validados na próxima etapa
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
