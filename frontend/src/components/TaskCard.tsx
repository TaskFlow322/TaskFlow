import React from 'react';
import { Task } from '../types/task.types';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', String(task.id));
  };

  return (
    <div
      onClick={onClick}
      draggable
      onDragStart={handleDragStart}
      className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 cursor-grab hover:shadow-md transition-all active:cursor-grabbing"
    >
      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">{task.title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Задача #{task.id}</p>
    </div>
  );
};

export default TaskCard;