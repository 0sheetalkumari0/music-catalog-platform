import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, ArrowRight, Lightbulb, RefreshCw, CheckCircle } from 'lucide-react';
import { insightsService } from '../services';

export default function CatalogInsights({ library, onSelectSearchQuery, onNavigateSearch }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInsights();
  }, [library]);

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await insightsService.getInsights();
      setInsights(data);
    } catch (err) {
      setError('To access catalog insights, please log in with your account.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 animate-fade-in max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto mb-4 text-pink-400 animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin-slow" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Analyzing Music Preferences...</h3>
        <p className="text-slate-400 text-sm">Evaluating genre distributions, release timelines, and user rating patterns.</p>
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 animate-fade-in max-w-xl mx-auto my-12">
        <Compass className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">Catalog Insights Unavailable</h3>
        <p className="text-slate-400 text-sm mb-6">{error || 'Please log in and add albums to enable catalog analytics.'}</p>
        <button
          onClick={fetchInsights}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Summary Card */}
      <div className="relative glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/20 overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/25">
            <Sparkles className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Catalog Taste Profile</h2>
            <p className="text-xs text-pink-300">Automated Insights & Intelligent Recommendation Engine</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-slate-200 text-sm leading-relaxed mb-6">
          <p className="font-medium text-slate-100">{insights.tasteProfileSummary}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Dominant Genre</span>
            <span className="text-lg font-bold text-brand-300">{insights.primaryGenre}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Peak Era</span>
            <span className="text-lg font-bold text-pink-400">{insights.favoriteEra}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Catalog Size</span>
            <span className="text-lg font-bold text-emerald-400">{library.length} Albums</span>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h3 className="font-bold text-lg text-white mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" /> Key Musical Takeaways
        </h3>
        <div className="space-y-2">
          {insights.catalogKeyTakeaways?.map((takeaway, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 text-xs text-slate-300 flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-brand-400 shrink-0" />
              <span>{takeaway}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
          <Compass className="w-5 h-5 text-purple-400" /> AI Catalog Recommendations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {insights.recommendations?.map((rec, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between group">
              <div>
                <span className="px-2.5 py-1 text-[10px] font-bold bg-purple-950/60 text-purple-300 border border-purple-800/60 rounded-lg inline-block mb-3">
                  {rec.genre}
                </span>

                <h4 className="font-bold text-white text-base line-clamp-1 group-hover:text-purple-300 transition-colors">
                  {rec.title}
                </h4>
                <p className="text-slate-400 text-xs font-medium mb-3">{rec.artistName}</p>

                <p className="text-xs text-slate-300 italic p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  "{rec.matchReason}"
                </p>
              </div>

              <button
                onClick={() => {
                  onSelectSearchQuery(rec.sampleQuery || rec.artistName);
                  onNavigateSearch();
                }}
                className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-purple-600 hover:text-white text-purple-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Find in Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
