import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';
import {
  LayoutDashboard,
  List,
  ChartGantt,
  SquareKanban,
  GalleryVerticalEnd,
  Calendar,
  Layers,
} from 'lucide-react';

const tabs = [
  {
    id: 'summary',
    label: 'Summary',
    icon: LayoutDashboard,
  },
  {
    id: 'list',
    label: 'List',
    icon: List,
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: ChartGantt,
  },
  {
    id: 'kanban',
    label: 'Kanban Board',
    icon: SquareKanban,
  },
  {
    id: 'scrum',
    label: 'Scrum Board',
    icon: GalleryVerticalEnd,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: Calendar,
  },
  {
    id: 'backlog',
    label: 'Backlog',
    icon: Layers,
  },
];

function PMTabBar() {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <AnimatePresence>
      <div className="sidebar-text flex h-fit w-fit">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={clsx(
              'relative flex items-center justify-center px-4 py-3 text-sm font-medium text-primary-gray transition-all hover:text-black'
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="z-10 flex items-center gap-2">
              <tab.icon size={16} />
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute start-0 top-11 h-[2px] w-full bg-primary-gray"
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </AnimatePresence>
  );
}

export default PMTabBar;
