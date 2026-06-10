import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import KanbanColumn from '../components/KanbanColumn';
import TaskModal from '../components/TaskModal';
import { Task, Column } from '../types/task.types';
import { mockColumns } from '../mocks/tasks.mock';

const KanbanBoard = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const [columns, setColumns] = useState<Column[]>(mockColumns);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const updatedColumns = mockColumns.map((col) => ({
      ...col,
      tasks: tasks.filter((t) => t.status === col.id),
    }));
    setColumns(updatedColumns);
  }, [tasks]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Небольшая задержка перед очисткой, чтобы анимация закрытия успела отработать
    setTimeout(() => setSelectedTask(null), 200);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Канбан-доска
      </h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            title={col.title}
            tasks={col.tasks}
            onTaskClick={handleTaskClick}
          />
        ))}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
      />
    </div>
  );
};

export default KanbanBoard;
