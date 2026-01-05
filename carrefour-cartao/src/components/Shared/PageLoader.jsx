import { motion } from 'framer-motion';

export default function PageLoader({ message = 'Carregando...' }) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="text-center"
      >
        <motion.img
          src="/images/logocsf.png"
          alt="Loading"
          className="w-24 h-24 mx-auto mb-4 opacity-50"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-lg font-semibold text-gray-900">{message}</p>
        <p className="text-sm text-gray-600 mt-2">Aguarde um momento</p>
      </motion.div>
    </div>
  );
}

