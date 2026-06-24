import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Calendar,
  MessageSquare,
  LayoutGrid,
  Plus,
  MoreHorizontal,
  MessageCircle,
  CirclePlus,
} from 'lucide-react';
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

  // Yeh arrays define karo PEHLE
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
        // Random 2-4 tags select karo
        const numTags = Math.floor(Math.random() * 3) + 2;
        const shuffled = [...possibleTags].sort(() => 0.5 - Math.random());
        const selectedTags = shuffled.slice(0, numTags);

        return {
          id: `task-${i}-${j}`,
          content: `Task ${idCounter++}: ${title}`,
          desc: 'Optimize the database query logic and improve performance metrics.',
          tags: selectedTags, // Dynamic tags, hardcoded nahi
          priorityColor: priorityColors[Math.floor(Math.random() * priorityColors.length)],
          date: new Date(2025, 0, Math.floor(Math.random() * 28) + 1),
          comments: Math.floor(Math.random() * 5),
          assignee: Math.random() > 0.3 ? 'John Doe' : null, // Yeh missing tha
        };
      }),
    };
  });
  return columns;
};

// --- COMPONENTS ---

const TaskCard = React.memo(({ item, index }) => {
  // Helper function for tag colors
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

  // Helper function for priority border color
  const getBorderColor = (color) => {
    const colorMap = {
      purple: 'border-l-purple-400',
      blue: 'border-l-blue-400',
      orange: 'border-l-orange-400',
      red: 'border-l-red-400',
      green: 'border-l-green-400',
    };
    return colorMap[color] || 'border-l-gray-400';
  };

  // Format date as DD/MM/YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...provided.draggableProps.style }}
          className="mb-3 outline-none"
        >
          <div
            className={cn(
              'group relative rounded-xl border border-gray-200 bg-white p-3 transition-all duration-200',
              snapshot.isDragging
                ? 'z-50 scale-105 rotate-2 shadow-2xl ring-2 ring-blue-500/50'
                : 'shadow-md hover:shadow-lg'
            )}
          >
            {/* Decorative Left Border Line - Absolute positioned */}
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

            {/* Title & Description - No border, just content */}
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
                {item.comments > 0 && (
                  <span className="text-xs text-gray-500">{item.comments}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
});

// 2. Column Component (SCROLL REMOVED)
const KanbanColumn = ({ columnId, column }) => {
  return (
    // Changed: No fixed height, No overflow-y-auto. Removed h-full.
    <div className="mx-2 flex h-fit w-[342px] min-w-[342px] flex-col rounded-xl border border-[#FDFDFD]/50 bg-[#FDFDFD]">
      {/* Header - Added 'sticky' so it stays visible if page scrolls */}
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-xl border-b border-[#FDFDFD] bg-[#FDFDFD] p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold tracking-wider uppercase">{column.title}</h2>
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold">
            {column.items.length}
          </span>
        </div>
        <CirclePlus size={18} className="cursor-pointer hover:text-gray-700" />
      </div>

      {/* Droppable Area - REMOVED overflow-y-auto */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              'min-h-[150px] flex-1 px-3 pb-4 transition-colors duration-200', // Min-height ensures drop area exists
              snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
            )}
          >
            {column.items.map((item, index) => (
              <TaskCard key={item.id} item={item} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

// 3. Main Board
export default function UltimateKanban() {
  const [columns, setColumns] = useState(generateData());

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index)
        return;

      const sourceCol = columns[source.droppableId];
      const destCol = columns[destination.droppableId];
      const sourceItems = [...sourceCol.items];
      const destItems = sourceCol === destCol ? sourceItems : [...destCol.items];

      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
        [destination.droppableId]: { ...destCol, items: destItems },
      });
    },
    [columns]
  );

  return (
    <div className="flex h-screen flex-col bg-white font-sans text-slate-900">
      <header className="sticky top-0 z-20 flex-none border-b border-gray-100 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <LayoutGrid size={18} className="text-blue-600" />
          <span className="text-lg font-bold tracking-tight"> Kanban Board</span>
        </div>
      </header>

      {/* Main Board Container */}
      {/* Changed: overflow-auto allows BOTH X and Y scrolling on the main window */}
      <div className="relative flex-1 overflow-auto bg-[#F9F9F9]">
        <DragDropContext onDragEnd={onDragEnd}>
          {/* w-max ensures horizontal scroll triggers. h-full ensures full height canvas */}
          <div className="flex h-full w-max items-start p-6">
            {Object.values(columns).map((column) => (
              <KanbanColumn key={column.id} columnId={column.id} column={column} />
            ))}
            {/* Spacer for adding new section */}
            <div className="w-[320px] min-w-[320px] px-2">
              <button className="flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-3 text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-800">
                <Plus size={20} />
                <span className="font-medium">Add Section</span>
              </button>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
