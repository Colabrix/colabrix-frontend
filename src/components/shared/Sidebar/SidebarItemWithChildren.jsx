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
        className="sidebar-text relative last:mb-0"
        onMouseEnter={() => setShowToolTip(true)}
        onMouseLeave={() => setShowToolTip(false)}
        onClick={() => setActiveTab(item.key)}
      >
        <motion.a
          className={clsx(
            isCollapsed && 'justify-center',
            activeTab === item.key ? 'bg-primary text-white' : 'hover:bg-indigo-50',
            'flex items-center justify-start gap-2 overflow-x-hidden rounded-xl p-2'
          )}
          href={item.href}
        >
          <Icon size={16} className="block w-fit shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.2 }}
                className={clsx('block whitespace-nowrap')}
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
        className={clsx(isCollapsed ? 'ml-0' : 'ml-8', 'flex flex-col transition-all duration-300')}
      >
        {item.children.slice(0, 3).map((child, index) => (
          <ChildItems
            key={child.key}
            item={child}
            isLast={2 === index}
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
