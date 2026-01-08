import clsx from 'clsx';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import SidebarToolTip from './SidebarToolTip';
import SidebarItem from './SidebarItem';
import ChildItems from './ChildItems';

function SidebarItemWithChildren({ item, isCollapsed, activeTab, setActiveTab }) {
  const [showToolTip, setShowToolTip] = useState(false);
  const Icon = item.icon;
  return (
    <div>
      <motion.div
        className="text-sidebarItemFont relative last:mb-0"
        onMouseEnter={() => setShowToolTip(true)}
        onMouseLeave={() => setShowToolTip(false)}
      >
        <motion.a
          className={clsx(
            isCollapsed && 'justify-center',
            activeTab === item.key && 'bg-purple-300',
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
      <motion.div
        layout
        className={clsx(isCollapsed ? 'ml-0' : 'ml-8', 'transition-all duration-300')}
      >
        {item.children.slice(0, 3).map((child) => (
          <ChildItems
            key={child.key}
            item={child}
            isCollapsed={isCollapsed}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default SidebarItemWithChildren;
