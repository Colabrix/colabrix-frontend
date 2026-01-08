import clsx from 'clsx';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import SidebarToolTip from './SidebarToolTip';

function SidebarItem({ item, isCollapsed, activeTab, setActiveTab }) {
  const [showToolTip, setShowToolTip] = useState(false);
  const Icon = item.icon;
  return (
    <motion.div
      className="relative pb-2 last:mb-0"
      onMouseEnter={() => setShowToolTip(true)}
      onMouseLeave={() => setShowToolTip(false)}
    >
      <motion.a
        className={clsx(
          activeTab === item.key && 'bg-primary',
          'flex items-center justify-start gap-2 overflow-x-hidden rounded-2xl p-3 hover:bg-gray-300'
        )}
        href={item.href}
      >
        <Icon size={24} className="block w-fit shrink-0" />

        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.2 }}
              className={clsx('block text-nowrap whitespace-nowrap')}
            >
              {item.title}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.a>
      {isCollapsed && showToolTip && (
        <SidebarToolTip title={item.title} id="main-sidebar-tooltip" />
      )}
    </motion.div>
  );
}

export default SidebarItem;
