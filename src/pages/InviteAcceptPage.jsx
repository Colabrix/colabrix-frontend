import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, Loader2, XCircle, UserPlus } from 'lucide-react';
import clsx from 'clsx';
import { validateInvite, acceptInvite } from '../services/apis/invite.js';
import { savePendingInvite } from '../lib/pendingInvite.js';
import { resolveOrgDestination } from '../lib/orgRedirect.js';
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

function Centered({ children }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white px-8">
      <motion.div
        className="w-full max-w-[420px] text-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function InviteAcceptPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, organizations, loading: authLoading, refetch, setActiveOrgSlug } = useAuth();

  const [phase, setPhase] = useState('validating');
  const [invalidMessage, setInvalidMessage] = useState('');
  const [invite, setInvite] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState('');

  useEffect(() => {
    let cancelled = false;

    validateInvite(token)
      .then((data) => {
        if (cancelled) return;
        setInvite(data);
        setPhase('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setInvalidMessage(err.message || 'This invite link is invalid.');
        setPhase('invalid');
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const existingMembership =
    invite && organizations.find((m) => m.organization.id === invite.organization.id);

  useEffect(() => {
    if (phase === 'ready' && user && existingMembership) {
      setActiveOrgSlug(existingMembership.organization.slug);
      navigate(`/org/${existingMembership.organization.slug}/dashboard`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, user, existingMembership]);

  function goToAuth(path) {
    savePendingInvite(token);
    navigate(path);
  }

  function handleDecline() {
    navigate(resolveOrgDestination(organizations));
  }

  async function handleAccept() {
    if (accepting) return;
    setAcceptError('');
    setAccepting(true);
    try {
      const result = await acceptInvite(token);
      const me = await refetch();
      const membership = me?.organizations?.find(
        (m) => m.organization.id === result.organization.id
      );
      const slug = membership?.organization?.slug;
      if (slug) {
        setActiveOrgSlug(slug);
        navigate(`/org/${slug}/dashboard`, { replace: true });
      } else {
        navigate(resolveOrgDestination(me?.organizations));
      }
    } catch (err) {
      setAcceptError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setAccepting(false);
    }
  }

  if (phase === 'validating' || authLoading || (phase === 'ready' && user && existingMembership)) {
    return (
      <Centered>
        <motion.div
          variants={itemVariants}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"
        >
          <Loader2 size={26} className="animate-spin text-primary" />
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-2xl font-bold text-primary-gray">
          Checking your invite…
        </motion.h2>
      </Centered>
    );
  }

  if (phase === 'invalid') {
    return (
      <Centered>
        <motion.div
          variants={itemVariants}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-50"
        >
          <XCircle size={26} className="text-red-500" />
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-2xl font-bold text-primary-gray">
          {invalidMessage}
        </motion.h2>
        <motion.p variants={itemVariants} className="mt-3 text-sm text-secondary-gray">
          Ask your Org Admin to send a new invite link.
        </motion.p>
        <motion.div variants={itemVariants} className="mt-8 flex justify-center gap-4">
          <a href="/login" className="text-sm font-medium text-primary hover:underline">
            Log in
          </a>
          <a href="/signup" className="text-sm font-medium text-primary hover:underline">
            Sign up
          </a>
        </motion.div>
      </Centered>
    );
  }

  if (!user) {
    return (
      <Centered>
        <motion.div
          variants={itemVariants}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"
        >
          <Building2 size={26} className="text-primary" />
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-2xl font-bold text-primary-gray">
          Join {invite.organization.name}
        </motion.h2>
        <motion.p variants={itemVariants} className="mt-3 text-sm text-secondary-gray">
          {invite.inviterEmail ? `${invite.inviterEmail} invited you` : "You've been invited"}
          {invite.roleName ? ` as ${invite.roleName}` : ''}. Sign in or create an account to
          continue.
        </motion.p>
        <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => goToAuth('/login')}
            className="w-full cursor-pointer rounded-full bg-primary py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary/88"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => goToAuth('/signup')}
            className="w-full cursor-pointer rounded-full border border-border-gray bg-white py-3 text-sm font-medium text-primary-gray transition-colors duration-200 hover:bg-background"
          >
            Create an account
          </button>
        </motion.div>
      </Centered>
    );
  }

  return (
    <Centered>
      <motion.div
        variants={itemVariants}
        className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"
      >
        <UserPlus size={26} className="text-primary" />
      </motion.div>
      <motion.h2 variants={itemVariants} className="text-2xl font-bold text-primary-gray">
        Join {invite.organization.name}
      </motion.h2>
      <motion.p variants={itemVariants} className="mt-3 text-sm text-secondary-gray">
        {invite.inviterEmail ? `${invite.inviterEmail} invited you` : "You've been invited"} to join
        as <span className="font-medium text-primary-gray">{invite.roleName || 'a member'}</span>.
      </motion.p>

      <motion.div variants={itemVariants} className="mt-6 text-left">
        <ErrorBanner message={acceptError} />
      </motion.div>

      <motion.div variants={itemVariants} className="mt-4 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleAccept}
          disabled={accepting}
          className={clsx(
            'w-full rounded-full bg-primary py-3 text-sm font-semibold text-white',
            'transition-colors duration-200 hover:bg-primary/88',
            accepting ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
          )}
        >
          {accepting ? 'Joining…' : `Join ${invite.organization.name}`}
        </button>
        <button
          type="button"
          onClick={handleDecline}
          disabled={accepting}
          className="w-full cursor-pointer rounded-full border border-border-gray bg-white py-3 text-sm font-medium text-primary-gray transition-colors duration-200 hover:bg-background"
        >
          Decline
        </button>
      </motion.div>
    </Centered>
  );
}
