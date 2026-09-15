import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Check, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { createOrganization, checkSlugAvailability } from '../services/apis/organization.js';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function OrgSetupPage() {
  const navigate = useNavigate();
  const { refetch, setActiveOrgSlug } = useAuth();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slugStatus, setSlugStatus] = useState('idle');
  const [suggestion, setSuggestion] = useState('');
  const latestSlugRef = useRef('');

  function handleNameChange(value) {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  function handleSlugChange(value) {
    setSlugEdited(true);
    setSlug(slugify(value));
  }

  function applySuggestion() {
    if (!suggestion) return;
    setSlugEdited(true);
    setSlug(suggestion);
  }

  useEffect(() => {
    if (slug.length < 3) {
      setSlugStatus('idle');
      setSuggestion('');
      return undefined;
    }

    latestSlugRef.current = slug;
    setSlugStatus('checking');
    setSuggestion('');

    const timer = setTimeout(async () => {
      try {
        const result = await checkSlugAvailability(slug);
        if (latestSlugRef.current !== slug) return;
        if (result.available) {
          setSlugStatus('available');
          setSuggestion('');
        } else {
          setSlugStatus('taken');
          setSuggestion(result.suggestion || '');
        }
      } catch {
        if (latestSlugRef.current !== slug) return;
        setSlugStatus('idle');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || slug.length < 3 || slugStatus !== 'available' || loading) return;

    setError('');
    setLoading(true);
    try {
      const org = await createOrganization(name.trim(), slug);
      await refetch();
      setActiveOrgSlug(org.slug);
      navigate(`/org/${org.slug}/dashboard`);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = name.trim() && slug.length >= 3 && slugStatus === 'available' && !loading;

  function getSlugHint() {
    if (slug.length > 0 && slug.length < 3) {
      return {
        key: 'short',
        node: <span className="text-secondary-gray">Must be at least 3 characters</span>,
      };
    }
    if (slug.length >= 3 && slugStatus === 'checking') {
      return {
        key: 'checking',
        node: (
          <span className="flex items-center gap-1.5 text-secondary-gray">
            <Loader2 size={11} className="animate-spin" />
            Checking availability…
          </span>
        ),
      };
    }
    if (slugStatus === 'available') {
      return {
        key: 'available',
        node: (
          <span className="flex items-center gap-1.5 text-green-600">
            <Check size={11} strokeWidth={3} />
            Available
          </span>
        ),
      };
    }
    if (slugStatus === 'taken') {
      return {
        key: 'taken',
        node: (
          <span className="text-red-500">
            This URL is taken.
            {suggestion && (
              <>
                {' '}
                Try{' '}
                <button
                  type="button"
                  onClick={applySuggestion}
                  className="cursor-pointer font-medium text-primary underline hover:no-underline"
                >
                  {suggestion}
                </button>
                ?
              </>
            )}
          </span>
        ),
      };
    }
    return null;
  }

  const slugHint = getSlugHint();

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white px-8">
      <motion.div
        className="w-full max-w-[400px]"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-2xl font-bold text-primary-gray">Set up your organisation</h2>
          <p className="mt-1.5 text-sm text-secondary-gray">
            This is your team's workspace on Colabrix
          </p>
        </motion.div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <ErrorBanner message={error} />

          <motion.div variants={itemVariants}>
            <label className="mb-1.5 block text-sm font-medium text-primary-gray">
              Organisation name
            </label>
            <div className="relative">
              <Building2
                size={15}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-secondary-gray"
              />
              <input
                type="text"
                placeholder="Colabrix"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
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
              Workspace URL
            </label>
            <div
              className={clsx(
                'flex items-center rounded-xl border border-border-gray bg-background pr-1.5 pl-4',
                'transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15'
              )}
            >
              <span className="text-sm text-secondary-gray">colabrix.in/org/</span>
              <input
                type="text"
                placeholder="colabrix"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full bg-transparent py-3 text-sm text-primary-gray placeholder:text-secondary-gray/50 focus:outline-none"
              />
            </div>

            {slug.length > 0 && (
              <div className="mt-1.5 min-h-[14px] text-[11px]">
                <AnimatePresence mode="wait" initial={false}>
                  {slugHint && (
                    <motion.span
                      key={slugHint.key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="block"
                    >
                      {slugHint.node}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="pt-1">
            <motion.button
              type="submit"
              disabled={!canSubmit}
              whileHover={canSubmit ? { scale: 1.015 } : {}}
              whileTap={canSubmit ? { scale: 0.985 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className={clsx(
                'w-full rounded-full py-3',
                'text-sm font-semibold text-white',
                'transition-all duration-200',
                'focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:outline-none',
                canSubmit
                  ? 'cursor-pointer bg-primary hover:bg-primary/88'
                  : 'cursor-not-allowed bg-primary/40'
              )}
            >
              {loading ? 'Creating…' : 'Create organisation'}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
