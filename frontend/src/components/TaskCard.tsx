import { Task } from '../types/task.types';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all"
    >
      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">{task.title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Задача #{task.id}</p>
    </div>
  );
};

export default TaskCard;