import { useAuth } from '../context/AuthContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useAuth();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-camel-200 dark:bg-charcoal-400 
                 hover:bg-camel-300 dark:hover:bg-charcoal-500
                 transition-all duration-300"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;