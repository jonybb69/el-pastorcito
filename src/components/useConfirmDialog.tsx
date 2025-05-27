'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

type ConfirmDialogOptions = {
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'danger' | 'info' | 'warning';
};

const typeColors = {
  default: 'bg-gray-700',
  danger: 'bg-red-600',
  info: 'bg-blue-600',
  warning: 'bg-yellow-500',
};

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions>({
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'default',
  });
  const [resolver, setResolver] = useState<(value: boolean) => void>(() => {});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const confirm = useCallback((opts: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      setOptions({
        message: opts.message,
        confirmText: opts.confirmText || 'Confirmar',
        cancelText: opts.cancelText || 'Cancelar',
        type: opts.type || 'default',
      });
      setIsOpen(true);
      setResolver(() => resolve);
    });
  }, []);

  const handleClose = (result: boolean) => {
    setIsOpen(false);
    resolver(result);
  };

  const Dialog = () => {
    if (!mounted) return null;

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`rounded-xl p-6 text-white shadow-lg w-full max-w-sm ${typeColors[options.type || 'default']}`}
            >
              <p className="mb-6 text-center text-lg font-medium">
                {options.message}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleClose(false)}
                  className="px-4 py-2 bg-black/40 border border-white/20 text-white rounded-md hover:bg-black/60 transition"
                >
                  {options.cancelText}
                </button>
                <button
                  onClick={() => handleClose(true)}
                  className={`px-4 py-2 rounded-md font-semibold transition ${
                    options.type === 'danger'
                      ? 'bg-white text-red-600 hover:bg-gray-100'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {options.confirmText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  return { confirm, Dialog };
}