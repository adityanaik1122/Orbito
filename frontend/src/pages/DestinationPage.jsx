import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Sparkles, ChevronRight } from 'lucide-react';

// ── Destination config ────────────────────────────────────────────────────────
const DESTINATIONS = {
  london: {
    name: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1600&auto=format&fit=crop',
    description: 'Discover the iconic capital — world-class museums, royal palaces, and vibrant neighbourhoods all within one extraordinary city.',
    highlights: ['Tower of London', 'Buckingham Palace', 'The Shard', 'West End Shows'],
    nearby: ['edinburgh', 'paris', 'amsterdam'],
  },
  paris: {
    name: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop',
    description: 'Experience the city of light — the Eiffel Tower, world-famous cuisine, and unparallelled art in every arrondissement.',
    highlights: ['Eiffel Tower', 'The Louvre', 'Montmartre', 'Seine River Cruise'],
    nearby: ['amsterdam', 'barcelona', 'london'],
  },
  amsterdam: {
    name: 'Amsterdam',
    country: 'Netherlands',
    flag: '🇳🇱',
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1600&auto=format&fit=crop',
    description: 'Explore historic canals, cycling culture, and world-class museums in the compact but captivating Dutch capital.',
    highlights: ['Rijksmuseum', 'Anne Frank House', 'Canal Cruise', 'Vondelpark'],
    nearby: ['paris', 'london', 'brussels'],
  },
  dubai: {
    name: 'Dubai',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop',
    description: "A city of superlatives — the world's tallest building, ultra-luxury experiences, and unforgettable desert adventures.",
    highlights: ['Burj Khalifa', 'Dubai Mall', 'Desert Safari', 'Dubai Creek'],
    nearby: ['istanbul', 'rome', 'barcelona'],
  },
  rome: {
    name: 'Rome',
    country: 'Italy',
    flag: '🇮🇹',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1600&auto=format&fit=crop',
    description: 'Walk through 2,000 years of history — the Colosseum, Vatican, and the incredible Italian cuisine of the Eternal City.',
    highlights: ['Colosseum', 'Vatican Museums', 'Trevi Fountain', 'Roman Forum'],
    nearby: ['barcelona', 'paris', 'amsterdam'],
  },
  barcelona: {
    name: 'Barcelona',
    country: 'Spain',
    flag: '🇪🇸',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1600&auto=format&fit=crop',
    description: "Gaudí's architectural masterpieces, golden beaches, world-famous food markets, and vibrant nightlife await.",
    highlights: ['Sagrada Família', 'Park Güell', 'La Boqueria', 'Gothic Quarter'],
    nearby: ['madrid', 'rome', 'paris'],
  },
  'new-york': {
    name: 'New York',
    country: 'United States',
    flag: '🇺🇸',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1600&auto=format&fit=crop',
    description: 'The city that never sleeps — Times Square, Central Park, world-class museums, and every cuisine on the planet.',
    highlights: ['Statue of Liberty', 'Central Park', 'Times Square', 'Brooklyn Bridge'],
    nearby: ['london', 'paris', 'dubai'],
  },
  tokyo: {
    name: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1600&auto=format&fit=crop',
    description: 'Where ancient temples meet neon-lit skyscrapers — Tokyo is a sensory adventure unlike anywhere else on earth.',
    highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Tower', 'Tsukiji Market'],
    nearby: ['bangkok', 'singapore', 'dubai'],
  },
  istanbul: {
    name: 'Istanbul',
    country: 'Turkey',
    flag: '🇹🇷',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1600&auto=format&fit=crop',
    description: 'Where East meets West — the Hagia Sophia, Grand Bazaar, and Bosphorus cruises make Istanbul unmissable.',
    highlights: ['Hagia Sophia', 'Grand Bazaar', 'Bosphorus Cruise', 'Topkapi Palace'],
    nearby: ['rome', 'barcelona', 'dubai'],
  },
  bangkok: {
    name: 'Bangkok',
    country: 'Thailand',
    flag: '🇹🇭',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1600&auto=format&fit=crop',
    description: 'Dazzling temples, street food markets, and vibrant nightlife make Bangkok one of the most exciting cities in Asia.',
    highlights: ['Wat Phra Kaew', 'Chatuchak Market', 'Chao Phraya River', 'Khao San Road'],
    nearby: ['singapore', 'tokyo', 'bali'],
  },
  singapore: {
    name: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1600&auto=format&fit=crop',
    description: "A futuristic garden city — Marina Bay Sands, Sentosa Island, and hawker centres serving the world's finest street food.",
    highlights: ['Marina Bay Sands', 'Gardens by the Bay', 'Sentosa Island', 'Hawker Centres'],
    nearby: ['bangkok', 'tokyo', 'bali'],
  },
  bali: {
    name: 'Bali',
    country: 'Indonesia',
    flag: '🇮🇩',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1600&auto=format&fit=crop',
    description: 'Terraced rice fields, ancient temples, surf breaks, and a spiritual energy that draws visitors back again and again.',
    highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur'],
    nearby: ['singapore', 'bangkok', 'tokyo'],
  },
};

