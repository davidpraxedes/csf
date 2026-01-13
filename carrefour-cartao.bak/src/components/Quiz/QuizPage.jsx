import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import ProgressBar from '../Shared/ProgressBar';
import Logo from '../Shared/Logo';
import { ShoppingCart, Plane, DollarSign, Wallet, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { useState } from 'react';

export default function QuizPage() {
  const navigate = useNavigate();
  const { setQuizResposta, setEtapaAtual } = useUserStore();
  const [perguntaAtual, setPerguntaAtual] = useState(1);
  const [respostas, setRespostas] = useState({});

  const perguntas = [
    {
      id: 1,
      titulo: 'Qual é o principal objetivo ao solicitar um cartão de crédito?',
      subtitulo: 'Selecione a opção que melhor descreve sua necessidade',
      opcoes: [
        { id: 'comprar', texto: 'Realizar compras no Carrefour com benefícios exclusivos', icon: ShoppingCart, descricao: 'Cashback e descontos especiais' },
        { id: 'online', texto: 'Facilitar compras online e pagamentos digitais', icon: Plane, descricao: 'Segurança e praticidade' },
        { id: 'emergencia', texto: 'Ter uma linha de crédito para situações emergenciais', icon: Wallet, descricao: 'Disponibilidade imediata' },
        { id: 'negativado', texto: 'Acessar crédito mesmo com restrições cadastrais', icon: CheckCircle, descricao: 'Aprovação sem consulta SPC/Serasa' },
        { id: 'outros', texto: 'Outras necessidades financeiras', icon: DollarSign, descricao: 'Flexibilidade de uso' },
      ]
    },
    {
      id: 2,
      titulo: 'Você possui restrições cadastrais?',
      subtitulo: 'Esta informação nos ajuda a personalizar sua proposta',
      opcoes: [
        { id: 'sim-spc', texto: 'Sim, possuo restrições no SPC/Serasa' },
        { id: 'problemas', texto: 'Não, mas já tive problemas no passado' },
        { id: 'certeza', texto: 'Não tenho certeza sobre meu status' },
      ],
      mensagemConfianca: 'Importante: O Cartão Carrefour utiliza análise prévia automatizada e não consulta SPC/Serasa na aprovação. Mesmo com restrições cadastrais, você pode ser aprovado.'
    },
    {
      id: 3,
      titulo: 'Quantos cartões de crédito você possui atualmente?',
      subtitulo: 'Informação para análise de perfil',
      opcoes: [
        { id: 'primeiro', texto: 'Este será meu primeiro cartão de crédito' },
        { id: 'um-dois', texto: 'Possuo 1 ou 2 cartões atualmente' },
        { id: 'tres-mais', texto: 'Possuo 3 ou mais cartões' },
      ]
    }
  ];

  const pergunta = perguntas[perguntaAtual - 1];

  const handleResposta = (respostaId) => {
    const novasRespostas = { ...respostas, [pergunta.id]: respostaId };
    setRespostas(novasRespostas);
    setQuizResposta(pergunta.id, respostaId);

    if (perguntaAtual < perguntas.length) {
      setTimeout(() => setPerguntaAtual(perguntaAtual + 1), 300);
    } else {
      setEtapaAtual('cpf');
      navigate('/cpf');
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
        <ProgressBar etapaAtual="quiz" />
        
        <motion.div
          key={perguntaAtual}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-3xl mx-auto mt-12"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-10">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 bg-carrefour-blue/10 text-carrefour-blue px-4 py-2 rounded-full text-sm font-semibold">
                  <Lock className="w-4 h-4" />
                  <span>Pergunta {perguntaAtual} de {perguntas.length}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {Math.round((perguntaAtual / perguntas.length) * 100)}% completo
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {pergunta.titulo}
              </h2>
              {pergunta.subtitulo && (
                <p className="text-gray-600 text-lg">
                  {pergunta.subtitulo}
                </p>
              )}
              
              {pergunta.mensagemConfianca && (
                <div className="mt-6 bg-blue-50 border-l-4 border-carrefour-blue rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-carrefour-blue flex-shrink-0 mt-0.5" />
                    <p className="text-blue-800 text-sm leading-relaxed">
                      {pergunta.mensagemConfianca}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {pergunta.opcoes.map((opcao) => (
                <motion.button
                  key={opcao.id}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleResposta(opcao.id)}
                  className="w-full text-left p-5 bg-gray-50 hover:bg-carrefour-blue hover:text-white rounded-xl border-2 border-gray-200 hover:border-carrefour-blue transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    {opcao.icon && (
                      <div className="w-12 h-12 bg-white group-hover:bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <opcao.icon className="w-6 h-6 text-carrefour-blue group-hover:text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <span className="font-semibold text-lg block mb-1">{opcao.texto}</span>
                      {opcao.descricao && (
                        <span className="text-sm text-gray-500 group-hover:text-white/80">
                          {opcao.descricao}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white flex-shrink-0 mt-1" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
