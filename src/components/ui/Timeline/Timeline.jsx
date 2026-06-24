import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ChevronDown,
  Calendar as CalendarIcon,
  Search,
  Filter,
} from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

const VIEWS = {
  MONTH: 'month',
  WEEK: 'week',
};

// Mock Data
// Mock Data - Resources removed as per request

const TODAY = new Date();
const YEAR = TODAY.getFullYear();
const MONTH = TODAY.getMonth();

const EVENTS = [
  {
    id: 'e1',
    resourceId: 'r1',
    title: 'Implement Auth',
    start: new Date(YEAR, MONTH, 10),
    end: new Date(YEAR, MONTH, 15),
    progress: 60,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    id: 'e2',
    resourceId: 'r2',
    title: 'API Setup',
    start: new Date(YEAR, MONTH, 12),
    end: new Date(YEAR, MONTH, 20),
    progress: 30,
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
  {
    id: 'e3',
    resourceId: 'r3',
    title: 'Design System',
    start: new Date(YEAR, MONTH, 5),
    end: new Date(YEAR, MONTH, 18),
    progress: 80,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    id: 'e4',
    resourceId: 'r1',
    title: 'Dashboard UI',
    start: new Date(YEAR, MONTH, 18),
    end: new Date(YEAR, MONTH, 25),
    progress: 0,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    id: 'e5',
    resourceId: 'r4',
    title: 'Blog Launch',
    start: new Date(YEAR, MONTH, 22),
    end: new Date(YEAR, MONTH, 28),
    progress: 10,
    color: 'bg-pink-100 text-pink-700 border-pink-200',
  },
];

function Timeline() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState(VIEWS.MONTH);
  const scrollContainerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Helper to get days for the grid
  const getDays = () => {
    const days = [];
    const center = new Date(currentDate); // Center point

    // Generate a wide range: e.g., 60 days before and 60 days after
    const range = 60;

    // Start of the window
    const start = new Date(center);
    start.setDate(start.getDate() - range);

    // Total days = range * 2
    for (let i = 0; i < range * 2; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const days = getDays();
  const COLUMN_WIDTH = view === VIEWS.WEEK ? 120 : 60;

  const handleToday = () => {
    // Scroll to center where Today is likely located
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Calculate position of Today
      const dayIndex = days.findIndex((d) => isToday(d));
      if (dayIndex !== -1) {
        const scrollPos = dayIndex * COLUMN_WIDTH - container.clientWidth / 2 + COLUMN_WIDTH / 2;
        container.scrollTo({ left: scrollPos, behavior: 'smooth' });
      }
    }
  };

  // Drag Scroll Handlers
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Scroll-fast multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Scroll to today on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const dayIndex = days.findIndex((d) => isToday(d));
      if (dayIndex !== -1) {
        const scrollPos =
          dayIndex * COLUMN_WIDTH - scrollContainerRef.current.clientWidth / 2 + COLUMN_WIDTH / 2;
        scrollContainerRef.current.scrollLeft = scrollPos;
      }
    }
  }, []); // Run once on mount (window size dependency omitted for simplicity)

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Render Functions
  const renderHeader = () => {
    return (
      <div className="flex flex-col border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToday}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Today
            </button>
            <div className="mx-1 h-6 w-px bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  };

  const renderTimelineBody = () => {
    const totalWidth = days.length * COLUMN_WIDTH;
    const start = days[0];

    // Calculate Today Position
    const today = new Date();
    // Reset time components for accurate day comparison if needed, or keep precise for line
    // For line position, exact time is better.
    const timeDiff = today.getTime() - start.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    const todayLeft = dayDiff * COLUMN_WIDTH;

    // Check if today is within range (roughly)
    const showTodayLine = dayDiff >= -0.5 && dayDiff <= days.length;

    return (
      <div
        ref={scrollContainerRef}
        className="custom-scrollbar relative flex-1 cursor-grab overflow-auto select-none"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex min-h-full min-w-max flex-col">
          {/* Header: Dates */}
          <div className="sticky top-0 z-20 flex h-12 border-b border-gray-200 bg-gray-50/95 shadow-sm backdrop-blur-sm">
            {days.map((day, i) => {
              const isFirstDay = day.getDate() === 1;
              return (
                <div
                  key={i}
                  style={{ width: `${COLUMN_WIDTH}px` }}
                  className={clsx(
                    'relative flex flex-shrink-0 flex-col items-center justify-center border-r border-gray-100 text-xs transition-colors',
                    isToday(day) ? 'bg-indigo-50/30 font-semibold text-primary' : 'text-gray-500',
                    isFirstDay && 'border-l-2 border-l-gray-300 bg-gray-50'
                  )}
                >
                  {isFirstDay ? (
                    <>
                      <span className="font-bold tracking-tight text-gray-900 uppercase">
                        {day.toLocaleDateString('default', { month: 'short' })}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400">
                        {day.getFullYear()}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] uppercase opacity-70">
                        {day.toLocaleDateString('default', { weekday: 'short' })}
                      </span>
                      <span
                        className={clsx(
                          'mt-0.5',
                          isToday(day) &&
                            'flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-sm'
                        )}
                      >
                        {day.getDate()}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Timeline Content */}
          <div className="relative min-h-full flex-1">
            {/* Background Grid */}
            <div className="pointer-events-none absolute inset-0 z-0 flex min-h-full">
              {days.map((day, i) => {
                const isFirstDay = day.getDate() === 1;
                return (
                  <div
                    key={i}
                    style={{ width: `${COLUMN_WIDTH}px` }}
                    className={clsx(
                      'h-full flex-shrink-0 border-r border-gray-100',
                      [0, 6].includes(day.getDay()) ? 'bg-gray-50/20' : 'bg-transparent',
                      isFirstDay && 'border-l border-l-gray-200'
                    )}
                  ></div>
                );
              })}
            </div>

            {/* Today Line */}
            {showTodayLine && (
              <div
                className="pointer-events-none absolute top-0 bottom-0 z-30 border-l-2 border-primary"
                style={{ left: `${todayLeft}px` }}
              >
                <div className="absolute top-2 z-40 -translate-x-1/2 rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  TODAY
                </div>
              </div>
            )}

            {/* Events */}
            <div className="relative z-10 space-y-1 pt-2">
              {EVENTS.map((event) => {
                const startDate = event.start;
                const endDate = event.end;

                const offsetDays = (startDate - start) / (1000 * 60 * 60 * 24);
                const durationDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

                if (offsetDays + durationDays < -5 || offsetDays > days.length) return null; // Loose bounds

                const left = offsetDays * COLUMN_WIDTH;
                const width = Math.max(durationDays * COLUMN_WIDTH, 4);

                return (
                  <div
                    key={event.id}
                    className="group relative h-10 w-full transition-colors hover:bg-gray-50/50"
                  >
                    <motion.div
                      layoutId={event.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={clsx(
                        'absolute top-1 bottom-1 flex cursor-pointer items-center truncate overflow-hidden rounded-md border px-2 text-xs font-medium shadow-sm transition-all hover:shadow-md hover:brightness-95',
                        event.color
                      )}
                      style={{ left: `${left}px`, width: `${width}px` }}
                    >
                      <div className="w-full truncate">{event.title}</div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {renderHeader()}
      {renderTimelineBody()}
    </div>
  );
}

export default Timeline;
