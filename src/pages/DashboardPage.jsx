import React from 'react';
import { motion } from 'motion/react';
import { FolderKanban, Users, ListTodo, GitBranch, CalendarDays, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext.jsx';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

const checklistItems = [
  { icon: FolderKanban, label: 'Create your first project' },
  { icon: Users, label: 'Invite a team member' },
  { icon: ListTodo, label: 'Create your first task' },
  { icon: GitBranch, label: 'Connect a GitHub repository' },
  { icon: CalendarDays, label: 'Schedule a meeting' },
  { icon: Sparkles, label: 'Try AI task creation' },
];

export default function DashboardPage() {
  const { user, activeOrg } = useAuth();

  return (
    <div className="min-h-full w-full bg-background px-8 py-10">
      <motion.div
        className="mx-auto max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="mb-8 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-white">C</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-primary-gray">
              Welcome{user?.name ? `, ${user.name}` : ''}
            </p>
            <p className="text-sm text-secondary-gray">
              {activeOrg?.name
                ? `Let's get ${activeOrg.name} moving`
                : "Let's get your workspace moving"}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mb-6 rounded-2xl border border-border-gray bg-white p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-semibold text-primary-gray">Onboarding checklist</p>
            <span className="text-[13px] text-secondary-gray">
              0 / {checklistItems.length} steps complete
            </span>
          </div>
          <div className="space-y-1">
            {checklistItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className={clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5',
                  'transition-colors duration-200 hover:bg-background'
                )}
              >
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-border-gray" />
                <Icon size={15} className="shrink-0 text-secondary-gray" />
                <span className="text-sm text-primary-gray">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-gray bg-white px-6 py-16 text-center"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <FolderKanban size={22} className="text-primary" />
          </div>
          <p className="text-sm font-semibold text-primary-gray">No projects yet</p>
          <p className="mt-1 text-[13px] text-secondary-gray">
            Create your first project to start planning and shipping work
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
