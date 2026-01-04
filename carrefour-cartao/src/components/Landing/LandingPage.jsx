import { motion } from 'framer-motion';
import { Shield, Lock, Award, CheckCircle, ArrowRight, Building2, CreditCard, TrendingUp, Zap, Users, Star, Clock, ShoppingBag, Smartphone, Wallet, DollarSign, Gift, Percent, Phone, Mail, MapPin, FileText, HelpCircle } from 'lucide-react';
import Logo from '../Shared/Logo';
import CardDesign from '../Shared/CardDesign';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { trackPageView } from '../../services/facebookPixel';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Disparar PageView do Facebook Pixel
  useEffect(() => {
    trackPageView();
  }, []);

  // Efeito de parallax no cartão
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const badges = [
    { icon: CheckCircle, text: 'Sem consulta ao SPC/Serasa', color: 'green' },
    { icon: Clock, text: 'Aprovação em até 5 minutos', color: 'blue' },
    { icon: Zap, text: 'Cartão virtual liberado na hora', color: 'yellow' },
    { icon: Users, text: 'Mais de 500 mil aprovados', color: 'purple' }
  ];

  const garantias = [
    { icon: Shield, text: 'Segurança Bancária', subtext: 'Proteção total dos seus dados' },
    { icon: Lock, text: 'LGPD Compliant', subtext: 'Seus dados protegidos por lei' },
    { icon: Award, text: 'Aprovado pelo Banco Central', subtext: 'Instituição regulamentada' },
    { icon: Building2, text: 'Carrefour Soluções Financeiras', subtext: 'Credibilidade e confiança' }
  ];

  const beneficios = [
    { 
      icon: TrendingUp,
      title: 'Análise Prévia Automatizada',
      description: 'Sistema inteligente que avalia seu perfil sem consultar SPC/Serasa'
    },
    { 
      icon: CreditCard,
      title: 'Limite de até R$ 5.500,00',
      description: 'Limite que pode chegar até R$ 5.500,00 conforme análise do seu perfil',
      highlight: 'Até R$ 5.500'
    },
    { 
      icon: Star,
      title: 'Cashback Exclusivo',
      description: '5% de volta em todas as compras realizadas no Carrefour',
      highlight: '5%'
    },
    { 
      icon: Zap,
      title: 'Ativação Imediata',
      description: 'Cartão virtual liberado instantaneamente após aprovação'
    }
  ];

  const servicos = [
    { icon: ShoppingBag, title: 'Compras no Carrefour', description: 'Aproveite descontos exclusivos e cashback em todas as compras' },
    { icon: Smartphone, title: 'Cartão Virtual', description: 'Pague suas compras online usando apenas o celular. É mais prático e seguro!' },
    { icon: Wallet, title: 'Sem Anuidade', description: 'É só usar uma vez por mês em qualquer Carrefour e pronto: zerou a anuidade.' }
  ];

  const vantagens = [
    { icon: DollarSign, title: 'Sem Anuidade', description: 'Use uma vez por mês no Carrefour e zere a anuidade' },
    { icon: Percent, title: 'Cashback de 5%', description: 'Ganhe dinheiro de volta em todas as compras' },
    { icon: Gift, title: 'Descontos Exclusivos', description: 'Aproveite ofertas especiais para portadores do cartão' },
    { icon: CreditCard, title: 'Limite até R$ 5.500', description: 'Limite que pode chegar até R$ 5.500,00 conforme análise do seu perfil' },
    { icon: Smartphone, title: 'App Carrefour', description: 'Gerencie seu cartão pelo aplicativo' },
    { icon: Shield, title: 'Segurança Total', description: 'Proteção contra fraudes e compras não autorizadas' }
  ];

  const formasPagamento = [
    { icon: Smartphone, title: 'Cartão Virtual', description: 'Pague compras online com segurança usando apenas o celular' },
    { icon: CreditCard, title: 'Contactless', description: 'Tecnologia de pagamento por aproximação para mais praticidade' },
    { icon: Wallet, title: 'QR Code', description: 'Pague suas compras usando QR Code com seu Cartão Carrefour' },
    { icon: Smartphone, title: 'Carteiras Digitais', description: 'Use Apple Pay, Google Pay e outras carteiras digitais' }
  ];

  const depoimentos = [
    { nome: 'Maria Silva', tempo: 'há 2 minutos', texto: 'Aprovado! Limite de R$ 3.200 liberado!', cidade: 'São Paulo - SP' },
    { nome: 'João Santos', tempo: 'há 5 minutos', texto: 'Cartão aprovado mesmo estando negativado!', cidade: 'Rio de Janeiro - RJ' },
    { nome: 'Ana Costa', tempo: 'há 8 minutos', texto: 'Processo super rápido, já estou usando!', cidade: 'Belo Horizonte - MG' },
    { nome: 'Carlos Oliveira', tempo: 'há 12 minutos', texto: 'Não acreditei quando fui aprovado!', cidade: 'Curitiba - PR' },
    { nome: 'Fernanda Lima', tempo: 'há 15 minutos', texto: 'Melhor cartão que já tive!', cidade: 'Porto Alegre - RS' },
    { nome: 'Roberto Souza', tempo: 'há 18 minutos', texto: 'Cashback já está rendendo!', cidade: 'Salvador - BA' }
  ];

  const perguntasFrequentes = [
    { pergunta: 'Como solicitar o Cartão Carrefour?', resposta: 'É simples! Preencha o formulário online, aguarde a análise e receba seu cartão aprovado.' },
    { pergunta: 'Preciso ter conta no Carrefour?', resposta: 'Não é necessário ter conta. O cartão pode ser solicitado por qualquer pessoa.' },
    { pergunta: 'Qual o limite do cartão?', resposta: 'O limite varia conforme seu perfil, podendo chegar até R$ 5.500,00.' },
    { pergunta: 'Há cobrança de anuidade?', resposta: 'Não! Use o cartão uma vez por mês em qualquer loja Carrefour e a anuidade é zerada.' },
    { pergunta: 'Como funciona o cashback?', resposta: 'Você ganha 5% de volta em todas as compras realizadas no Carrefour.' },
    { pergunta: 'O cartão funciona para negativados?', resposta: 'Sim! Não consultamos SPC/Serasa na aprovação. Mesmo com restrições, você pode ser aprovado.' }
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

      {/* Hero Section - Estilo Original Carrefour com Efeitos */}
      <section className="relative bg-gradient-to-br from-carrefour-blue via-blue-700 to-primary-dark text-white py-16 md:py-24 overflow-hidden">
        {/* Efeitos de fundo animados */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 animate-pulse" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Gradiente animado */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Lado Esquerdo - Texto Principal */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center md:text-left py-8 md:py-12"
              >
                <h1 
                  id="h-cartao-de-credito-carrefour"
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight text-white"
                >
                  Cartão de Crédito Carrefour
                </h1>
                
                {/* Destaque para Negativados */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm border-2 border-yellow-400/50 rounded-full px-4 py-2 mb-6"
                >
                  <Award className="w-5 h-5 text-yellow-300" />
                  <span className="text-base md:text-lg font-bold text-yellow-300">
                    O Cartão Preferido dos Negativados
                  </span>
                </motion.div>
                
                <p className="text-xl sm:text-2xl md:text-3xl text-white mb-8 leading-relaxed">
                  É só usar uma vez por mês em qualquer Carrefour e pronto:
                  <br />
                  <strong>zerou a anuidade.</strong>
                </p>

                <div className="flex justify-center md:justify-start mb-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/quiz')}
                    className="btn-shine relative bg-green-500 hover:bg-green-600 text-white font-bold text-lg md:text-xl px-8 py-4 md:px-10 md:py-5 rounded-lg transition-all duration-300 shadow-2xl hover:shadow-green-500/50 inline-flex items-center gap-3"
                  >
                    Peça já o seu
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.button>
                </div>

                {/* Badges de Confiança - Grid 2x2 */}
                <div className="grid grid-cols-2 gap-4">
                  {badges.map((badge, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <badge.icon className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-sm font-medium">{badge.text}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Lado Direito - Mockup do Cartão com Efeitos */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center py-8 md:py-12 relative"
              >
                <div className="relative w-full max-w-md">
                  {/* Efeito de brilho pulsante atrás */}
                  <motion.div
                    className="absolute inset-0 bg-green-500/30 blur-3xl rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  {/* Partículas flutuantes */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-green-400/50 rounded-full"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${10 + i * 12}%`
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.7, 0.3],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 2 + i * 0.3,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                  
                  {/* Cartão com efeito parallax */}
                  <motion.div
                    style={{
                      transform: `perspective(1000px) rotateY(${mousePosition.x * 0.1}deg) rotateX(${-mousePosition.y * 0.1}deg)`,
                    }}
                    whileHover={{ scale: 1.05 }}
                    className="relative z-10"
                  >
                    {/* Brilho no cartão */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    />
                    
                    <div className="relative">
                      <CardDesign
                        nome="SEU NOME AQUI"
                        numero="5442 34•• •••• ••••"
                        validade="12/28"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Anel de energia ao redor */}
                  <motion.div
                    className="absolute inset-0 border-4 border-green-400/30 rounded-2xl"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Destaque do Limite - Visual Impactante */}
      <section className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 py-12 md:py-16 text-white relative overflow-hidden">
        {/* Efeitos de fundo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <TrendingUp className="w-4 h-4" />
                <span>Possibilidade de Limite</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Limite de até <span className="text-yellow-300">R$ 5.500,00</span>
              </h2>
              <p className="text-xl text-white/90 mb-8">
                O limite será definido após análise do seu perfil, sem consulta ao SPC/Serasa
              </p>
            </motion.div>

            {/* Card de Limite Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-10 border-2 border-white/30 shadow-2xl"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-white/80 mb-1">Limite Possível</p>
                  <p className="text-5xl md:text-6xl font-bold whitespace-nowrap">Até R$ 5.500</p>
                </div>
              </div>
              
              {/* Barra de Progresso Visual - Mostrando possibilidade */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                  <span className="text-sm text-white/90">Limite Máximo Possível</span>
                  <span className="text-sm text-white/90 whitespace-nowrap">Conforme seu perfil</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-yellow-300 to-yellow-400 h-4 rounded-full shadow-lg"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
                <p className="text-xs text-white/70 mt-2">O limite será definido após análise</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-yellow-300 whitespace-nowrap">Até R$ 5.500</p>
                  <p className="text-xs text-white/80">Limite Máximo</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">Variável</p>
                  <p className="text-xs text-white/80">Conforme Perfil</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-300">Sem SPC</p>
                  <p className="text-xs text-white/80">Não Consultamos</p>
                </div>
              </div>
            </motion.div>

            {/* Badges de Benefícios do Limite */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <CheckCircle className="w-6 h-6 text-yellow-300 mx-auto mb-2" />
                <p className="text-sm font-medium">Sem Anuidade</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <Zap className="w-6 h-6 text-yellow-300 mx-auto mb-2" />
                <p className="text-sm font-medium">Análise Rápida</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <Shield className="w-6 h-6 text-yellow-300 mx-auto mb-2" />
                <p className="text-sm font-medium">Sem Consulta SPC</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos Sociais - Notificações em Tempo Real */}
      <section className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-center text-lg font-semibold text-gray-700 mb-6">
              Aprovações em tempo real
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {depoimentos.map((depoimento, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-start gap-3 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{depoimento.nome}</span>
                      <span className="text-xs text-gray-500">{depoimento.tempo}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{depoimento.texto}</p>
                    <p className="text-xs text-gray-500">{depoimento.cidade}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Garantias e Segurança */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {garantias.map((garantia, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-carrefour-blue/20"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-carrefour-blue to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <garantia.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{garantia.text}</h3>
                <p className="text-sm text-gray-600">{garantia.subtext}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vantagens do Cartão - Grid Expandido */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Vantagens do Cartão Carrefour
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Descubra todos os benefícios exclusivos para portadores do cartão
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {vantagens.map((vantagem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-carrefour-blue to-primary-dark rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <vantagem.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{vantagem.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{vantagem.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Detalhados */}
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Por que escolher o Cartão Carrefour?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Conheça os benefícios pensados para atender suas necessidades
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {beneficios.map((beneficio, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-carrefour-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-carrefour-blue to-primary-dark rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        <beneficio.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <h3 className="font-bold text-gray-900 text-xl">{beneficio.title}</h3>
                          {beneficio.highlight && (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                              {beneficio.highlight}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 leading-relaxed">{beneficio.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Serviços do Cartão */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Confira todos os serviços
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                O Cartão Carrefour também disponibiliza diversos meios de pagamento para facilitar o seu dia-a-dia!
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicos.map((servico, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-carrefour-blue to-primary-dark rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <servico.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">{servico.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{servico.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Formas de Pagamento */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Meios de Pagamento
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                O Cartão Carrefour também disponibiliza diversos meios de pagamento para facilitar o seu dia-a-dia!
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {formasPagamento.map((forma, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-carrefour-blue to-primary-dark rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <forma.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">{forma.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{forma.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas e Números */}
      <section className="bg-gradient-to-r from-carrefour-blue to-primary-dark py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center text-white"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">500K+</div>
              <div className="text-white/90 text-sm md:text-base">Clientes Aprovados</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center text-white"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">5min</div>
              <div className="text-white/90 text-sm md:text-base">Aprovação Rápida</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-white"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2 whitespace-nowrap">Até R$ 5.500</div>
              <div className="text-white/90 text-sm md:text-base">Limite Possível</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-white"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">5%</div>
              <div className="text-white/90 text-sm md:text-base">Cashback</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Perguntas Frequentes */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Perguntas Frequentes
              </h2>
              <p className="text-lg text-gray-600">
                Tire suas dúvidas sobre o Cartão Carrefour
              </p>
            </motion.div>
            
            <div className="space-y-4">
              {perguntasFrequentes.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-carrefour-blue/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-carrefour-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-5 h-5 text-carrefour-blue" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">{faq.pergunta}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.resposta}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Impactante */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto text-center bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 md:p-12 border-2 border-green-200"
          >
            <Award className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 text-green-600" />
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mais de 500 mil clientes aprovados
            </h3>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que conquistaram acesso ao crédito 
              mesmo com restrições cadastrais. Aprovação rápida e descomplicada.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/quiz')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg md:text-xl px-8 py-4 md:px-12 md:py-5 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-green-500/50 inline-flex items-center gap-3"
            >
              Quero meu Cartão
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Informações de Contato */}
      <section className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Informações Úteis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <Phone className="w-8 h-8 text-carrefour-blue mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Central de Atendimento</h4>
                <p className="text-sm text-gray-600">3004 2222</p>
                <p className="text-sm text-gray-600">0800 718 2222</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <Mail className="w-8 h-8 text-carrefour-blue mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">E-mail</h4>
                <p className="text-sm text-gray-600">atendimento@carrefoursolucoes.com.br</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <FileText className="w-8 h-8 text-carrefour-blue mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Documentos</h4>
                <p className="text-sm text-gray-600">Contrato e Tabela de Tarifas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Profissional */}
      <footer className="bg-gradient-to-br from-carrefour-blue to-primary-dark text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-3 text-base">Sobre</h4>
              <p className="text-sm text-white/90">
                Cartão de Crédito Carrefour - Banco CSF S.A.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-base">Segurança</h4>
              <p className="text-sm text-white/90">
                Site 100% seguro • Dados protegidos • LGPD Compliant
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-base">Regulamentação</h4>
              <p className="text-sm text-white/90">
                Instituição autorizada pelo Banco Central do Brasil
              </p>
            </div>
          </div>
          <div className="border-t border-white/20 pt-6 text-center text-sm space-y-2">
            <p className="text-white/90">© 2025 Banco CSF S.A. CNPJ 08.357.240/0001-50</p>
            <p className="text-white/70 px-2">
              Av. Doutora Ruth Cardoso, nº 4.777 – 2º andar – Edifício Villa Lobos – Jardim Universidade Pinheiros – São Paulo – SP – CEP: 05477-903
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
