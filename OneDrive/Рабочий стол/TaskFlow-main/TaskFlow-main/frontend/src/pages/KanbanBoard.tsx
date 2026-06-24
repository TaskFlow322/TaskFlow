import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import KanbanColumn from '../components/KanbanColumn';
import Modal from '../components/ui/Modal';
import CommentList from '../components/CommentList';
import { Task, TaskStatus, Column } from '../types/task.types';
import { fetchTasks, updateTaskStatus, updateTask, deleteTask, moveTaskLocally } from '../store/tasksSlice';

const COLUMNS: Column[] = [
  { id: 'todo', title: '📋 To Do', tasks: [] },
  { id: 'in_progress', title: '⚡ In Progress', tasks: [] },
  { id: 'done', title: '✅ Done', tasks: [] },
];

const KanbanBoard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const columns = COLUMNS.map(col => ({
    ...col,
    tasks: tasks.filter(t => t.status === col.id),
  }));

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsModalOpen(true);
  };

  const handleDrop = (taskId: number, newStatus: TaskStatus) => {
    dispatch(moveTaskLocally({ taskId, newStatus }));
    dispatch(updateTaskStatus({ taskId, newStatus }));
  };

  const handleSave = () => {
    if (selectedTask) {
      dispatch(updateTask({ ...selectedTask, title: editTitle, description: editDescription }));
      setIsModalOpen(false);
      setSelectedTask(null);
    }
  };

  const handleDelete = () => {
    if (selectedTask) {
      dispatch(deleteTask(selectedTask.id));
      setIsModalOpen(false);
      setSelectedTask(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">Загрузка задач...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Канбан-доска</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={col.tasks}
            onTaskClick={handleTaskClick}
            onDrop={handleDrop}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Просмотр задачи"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Название
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Описание
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>

          {selectedTask && <CommentList taskId={selectedTask.id} />}

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Закрыть
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Удалить
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              Сохранить
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default KanbanBoard;
