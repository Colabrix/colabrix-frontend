import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Link2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { extractInviteToken } from '../lib/pendingInvite.js';

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
  const [showInviteInput, setShowInviteInput] = useState(false);
  const [inviteInput, setInviteInput] = useState('');

  function handleInviteSubmit(e) {
    e.preventDefault();
    const token = extractInviteToken(inviteInput);
    if (!token) return;
    navigate(`/invite/${token}`);
  }

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

          {!showInviteInput && (
            <motion.button
              variants={itemVariants}
              type="button"
              onClick={() => setShowInviteInput(true)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className={clsx(
                'flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-border-gray p-5 text-left',
                'transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5'
              )}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-border-gray/40">
                <Link2 size={20} className="text-secondary-gray" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary-gray">I have an invite link</p>
                <p className="mt-0.5 text-[13px] text-secondary-gray">
                  Join a workspace you were invited to
                </p>
              </div>
              <ArrowRight size={16} className="shrink-0 text-secondary-gray" />
            </motion.button>
          )}

          <AnimatePresence>
            {showInviteInput && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleInviteSubmit}
                className="overflow-hidden rounded-2xl border border-border-gray p-5"
              >
                <label className="mb-1.5 block text-sm font-medium text-primary-gray">
                  Paste your invite link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    placeholder="colabrix.in/invite/…"
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                    className="w-full rounded-xl border border-border-gray bg-background px-4 py-2.5 text-sm text-primary-gray placeholder:text-secondary-gray/50 focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!inviteInput.trim()}
                    className={clsx(
                      'shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-white',
                      inviteInput.trim()
                        ? 'cursor-pointer bg-primary hover:bg-primary/88'
                        : 'cursor-not-allowed bg-primary/40'
                    )}
                  >
                    Go
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
