import React, { useState } from 'react';
import { X, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../services';

export default function AuthDialog({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login(username, password);
      } else {
        await authService.register(username, password);
      }
      onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700/80 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isLogin ? 'Sign in to access your saved music library' : 'Register to curate your personal album catalog'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Username</label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-11 pr-4 py-2.5 glass-input rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-11 pr-4 py-2.5 glass-input rounded-xl text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{isLogin ? 'Sign In' : 'Register Now'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
          {isLogin ? "Don't have an account?" : "Already registered?"}{' '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-2 ml-1"
          >
            {isLogin ? 'Create one now' : 'Sign in here'}
          </button>
        </div>
      </div>
    </div>
  );
}
