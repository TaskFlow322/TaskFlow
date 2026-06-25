import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AnalyticsPage = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks);

  // Статистика по статусам
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;

  const statusData = [
    { name: 'To Do', value: todoCount, color: '#3b82f6' },
    { name: 'In Progress', value: inProgressCount, color: '#f59e0b' },
    { name: 'Done', value: doneCount, color: '#10b981' },
  ];

  // Статистика по дням (из createdAt)
  const getDayStats = () => {
    const dayMap = new Map<string, { todo: number; in_progress: number; done: number }>();

    tasks.forEach(task => {
      const date = new Date(task.createdAt).toLocaleDateString();
      if (!dayMap.has(date)) {
        dayMap.set(date, { todo: 0, in_progress: 0, done: 0 });
      }
      const stats = dayMap.get(date)!;
      stats[task.status]++;
    });

    return Array.from(dayMap.entries())
      .map(([date, stats]) => ({
        date,
        todo: stats.todo,
        in_progress: stats.in_progress,
        done: stats.done,
      }))
      .slice(-7); // последние 7 дней
  };

  const dailyData = getDayStats();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Аналитика</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Круговая диаграмма */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Задачи по статусам</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Столбчатая диаграмма */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Динамика задач (по дням)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="todo" name="To Do" fill="#3b82f6" />
              <Bar dataKey="in_progress" name="In Progress" fill="#f59e0b" />
              <Bar dataKey="done" name="Done" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Простая статистика карточками */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">To Do</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{todoCount}</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
          <h3 className="text-sm font-medium text-orange-700 dark:text-orange-300">In Progress</h3>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{inProgressCount}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-sm font-medium text-green-700 dark:text-green-300">Done</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{doneCount}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
