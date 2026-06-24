import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../store/authSlice';
import { useTheme } from '../context/ThemeContext';
import Alert from '../components/ui/Alert';
import { RootState } from '../store';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).then((action) => {
      if (loginUser.fulfilled.match(action)) {
        navigate('/dashboard');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="absolute top-4 right-4">
        <button onClick={toggleTheme} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          {theme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
        </button>
      </div>
      <div className="w-full max-w-md px-8">
        <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-8">Вход в TaskFlow</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert message={error} type="error" />}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50">
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <button onClick={() => navigate('/register')} className="w-full mt-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          Нет аккаунта? Зарегистрироваться
        </button>
      </div>
    </div>
  );
};

export default LoginPage;