import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, Link2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

export default function PostAuthDecisionPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white px-8">
      <motion.div
        className="w-full max-w-[520px]"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-primary-gray">How would you like to start?</h2>
          <p className="mt-1.5 text-sm text-secondary-gray">
            You can always join more workspaces later
          </p>
        </motion.div>

        <div className="space-y-3">
          <motion.button
            variants={itemVariants}
            type="button"
            onClick={() => navigate('/onboarding/profile')}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={clsx(
              'flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-border-gray p-5 text-left',
              'transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5'
            )}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Building2 size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary-gray">Create a new organisation</p>
              <p className="mt-0.5 text-[13px] text-secondary-gray">
                Set up a fresh workspace for your team
              </p>
            </div>
            <ArrowRight size={16} className="shrink-0 text-secondary-gray" />
          </motion.button>

          <motion.div
            variants={itemVariants}
            title="Coming soon"
            className={clsx(
              'flex w-full items-center gap-4 rounded-2xl border border-border-gray p-5 text-left',
              'cursor-not-allowed opacity-50'
            )}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-border-gray/40">
              <Link2 size={20} className="text-secondary-gray" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary-gray">I have an invite link</p>
              <p className="mt-0.5 text-[13px] text-secondary-gray">Coming soon</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
