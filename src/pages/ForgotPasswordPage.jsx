import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MailCheck } from 'lucide-react';
import clsx from 'clsx';
import { forgotPassword } from '../services/apis/auth.js';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setError('');
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white px-8">
        <motion.div
          className="w-full max-w-[400px] text-center"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={itemVariants}
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"
          >
            <MailCheck size={26} className="text-primary" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-2xl font-bold text-primary-gray">
            Check your inbox
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-3 text-sm leading-relaxed text-secondary-gray"
          >
            If an account exists for {email}, we've sent a link to reset your password.
          </motion.p>
          <motion.p variants={itemVariants} className="mt-8 text-sm text-secondary-gray">
            <a href="/login" className="font-medium text-primary hover:underline">
              Back to log in
            </a>
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white px-8">
      <motion.div
        className="w-full max-w-[360px]"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-bold text-primary-gray">Forgot your password?</h2>
          <p className="mt-1.5 text-sm text-secondary-gray">
            Enter your email and we'll send you a reset link
          </p>
        </motion.div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <ErrorBanner message={error} />

          <motion.div variants={itemVariants}>
            <label className="mb-1.5 block text-sm font-medium text-primary-gray">Email</label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-secondary-gray"
              />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={clsx(
                  'w-full rounded-xl border border-border-gray bg-background py-3 pr-4 pl-10',
                  'text-sm text-primary-gray placeholder:text-secondary-gray/50',
                  'transition-all duration-200',
                  'focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none'
                )}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-1">
            <motion.button
              type="submit"
              disabled={!email.trim() || loading}
              whileHover={email.trim() && !loading ? { scale: 1.015 } : {}}
              whileTap={email.trim() && !loading ? { scale: 0.985 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className={clsx(
                'w-full rounded-full py-3',
                'text-sm font-semibold text-white',
                'transition-all duration-200',
                'focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:outline-none',
                email.trim() && !loading
                  ? 'cursor-pointer bg-primary hover:bg-primary/88'
                  : 'cursor-not-allowed bg-primary/40'
              )}
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </motion.button>
          </motion.div>
        </form>

        <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-secondary-gray">
          <a href="/login" className="font-medium text-primary hover:underline">
            Back to log in
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
