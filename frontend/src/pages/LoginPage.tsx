import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Heart, Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-urjaa-ivory dark:bg-slate-950 text-urjaa-plum dark:text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-urjaa-rose flex items-center justify-center text-white shadow-soft">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <span className="font-serif font-bold text-2xl text-plum-950 dark:text-white">Urjaa</span>
        </Link>
        <h2 className="text-2xl font-serif font-bold tracking-tight text-plum-950 dark:text-white">
          Welcome back
        </h2>
        <p className="text-xs text-plum-600 dark:text-slate-400 mt-1">
          Sign in to access your authentic cycle rhythms, workouts, and wellness companion.
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-8 rounded-3xl border border-plum-100/80 dark:border-slate-800 shadow-soft">
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-urjaa-ivory/60 dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-sm text-plum-950 dark:text-white placeholder:text-plum-400 focus:outline-none focus:ring-2 focus:ring-urjaa-rose"
                />
                <Mail className="w-4 h-4 text-plum-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-plum-600 dark:text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-urjaa-ivory/60 dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-sm text-plum-950 dark:text-white placeholder:text-plum-400 focus:outline-none focus:ring-2 focus:ring-urjaa-rose"
                />
                <Lock className="w-4 h-4 text-plum-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <Button
              type="submit"
              variant="blush"
              size="md"
              disabled={isLoading}
              className="w-full justify-center mt-2 shadow-soft font-semibold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-plum-600 dark:text-slate-400">
              Don&apos;t have an account yet?{' '}
              <Link to="/register" className="font-semibold text-urjaa-rose hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
