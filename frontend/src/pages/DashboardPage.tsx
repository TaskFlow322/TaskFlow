import { useSelector } from 'react-redux';
import { RootState } from '../store';

const DashboardPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Дашборд</h1>
      <p className="text-gray-600 dark:text-gray-400">Добро пожаловать, {user?.name}!</p>
    </div>
  );
};

export default DashboardPage;