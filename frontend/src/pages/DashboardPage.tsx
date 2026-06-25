import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { useEffect } from 'react';
import { fetchTasks } from '../store/tasksSlice';

const DashboardPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        Дашборд
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Добро пожаловать, {user?.username || user?.email || 'пользователь'}!
      </p>

      {/* Карточки статистики */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">📋 To Do</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? '...' : todoCount}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full"
              style={{ width: tasks.length ? `${(todoCount / tasks.length) * 100}%` : '0%' }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">⚡ In Progress</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? '...' : inProgressCount}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-yellow-500 h-1.5 rounded-full"
              style={{ width: tasks.length ? `${(inProgressCount / tasks.length) * 100}%` : '0%' }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">✅ Done</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? '...' : doneCount}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{ width: tasks.length ? `${(doneCount / tasks.length) * 100}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Последние задачи */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Последние задачи</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <p className="p-5 text-gray-500 dark:text-gray-400">Загрузка...</p>
          ) : tasks.length === 0 ? (
            <p className="p-5 text-gray-500 dark:text-gray-400">Задач пока нет</p>
          ) : (
            tasks.slice(0, 5).map(task => (
              <div key={task.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Задача #{task.id}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  task.status === 'todo'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : task.status === 'in_progress'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                }`}>
                  {task.status === 'todo' ? 'To Do' : task.status === 'in_progress' ? 'In Progress' : 'Done'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;