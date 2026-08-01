import React from 'react';
import { BarChart3, PieChart as PieIcon, TrendingUp, Star, Music2, Disc, Layers, Calendar } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Legend } from 'recharts';

const COLOR_PALETTE = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f43f5e', '#64748b'];

export default function AnalyticsDashboard({ library, onNavigateSearch }) {
  if (library.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 animate-fade-in max-w-xl mx-auto my-12">
        <BarChart3 className="w-12 h-12 text-brand-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">No Analytics Data Yet</h3>
        <p className="text-slate-400 text-sm mb-6">Save albums to your library to generate interactive genre distributions, rating histograms, and release timelines.</p>
        <button
          onClick={onNavigateSearch}
          className="px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-2xl text-sm transition-all shadow-lg shadow-brand-500/25"
        >
          Explore Music Catalog
        </button>
      </div>
    );
  }

  // --- Data Computations ---

  // 1. Stat Cards
  const totalAlbums = library.length;
  const uniqueGenres = new Set(library.map(a => a.genre)).size;
  const avgRating = (library.reduce((acc, a) => acc + (a.userRating || 5), 0) / totalAlbums).toFixed(1);

  // 2. Chart 1: Genre Breakdown (Pie/Donut)
  const genreCounts = library.reduce((acc, a) => {
    const g = a.genre || 'Other';
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  const genreChartData = Object.keys(genreCounts).map(name => ({
    name,
    value: genreCounts[name]
  })).sort((a, b) => b.value - a.value);

  // 3. Chart 2: Release Year Timeline (Line)
  const yearCounts = library.reduce((acc, a) => {
    if (a.releaseDate && a.releaseDate.length >= 4) {
      const year = a.releaseDate.substring(0, 4);
      acc[year] = (acc[year] || 0) + 1;
    }
    return acc;
  }, {});

  const yearChartData = Object.keys(yearCounts)
    .sort()
    .map(year => ({
      year,
      albums: yearCounts[year]
    }));

  // 4. Chart 3: Rating Distribution (Bar / Histogram)
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  library.forEach(a => {
    const r = a.userRating || 5;
    ratingCounts[r] = (ratingCounts[r] || 0) + 1;
  });

  const ratingChartData = [1, 2, 3, 4, 5].map(star => ({
    stars: `${star} ★`,
    count: ratingCounts[star]
  }));

  // 5. Chart 4: Top Artists Share (Horizontal Bar)
  const artistCounts = library.reduce((acc, a) => {
    const artist = a.artistName || 'Unknown';
    acc[artist] = (acc[artist] || 0) + 1;
    return acc;
  }, {});

  const artistChartData = Object.keys(artistCounts)
    .map(name => ({ name, count: artistCounts[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Top Era Computation
  const eras = library.map(a => a.releaseDate ? Math.floor(parseInt(a.releaseDate.substring(0, 4)) / 10) * 10 : null).filter(Boolean);
  const eraCounts = eras.reduce((acc, e) => { acc[e] = (acc[e] || 0) + 1; return acc; }, {});
  const topEraKey = Object.keys(eraCounts).sort((a, b) => eraCounts[b] - eraCounts[a])[0];
  const topEraStr = topEraKey ? `${topEraKey}s` : 'N/A';

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
            <Disc className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Saved</p>
            <h4 className="text-2xl font-extrabold text-white mt-0.5">{totalAlbums} Albums</h4>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Genres</p>
            <h4 className="text-2xl font-extrabold text-white mt-0.5">{uniqueGenres} Categories</h4>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Star className="w-6 h-6 fill-amber-400/20" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Average Rating</p>
            <h4 className="text-2xl font-extrabold text-white mt-0.5">{avgRating} / 5.0</h4>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Favorite Era</p>
            <h4 className="text-2xl font-extrabold text-white mt-0.5">{topEraStr}</h4>
          </div>
        </div>
      </div>

      {/* 2x2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Donut Chart - Genre Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-brand-400" /> Genre Distribution
              </h3>
              <p className="text-xs text-slate-400">Share of saved albums by musical style</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genreChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Line Chart - Release Timeline */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-pink-400" /> Release Timeline
              </h3>
              <p className="text-xs text-slate-400">Distribution of album release years</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Line type="monotone" dataKey="albums" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Bar Chart - Rating Histogram */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" /> User Rating Frequency
              </h3>
              <p className="text-xs text-slate-400">Histogram of your 1-5 star ratings</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="stars" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Horizontal Bar Chart - Top Artists */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Music2 className="w-5 h-5 text-emerald-400" /> Top Artists in Library
              </h3>
              <p className="text-xs text-slate-400">Most saved musical creators</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={artistChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fontSize: 11 }} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
