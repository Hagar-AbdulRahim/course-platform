import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/login', formData);
      login(data.user, data.token);
      navigate('/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 blur-[100px] rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand/5 blur-[100px] rounded-full -ml-48 -mb-48"></div>

      <div className="card p-10 w-full max-w-lg shadow-2xl border-none relative z-10 reveal-anim active">
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-bold text-brand mb-6 inline-block font-heading">EduFlex</Link>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-neutral-500 font-medium">
            Continue your learning journey today
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="input-field rounded-2xl"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                Password
              </label>
              <Link to="#" className="text-xs font-bold text-brand hover:underline">Forgot password?</Link>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-field rounded-2xl"
              minLength="6"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 mt-4 disabled:opacity-50 text-lg shadow-lg shadow-brand/20"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-center mt-8 text-neutral-500 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand font-bold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;