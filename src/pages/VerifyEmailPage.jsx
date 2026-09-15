import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { verifyEmail } from '../services/apis/auth.js';
import { consumePendingInvite } from '../lib/pendingInvite.js';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus('success');
        const pendingInviteToken = consumePendingInvite();
        navigate(pendingInviteToken ? `/invite/${pendingInviteToken}` : '/get-started', {
          replace: true,
        });
      })
      .catch(() => setStatus('error'));
  }, [token, navigate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white px-8">
      <motion.div
        className="w-full max-w-[400px] text-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {status === 'verifying' && (
          <>
            <motion.div
              variants={itemVariants}
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"
            >
              <Loader2 size={26} className="animate-spin text-primary" />
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-primary-gray">
              Verifying your email
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-3 text-sm text-secondary-gray">
              Just a moment…
            </motion.p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              variants={itemVariants}
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-50"
            >
              <CheckCircle2 size={26} className="text-green-500" />
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-primary-gray">
              Email verified
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-3 text-sm text-secondary-gray">
              Taking you to the next step…
            </motion.p>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              variants={itemVariants}
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-50"
            >
              <XCircle size={26} className="text-red-500" />
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-primary-gray">
              This link is invalid or expired
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-3 text-sm leading-relaxed text-secondary-gray"
            >
              Please try signing up again, or log in if your account is already verified.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-8 flex justify-center gap-4">
              <a href="/signup" className="text-sm font-medium text-primary hover:underline">
                Sign up
              </a>
              <a href="/login" className="text-sm font-medium text-primary hover:underline">
                Log in
              </a>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
