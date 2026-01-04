import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function PageLoader({ message = 'Carregando...' }) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="text-center"
      >
        <Loader2 className="w-12 h-12 text-carrefour-blue animate-spin mx-auto mb-4" />
        <p className="text-lg font-semibold text-gray-900">{message}</p>
        <p className="text-sm text-gray-600 mt-2">Aguarde um momento</p>
      </motion.div>
    </div>
  );
}

