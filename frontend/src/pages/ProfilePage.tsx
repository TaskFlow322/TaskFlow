import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { updateProfile } from '../store/authSlice';
import Alert from '../components/ui/Alert';

const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState<string>(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    setTimeout(() => {
      if (!username.trim()) {
        setError('Имя пользователя не может быть пустым');
        setLoading(false);
        return;
      }
      if (!email.includes('@')) {
        setError('Введите корректный email');
        setLoading(false);
        return;
      }

      dispatch(updateProfile({
        username,
        email,
        avatar: avatar || undefined
      }));
      setSuccess('Профиль успешно обновлён');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Профиль</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert message={error} type="error" />}
        {success && <Alert message={success} type="success" duration={3000} />}

        {/* Аватар */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl text-gray-500">👤</span>
            )}
          </div>
          <label className="cursor-pointer bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-md text-sm hover:bg-gray-800 dark:hover:bg-gray-100">
            Загрузить аватар
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Имя пользователя (username) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Имя пользователя
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-md text-sm hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50"
        >
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
