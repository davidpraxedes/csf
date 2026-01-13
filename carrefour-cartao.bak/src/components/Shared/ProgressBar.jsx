import { motion } from 'framer-motion';

const etapas = [
  { id: 'landing', label: 'Início' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'cpf', label: 'CPF' },
  { id: 'processing', label: 'Análise' },
  { id: 'approval', label: 'Aprovação' },
  { id: 'benefits', label: 'Benefícios' },
  { id: 'customization', label: 'Personalizar' },
  { id: 'forms', label: 'Dados' },
  { id: 'delivery', label: 'Entrega' },
  { id: 'payment', label: 'Pagamento' },
  { id: 'virtual', label: 'Ativação' },
  { id: 'confirmation', label: 'Concluído' },
];

export default function ProgressBar({ etapaAtual }) {
  const etapaIndex = etapas.findIndex(e => e.id === etapaAtual);
  const progresso = ((etapaIndex + 1) / etapas.length) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <motion.div
        className="bg-carrefour-blue h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progresso}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}

