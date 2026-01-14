import clsx from 'clsx';
import { Backpack } from 'lucide-react';
import React from 'react';
import SidebarToolTip from './SidebarToolTip';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

function ChildItems({ item, isCollapsed, isLast, activeTab, setActiveTab }) {
  const [showSidebarToolTip, setShowSidebarToolTip] = useState(false);
  return (
    <motion.div
      layout
      className="relative pb-2"
      onMouseEnter={() => setShowSidebarToolTip(true)}
      onMouseLeave={() => setShowSidebarToolTip(false)}
      onClick={() => setActiveTab(item.key)}
    >
      <span
        className={clsx(
          isLast ? 'h-[40%]' : 'h-full',
          isCollapsed ? 'hidden' : 'block',
          'absolute top-0 -left-3 w-[2px] bg-gray-300'
        )}
      />
      <span
        className={clsx(
          isCollapsed && 'hidden',
          'absolute top-3 -left-3 h-3 w-3 rounded-bl-lg border-b-2 border-l border-gray-300'
        )}
      />
      <div
        href={item.href}
        className={clsx(
          activeTab === item.key ? 'bg-primary' : 'hover:bg-gray-300',
          isCollapsed && 'pl-[14px]',
          'relative flex items-center gap-2 rounded-xl p-2 transition-all'
        )}
      >
        <Backpack size={20} className="block w-fit shrink-0" />
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={clsx('block text-nowrap whitespace-nowrap')}
            >
              {item.title} {isLast ? 'yes' : 'no'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {isCollapsed && showSidebarToolTip && (
        <SidebarToolTip title={item.title} id={'child-sidebar-tooltip'} />
      )}
    </motion.div>
  );
}

export default ChildItems;
