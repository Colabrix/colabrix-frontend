import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { MailCheck } from 'lucide-react';

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
  const email = location.state?.email;

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

        <motion.p variants={itemVariants} className="mt-8 text-sm text-secondary-gray">
          Didn't get it? Check your spam folder, or{' '}
          <a href="/signup" className="font-medium text-primary hover:underline">
            try signing up again
          </a>
          .
        </motion.p>
      </motion.div>
    </div>
  );
}