const VIATOR_WIDGET_SRC = 'https://www.viator.com/orion/partner/widget.js';

// ── Component ─────────────────────────────────────────────────────────────────
const DestinationPage = () => {
  const { city } = useParams();
  const navigate = useNavigate();

  const citySlug = city?.toLowerCase();
  const dest = DESTINATIONS[citySlug];

  useEffect(() => {
    if (!dest) {
      navigate(`/tours`, { replace: true });
      return;
    }

    // Force re-initialization on every mount (SPA navigation fix)
    const existing = document.querySelector(`script[src="${VIATOR_WIDGET_SRC}"]`);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = VIATOR_WIDGET_SRC;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const s = document.querySelector(`script[src="${VIATOR_WIDGET_SRC}"]`);
      if (s) s.remove();
    };
  }, [city]);

  if (!dest) return null;

  const nearbyDestinations = (dest.nearby || [])
    .map((slug) => ({ slug, ...DESTINATIONS[slug] }))
    .filter(Boolean);

  return (
    <>
      <Helmet>
        <title>Things to Do in {dest.name} | Tours & Experiences | Orbito</title>
        <meta
          name="description"
          content={`Book the best tours and experiences in ${dest.name}. ${dest.description} Discover curated activities powered by Viator.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Things to Do in ${dest.name} | Orbito`} />
        <meta property="og:description" content={dest.description} />
        <meta property="og:image" content={dest.image} />
        <meta property="og:url" content={`https://orbitotrip.com/destinations/${citySlug}`} />
        <link rel="canonical" href={`https://orbitotrip.com/destinations/${citySlug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TouristDestination",
          "name": dest.name,
          "description": dest.description,
          "image": dest.image,
          "url": `https://orbitotrip.com/destinations/${citySlug}`,
          "touristType": ["Cultural", "Adventure", "Family"],
          "containedInPlace": { "@type": "Country", "name": dest.country }
        })}</script>
      </Helmet>

      {/* ── Hero ── */}
      <div className="relative h-[480px] overflow-hidden bg-gray-800">
        <img
          src={dest.image}
          alt={dest.name}
          className="w-full h-full object-cover"
          loading="eager"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container mx-auto px-4 pb-10">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
              <Link to="/tours" className="hover:text-white transition-colors">Tours</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>{dest.name}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg">
              {dest.flag} {dest.name}
            </h1>
            <p className="text-white/85 text-lg max-w-2xl mb-5 leading-relaxed">{dest.description}</p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {dest.country}
              </div>
              {dest.highlights.slice(0, 2).map((h) => (
                <div key={h} className="hidden md:flex bg-white/10 backdrop-blur-sm text-white/90 px-3 py-1.5 rounded-full text-xs items-center gap-1.5">
                  ✦ {h}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-10 space-y-14">

          {/* ── Viator Widget ── */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Top experiences in {dest.name}
              </h2>
              <span className="text-xs text-gray-400">Affiliate partner content · Viator</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div
                data-vi-partner-id="P00281964"
                data-vi-widget-ref="W-e50d8b20-0e81-4083-a036-aad28f2f0562"
              />
            </div>
          </section>

          {/* ── AI Itinerary CTA ── */}
          <section className="bg-gradient-to-r from-[#0B3D91] to-[#1E5BA8] rounded-2xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-yellow-300 text-sm font-semibold uppercase tracking-wide">AI Itinerary Creator</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Plan your {dest.name} trip with AI</h3>
              <p className="text-blue-100 max-w-lg">
                Get a personalised day-by-day itinerary with activities matched to every day — in under 30 seconds.
              </p>
            </div>
            <Button
              onClick={() => navigate('/plan', { state: { destination: dest.name } })}
              className="bg-white text-[#0B3D91] hover:bg-blue-50 font-bold px-8 py-6 text-base rounded-xl shadow-lg whitespace-nowrap flex-shrink-0"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Plan My Trip
            </Button>
          </section>

          {/* ── Highlights ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Top attractions in {dest.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {dest.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="bg-white rounded-xl border border-gray-200 p-4 text-left"
                >
                  <MapPin className="w-5 h-5 text-[#0B3D91] mb-2" />
                  <p className="font-semibold text-sm text-gray-900">{highlight}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Nearby destinations ── */}
          {nearbyDestinations.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">You might also love</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {nearbyDestinations.map((d) => (
                  <Link
                    key={d.slug}
                    to={`/destinations/${d.slug}`}
                    className="relative h-44 rounded-2xl overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={d.image}
                      alt={d.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <p className="text-xl font-bold">{d.flag} {d.name}</p>
                      <p className="text-sm text-white/80">{d.country}</p>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore →
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
};

export default DestinationPage;
