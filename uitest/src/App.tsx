/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  HelpCircle,
  X,
  Search,
  Loader2,
  ExternalLink,
  Youtube,
  Key,
  AlertCircle,
  Play
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { searchYouTube, YouTubeVideoItem } from './services/youtube';

export default function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<YouTubeVideoItem[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<YouTubeVideoItem | null>(null);

  // Opcionális közvetlen API kulcs mező, ha a .env-ben még nem adta meg
  const envApiKey = import.meta.env.VITE_YOUTUBE_API_KEY || '';
  const [manualApiKey, setManualApiKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  const effectiveApiKey = manualApiKey.trim() || envApiKey.trim();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const query = searchQuery.trim();
    if (!query) return;

    if (!effectiveApiKey) {
      setShowKeyModal(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const results = await searchYouTube(query, effectiveApiKey);
      setSearchResults(results);
    } catch (err: any) {
      setErrorMessage(err.message || 'Hiba történt a YouTube keresés során.');
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {/* 
        Szimulált böngésző UI - a kontextus szemléltetéséhez:
        A valódi extensionben a böngésző saját felülete alatt a content script jelenik meg.
      */}
      <div className="bg-gray-200 border-b border-gray-300 px-4 py-2 flex items-center gap-2 text-sm text-gray-500 select-none shadow-sm">
        <div className="flex gap-1.5 items-center">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="ml-4 bg-white px-3 py-1 rounded shadow-sm text-xs flex-1 max-w-md text-gray-600 flex items-center gap-2">
          <span className="text-gray-400">🔒</span>
          <span>https://example.com</span>
        </div>
      </div>

      <div className="bg-gray-100 border-b border-gray-300 px-4 py-1 text-xs text-gray-500 flex items-center justify-between select-none">
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-600">★ Könyvjelzők:</span>
          <span className="hover:underline cursor-pointer">Google</span>
          <span className="hover:underline cursor-pointer">YouTube</span>
          <span className="hover:underline cursor-pointer">GitHub</span>
        </div>
        <div className="text-[11px] text-gray-400">Chrome Bookmark Bar</div>
      </div>

      {/* --- INNEN KEZDŐDIK A TÉNYLEGES TOOLBAR --- */}
      <header className="w-full bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 py-2 relative z-30 gap-4">
        {/* Bal oldal: Extension logó és megnevezés */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-xs">
            <Youtube className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-gray-800 tracking-tight hidden sm:inline">
            Media Toolbar
          </span>
        </div>

        {/* Jobb oldal: Keresőmező nagyító ikonnal és az About gomb */}
        <div className="flex items-center gap-3">
          {/* YouTube Keresőmező nagyító ikonnal */}
          <form
            onSubmit={handleSearch}
            className="relative flex items-center"
            role="search"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Keresés a YouTube-on..."
                className="w-48 sm:w-72 pl-3 pr-16 py-1.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all shadow-xs"
              />

              {/* Törlés gomb ha van szöveg */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-9 text-gray-400 hover:text-gray-600 p-0.5"
                  title="Keresés törlése"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Nagyító ikon / Keresés gomb a jobb szélén */}
              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                title="Keresés indítása a YouTube API-n"
                className="absolute right-1 p-1.5 rounded-md text-gray-600 hover:text-red-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:text-gray-600 disabled:hover:bg-transparent transition-colors focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>

          {/* API Kulcs indikátor / beállító gomb */}
          <button
            onClick={() => setShowKeyModal(true)}
            className={`p-1.5 rounded-md transition-colors text-xs flex items-center gap-1.5 border ${
              effectiveApiKey
                ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
            title="YouTube Data API Kulcs beállítása"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {effectiveApiKey ? 'API Kulcs aktív' : 'API Kulcs hiányzik'}
            </span>
          </button>

          {/* About Box gomb kérdőjel ikonnal */}
          <button
            onClick={() => setIsAboutOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 shadow-xs"
            aria-label="About box megnyitása"
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">About</span>
          </button>
        </div>
      </header>
      {/* --- TOOLBAR VÉGE --- */}

      {/* Fő tartalom: Szimulált weboldal és a YouTube keresési találatok */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {/* Hibaüzenet ha a keresés sikertelen */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">Keresési hiba</h3>
              <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              {!effectiveApiKey && (
                <button
                  onClick={() => setShowKeyModal(true)}
                  className="mt-2 text-xs font-semibold bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors"
                >
                  API kulcs megadása
                </button>
              )}
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Keresési találatok panel */}
        {searchResults !== null && (
          <section className="mb-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  YouTube Találatok: "{searchQuery}"
                </h2>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                  {searchResults.length} videó
                </span>
              </div>
              <button
                onClick={() => setSearchResults(null)}
                className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
              >
                Találatok elrejtése
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-xs">
                <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Nincs találat erre a keresésre.</p>
                <p className="text-sm text-gray-400 mt-1">Próbálkozz más kulcsszavakkal!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md hover:border-red-200 transition-all flex flex-col group"
                  >
                    {/* Bélyegkép lejátszás gombbal */}
                    <div
                      className="relative aspect-video bg-gray-900 cursor-pointer overflow-hidden"
                      onClick={() => setActiveVideo(video)}
                    >
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                          Nincs kép
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                          <Play className="w-5 h-5 ml-0.5 fill-current" />
                        </div>
                      </div>
                    </div>

                    {/* Videó adatok */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3
                          className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug hover:text-red-600 cursor-pointer"
                          onClick={() => setActiveVideo(video)}
                          title={video.title}
                        >
                          {video.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-medium truncate">
                          {video.channelTitle}
                        </p>
                        {video.publishedAt && (
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {video.publishedAt}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                        <button
                          onClick={() => setActiveVideo(video)}
                          className="text-red-600 font-medium hover:underline flex items-center gap-1"
                        >
                          Lejátszás
                        </button>
                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 flex items-center gap-1"
                          title="Megnyitás a YouTube weboldalon"
                        >
                          YouTube <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Alapértelmezett bemutató oldal, ha nincs keresés vagy a találatok mellett */}
        {searchResults === null && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xs max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Chrome Extension Toolbar Prototípus
            </h1>
            <p className="text-gray-600 mt-3 leading-relaxed">
              A fenti toolbar tartalmazza az új <strong>YouTube keresőmezőt</strong> és a jobb oldalán
              elhelyezkedő <strong>nagyító ikont</strong>, valamint az <strong>About</strong> gombot.
            </p>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm space-y-2">
              <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                <Search className="w-4 h-4 text-red-500" />
                Hogyan tesztelheted a keresést?
              </h4>
              <ol className="list-decimal list-inside text-gray-600 space-y-1.5 text-xs sm:text-sm">
                <li>
                  Írj be egy keresőszót a fenti toolbar keresőmezőjébe (pl. <em>"web development"</em> vagy <em>"chill music"</em>).
                </li>
                <li>
                  Kattints a keresőmező jobb oldalán lévő <strong>nagyító ikonra</strong> (vagy nyomj <code>Enter</code>-t).
                </li>
                <li>
                  Ha még nincs YouTube API kulcsod megadva a <code>.env</code> fájlban, kattints a kulcs ikonra a felső sávban és add meg ideiglenesen a teszthez.
                </li>
              </ol>
            </div>
          </div>
        )}
      </main>

      {/* Videó Lejátszó Modal */}
      <AnimatePresence>
        {activeVideo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
            />
            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 pointer-events-auto overflow-hidden w-full max-w-3xl"
              >
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-800 truncate pr-4">
                    {activeVideo.title}
                  </h3>
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
                <div className="p-4 flex items-center justify-between bg-white text-xs text-gray-500">
                  <span className="font-medium text-gray-700">{activeVideo.channelTitle}</span>
                  <a
                    href={activeVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Megnyitás a YouTube-on <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* About Box Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 backdrop-blur-xs"
            />
            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="bg-white rounded-xl shadow-xl border border-gray-100 pointer-events-auto overflow-hidden min-w-[320px] max-w-sm w-full"
              >
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    About Extension
                  </h2>
                  <button
                    onClick={() => setIsAboutOpen(false)}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-8 text-center">
                  <p className="text-lg font-medium text-gray-800">hello world</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Chrome Toolbar Extension Preview v1.1
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* API Kulcs Beállítása Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKeyModal(false)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
            />
            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 pointer-events-auto overflow-hidden max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-gray-800 text-base">
                      YouTube Data API v3 Kulcs
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowKeyModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-4 text-sm text-gray-600">
                  <p>
                    A YouTube keresési funkció működéséhez a Google Cloud Console-ban létrehozott{' '}
                    <strong>YouTube Data API v3</strong> kulcsra van szükség.
                  </p>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs">
                    <p className="font-medium text-gray-700">1. Állandó beállítás a projektben:</p>
                    <p className="text-gray-500 mt-0.5">
                      Nyisd meg a <code>.env</code> fájlt és add hozzá:
                    </p>
                    <pre className="bg-white p-2 mt-1 rounded border border-gray-200 font-mono text-gray-800 text-[11px] select-all">
                      YOUTUBE_API_KEY=AIzaSy...
                    </pre>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      2. Vagy add meg itt a közvetlen teszteléshez:
                    </label>
                    <input
                      type="password"
                      value={manualApiKey}
                      onChange={(e) => setManualApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setShowKeyModal(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Mentés & Bezárás
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
