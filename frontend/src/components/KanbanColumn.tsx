import { Task } from '../types/task.types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const KanbanColumn = ({ title, tasks, onTaskClick }: KanbanColumnProps) => {
  return (
    <div className="rounded-lg p-4 w-80 min-w-[320px] bg-gray-50 dark:bg-gray-800/30">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
        {title} ({tasks.length})
      </h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;