import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { MailCheck } from 'lucide-react';
import clsx from 'clsx';
import { resendVerification } from '../services/apis/auth.js';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';

const RESEND_COOLDOWN_SECONDS = 60;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

export default function CheckEmailPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const email = location.state?.email || searchParams.get('email') || '';

  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleResend() {
    if (!email || resending || cooldown > 0) return;

    setResending(true);
    setResendError('');
    setResendSuccess(false);
    try {
      await resendVerification(email);
      setResendSuccess(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setResendError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setResending(false);
    }
  }

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
          We've sent a verification link{email ? ` to ${email}` : ''}. Click the link to verify your
          account and get started.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-6 text-left">
          <ErrorBanner message={resendError} />
          {resendSuccess && !resendError && (
            <p className="text-[13px] leading-relaxed text-green-600">
              Verification email sent — check your inbox.
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-4">
          <button
            type="button"
            onClick={handleResend}
            disabled={!email || resending || cooldown > 0}
            className={clsx(
              'w-full rounded-full border border-border-gray bg-white py-3',
              'text-sm font-medium text-primary-gray',
              'transition-colors duration-200 hover:bg-background',
              (!email || resending || cooldown > 0) && 'cursor-not-allowed opacity-50',
              email && !resending && cooldown === 0 && 'cursor-pointer'
            )}
          >
            {resending
              ? 'Sending…'
              : cooldown > 0
                ? `Resend email in ${cooldown}s`
                : 'Resend verification email'}
          </button>
        </motion.div>

        <motion.p variants={itemVariants} className="mt-6 text-sm text-secondary-gray">
          Wrong email?{' '}
          <a href="/signup" className="font-medium text-primary hover:underline">
            Sign up again
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
