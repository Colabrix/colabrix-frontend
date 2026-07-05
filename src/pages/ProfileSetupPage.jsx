import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Image } from 'lucide-react';
import clsx from 'clsx';
import { updateProfile } from '../services/apis/auth.js';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || loading) return;

    setError('');
    setLoading(true);
    try {
      await updateProfile(name.trim(), avatarUrl.trim() || undefined);
      navigate('/onboarding/organization');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white px-8">
      <motion.div
        className="w-full max-w-[400px]"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-bold text-primary-gray">Tell us about you</h2>
          <p className="mt-1.5 text-sm text-secondary-gray">
            This is how you'll appear to your team
          </p>
        </motion.div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <ErrorBanner message={error} />

          <motion.div variants={itemVariants}>
            <label className="mb-1.5 block text-sm font-medium text-primary-gray">Full name</label>
            <div className="relative">
              <User
                size={15}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-secondary-gray"
              />
              <input
                type="text"
                placeholder="Harsh Gupta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={clsx(
                  'w-full rounded-xl border border-border-gray bg-background py-3 pr-4 pl-10',
                  'text-sm text-primary-gray placeholder:text-secondary-gray/50',
                  'transition-all duration-200',
                  'focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none'
                )}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="mb-1.5 block text-sm font-medium text-primary-gray">
              Avatar URL <span className="font-normal text-secondary-gray">(optional)</span>
            </label>
            <div className="relative">
              <Image
                size={15}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-secondary-gray"
              />
              <input
                type="url"
                placeholder="https://…"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
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
              disabled={!name.trim() || loading}
              whileHover={name.trim() && !loading ? { scale: 1.015 } : {}}
              whileTap={name.trim() && !loading ? { scale: 0.985 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className={clsx(
                'w-full rounded-full py-3',
                'text-sm font-semibold text-white',
                'transition-all duration-200',
                'focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:outline-none',
                name.trim() && !loading
                  ? 'cursor-pointer bg-primary hover:bg-primary/88'
                  : 'cursor-not-allowed bg-primary/40'
              )}
            >
              {loading ? 'Saving…' : 'Continue'}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
