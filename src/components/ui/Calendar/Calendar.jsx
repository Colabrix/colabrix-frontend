import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const VIEWS = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
};

const MOCK_EVENTS = [
  { day: 5, hour: 10, title: 'Sprint Review', color: 'bg-blue-100 text-blue-700' },
  { day: 12, hour: 14, title: 'Design Sync', color: 'bg-purple-100 text-purple-700' },
  { day: 15, hour: 9, title: 'Client Meeting', color: 'bg-amber-100 text-amber-700' },
  { day: 24, hour: 16, title: 'Release v1.0', color: 'bg-emerald-100 text-emerald-700' },
];

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState(VIEWS.MONTH);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getDaysInMonth = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const startDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const days = [];

    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startDayIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isPrevMonth: true,
        fullDate: new Date(year, month - 1, prevMonthDays - i),
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i),
      });
    }

    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isNextMonth: true,
        fullDate: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = date.getDay();
    const diff = day === 0 ? 6 : day - 1;

    startOfWeek.setDate(date.getDate() - diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSameDate = (d1, d2) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === VIEWS.MONTH) newDate.setMonth(newDate.getMonth() - 1);
    else if (view === VIEWS.WEEK) newDate.setDate(newDate.getDate() - 7);
    else if (view === VIEWS.DAY) newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === VIEWS.MONTH) newDate.setMonth(newDate.getMonth() + 1);
    else if (view === VIEWS.WEEK) newDate.setDate(newDate.getDate() + 7);
    else if (view === VIEWS.DAY) newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const renderHeader = () => {
    let title = '';
    if (view === VIEWS.DAY) {
      title = currentDate.toLocaleDateString('default', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } else {
      title = currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' });
    }

    return (
      <div className="flex flex-col items-center justify-between gap-4 px-6 py-4 md:flex-row">
        <div className="flex items-center gap-4">
          <h2 className="min-w-40 text-xl font-bold text-gray-800">{title}</h2>
          <div className="flex items-center rounded-lg bg-gray-100 p-1">
            <button
              onClick={handlePrev}
              className="rounded-md p-1 text-gray-600 transition-all hover:bg-white hover:shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="rounded-md p-1 text-gray-600 transition-all hover:bg-white hover:shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-4 rounded-lg bg-white py-2 pr-3 pl-4 text-sm font-medium text-gray-700 capitalize shadow-sm ring-1 shadow-black/10 ring-black/10 transition-colors hover:bg-gray-50"
            >
              {view}
              <ChevronDown
                size={14}
                className={clsx(
                  'text-gray-500 transition-transform',
                  isDropdownOpen && 'rotate-180'
                )}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="absolute top-full right-0 z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-100 bg-white p-1 shadow-lg"
                >
                  {Object.values(VIEWS).map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setView(v);
                        setIsDropdownOpen(false);
                      }}
                      className={clsx(
                        'w-full rounded-md px-3 py-2 text-left text-sm capitalize transition-colors',
                        view === v
                          ? 'bg-gray-50 font-medium text-primary'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={handleToday}
            className="rounded-lg border border-transparent px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm ring-1 shadow-black/10 ring-black/10 transition-colors"
          >
            Today
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-200 transition-opacity hover:opacity-90">
            <Plus size={16} />
            <span className="hidden sm:inline">Add Event</span>
          </button>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const getEventsForDay = (dayObj) => {
      if (!dayObj.isCurrentMonth) return [];
      return MOCK_EVENTS.filter((e) => e.day === dayObj.day);
    };

    return (
      <>
        <div className="grid grid-cols-7 border-b border-border-gray bg-gray-50/50">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="border-r border-border-gray py-3 text-center text-xs font-semibold tracking-wider text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-7 grid-rows-6">
          {days.map((dayObj, index) => {
            const events = getEventsForDay(dayObj);
            return (
              <div
                key={index}
                className={clsx(
                  'group relative min-h-[80px] border-r border-b border-border-gray p-2 transition-colors hover:bg-gray-50/50',
                  !dayObj.isCurrentMonth && 'bg-gray-100 text-[#555558]/10',
                  isToday(dayObj.fullDate) && 'bg-indigo-50/30'
                )}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={clsx(
                      'flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                      isToday(dayObj.fullDate)
                        ? 'bg-primary text-white shadow-sm shadow-indigo-200'
                        : 'text-[#555558]/60'
                    )}
                  >
                    {dayObj.day}
                  </span>
                  <button className="p-1 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:text-primary">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="mt-1 space-y-1">
                  {events.map((event, i) => (
                    <div
                      key={i}
                      className={clsx(
                        'cursor-pointer truncate rounded px-1.5 py-0.5 text-[10px] font-medium transition-opacity hover:opacity-80',
                        event.color
                      )}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderWeekView = () => {
    const days = getWeekDays(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const getWeekDayLabel = (date) => {
      const day = date.getDay();
      const index = day === 0 ? 6 : day - 1;
      return WEEKDAYS[index];
    };

    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="grid grid-cols-8 border-b border-gray-100 bg-gray-50/50">
          <div className="border-r border-gray-100 py-3 text-center text-xs font-semibold text-gray-400">
            GMT+5:30
          </div>
          {days.map((day, i) => (
            <div
              key={i}
              className={clsx(
                'border-r border-gray-100 py-3 text-center last:border-r-0',
                isToday(day) && 'bg-indigo-50/30'
              )}
            >
              <div className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                {getWeekDayLabel(day)}
              </div>
              <div
                className={clsx(
                  'text-lg font-medium',
                  isSameDate(day, new Date()) ? 'text-primary' : 'text-gray-800'
                )}
              >
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="relative grid grid-cols-8">
            {/* Time Column */}
            <div className="col-span-1 border-r border-gray-100">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="relative h-16 border-b border-gray-50 text-center text-xs text-gray-400"
                >
                  <span className={clsx(hour === 0 && 'top-0', 'absolute -top-2 right-0 left-0')}>
                    {hour === 0
                      ? '12 AM'
                      : hour > 12
                        ? `${hour - 12} PM`
                        : hour === 12
                          ? '12 PM'
                          : `${hour} AM`}
                  </span>
                </div>
              ))}
            </div>
            {/* Days Columns */}
            {days.map((day, i) => (
              <div
                key={i}
                className={clsx(
                  'relative col-span-1 border-r border-gray-100',
                  isToday(day) && 'bg-indigo-50/10'
                )}
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                  ></div>
                ))}
                {/* Mock events for week view logic would go here */}
                {MOCK_EVENTS.filter((e) => e.day === day.getDate()).map((evt, idx) => (
                  <div
                    key={idx}
                    className={clsx(
                      'absolute right-1 left-1 rounded border-l-2 px-2 py-1 text-xs font-medium shadow-sm',
                      evt.color.replace('bg-', 'bg-opacity-90 bg-').replace('text-', 'border-')
                    )}
                    style={{ top: `${evt.hour * 64}px`, height: '58px' }}
                  >
                    {evt.title}
                    <div className="text-[10px] opacity-75">
                      {evt.hour > 12 ? `${evt.hour - 12} PM` : `${evt.hour} AM`}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayEvents = MOCK_EVENTS.filter((e) => e.day === currentDate.getDate());

    const getWeekDayLabel = (date) => {
      const day = date.getDay();
      const index = day === 0 ? 6 : day - 1;
      return WEEKDAYS[index];
    };

    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 py-3 text-center">
          <div className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
            {getWeekDayLabel(currentDate)}
          </div>
          <div
            className={clsx(
              'mt-1 text-2xl font-bold',
              isToday(currentDate) ? 'text-primary' : 'text-gray-800'
            )}
          >
            {currentDate.getDate()}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="relative">
            {hours.map((hour) => (
              <div key={hour} className="group flex h-20 border-b border-gray-50">
                <div className="relative w-20 border-r border-gray-100 pt-2 text-center text-xs text-gray-400">
                  {hour === 0
                    ? '12 AM'
                    : hour > 12
                      ? `${hour - 12} PM`
                      : hour === 12
                        ? '12 PM'
                        : `${hour} AM`}
                </div>
                <div className="relative flex-1 transition-colors hover:bg-gray-50/50">
                  {dayEvents
                    .filter((e) => e.hour === hour)
                    .map((evt, idx) => (
                      <div
                        key={idx}
                        className={clsx(
                          'absolute top-1 right-2 bottom-1 left-2 rounded border-l-4 px-3 py-2 text-sm font-medium shadow-sm',
                          evt.color.replace('text-', 'border-')
                        )}
                      >
                        <div className="flex justify-between">
                          <span>{evt.title}</span>
                          <span className="opacity-75">
                            {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`} -{' '}
                            {hour + 1 > 12 ? `${hour - 11}:00 PM` : `${hour + 1}:00 AM`}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {renderHeader()}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          {view === VIEWS.MONTH && renderMonthView()}
          {view === VIEWS.WEEK && renderWeekView()}
          {view === VIEWS.DAY && renderDayView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Calendar;
