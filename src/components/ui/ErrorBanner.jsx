import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';

export default function ErrorBanner({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-2 py-1">
            <AlertCircle size={14} className="shrink-0 text-red-500" strokeWidth={2.5} />
            <span className="text-[13px] leading-relaxed text-red-600">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
