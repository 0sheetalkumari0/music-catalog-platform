import React from 'react';
import { Disc3, Search, Library, BarChart3, Sparkles, LogIn, LogOut, User } from 'lucide-react';

export default function HeaderNav({ activeTab, setActiveTab, libraryCount, user, onOpenAuth, onLogout }) {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('search')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-accent flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Disc3 className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Music Catalog
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-full">
                Platform
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Explore, Curate & Analyze</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'search'
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
              activeTab === 'library'
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>My Library</span>
            {libraryCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded-full font-semibold">
                {libraryCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'insights'
                ? 'bg-gradient-to-r from-brand-accent to-pink-600 text-white shadow-md shadow-pink-500/20 animate-pulse-slow'
                : 'text-pink-400 hover:text-pink-300 hover:bg-pink-950/30'
            }`}
          >
            <Sparkles className="w-4 h-4 text-pink-400 fill-pink-400/20" />
            <span>Insights</span>
          </button>
        </nav>

        {/* User Auth Controls */}
        <div className="flex items-center gap-3">
          {user?.token ? (
            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-1.5">
              <div className="w-7 h-7 rounded-full bg-brand-600/30 border border-brand-500/50 flex items-center justify-center text-brand-300">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-200">{user.username}</span>
              <button
                onClick={onLogout}
                title="Logout"
                className="p-1 text-slate-400 hover:text-rose-400 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-sm font-medium transition-all"
            >
              <LogIn className="w-4 h-4 text-brand-400" />
              <span>Login / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
