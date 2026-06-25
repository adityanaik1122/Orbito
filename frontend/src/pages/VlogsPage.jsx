import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Play, Clock, Eye, Youtube, ChevronLeft, ChevronRight } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ROW_ORDER = ['Trending Now', 'Hidden Gems', 'Solo Travel'];

const ROW_ICONS = {
  'Trending Now': '🔥',
  'Hidden Gems': '💎',
  'Solo Travel': '🎒',
};

function formatViews(n) {
  if (!n) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K views`;
  return `${n} views`;
}

const VlogCard = ({ vlog }) => {
  const views = formatViews(vlog.view_count);

  return (
    <a
      href={vlog.video_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 w-72 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
    >
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img
          src={vlog.thumbnail_url}
          alt={vlog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80'; }}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-red-600 rounded-full p-3 shadow-xl">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        </div>

        {/* Duration */}
        {vlog.duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> {vlog.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-1 group-hover:text-[#0B3D91] transition-colors">
          {vlog.title}
        </p>
        <p className="text-xs text-gray-500 truncate">{vlog.channel_name}</p>
        {views && (
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <Eye className="w-3 h-3" /> {views}
          </p>
        )}
      </div>
    </a>
  );
};

const ScrollRow = ({ title, vlogs }) => {
  const rowRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const scroll = (dir) => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: dir * 600, behavior: 'smooth' });
  };

  const checkScroll = () => {
    if (!rowRef.current) return;
    setCanLeft(rowRef.current.scrollLeft > 0);
    setCanRight(rowRef.current.scrollLeft + rowRef.current.clientWidth < rowRef.current.scrollWidth - 1);
  };

  useEffect(() => {
    const el = rowRef.current;
    if (el) { el.addEventListener('scroll', checkScroll); checkScroll(); }
    return () => el?.removeEventListener('scroll', checkScroll);
  }, [vlogs]);

  if (!vlogs || vlogs.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>{ROW_ICONS[title] || '🎬'}</span> {title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            disabled={!canLeft}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#0B3D91] hover:text-[#0B3D91] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={!canRight}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#0B3D91] hover:text-[#0B3D91] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {vlogs.map((vlog) => (
          <VlogCard key={vlog.id} vlog={vlog} />
        ))}
      </div>
    </div>
  );
};

const VlogsPage = () => {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/vlogs`)
      .then((r) => r.json())
      .then((data) => { setGrouped(data.grouped || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const hasVlogs = Object.values(grouped).some((v) => v.length > 0);

  return (
    <>
      <Helmet>
        <title>Travel Vlogs | Orbito</title>
        <meta name="description" content="Watch the best travel vlogs from around the world. Get inspired for your next adventure." />
        <link rel="canonical" href="https://orbitotrip.com/vlogs" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-[#0B3D91] py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-600 rounded-full p-2">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <span className="text-blue-200 font-semibold text-sm uppercase tracking-widest">Travel Vlogs</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Get Inspired</h1>
            <p className="text-blue-100 text-lg max-w-xl">
              Fresh travel videos curated daily from the world's best creators.
            </p>
          </div>
        </div>

        {/* Rows */}
        <div className="container mx-auto px-4 lg:px-8 py-10">
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="w-10 h-10 animate-spin text-[#0B3D91]" />
            </div>
          ) : !hasVlogs ? (
            <div className="text-center py-32">
              <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-semibold">Vlogs loading soon</p>
              <p className="text-gray-400 text-sm mt-1">Check back in a few minutes.</p>
            </div>
          ) : (
            ROW_ORDER.map((cat) => (
              <ScrollRow key={cat} title={cat} vlogs={grouped[cat] || []} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default VlogsPage;
