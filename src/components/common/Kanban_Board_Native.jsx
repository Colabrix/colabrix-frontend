import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MessageCircle, Plus, LayoutGrid, CirclePlus, GripVertical } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- MOCK DATA ---
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
        const selectedTags = shuffled.slice(0, numTags);

        return {
          id: `task-${i}-${j}`,
          content: `Task ${idCounter++}: ${title}`,
          desc: 'Optimize the database query logic and improve performance metrics.',
          tags: selectedTags,
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

// --- COMPONENTS ---

// Drop Indicator
const DropIndicator = ({ isVisible }) => {
  return (
    <div
      className={cn(
        'my-1 h-0.5 w-full rounded-full bg-blue-600 transition-opacity duration-200',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    />
  );
};

// Task Card - Ultimate Style
const TaskCard = React.memo(({ item, columnId, index, handleDragStart, handleDragOver }) => {
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
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div
      draggable="true"
      onDragStart={(e) => handleDragStart(e, { taskId: item.id, colId: columnId, index })}
      onDragOver={(e) => handleDragOver(e, { colId: columnId, index })}
      className="group relative"
    >
      <motion.div
        layout
        layoutId={item.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="mb-3 cursor-grab rounded-xl border border-gray-200 bg-white p-3 shadow-md transition-all duration-200 hover:shadow-lg active:cursor-grabbing"
      >
        {/* Decorative Left Border Line */}
        <div
          className={cn(
            'absolute top-[52px] -left-[2px] h-[62px] w-1 rounded-full',
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

        {/* Grip Icon */}
        <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
          <GripVertical size={16} className="text-gray-300" />
        </div>

        {/* Tags Row */}
        <div className="mb-3 flex flex-wrap gap-2">
          {item.tags.map((tag, idx) => (
            <span
              key={idx}
              className={cn(
                'rounded-md border px-2 py-1 text-xs font-semibold',
                getTagClasses(tag.color)
              )}
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Title & Description */}
        <div className="mb-3">
          <h4 className="mb-1 text-base font-bold text-gray-900">{item.content}</h4>
          <p className="text-xs text-gray-500">{item.desc}</p>
        </div>

        {/* Assignee */}
        <div className="mb-3 flex items-center gap-2 border-b border-gray-200 pb-3">
          <div className="h-4 w-4 rounded-full bg-gray-300" />
          <span className="text-xs text-gray-600">{item.assignee || 'To be assigned'}</span>
        </div>

        {/* Footer: Date and Comments */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar size={14} />
            <span className="text-sm">{formatDate(item.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={14} className="text-gray-400" />
            {item.comments > 0 && <span className="text-xs text-gray-500">{item.comments}</span>}
          </div>
        </div>
      </motion.div>
    </div>
  );
});

// Column Component
const KanbanColumn = ({ id, column, activeId, onDrop, setHoverState }) => {
  const [indicatorIndex, setIndicatorIndex] = useState(null);

  const handleDragOver = (e, target) => {
    e.preventDefault();

    if (!target) {
      setIndicatorIndex(column.items.length);
      return;
    }

    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const mouseY = e.clientY;
    const threshold = rect.top + rect.height / 2;

    if (mouseY < threshold) {
      setIndicatorIndex(target.index);
    } else {
      setIndicatorIndex(target.index + 1);
    }
  };

  const handleDragLeave = () => {
    setIndicatorIndex(null);
  };

  const handleColumnDrop = (e) => {
    e.preventDefault();
    setIndicatorIndex(null);

    const data = JSON.parse(e.dataTransfer.getData('dragData'));
    const finalIndex = indicatorIndex === null ? column.items.length : indicatorIndex;

    onDrop(data, id, finalIndex);
  };

  return (
    <div
      className="mx-2 flex h-fit w-[342px] min-w-[342px] flex-col rounded-xl border border-[#FDFDFD]/50 bg-[#FDFDFD]"
      onDragOver={(e) => {
        e.preventDefault();
        if (e.target === e.currentTarget) setIndicatorIndex(column.items.length);
      }}
      onDrop={handleColumnDrop}
      onDragLeave={handleDragLeave}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-xl border-b border-[#FDFDFD] bg-[#FDFDFD] p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold tracking-wider uppercase">{column.title}</h2>
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold">
            {column.items.length}
          </span>
        </div>
        <CirclePlus size={18} className="cursor-pointer hover:text-gray-700" />
      </div>

      {/* Droppable Area */}
      <div className="min-h-[150px] flex-1 px-3 pb-4">
        <AnimatePresence mode="popLayout">
          {column.items.map((task, index) => (
            <React.Fragment key={task.id}>
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

              {activeId &&
                activeId !== task.id &&
                indicatorIndex === index + 1 &&
                index === column.items.length - 1 && <DropIndicator isVisible={true} />}
            </React.Fragment>
          ))}
        </AnimatePresence>

        {column.items.length === 0 && (
          <div className="m-2 flex h-full min-h-[100px] items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-xs text-gray-400">
            Empty List
          </div>
        )}
      </div>
    </div>
  );
};

// Main Board
export default function NativeKanbanBoard() {
  const [columns, setColumns] = useState(generateData());
  const [activeDragId, setActiveDragId] = useState(null);
  const scrollContainerRef = useRef(null);

  const handleDrop = useCallback((sourceData, destColId, destIndex) => {
    setActiveDragId(null);
    const { taskId, colId: sourceColId, index: sourceIndex } = sourceData;

    if (sourceColId === destColId && sourceIndex === destIndex) return;

    setColumns((prev) => {
      const newData = { ...prev };

      const sourceList = [...newData[sourceColId].items];
      const [movedTask] = sourceList.splice(sourceIndex, 1);

      const destList = sourceColId === destColId ? sourceList : [...newData[destColId].items];

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

  const handleGlobalDragOver = (e) => {
    e.preventDefault();
    const container = scrollContainerRef.current;
    if (!container) return;

    const { left, right } = container.getBoundingClientRect();
    const buffer = 150;
    const mouseX = e.clientX;

    if (mouseX > right - buffer) {
      container.scrollLeft += 5;
    } else if (mouseX < left + buffer) {
      container.scrollLeft -= 5;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-white font-sans text-slate-900">
      <header className="sticky top-0 z-20 flex-none border-b border-gray-100 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <LayoutGrid size={18} className="text-blue-600" />
          <span className="text-lg font-bold tracking-tight">Native Kanban Board</span>
        </div>
      </header>

      <div
        ref={scrollContainerRef}
        onDragOver={handleGlobalDragOver}
        className="relative flex-1 overflow-auto bg-[#F9F9F9]"
      >
        <div className="flex h-full w-max items-start p-6">
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

          <div className="w-[320px] min-w-[320px] px-2">
            <button className="flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-3 text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-800">
              <Plus size={20} />
              <span className="font-medium">Add Section</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
