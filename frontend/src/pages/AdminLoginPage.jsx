import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center font-serif italic text-2xl sm:text-3xl mb-8 sm:mb-10">Reesha</Link>
        <div className="border border-neutral-200 bg-white p-6 sm:p-8">
          <p className="eyebrow">Staff only</p>
          <h1 className="mt-2 font-serif text-xl sm:text-2xl">Admin sign in</h1>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="eyebrow block mb-2">Email</label>
              <input
                type="email"
                autoComplete="email"
                autoCapitalize="off"
                autoCorrect="off"
                required
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="eyebrow block mb-2">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
        <Link to="/" className="mt-6 block text-center text-[11px] uppercase tracking-widest2 text-neutral-500 hover:text-ink py-2">
          ← Back to store
        </Link>
      </div>
    </div>
  );
}
