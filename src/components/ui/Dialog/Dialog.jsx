import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { XCircle } from 'lucide-react';
import clsx from 'clsx';

/**
 * Dialog Component - A reusable modal/dialog box
 *
 * @param {boolean} isOpen - Controls dialog visibility
 * @param {function} onClose - Callback when dialog closes
 * @param {React.ReactNode} children - Dialog content
 * @param {string} className - Custom classes for the dialog container (e.g., width)
 * @param {string} overlayClassName - Custom classes for the overlay/backdrop
 * @param {string} title - Optional dialog title
 * @param {boolean} showCloseIcon - Whether to show close icon (default: true)
 * @param {boolean} closeOnOverlayClick - Close when clicking overlay (default: true)
 * @param {boolean} closeOnEscape - Close when pressing ESC (default: true)
 * @param {boolean} preventBodyScroll - Prevent body scroll when open (default: true)
 * @param {boolean} showDecorativeCurve - Show the decorative purple curve (default: true)
 */
function Dialog({
  isOpen,
  onClose,
  children,
  className = '',
  overlayClassName = '',
  title,
  showCloseIcon = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventBodyScroll = true,
  showDecorativeCurve = true,
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose?.();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (isOpen && preventBodyScroll) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, preventBodyScroll]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const dialogContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={clsx(
            'fixed inset-0 z-50 flex items-center justify-center p-4',
            'bg-black/60',
            overlayClassName
          )}
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={clsx(
              'relative w-full max-w-2xl',
              'rounded-3xl bg-white shadow-2xl',
              'overflow-hidden',
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {showDecorativeCurve && (
              <div
                className="pointer-events-none absolute rounded-full bg-primary"
                style={{
                  top: '50%',
                  right: 0,
                  width: '80%',
                  aspectRatio: '1',
                  transform: 'translateX(30%)',
                }}
              />
            )}

            {showCloseIcon && (
              <button
                onClick={onClose}
                className={clsx(
                  'absolute top-4 right-4 z-10',
                  'transition-transform hover:scale-110',
                  'focus:outline-none'
                )}
                aria-label="Close dialog"
              >
                <XCircle size={28} className="fill-primary text-white" strokeWidth={1.5} />
              </button>
            )}

            {title && (
              <div className="px-8 pt-8">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              </div>
            )}

            <div className={clsx('relative z-[1] px-8 pb-8', title ? 'pt-6' : 'pt-8')}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(dialogContent, document.body);
}

export default Dialog;
