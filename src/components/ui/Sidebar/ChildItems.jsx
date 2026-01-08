import clsx from 'clsx';
import { Backpack } from 'lucide-react';
import React from 'react';
import SidebarToolTip from './SidebarToolTip';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

function ChildItems({ item, isCollapsed, activeTab, setActiveTab }) {
  const [showSidebarToolTip, setShowSidebarToolTip] = useState(false);
  return (
    <motion.div
      layout
      className="relative pb-2"
      onMouseEnter={() => setShowSidebarToolTip(true)}
      onMouseLeave={() => setShowSidebarToolTip(false)}
    >
      <div
        href={item.href}
        className={clsx(
          isCollapsed && 'justify-center py-3',
          'flex items-center gap-2 rounded-xl p-2'
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
              {item.title}
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
