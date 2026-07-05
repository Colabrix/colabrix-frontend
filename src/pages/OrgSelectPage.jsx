import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' } },
};

export default function OrgSelectPage() {
  const navigate = useNavigate();
  const { organizations, setActiveOrgSlug, loading } = useAuth();

  useEffect(() => {
    if (!loading && organizations.length === 0) {
      navigate('/get-started', { replace: true });
    }
  }, [loading, organizations, navigate]);

  function handleSelect(slug) {
    setActiveOrgSlug(slug);
    navigate(`/org/${slug}/dashboard`);
  }

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white text-sm text-secondary-gray">
        Loading your workspaces…
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white px-8">
      <motion.div
        className="w-full max-w-[440px]"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-primary-gray">Choose a workspace</h2>
          <p className="mt-1.5 text-sm text-secondary-gray">
            Pick the organisation you want to open
          </p>
        </motion.div>

        <div className="space-y-2.5">
          {organizations.map(({ organization }) => (
            <motion.button
              key={organization.id}
              variants={itemVariants}
              type="button"
              onClick={() => handleSelect(organization.slug)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-border-gray p-4 text-left transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Building2 size={18} className="text-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-primary-gray">
                  {organization.name}
                </p>
                <p className="mt-0.5 truncate text-[13px] text-secondary-gray">
                  colabrix.in/org/{organization.slug}
                </p>
              </div>
              <ChevronRight size={16} className="shrink-0 text-secondary-gray" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
