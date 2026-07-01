import clsx from 'clsx';
import React from 'react';
import { useState } from 'react';
import SidebarItemWithChildren from './SidebarItemWithChildren';
import SidebarItem from './SidebarItem';
import {
  BarChart2,
  Calendar,
  CheckSquare,
  ChevronLeft,
  Inbox,
  KanbanSquare,
  LayoutDashboard,
  LayoutGrid,
  MessageCircle,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const sidebarItems = [
  {
    key: 'foryou',
    title: 'For You',
    icon: LayoutDashboard,
    href: '#',
  },
  {
    key: 'calendar',
    title: 'Calendar',
    icon: Calendar,
    href: '#',
  },
  {
    key: 'pm',
    title: 'Project Management',
    icon: KanbanSquare,
    children: [
      { key: 'overview', title: 'Overview', href: '/pm/overview', icon: LayoutGrid },
      { key: 'tasks', title: 'Tasks', href: '/pm/tasks', icon: CheckSquare },
      { key: 'sprints', title: 'Sprints', href: '/pm/sprints', icon: Zap },
      { key: 'backlog', title: 'Backlog', href: '/pm/backlog', icon: Inbox },
      { key: 'reports', title: 'Reports', href: '/pm/reports', icon: BarChart2 },
    ],
  },
  {
    key: 'messages',
    title: 'Messages',
    icon: MessageCircle,
    href: '#',
  },
];

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('foryou');

  return (
    <motion.div
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={clsx(
        isCollapsed ? 'w-16' : 'w-64',
        'relative flex h-full flex-col border-r border-border-gray p-2'
      )}
    >
      <div
        className="absolute top-10 -right-3 cursor-pointer rounded-full bg-primary p-0.5"
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronLeft size={16} className="text-white" />
        </motion.div>
      </div>

      <div className="flex items-center gap-2 px-2 py-3">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary">
          <span className="text-xs font-bold text-white">C</span>
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-semibold whitespace-nowrap text-primary-gray"
            >
              Colabrix
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full text-[13px] text-primary-gray">
        {sidebarItems.map((item) => {
          if (item.children) {
            return (
              <SidebarItemWithChildren
                key={item.key}
                item={item}
                isCollapsed={isCollapsed}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            );
          }
          return (
            <SidebarItem
              key={item.key}
              item={item}
              isCollapsed={isCollapsed}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

export default Sidebar;
