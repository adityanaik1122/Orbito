import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Play, Clock, Eye, Youtube, ChevronLeft, ChevronRight } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ROW_ORDER = ['Trending Now', 'Hidden Gems', 'Solo Travel'];

const ROW_ICONS = {};

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
      className="group flex-shrink-0 w-[80vw] sm:w-[45vw] lg:w-[42vw] rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
    >
      {/* Thumbnail — 16:9 */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
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
          <div className="bg-red-600 rounded-full p-4 shadow-xl">
            <Play className="w-7 h-7 text-white fill-white" />
          </div>
        </div>

        {/* Duration */}
        {vlog.duration && (
          <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" /> {vlog.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-base font-semibold text-gray-900 line-clamp-2 leading-snug mb-1.5 group-hover:text-[#0B3D91] transition-colors">
          {vlog.title}
        </p>
        <p className="text-sm text-gray-500 truncate">{vlog.channel_name}</p>
        {views && (
          <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
            <Eye className="w-3.5 h-3.5" /> {views}
          </p>
        )}
      </div>
    </a>
  );
};

const ScrollRow = ({ title, vlogs }) => {
  const rowRef = useRef(null);
  const targetRef = useRef(0);
  const rafRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const scroll = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    targetRef.current = Math.max(0, Math.min(
      targetRef.current + dir * el.clientWidth * 0.8,
      el.scrollWidth - el.clientWidth
    ));
    startRaf(el);
  };

  const startRaf = (el) => {
    if (rafRef.current) return;
    const tick = () => {
      const diff = targetRef.current - el.scrollLeft;
      if (Math.abs(diff) < 0.5) {
        el.scrollLeft = targetRef.current;
        rafRef.current = null;
        return;
      }
      el.scrollLeft += diff * 0.1;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const checkScroll = () => {
    if (!rowRef.current) return;
    setCanLeft(rowRef.current.scrollLeft > 0);
    setCanRight(rowRef.current.scrollLeft + rowRef.current.clientWidth < rowRef.current.scrollWidth - 1);
  };

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScroll);
    checkScroll();

    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      targetRef.current = Math.max(0, Math.min(
        targetRef.current + e.deltaY * 1.5,
        el.scrollWidth - el.clientWidth
      ));
      startRaf(el);
    };
    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      el.removeEventListener('scroll', checkScroll);
      el.removeEventListener('wheel', onWheel);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [vlogs]);

  if (!vlogs || vlogs.length === 0) return null;

  return (
    <div className="mb-14">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            disabled={!canLeft}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#0B3D91] hover:text-[#0B3D91] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={!canRight}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#0B3D91] hover:text-[#0B3D91] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-5 overflow-x-auto pb-3"
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
        <div className="bg-gradient-to-r from-[#0B3D91] to-[#0EA5E9] py-12">
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
