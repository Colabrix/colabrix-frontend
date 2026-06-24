import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MessageCircle, Plus, LayoutGrid, CirclePlus, GripVertical } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- MOCK DATA (Kept same as yours) ---
const generateData = () => {
  const columnTitles = [
    'BACKLOG',
    'TO DO',
    'IN PROGRESS',
    'BLOCKED',
    'REVIEW',
    'QA TESTING',
    'UAT',
    'DEPLOYMENT',
    'DONE',
    'ARCHIVED',
  ];
  const columns = {};
  let idCounter = 1;
  const priorityColors = ['purple', 'blue', 'orange', 'red', 'green'];
  const possibleTags = [
    { name: 'Design', color: 'purple' },
    { name: 'Backend', color: 'blue' },
    { name: 'Frontend', color: 'orange' },
    { name: 'Bug', color: 'red' },
    { name: 'Feature', color: 'green' },
    { name: 'Urgent', color: 'pink' },
  ];

  columnTitles.forEach((title, i) => {
    const colId = `col-${i}`;
    columns[colId] = {
      id: colId,
      title: title,
      items: Array.from({ length: 6 }).map((_, j) => {
        const numTags = Math.floor(Math.random() * 3) + 2;
        const shuffled = [...possibleTags].sort(() => 0.5 - Math.random());
        return {
          id: `task-${i}-${j}`,
          content: `Task ${idCounter++}: ${title}`,
          desc: 'Optimize the database query logic.',
          tags: shuffled.slice(0, numTags),
          priorityColor: priorityColors[Math.floor(Math.random() * priorityColors.length)],
          date: new Date(2025, 0, Math.floor(Math.random() * 28) + 1),
          comments: Math.floor(Math.random() * 5),
          assignee: Math.random() > 0.3 ? 'John Doe' : null,
        };
      }),
    };
  });
  return columns;
};

// --- OPTIMIZED COMPONENTS ---

// 1. Smoother Drop Indicator (Animates height)
const DropIndicator = ({ isVisible }) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0, margin: 0 }}
      animate={
        isVisible
          ? { height: 4, opacity: 1, marginBottom: 8 }
          : { height: 0, opacity: 0, margin: 0 }
      }
      transition={{ duration: 0.1 }}
      className="w-full rounded-full bg-blue-600"
    />
  );
};

