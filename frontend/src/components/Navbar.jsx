import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { getFullUrl } from '../utils/urlHelper';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-[#001f3f] border-b border-white/10 shadow-xl">
      <div className="site-container py-1 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-black text-brand tracking-tighter">
            EduFlex<span className="text-neutral-400 font-light ml-0.5">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-[11px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors">Home</Link>
            <Link to="/courses" className="text-[11px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors">All Courses</Link>
            <Link to="/profile" className="text-[11px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors">Workspace</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle Added Back */}
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-4">
              <Link to="/profile" className="flex items-center gap-2 group">
                <img src={getFullUrl(user.profileImage, user.name)} alt="u" className="w-8 h-8 rounded-full object-cover border border-white/20 shadow-sm transition-transform group-hover:scale-110" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white hidden lg:block">Profile</span>
              </Link>
              <button onClick={handleLogout} className="text-red-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-white/70 px-4 py-2 hover:bg-white/5 rounded-full transition-all">Sign In</Link>
              <Link to="/register" className="bg-brand text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20">Sign Up</Link>
            </div>
          )}

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-2xl p-2 dark:text-white">
            {isMenuOpen ? '×' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 p-6 animate-fade-in shadow-xl">
          <div className="flex flex-col gap-5">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase tracking-widest dark:text-white">Home</Link>
            <Link to="/courses" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase tracking-widest dark:text-white">All Courses</Link>
            <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase tracking-widest dark:text-white">Workspace</Link>
            {!user && (
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-brand">Register</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
