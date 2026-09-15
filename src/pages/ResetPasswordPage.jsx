import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, Lock, CheckCircle2, XCircle } from 'lucide-react';
import clsx from 'clsx';
import { resetPassword } from '../services/apis/auth.js';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

function Centered({ children }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white px-8">
      <motion.div
        className="w-full max-w-[400px] text-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading || password.length < 8) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <Centered>
        <motion.div
          variants={itemVariants}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-50"
        >
          <XCircle size={26} className="text-red-500" />
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-2xl font-bold text-primary-gray">
          This link is invalid
        </motion.h2>
        <motion.p variants={itemVariants} className="mt-3 text-sm text-secondary-gray">
          Please request a new password reset link.
        </motion.p>
        <motion.div variants={itemVariants} className="mt-8">
          <a href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Request a new link
          </a>
        </motion.div>
      </Centered>
    );
  }

  if (success) {
    return (
      <Centered>
        <motion.div
          variants={itemVariants}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-50"
        >
          <CheckCircle2 size={26} className="text-green-500" />
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-2xl font-bold text-primary-gray">
          Password reset
        </motion.h2>
        <motion.p variants={itemVariants} className="mt-3 text-sm text-secondary-gray">
          You can now log in with your new password.
        </motion.p>
        <motion.div variants={itemVariants} className="mt-8">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="cursor-pointer rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary/88"
          >
            Log in
          </button>
        </motion.div>
      </Centered>
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
          <h2 className="text-2xl font-bold text-primary-gray">Set a new password</h2>
          <p className="mt-1.5 text-sm text-secondary-gray">
            Choose a strong password for your account
          </p>
        </motion.div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <ErrorBanner message={error} />

          <motion.div variants={itemVariants}>
            <label className="mb-1.5 block text-sm font-medium text-primary-gray">
              New password
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-secondary-gray"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={clsx(
                  'w-full rounded-xl border border-border-gray bg-background py-3 pr-11 pl-10',
                  'text-sm text-primary-gray placeholder:text-secondary-gray/50',
                  'transition-all duration-200',
                  'focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-secondary-gray transition-colors hover:text-primary-gray"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="mb-1.5 block text-sm font-medium text-primary-gray">
              Confirm password
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-secondary-gray"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              disabled={password.length < 8 || loading}
              whileHover={password.length >= 8 && !loading ? { scale: 1.015 } : {}}
              whileTap={password.length >= 8 && !loading ? { scale: 0.985 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className={clsx(
                'w-full rounded-full py-3',
                'text-sm font-semibold text-white',
                'transition-all duration-200',
                'focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:outline-none',
                password.length >= 8 && !loading
                  ? 'cursor-pointer bg-primary hover:bg-primary/88'
                  : 'cursor-not-allowed bg-primary/40'
              )}
            >
              {loading ? 'Resetting…' : 'Reset password'}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
