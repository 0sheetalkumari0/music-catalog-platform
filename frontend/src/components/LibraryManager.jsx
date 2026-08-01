import React, { useState } from 'react';
import { Library, Star, Trash2, Edit3, Grid, Table as TableIcon, Search, Disc } from 'lucide-react';
import { libraryService } from '../services';

export default function LibraryManager({ library, onLibraryUpdated, onNavigateSearch }) {
  const [viewMode, setViewMode] = useState('grid');
  const [filterGenre, setFilterGenre] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editNotes, setEditNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const availableGenres = ['All', ...new Set(library.map(a => a.genre).filter(Boolean))];

  const processedLibrary = library
    .filter(album => {
      const matchGenre = filterGenre === 'All' || album.genre === filterGenre;
      const matchSearch = searchQuery === '' || 
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.artistName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGenre && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.userRating || 0) - (a.userRating || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return (b.id || 0) - (a.id || 0);
    });

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from your library?`)) return;
    try {
      await libraryService.deleteAlbum(id);
      onLibraryUpdated();
    } catch (err) {
      alert('Failed to remove album from library');
    }
  };

  const handleOpenEdit = (album) => {
    setEditingAlbum(album);
    setEditRating(album.userRating || 5);
    setEditNotes(album.userNotes || '');
  };

  const handleSaveEdit = async () => {
    if (!editingAlbum) return;
    setUpdating(true);
    try {
      await libraryService.updateAlbum(editingAlbum.id, {
        userRating: editRating,
        userNotes: editNotes,
      });
      setEditingAlbum(null);
      onLibraryUpdated();
    } catch (err) {
      alert('Failed to update album notes/rating');
    } finally {
      setUpdating(false);
    }
  };

  if (library.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800 animate-fade-in max-w-xl mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4 text-brand-400">
          <Library className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Your Library is Empty</h3>
        <p className="text-slate-400 text-sm mb-6">
          Search the iTunes catalog to discover albums, rate them, and build your personal music collection.
        </p>
        <button
          onClick={onNavigateSearch}
          className="px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold rounded-2xl text-sm transition-all shadow-lg shadow-brand-500/25 inline-flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>Explore Catalog Now</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Controls */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white">Personal Library</h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded-full">
              {library.length} Albums Saved
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">Manage ratings, notes, and catalog curation</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter library..."
              className="w-full pl-9 pr-3 py-1.5 glass-input rounded-xl text-xs"
            />
          </div>

          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="glass-input px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer"
          >
            {availableGenres.map(g => (
              <option key={g} value={g} className="bg-slate-900 text-slate-200">{g === 'All' ? 'All Genres' : g}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-input px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer"
          >
            <option value="newest" className="bg-slate-900 text-slate-200">Sort by Date Added</option>
            <option value="rating" className="bg-slate-900 text-slate-200">Sort by Highest Rating</option>
            <option value="title" className="bg-slate-900 text-slate-200">Sort by Title (A-Z)</option>
          </select>

          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-brand-400' : 'text-slate-500 hover:text-slate-300'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-slate-800 text-brand-400' : 'text-slate-500 hover:text-slate-300'}`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {processedLibrary.map((album) => (
            <div key={album.id} className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group">
              <div className="p-4">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-slate-800">
                  {album.artworkUrl ? (
                    <img src={album.artworkUrl} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Disc className="w-16 h-16" />
                    </div>
                  )}

                  <div className="absolute top-2 right-2 px-2.5 py-1 text-xs font-bold bg-slate-900/90 backdrop-blur-md text-amber-400 border border-slate-700/80 rounded-lg flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {album.userRating || 5}.0
                  </div>
                </div>

                <h3 className="font-bold text-slate-100 text-base line-clamp-1" title={album.title}>{album.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-1 mt-0.5" title={album.artistName}>{album.artistName}</p>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">{album.genre}</span>
                  <span className="text-slate-500">{album.releaseDate ? album.releaseDate.substring(0, 4) : ''}</span>
                </div>

                {album.userNotes && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 italic line-clamp-2">
                    "{album.userNotes}"
                  </div>
                )}
              </div>

              <div className="p-4 pt-0 flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(album)}
                  className="flex-1 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-brand-400" />
                  <span>Notes / Rating</span>
                </button>
                <button
                  onClick={() => handleDelete(album.id, album.title)}
                  className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 text-rose-400 transition-colors"
                  title="Remove from Library"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Album</th>
                  <th className="py-3.5 px-4">Artist</th>
                  <th className="py-3.5 px-4">Genre</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Notes</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {processedLibrary.map((album) => (
                  <tr key={album.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={album.artworkUrl} alt={album.title} className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0" />
                      <span className="font-semibold text-slate-100">{album.title}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{album.artistName}</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-md bg-slate-800 text-xs text-slate-300">{album.genre}</span></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-bold text-amber-400 text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {album.userRating || 5}.0
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400 italic max-w-xs truncate">{album.userNotes || '—'}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(album)} className="p-1.5 text-slate-400 hover:text-brand-400 transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(album.id, album.title)} className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-700 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-1">Edit Album Review</h3>
            <p className="text-xs text-slate-400 mb-4 line-clamp-1">"{editingAlbum.title}" by {editingAlbum.artistName}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Rating</label>
                <div className="flex items-center gap-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setEditRating(star)} className="p-1 hover:scale-125 transition-transform">
                      <Star className={`w-7 h-7 ${star <= editRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Personal Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Update your notes for this album..."
                  className="w-full p-3 glass-input rounded-2xl text-sm"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={() => setEditingAlbum(null)} className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">Cancel</button>
                <button type="button" onClick={handleSaveEdit} disabled={updating} className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20">
                  {updating ? 'Saving...' : 'Update Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
