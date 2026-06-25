import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Play, Clock, Eye, Youtube } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function formatViews(n) {
  if (!n) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K views`;
  return `${n} views`;
}

const PlayOverlay = () => (
  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <div className="bg-red-600 rounded-full p-4 shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
      <Play className="w-6 h-6 text-white fill-white" />
    </div>
  </div>
);

const VlogCard = ({ vlog, size = 'sm' }) => {
  const views = formatViews(vlog.view_count);

  return (
    <a
      href={vlog.video_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-2xl overflow-hidden bg-gray-900 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-full">
        <img
          src={vlog.thumbnail_url}
          alt={vlog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <PlayOverlay />

        {/* Duration badge */}
        {vlog.duration && (
          <span className="absolute top-3 right-3 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> {vlog.duration}
          </span>
        )}

        {/* YouTube badge on large cards */}
        {size === 'lg' && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Youtube className="w-3 h-3" /> YouTube
          </span>
        )}

        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className={`text-white font-bold leading-snug mb-1 ${size === 'lg' ? 'text-xl line-clamp-2' : size === 'md' ? 'text-base line-clamp-2' : 'text-sm line-clamp-2'}`}>
            {vlog.title}
          </p>
          <div className="flex items-center gap-3 text-white/70 text-xs">
            <span className="font-medium">{vlog.channel_name}</span>
            {views && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> {views}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

const VlogsPage = () => {
  const [vlogs, setVlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/vlogs?limit=15`)
      .then((r) => r.json())
      .then((data) => { setVlogs(data.vlogs || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Travel Vlogs | Orbito</title>
        <meta name="description" content="Watch the best travel vlogs from around the world. Get inspired for your next adventure." />
        <link rel="canonical" href="https://orbitotrip.com/vlogs" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-[#0B3D91] pt-12 pb-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-600 rounded-full p-2">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <span className="text-blue-200 font-semibold text-sm uppercase tracking-widest">Travel Vlogs</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Get Inspired
            </h1>
            <p className="text-blue-100 text-lg max-w-xl">
              Fresh travel videos curated daily from the world's best travel creators.
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="container mx-auto px-4 lg:px-8 py-10">
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="w-10 h-10 animate-spin text-[#0B3D91]" />
            </div>
          ) : vlogs.length === 0 ? (
            <div className="text-center py-32">
              <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-semibold">Vlogs loading soon</p>
              <p className="text-gray-400 text-sm mt-1">Check back in a few minutes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px]">
              {/* Row 1: 1 large hero + 2 small stacked */}
              {vlogs[0] && (
                <div className="col-span-2 row-span-2">
                  <VlogCard vlog={vlogs[0]} size="lg" />
                </div>
              )}
              {vlogs[1] && (
                <div className="col-span-1 row-span-1">
                  <VlogCard vlog={vlogs[1]} size="sm" />
                </div>
              )}
              {vlogs[2] && (
                <div className="col-span-1 row-span-1">
                  <VlogCard vlog={vlogs[2]} size="sm" />
                </div>
              )}

              {/* Row 2 continuation: 2 more smalls on the right */}
              {vlogs[3] && (
                <div className="col-span-1 row-span-1">
                  <VlogCard vlog={vlogs[3]} size="sm" />
                </div>
              )}
              {vlogs[4] && (
                <div className="col-span-1 row-span-1">
                  <VlogCard vlog={vlogs[4]} size="sm" />
                </div>
              )}

              {/* Row 3: 3 medium cards */}
              {vlogs[5] && (
                <div className="col-span-1 row-span-1 md:col-span-1">
                  <VlogCard vlog={vlogs[5]} size="md" />
                </div>
              )}
              {vlogs[6] && (
                <div className="col-span-2 row-span-1">
                  <VlogCard vlog={vlogs[6]} size="md" />
                </div>
              )}
              {vlogs[7] && (
                <div className="col-span-1 row-span-1">
                  <VlogCard vlog={vlogs[7]} size="sm" />
                </div>
              )}

              {/* Row 4: 1 wide + 1 small */}
              {vlogs[8] && (
                <div className="col-span-2 row-span-1">
                  <VlogCard vlog={vlogs[8]} size="md" />
                </div>
              )}
              {vlogs[9] && (
                <div className="col-span-1 row-span-2">
                  <VlogCard vlog={vlogs[9]} size="md" />
                </div>
              )}
              {vlogs[10] && (
                <div className="col-span-1 row-span-1">
                  <VlogCard vlog={vlogs[10]} size="sm" />
                </div>
              )}

              {/* Row 5 */}
              {vlogs[11] && (
                <div className="col-span-1 row-span-1">
                  <VlogCard vlog={vlogs[11]} size="sm" />
                </div>
              )}
              {vlogs[12] && (
                <div className="col-span-2 row-span-1">
                  <VlogCard vlog={vlogs[12]} size="md" />
                </div>
              )}
              {vlogs[13] && (
                <div className="col-span-1 row-span-1">
                  <VlogCard vlog={vlogs[13]} size="sm" />
                </div>
              )}
              {vlogs[14] && (
                <div className="col-span-2 row-span-1">
                  <VlogCard vlog={vlogs[14]} size="md" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VlogsPage;
