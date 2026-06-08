import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    { to: '/dashboard', label: 'Дашборд' },
    { to: '/kanban', label: 'Канбан' },
    { to: '/profile', label: 'Профиль' },
    { to: '/analytics', label: 'Аналитика' },  // ← добавить
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex-col">
      <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">TaskFlow</h1>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                isActive
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;