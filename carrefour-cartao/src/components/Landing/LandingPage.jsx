import { motion } from 'framer-motion';
import { Shield, Lock, Award, CheckCircle, ArrowRight, Building2 } from 'lucide-react';
import Logo from '../Shared/Logo';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const garantias = [
    { icon: Shield, text: 'Segurança Bancária', subtext: 'Proteção total dos seus dados' },
    { icon: Lock, text: 'LGPD Compliant', subtext: 'Seus dados protegidos por lei' },
    { icon: Award, text: 'Aprovado pelo Banco Central', subtext: 'Instituição regulamentada' },
    { icon: Building2, text: 'Carrefour Soluções Financeiras', subtext: 'Credibilidade e confiança' }
  ];

  const beneficios = [
    { 
      title: 'Análise Prévia Automatizada',
      description: 'Sistema inteligente que avalia seu perfil sem consultar SPC/Serasa'
    },
    { 
      title: 'Limite Pré-Aprovado',
      description: 'Até R$ 5.000,00 de limite disponível conforme seu perfil'
    },
    { 
      title: 'Cashback Exclusivo',
      description: '5% de volta em todas as compras realizadas no Carrefour'
    },
    { 
      title: 'Ativação Imediata',
      description: 'Cartão virtual liberado instantaneamente após aprovação'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Profissional */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>Conexão Segura</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section Profissional */}
      <section className="bg-gradient-to-br from-carrefour-blue via-blue-700 to-carrefour-purple text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
              <CheckCircle className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Aprovação disponível mesmo com restrições</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 leading-tight px-2">
              Cartão de Crédito Carrefour
              <br />
              <span className="text-white/90 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold">
                Solução completa para suas necessidades financeiras
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Aprovação rápida e descomplicada. Mesmo com restrições cadastrais, 
              você pode ter acesso a crédito com condições especiais.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/quiz')}
              className="btn-shine relative bg-green-500 hover:bg-green-600 text-white font-bold text-base sm:text-lg px-6 py-3.5 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-green-500/50 inline-flex items-center gap-2 z-0"
            >
              <span className="relative z-10">Iniciar Solicitação</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Garantias e Segurança */}
      <section className="bg-gray-50 py-8 md:py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {garantias.map((garantia, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-carrefour-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <garantia.icon className="w-6 h-6 text-carrefour-blue" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{garantia.text}</h3>
                <p className="text-sm text-gray-600">{garantia.subtext}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios Detalhados */}
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-3 md:mb-4 px-2">
              Vantagens Exclusivas do Cartão Carrefour
            </h2>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-8 md:mb-12 px-4">
              Conheça os benefícios pensados para atender suas necessidades
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {beneficios.map((beneficio, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-carrefour-blue rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{beneficio.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{beneficio.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Profissional */}
      <section className="bg-gradient-to-r from-carrefour-blue to-carrefour-purple py-10 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <Award className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 text-white/90" />
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 px-2">
              Mais de 500 mil clientes aprovados
            </h3>
            <p className="text-base sm:text-lg text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Junte-se a milhares de pessoas que conquistaram acesso ao crédito 
              mesmo com restrições cadastrais. Aprovação rápida e descomplicada.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/quiz')}
              className="bg-white text-carrefour-blue hover:bg-gray-50 font-semibold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl inline-flex items-center gap-2"
            >
              Solicitar Cartão Agora
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer Profissional */}
      <footer className="bg-gray-900 text-gray-400 py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            <div>
              <h4 className="text-white font-semibold mb-2 md:mb-3 text-sm md:text-base">Sobre</h4>
              <p className="text-xs sm:text-sm">
                Cartão de Crédito Carrefour - Banco CSF S.A.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2 md:mb-3 text-sm md:text-base">Segurança</h4>
              <p className="text-xs sm:text-sm">
                Site 100% seguro • Dados protegidos • LGPD Compliant
              </p>
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <h4 className="text-white font-semibold mb-2 md:mb-3 text-sm md:text-base">Regulamentação</h4>
              <p className="text-xs sm:text-sm">
                Instituição autorizada pelo Banco Central do Brasil
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-4 md:pt-6 text-center text-xs sm:text-sm space-y-2">
            <p>© 2025 Banco CSF S.A. CNPJ 08.357.240/0001-50</p>
            <p className="text-gray-500 px-2">
              Av. Doutora Ruth Cardoso, nº 4.777 – 2º andar – Edifício Villa Lobos – Jardim Universidade Pinheiros – São Paulo – SP – CEP: 05477-903
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
