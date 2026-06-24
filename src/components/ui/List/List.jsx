import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Loader,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  HelpCircle,
  Sun,
} from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'motion/react';

const TASKS = [
  {
    id: 't1',
    taskId: 'TSK-8',
    title: 'Improve Navigation & Menu Organization',
    status: 'Ongoing',
    priority: 'Medium',
    assignee: { name: 'Alex M.', avatar: 'AM', color: 'bg-cyan-100 text-cyan-600' },
    points: 5,
    dueDate: new Date(2026, 8, 29),
  },
  {
    id: 't2',
    taskId: 'TSK-10',
    title: 'Speed Optimization for Home Page',
    status: 'Ongoing',
    priority: 'High',
    assignee: { name: 'Sarah K.', avatar: 'SK', color: 'bg-purple-100 text-purple-600' },
    points: 8,
    dueDate: new Date(2026, 8, 29),
  },
  {
    id: 't3',
    taskId: 'TSK-11',
    title: 'Setup CI/CD Pipeline',
    status: 'Pending',
    priority: 'Medium',
    assignee: { name: 'Mike R.', avatar: 'MR', color: 'bg-orange-100 text-orange-600' },
    points: 3,
    dueDate: new Date(2026, 8, 29),
  },
  {
    id: 't4',
    taskId: 'TSK-12',
    title: 'User Profile Page',
    status: 'Ongoing',
    priority: 'High',
    assignee: { name: 'Alex M.', avatar: 'AM', color: 'bg-cyan-100 text-cyan-600' },
    points: 5,
    dueDate: new Date(2026, 8, 29),
  },
  {
    id: 't5',
    taskId: 'TSK-13',
    title: 'Fix Navigation Bug',
    status: 'Pending',
    priority: 'Low',
    assignee: { name: 'Open', avatar: '?', color: 'bg-gray-100 text-gray-500' },
    points: 1,
    dueDate: new Date(2026, 8, 29),
  },
  {
    id: 't6',
    taskId: 'TSK-14',
    title: 'Mobile Responsiveness',
    status: 'Ongoing',
    priority: 'High',
    assignee: { name: 'Sarah K.', avatar: 'SK', color: 'bg-purple-100 text-purple-600' },
    points: 13,
    dueDate: new Date(2026, 8, 29),
  },
];

const COLUMNS = [
  { id: 'title', label: 'Task title', width: 'flex-[2] min-w-[300px]' },
  { id: 'status', label: 'Status', width: 'w-[140px]' },
  { id: 'priority', label: 'Priority', width: 'w-[120px]' },
  { id: 'assignee', label: 'Assignee', width: 'w-[120px]' },
  { id: 'points', label: 'Story points', width: 'w-[120px] ' },
  { id: 'dueDate', label: 'Due date', width: 'w-[120px] ' },
];

const STATUS_CONFIG = {
  Ongoing: { icon: Sun, color: 'text-indigo-500', labelColor: 'text-gray-700' },
  Pending: { icon: HelpCircle, color: 'text-gray-400', labelColor: 'text-gray-500' },
};

const PRIORITY_CONFIG = {
  High: { icon: SignalHigh, color: 'text-red-500', labelColor: 'text-gray-700' },
  Medium: { icon: SignalMedium, color: 'text-orange-500', labelColor: 'text-gray-700' },
  Low: { icon: SignalLow, color: 'text-green-500', labelColor: 'text-gray-700' },
};

function List() {
  const [selectedTasks, setSelectedTasks] = useState(new Set(['t1']));

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTasks(newSelected);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <div className="flex items-center border-b border-border-gray px-8 py-2">
        <div className="w-1/3 pl-10">
          <span className="text-sm font-medium text-primary-gray">Task title</span>
        </div>
        <div className="flex w-2/3 items-center justify-evenly">
          {COLUMNS.slice(1).map((col) => (
            <div key={col.id} className={clsx('text-sm font-medium text-primary-gray', col.width)}>
              {col.label}
            </div>
          ))}
        </div>
      </div>

      <div className="custom-scrollbar flex-1 overflow-auto">
        {TASKS.map((task, index) => {
          const StatusIcon = STATUS_CONFIG[task.status]?.icon || Circle;
          const PriorityIcon = PRIORITY_CONFIG[task.priority]?.icon || Circle;
          const isSelected = selectedTasks.has(task.id);

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50"
            >
              <div className="flex items-center px-8 py-2">
                <div className="flex w-1/3 items-center gap-4 pr-4">
                  <button onClick={() => toggleSelect(task.id)} className="outline-none">
                    {isSelected ? (
                      <CheckCircle2 className="fill-indigo-50 text-indigo-500" size={20} />
                    ) : (
                      <Circle className="text-gray-300 hover:text-gray-400" size={20} />
                    )}
                  </button>

                  <span className="w-16 text-sm font-medium text-secondary-gray">
                    {task.taskId}
                  </span>
                  <span className="truncate text-sm font-medium text-black">{task.title}</span>
                </div>

                <div className="flex w-2/3 items-center justify-evenly">
                  <div className="flex w-[140px] items-center gap-2">
                    <StatusIcon size={16} className={STATUS_CONFIG[task.status]?.color} />
                    <span
                      className={clsx(
                        'text-sm font-medium',
                        STATUS_CONFIG[task.status]?.labelColor
                      )}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="flex w-[120px] items-center gap-2">
                    <PriorityIcon size={16} className={PRIORITY_CONFIG[task.priority]?.color} />
                    <span
                      className={clsx(
                        'text-sm font-medium',
                        PRIORITY_CONFIG[task.priority]?.labelColor
                      )}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div className="flex w-[120px] items-center">
                    <div
                      className={clsx(
                        'flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-bold shadow-sm',
                        task.assignee.color
                      )}
                    >
                      {task.assignee.avatar}
                    </div>
                  </div>

                  <div className="flex w-[120px] items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-100 text-[10px] font-bold text-sky-700">
                      {task.points}
                    </div>
                  </div>

                  <div className="w-[120px]">
                    <span className="text-sm font-medium text-gray-700">
                      {task.dueDate ? task.dueDate.toLocaleDateString('en-GB') : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default List;