// 2. Optimized Task Card
const TaskCard = React.memo(({ item, columnId, index, handleDragStart, handleDragOver }) => {
  const [isDragging, setIsDragging] = useState(false);

  const getTagClasses = (color) => {
    const colorMap = {
      orange: 'bg-orange-50 text-orange-600 border-orange-100',
      blue: 'bg-blue-50 text-blue-600 border-blue-100',
      pink: 'bg-pink-50 text-pink-600 border-pink-100',
      green: 'bg-green-50 text-green-600 border-green-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-100',
      red: 'bg-red-50 text-red-600 border-red-100',
    };
    return colorMap[color] || 'bg-gray-50 text-gray-600 border-gray-100';
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const onDragStart = (e) => {
    // 1. Data Setup
    handleDragStart(e, { taskId: item.id, colId: columnId, index });

    // 2. Visual Trick: Let browser take a full-opacity snapshot first
    // Then fade out the element in the DOM
    requestAnimationFrame(() => setIsDragging(true));
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <>
      <div
        draggable="true"
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={(e) => handleDragOver(e, { colId: columnId, index })}
        className={cn('group relative touch-none', isDragging && 'opacity-30')} // Dim original while dragging
      >
        <motion.div
          layout // Standard layout only (no layoutId to prevent flying)
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          // Crisp spring transition to reduce blur/jitter
          transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 1 }}
          className="mb-3 cursor-grab rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow duration-200 select-none hover:shadow-md active:cursor-grabbing"
        >
          {/* Decorative Left Border */}
          <div
            className={cn(
              'absolute top-[14px] -left-[1px] h-[60%] w-1 rounded-r-full',
              item.priorityColor === 'purple'
                ? 'bg-purple-400'
                : item.priorityColor === 'blue'
                  ? 'bg-blue-400'
                  : item.priorityColor === 'orange'
                    ? 'bg-orange-400'
                    : item.priorityColor === 'red'
                      ? 'bg-red-400'
                      : item.priorityColor === 'green'
                        ? 'bg-green-400'
                        : 'bg-gray-400'
            )}
          />

          <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
            <GripVertical size={16} className="text-gray-300" />
          </div>

          <div className="mb-3 flex flex-wrap gap-2 pl-2">
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className={cn(
                  'rounded border px-1.5 py-0.5 text-[10px] font-bold',
                  getTagClasses(tag.color)
                )}
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div className="mb-3 pl-2">
            <h4 className="mb-1 text-sm leading-tight font-bold text-gray-800">{item.content}</h4>
            <p className="line-clamp-2 text-[11px] text-gray-400">{item.desc}</p>
          </div>

          <div className="flex items-center justify-between border-t border-gray-50 pt-2 pl-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={12} />
              <span className="text-[10px] font-medium">{formatDate(item.date)}</span>
            </div>
            {item.assignee && (
              <div
                className="h-5 w-5 rounded-full border border-white bg-gradient-to-br from-gray-200 to-gray-300 shadow-sm"
                title={item.assignee}
              />
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
});

// 3. Optimized Column
const KanbanColumn = ({ id, column, activeId, onDrop, setHoverState }) => {
  const [indicatorIndex, setIndicatorIndex] = useState(null);

  const handleDragOver = (e, target) => {
    e.preventDefault();
    // Throttle checks slightly if needed, but usually pure JS is fast enough here
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const mouseY = e.clientY;
    const threshold = rect.top + rect.height / 2;

    const newIndex = mouseY < threshold ? target.index : target.index + 1;
    if (newIndex !== indicatorIndex) setIndicatorIndex(newIndex);
  };

  const handleDragLeave = (e) => {
    // Prevent flickering when moving between children and parent
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIndicatorIndex(null);
    }
  };

  const handleColumnDrop = (e) => {
    e.preventDefault();
    const dataStr = e.dataTransfer.getData('dragData');
    if (!dataStr) return;

    const data = JSON.parse(dataStr);
    const finalIndex = indicatorIndex === null ? column.items.length : indicatorIndex;

    onDrop(data, id, finalIndex);
    setIndicatorIndex(null);
  };

  return (
    <div
      className="mx-2 flex h-fit w-[340px] min-w-[340px] flex-col transition-all"
      onDragOver={(e) => {
        e.preventDefault();
        // Fallback: if hovering empty space at bottom, set to end
        if (e.target === e.currentTarget) setIndicatorIndex(column.items.length);
      }}
      onDrop={handleColumnDrop}
      onDragLeave={handleDragLeave}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-xl border border-[#FDFDFD]/50 bg-[#FDFDFD] px-3 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-extrabold tracking-wide text-gray-700 uppercase">
            {column.title}
          </h2>
          <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
            {column.items.length}
          </span>
        </div>
        <div className="flex gap-1">
          <CirclePlus
            size={16}
            className="cursor-pointer text-gray-400 transition-colors hover:text-blue-600"
          />
        </div>
      </div>

      <div className="custom-scrollbar min-h-[150px] flex-1 rounded-b-xl bg-[#F9F9F9] px-1 pt-2 pb-10">
        {/* AnimatePresence handles the Item entering/exiting the DOM */}
        <AnimatePresence mode="popLayout" initial={false}>
          {column.items.map((task, index) => (
            <React.Fragment key={task.id}>
              {/* Top Indicator */}
              {activeId && activeId !== task.id && indicatorIndex === index && (
                <DropIndicator isVisible={true} />
              )}

              <TaskCard
                item={task}
                columnId={id}
                index={index}
                handleDragStart={(e, data) => {
                  e.dataTransfer.setData('dragData', JSON.stringify(data));
                  e.dataTransfer.effectAllowed = 'move';
                  setHoverState(task.id);
                }}
                handleDragOver={handleDragOver}
              />

              {/* Bottom Indicator (Only for last item) */}
              {activeId &&
                activeId !== task.id &&
                indicatorIndex === index + 1 &&
                index === column.items.length - 1 && <DropIndicator isVisible={true} />}
            </React.Fragment>
          ))}
        </AnimatePresence>

        {column.items.length === 0 && (
          <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-xs text-gray-400">
            Drop items here
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN BOARD (Logic mostly same, styling tweaks) ---
export default function Kanban() {
  const [columns, setColumns] = useState(generateData());
  const [activeDragId, setActiveDragId] = useState(null);
  const scrollContainerRef = useRef(null);

  const handleDrop = useCallback((sourceData, destColId, destIndex) => {
    setActiveDragId(null);
    const { colId: sourceColId, index: sourceIndex } = sourceData;

    // Optimization: Don't rerender if dropping in same spot
    if (sourceColId === destColId && sourceIndex === destIndex) return;
    if (sourceColId === destColId && sourceIndex === destIndex - 1) return;

    setColumns((prev) => {
      const newData = { ...prev };
      const sourceList = [...newData[sourceColId].items];
      const [movedTask] = sourceList.splice(sourceIndex, 1);

      const destList = sourceColId === destColId ? sourceList : [...newData[destColId].items];

      // Adjust index if moving within same list downwards
      let finalIndex = destIndex;
      if (sourceColId === destColId && sourceIndex < destIndex) {
        finalIndex -= 1;
      }

      destList.splice(finalIndex, 0, movedTask);

      newData[sourceColId] = { ...newData[sourceColId], items: sourceList };
      if (sourceColId !== destColId) {
        newData[destColId] = { ...newData[destColId], items: destList };
      }

      return newData;
    });
  }, []);

  const handleContainerDragOver = (e) => {
    e.preventDefault(); // Drop allow karne ke liye zaroori hai

    const container = scrollContainerRef.current;
    if (!container) return;

    const { top, bottom } = container.getBoundingClientRect();
    const mouseY = e.clientY;

    // Config: Kitne pass aane par scroll shuru ho
    const edgeThreshold = 100; // 100px from edge
    const scrollSpeed = 15; // Speed of scroll

    // Logic: Agar mouse bottom edge ke pass hai -> Scroll Down
    if (mouseY > bottom - edgeThreshold) {
      container.scrollTop += scrollSpeed;
    }
    // Logic: Agar mouse top edge ke pass hai -> Scroll Up
    else if (mouseY < top + edgeThreshold) {
      container.scrollTop -= scrollSpeed;
    }

    // Logic: Agar mouse right edge ke pass hai (Horizontal bhi support karega)
    const { right, left } = container.getBoundingClientRect();
    const mouseX = e.clientX;

    if (mouseX > right - edgeThreshold) {
      container.scrollLeft += scrollSpeed;
    } else if (mouseX < left + edgeThreshold) {
      container.scrollLeft -= scrollSpeed;
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F3F4F6] font-sans text-slate-900">
      <header className="z-20 flex flex-none items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-600 p-2">
            <LayoutGrid size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-800">Kanban Board</span>
        </div>
      </header>

      <div
        ref={scrollContainerRef}
        onDragOver={handleContainerDragOver}
        className="relative flex-1 overflow-auto bg-[#F3F4F6]"
      >
        <div className="flex h-full w-max items-start gap-2 px-6 py-6">
          {Object.entries(columns).map(([colId, colData]) => (
            <KanbanColumn
              key={colId}
              id={colId}
              column={colData}
              activeId={activeDragId}
              setHoverState={setActiveDragId}
              onDrop={handleDrop}
            />
          ))}

          <div className="min-w-[340px] px-2 opacity-50 transition-opacity hover:opacity-100">
            <button className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600">
              <Plus size={20} />
              <span className="font-medium">Add Column</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
