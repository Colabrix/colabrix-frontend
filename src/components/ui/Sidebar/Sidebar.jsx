import clsx from 'clsx';
import React from 'react';
import { useState } from 'react';
import SidebarItemWithChildren from './SidebarItemWithChildren';
import SidebarItem from './SidebarItem';
import { Calendar, ChevronLeft, KanbanSquare, LayoutDashboard, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

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
      { key: 'overview', title: 'Overview', href: '/pm/overview' },
      { key: 'tasks', title: 'Tasks', href: '/pm/tasks' },
      { key: 'sprints', title: 'Sprints', href: '/pm/sprints' },
      { key: 'backlog', title: 'Backlog', href: '/pm/backlog' },
      { key: 'reports', title: 'Reports', href: '/pm/reports' },
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
      className={clsx(isCollapsed ? 'w-16' : 'w-64', 'relative flex flex-col bg-gray-100 p-2')}
    >
      <div
        className="absolute top-10 -right-3 rounded-full bg-primary"
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        <ChevronLeft />
      </div>
      <div className="mt-20 w-full text-[14px] font-medium text-test">
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
