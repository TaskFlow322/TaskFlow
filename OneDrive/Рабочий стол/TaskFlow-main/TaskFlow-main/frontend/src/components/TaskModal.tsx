import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateTask, deleteTask } from '../store/tasksSlice';
import { Task, TaskStatus } from '../types/task.types';
import Modal from './ui/Modal';
import CommentList from './CommentList';
import { useToast } from '../context/ToastContext';
import {
  Calendar,
  Tag,
  User,
  Trash2,
  Pencil,
  Check,
  X,
  MessageSquare,
} from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'todo', label: '📋 To Do', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  { value: 'in_progress', label: '⚙️ In Progress', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { value: 'done', label: '✅ Done', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
];

const TaskModal = ({ isOpen, onClose, task }: TaskModalProps) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { comments } = useSelector((state: RootState) => state.comments);

  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState<TaskStatus>('todo');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

  // Синхронизация при открытии
  const prevTaskId = useState<number | null>(null)[0];
  if (task && task.id !== prevTaskId) {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status);
    setIsEditingTitle(false);
    setIsEditingDescription(false);
    setIsDeleteConfirming(false);
  }

  if (!task) return null;

  const taskComments = comments.filter((c) => c.taskId === task.id);
  const currentStatus =
    STATUS_OPTIONS.find((s) => s.value === editStatus) ?? STATUS_OPTIONS[0];

  const handleSave = () => {
    if (!editTitle.trim()) {
      showToast('Название задачи не может быть пустым', 'error');
      return;
    }
    dispatch(updateTask({ ...task, title: editTitle, description: editDescription, status: editStatus }));
    setIsEditingTitle(false);
    setIsEditingDescription(false);
    showToast('Задача обновлена', 'success');
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    setEditStatus(newStatus);
    dispatch(updateTask({ ...task, title: editTitle, description: editDescription, status: newStatus }));
    showToast(`Статус изменён на "${STATUS_OPTIONS.find((s) => s.value === newStatus)?.label}"`, 'info');
  };

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    onClose();
    showToast('Задача удалена', 'info');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      {/* Шапка модалки */}
      <div className="space-y-5">
        {/* Название задачи */}
        <div>
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 text-lg font-semibold px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
              />
              <button
                onClick={handleSave}
                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              >
                <Check size={18} />
              </button>
              <button
                onClick={() => {
                  setEditTitle(task.title);
                  setIsEditingTitle(false);
                }}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div
              className="group cursor-pointer flex items-center gap-2"
              onClick={() => setIsEditingTitle(true)}
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                {task.title}
              </h2>
              <Pencil
                size={14}
                className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          )}
        </div>

        {/* Метаинформация: статус, дата, исполнитель */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {/* Статус — выпадающий селект */}
          <div className="relative group">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer ${currentStatus.color} hover:opacity-80 transition-opacity`}
            >
              <Tag size={12} />
              {currentStatus.label}
            </span>
            <div className="absolute top-full left-0 mt-1 hidden group-hover:block z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[160px]">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    editStatus === opt.value ? 'font-semibold' : ''
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Дата создания */}
          <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <Calendar size={12} />
            {formatDate(task.createdAt)}
          </span>

          {/* Исполнитель */}
          <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <User size={12} />
            Исполнитель #{task.assigneeId}
          </span>

          {/* Проект */}
          <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            Проект #{task.projectId}
          </span>
        </div>

        {/* Описание */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Описание
            </h3>
            {!isEditingDescription && (
              <button
                onClick={() => setIsEditingDescription(true)}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
              >
                <Pencil size={12} />
                Изменить
              </button>
            )}
          </div>
          {isEditingDescription ? (
            <div className="space-y-2">
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                placeholder="Добавьте описание задачи..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center gap-1"
                >
                  <Check size={12} />
                  Сохранить
                </button>
                <button
                  onClick={() => {
                    setEditDescription(task.description);
                    setIsEditingDescription(false);
                  }}
                  className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div
              className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer min-h-[60px] p-3 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all"
              onClick={() => setIsEditingDescription(true)}
            >
              {task.description ? (
                <p className="whitespace-pre-wrap">{task.description}</p>
              ) : (
                <span className="text-gray-400 italic">
                  Добавить описание...
                </span>
              )}
            </div>
          )}
        </div>

        {/* Комментарии */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={16} className="text-gray-500 dark:text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Комментарии
            </h3>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
              {taskComments.length}
            </span>
          </div>
          <CommentList taskId={task.id} />
        </div>

        {/* Нижняя панель: удаление + действия */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center">
          <div>
            {!isDeleteConfirming ? (
              <button
                onClick={() => setIsDeleteConfirming(true)}
                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 size={14} />
                Удалить задачу
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-red-600 dark:text-red-400">
                  Точно удалить?
                </span>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Да, удалить
                </button>
                <button
                  onClick={() => setIsDeleteConfirming(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Отмена
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;
