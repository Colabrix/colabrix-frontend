import React from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';

function SidebarToolTip({ title, id }) {
  return (
    <motion.div
      layoutId={id}
      className={clsx(
        title.length > 10 ? 'text-wrap' : 'text-nowrap',
        'absolute top-1/2 left-full z-40 ml-2 -translate-y-1/2 rounded-md border border-neutral-800 bg-gray-800 p-1 px-2 text-neutral-100'
      )}
    >
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {title}
      </motion.span>
    </motion.div>
  );
}

export default SidebarToolTip;
