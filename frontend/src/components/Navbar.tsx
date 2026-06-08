import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import { useTheme } from '../context/ThemeContext';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <MobileMenu />
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white md:hidden">TaskFlow</h1>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Ссылка на профиль с аватаром */}
        <Link to="/profile" className="flex items-center gap-2">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
          )}
          <span className="text-sm text-gray-600 dark:text-gray-400">{user?.username}</span>
        </Link>

        <button
          onClick={() => dispatch(logout())}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          Выйти
        </button>
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={toggleTheme}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <Link to="/profile">
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <span className="text-sm">👤</span>
          )}
        </Link>
        <button
          onClick={() => dispatch(logout())}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          Выйти
        </button>
      </div>
    </header>
  );
};

export default Navbar;