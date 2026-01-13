import { motion } from 'framer-motion';
import { useUserStore } from '../../store/userStore';
import ProgressBar from '../Shared/ProgressBar';
import Logo from '../Shared/Logo';
import { CheckCircle, Mail, Phone, Package, CreditCard, HelpCircle, Award, Shield, ArrowRight } from 'lucide-react';
import CardDesign from '../Shared/CardDesign';

export default function ConfirmationPage() {
  const { nomeCompleto, numeroCartao, validade, limite, endereco } = useUserStore();

  const itensConfirmacao = [
    { icon: CheckCircle, texto: 'Cartão aprovado e ativado com sucesso', cor: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { icon: CreditCard, texto: 'Taxa de emissão paga e confirmada', cor: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { icon: CreditCard, texto: 'Cartão virtual disponível para uso imediato', cor: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { icon: Package, texto: 'Cartão físico em produção e envio programado', cor: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
  ];

  const faqs = [
    {
      pergunta: 'Quando posso começar a usar o cartão virtual?',
      resposta: 'Agora mesmo! Seu cartão virtual já está ativo e pronto para uso em compras online e pagamentos digitais.'
    },
    {
      pergunta: 'Quando receberei o cartão físico?',
      resposta: 'Seu cartão físico será enviado por SEDEX e chegará no endereço informado em 5-7 dias úteis. Você receberá um código de rastreamento por email quando o cartão for postado.'
    },
    {
      pergunta: 'Como acesso minha fatura e extrato?',
      resposta: 'Acesse o aplicativo Carrefour ou o site carrefour.com.br e faça login com seus dados cadastrais para visualizar faturas, extratos e gerenciar seu cartão.'
    },
    {
      pergunta: 'Como altero minha senha ou dados?',
      resposta: 'Você pode alterar seus dados e senha através do aplicativo Carrefour ou entrando em contato com nosso atendimento pelo telefone 0800-XXX-XXXX.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <ProgressBar etapaAtual="confirmation" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto mt-12"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                <Award className="w-16 h-16 text-white" />
              </div>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ativação Concluída com Sucesso
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Seu Cartão Carrefour foi ativado e está pronto para uso. 
              Confira abaixo todas as informações importantes.
            </p>
          </div>

          {/* Resumo */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Resumo da Solicitação</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {itensConfirmacao.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${item.bg} border-2 ${item.border} rounded-xl p-5 flex items-start gap-4`}
                >
                  <item.icon className={`w-6 h-6 ${item.cor} flex-shrink-0 mt-1`} />
                  <span className="font-semibold text-gray-900 leading-relaxed">{item.texto}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Card Preview */}
            <div className="flex justify-center">
              <CardDesign
                nome={nomeCompleto || 'SEU NOME'}
                numero={numeroCartao || '5442 34•• •••• ••••'}
                validade={validade}
              />
            </div>

            {/* Informações */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Próximos Passos</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-carrefour-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-carrefour-blue" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Email de confirmação</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Um email com todos os detalhes do seu cartão foi enviado para sua caixa de entrada.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-carrefour-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-carrefour-blue" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">SMS com dados do cartão</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Você receberá um SMS com informações importantes sobre seu cartão.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-carrefour-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-carrefour-blue" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Rastreamento do envio</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Você receberá o código de rastreamento por email quando o cartão físico for postado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-carrefour-blue" />
              <h3 className="text-2xl font-bold text-gray-900">Perguntas Frequentes</h3>
            </div>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <p className="font-semibold text-gray-900 mb-2 text-lg">{faq.pergunta}</p>
                  <p className="text-gray-600 leading-relaxed">{faq.resposta}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Final */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-carrefour-blue hover:bg-blue-700 text-white font-semibold text-lg py-5 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 mb-8"
          >
            Acessar Portal do Cliente
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {/* Suporte */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-700 mb-3">
              <Shield className="w-5 h-5 text-carrefour-blue" />
              <span className="font-semibold">Precisa de ajuda?</span>
            </div>
            <p className="text-gray-600 mb-2">Nossa equipe está pronta para atendê-lo</p>
            <p className="font-semibold text-carrefour-blue text-lg">0800-XXX-XXXX</p>
            <p className="text-sm text-gray-500 mt-2">Segunda a Sexta, das 8h às 20h</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
