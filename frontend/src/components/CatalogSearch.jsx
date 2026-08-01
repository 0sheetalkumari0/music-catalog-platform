import React, { useState, useEffect } from 'react';
import { Search, Disc, Plus, Star, Calendar, Music, Sparkles, Database, Check, AlertCircle } from 'lucide-react';
import { catalogService, libraryService } from '../services';

const GENRE_FILTERS = ['All', 'Alternative', 'Rock', 'Pop', 'Hip-Hop', 'Electronic', 'Jazz', 'Classical'];

export default function CatalogSearch({ savedCatalogIds, onAlbumSaved, onOpenAuth, isAuthenticated }) {
  const [searchTerm, setSearchTerm] = useState('Coldplay');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cached, setCached] = useState(false);
  const [error, setError] = useState('');
  
  const [selectedAlbumToSave, setSelectedAlbumToSave] = useState(null);
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim().length > 1) {
        performSearch(searchTerm);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const performSearch = async (query) => {
    setLoading(true);
    setError('');
    try {
      const res = await catalogService.search(query, 'album', 24);
      setResults(res.results || []);
      setCached(res.cached || false);
    } catch (err) {
      setError('Failed to fetch music catalog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter((item) => {
    if (selectedGenre === 'All') return true;
    return item.primaryGenreName?.toLowerCase().includes(selectedGenre.toLowerCase());
  });

  const handleOpenSaveModal = (album) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    setSelectedAlbumToSave(album);
    setRating(5);
    setNotes('');
  };

  const handleConfirmSave = async () => {
    if (!selectedAlbumToSave) return;
    setSaving(true);
    try {
      const albumData = {
        appleCatalogId: selectedAlbumToSave.collectionId,
        title: selectedAlbumToSave.collectionName || 'Untitled Album',
        artistName: selectedAlbumToSave.artistName || 'Unknown Artist',
        genre: selectedAlbumToSave.primaryGenreName || 'General',
        releaseDate: selectedAlbumToSave.releaseDate || '',
        trackCount: selectedAlbumToSave.trackCount || 0,
        artworkUrl: selectedAlbumToSave.artworkUrl100 ? selectedAlbumToSave.artworkUrl100.replace('100x100bb', '300x300bb') : '',
        userRating: rating,
        userNotes: notes,
      };

      await libraryService.saveAlbum(albumData);
      onAlbumSaved(selectedAlbumToSave.collectionId);
      setSelectedAlbumToSave(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save album to library');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative glass-panel p-6 sm:p-8 rounded-3xl overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Public Music Catalog Proxy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Millions of Albums
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Search live iTunes catalog data with sub-second response times, Caffeine proxy caching, and 1-click personal library curation.
          </p>
        </div>

        {/* Search Input */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search albums, artists, or genres (e.g. Coldplay, Taylor Swift, Jazz)..."
              className="w-full pl-12 pr-10 py-3.5 glass-input rounded-2xl text-base shadow-inner"
            />
            {loading && (
              <span className="w-5 h-5 border-2 border-brand-400/30 border-t-brand-400 rounded-full animate-spin absolute right-4 top-1/2 -translate-y-1/2"></span>
            )}
          </div>

          {cached && (
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-950/60 border border-emerald-800/60 rounded-2xl text-emerald-400 text-xs font-semibold shrink-0">
              <Database className="w-4 h-4" />
              <span>Proxy Cache Active</span>
            </div>
          )}
        </div>

        {/* Genre Filter Pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {GENRE_FILTERS.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedGenre === genre
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-2xl text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Count & Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-sm font-medium text-slate-400">
            Showing <span className="text-slate-100 font-semibold">{filteredResults.length}</span> albums for "{searchTerm}"
          </p>
        </div>

        {filteredResults.length === 0 && !loading ? (
          <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
            <Disc className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-spin-slow" />
            <h3 className="text-lg font-bold text-slate-300">No albums found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search terms or genre filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredResults.map((album) => {
              const isSaved = savedCatalogIds.has(album.collectionId);
              const releaseYear = album.releaseDate ? album.releaseDate.substring(0, 4) : 'N/A';
              const imgUrl = album.artworkUrl100 ? album.artworkUrl100.replace('100x100bb', '300x300bb') : '';

              return (
                <div
                  key={album.collectionId || Math.random()}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group"
                >
                  <div className="p-4">
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-slate-800 shadow-md">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={album.collectionName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <Disc className="w-16 h-16" />
                        </div>
                      )}

                      <span className="absolute top-2 right-2 px-2.5 py-1 text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-brand-300 border border-slate-700/80 rounded-lg">
                        {album.primaryGenreName || 'Music'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-100 text-base line-clamp-1 group-hover:text-brand-300 transition-colors" title={album.collectionName}>
                      {album.collectionName}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-1 mt-0.5" title={album.artistName}>
                      {album.artistName}
                    </p>

                    <div className="flex items-center gap-3 mt-3 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" /> {releaseYear}
                      </span>
                      <span className="flex items-center gap-1">
                        <Music className="w-3.5 h-3.5 text-slate-500" /> {album.trackCount || '?'} tracks
                      </span>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    {isSaved ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-default"
                      >
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>In Personal Library</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenSaveModal(album)}
                        className="w-full py-2.5 rounded-xl bg-slate-800/90 hover:bg-brand-600 hover:text-white border border-slate-700/80 hover:border-brand-500 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Save to Library</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rating & Notes Modal */}
      {selectedAlbumToSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-700 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-1">Save Album to Personal Library</h3>
            <p className="text-xs text-slate-400 mb-4 line-clamp-1">
              "{selectedAlbumToSave.collectionName}" by {selectedAlbumToSave.artistName}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Your Rating</label>
                <div className="flex items-center gap-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-bold text-amber-400">{rating}.0 / 5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Personal Notes (Optional)</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Why do you love this album? Key favorite tracks..."
                  className="w-full p-3 glass-input rounded-2xl text-sm"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAlbumToSave(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-semibold transition-all shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5"
                >
                  {saving ? 'Saving...' : 'Add to My Library'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
