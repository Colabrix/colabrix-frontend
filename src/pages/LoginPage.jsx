import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LayoutDashboard,
  MessageCircle,
  GitBranch,
  Zap,
} from 'lucide-react';
import clsx from 'clsx';
import { login } from '../services/apis/auth.js';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { resolveOrgDestination } from '../lib/orgRedirect.js';

const features = [
  { icon: LayoutDashboard, label: 'Project Management' },
  { icon: MessageCircle, label: 'Team Messaging' },
  { icon: GitBranch, label: 'GitHub DevOps' },
  { icon: Zap, label: 'AI Assistant' },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { refetch, activeOrgSlug, setActiveOrgSlug } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const me = await refetch();
      const destination = resolveOrgDestination(me?.organizations, activeOrgSlug);
      const [, , slug] = destination.split('/');
      if (destination.startsWith('/org/') && slug !== 'select') {
        setActiveOrgSlug(slug);
      }
      navigate(destination);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left — Brand panel */}
      <div className="relative hidden w-[42%] flex-col overflow-hidden bg-primary lg:flex">
        <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-white/5" />
        <div
          className="pointer-events-none absolute rounded-full bg-white/[0.04]"
          style={{
            bottom: 0,
            right: 0,
            width: '75%',
            aspectRatio: '1',
            transform: 'translate(35%, 30%)',
          }}
        />

        <motion.div
          className="relative z-10 flex h-full flex-col justify-between p-12"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <span className="text-sm font-bold text-white">C</span>
            </div>
            <span className="text-lg font-semibold text-white">Colabrix</span>
          </motion.div>

          <div>
            <motion.p
              variants={itemVariants}
              className="mb-3 text-xs font-semibold tracking-widest text-white/40 uppercase"
            >
              Team OS
            </motion.p>
            <motion.h1
              variants={itemVariants}
              className="text-[2.6rem] leading-[1.15] font-bold text-white"
            >
              Your team's
              <br />
              command center.
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/60"
            >
              Everything your engineering team needs to build faster — in one place.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-2">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/80 backdrop-blur-sm"
                >
                  <Icon size={11} />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.p variants={itemVariants} className="text-[11px] text-white/30">
            © 2025 Colabrix. All rights reserved.
          </motion.p>
        </motion.div>
      </div>

      {/* Right — Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-8 py-12">
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-2 lg:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-bold text-white">C</span>
          </div>
          <span className="text-base font-semibold text-primary-gray">Colabrix</span>
        </div>

        <motion.div
          className="w-full max-w-[360px]"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-2xl font-bold text-primary-gray">Welcome back</h2>
            <p className="mt-1.5 text-sm text-secondary-gray">Log in to your Colabrix workspace</p>
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

            <motion.div variants={itemVariants}>
              <label className="mb-1.5 block text-sm font-medium text-primary-gray">Password</label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute top-1/2 left-3.5 -translate-y-1/2 text-secondary-gray"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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

            <motion.div variants={itemVariants} className="flex justify-end">
              <a
                href="#"
                className="text-[13px] font-medium text-[#b9bbf6] transition-colors hover:text-primary"
              >
                Forgot password?
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-1">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.015 } : {}}
                whileTap={!loading ? { scale: 0.985 } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={clsx(
                  'w-full rounded-full bg-primary py-3',
                  'text-sm font-semibold text-white',
                  'transition-colors duration-200 hover:bg-primary/88',
                  'focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:outline-none',
                  loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                )}
              >
                {loading ? 'Logging in…' : 'Log in'}
              </motion.button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-border-gray" />
            <span className="text-xs text-secondary-gray">or</span>
            <div className="h-px flex-1 bg-border-gray" />
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="button"
            disabled
            title="Google sign-in coming soon"
            className={clsx(
              'flex w-full items-center justify-center gap-3 rounded-full border border-border-gray bg-white py-3',
              'text-sm font-medium text-primary-gray/50',
              'cursor-not-allowed opacity-60'
            )}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path
                d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </motion.button>

          <motion.p
            variants={itemVariants}
            className="mt-8 text-center text-sm text-secondary-gray"
          >
            New to Colabrix?{' '}
            <a href="/signup" className="font-medium text-primary hover:underline">
              Create an account
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
