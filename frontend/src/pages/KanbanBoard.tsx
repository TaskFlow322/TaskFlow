import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { moveTask, updateTask, deleteTask, addTask } from '../store/tasksSlice';
import KanbanColumn from '../components/KanbanColumn';
import Modal from '../components/ui/Modal';
import CommentList from '../components/CommentList';
import { Task, TaskStatus, Column } from '../types/task.types';
import { mockColumns } from '../mocks/tasks.mock';
import { useToast } from '../context/ToastContext';

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { showToast } = useToast();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState<TaskStatus>('todo');

  // Фильтры
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  // Фильтруем задачи с помощью useMemo (чтобы не пересоздавать на каждый рендер)
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  // Обновляем колонки только когда меняется filteredTasks
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    const updatedColumns = mockColumns.map(col => ({
      ...col,
      tasks: filteredTasks.filter(t => t.status === col.id),
    }));
    setColumns(updatedColumns);
  }, [filteredTasks]); // ✅ Теперь зависимость правильная

  const handleTaskMove = (taskId: number, newStatus: TaskStatus) => {
    dispatch(moveTask({ taskId, newStatus }));
    const task = tasks.find(t => t.id === taskId);
    showToast(`Задача "${task?.title}" перемещена`, 'info');
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status);
    setIsCreateMode(false);
    setIsModalOpen(true);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setEditTitle('');
    setEditDescription('');
    setEditStatus('todo');
    setIsCreateMode(true);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editTitle.trim()) {
      showToast('Введите название задачи', 'error');
      return;
    }

    if (isCreateMode) {
      const newTask: Task = {
        id: Date.now(),
        title: editTitle,
        description: editDescription,
        status: editStatus,
        projectId: 1,
        assigneeId: 1,
        createdAt: new Date().toISOString(),
      };
      dispatch(addTask(newTask));
      showToast('Задача создана', 'success');
    } else if (selectedTask) {
      dispatch(updateTask({
        ...selectedTask,
        title: editTitle,
        description: editDescription,
        status: editStatus,
      }));
      showToast('Задача сохранена', 'success');
    }
    setIsModalOpen(false);
    setSelectedTask(null);
    setIsCreateMode(false);
  };

  const handleDelete = () => {
    if (selectedTask) {
      dispatch(deleteTask(selectedTask.id));
      showToast('Задача удалена', 'error');
      setIsModalOpen(false);
      setSelectedTask(null);
      setIsCreateMode(false);
    }
  };

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

  const filterOptions = [
    { value: 'all', label: '📋 Все' },
    { value: 'todo', label: '📋 To Do' },
    { value: 'in_progress', label: '⚙️ In Progress' },
    { value: 'done', label: '✅ Done' },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Канбан-доска</h1>
        <button
          onClick={handleCreateTask}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + Создать задачу
        </button>
      </div>

      {/* Панель фильтров */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="🔍 Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            {filterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Найдено: {filteredTasks.length} / {tasks.length}
        </div>
        {(searchQuery || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="px-3 py-1 text-sm text-red-500 hover:text-red-700"
          >
            ✖ Сбросить
          </button>
        )}
      </div>

      {/* Колонки */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={col.tasks}
            onTaskMove={handleTaskMove}
            onTaskClick={handleTaskClick}
          />
        ))}
      </div>

      {/* Модалка создания/редактирования */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isCreateMode ? 'Создание задачи' : 'Редактирование задачи'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Название *
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Введите название задачи"
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
              placeholder="Введите описание задачи"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Статус
            </label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {!isCreateMode && selectedTask && <CommentList taskId={selectedTask.id} />}

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Отмена
            </button>
            {!isCreateMode && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Удалить
              </button>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              {isCreateMode ? 'Создать' : 'Сохранить'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default KanbanBoard;