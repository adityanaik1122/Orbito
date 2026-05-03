import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { Sparkles, ArrowRight, Star, CheckCircle2, MessageSquare, CreditCard, Shield } from 'lucide-react';

const DESTINATIONS = [
  { slug: 'london',    name: 'London',    flag: '🇬🇧', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop' },
  { slug: 'paris',     name: 'Paris',     flag: '🇫🇷', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop' },
  { slug: 'dubai',     name: 'Dubai',     flag: '🇦🇪', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600&auto=format&fit=crop' },
  { slug: 'tokyo',     name: 'Tokyo',     flag: '🇯🇵', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop' },
  { slug: 'rome',      name: 'Rome',      flag: '🇮🇹', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600&auto=format&fit=crop' },
  { slug: 'barcelona', name: 'Barcelona', flag: '🇪🇸', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=600&auto=format&fit=crop' },
  { slug: 'bali',      name: 'Bali',      flag: '🇮🇩', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop' },
  { slug: 'new-york',  name: 'New York',  flag: '🇺🇸', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600&auto=format&fit=crop' },
];

const PROMPTS = [
  '7 days in Tokyo, mix of tradition and modern 🇯🇵',
  'Romantic week in Paris with wine and art 🇫🇷',
  'Family trip to Bali, budget £3000 🇮🇩',
  'Weekend city break in Barcelona 🇪🇸',
  'Solo backpacking through Italy, 2 weeks 🇮🇹',
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    location: 'London',
    rating: 5,
    text: 'Planned my entire Tokyo trip in under 5 minutes. The AI understood exactly what I wanted — perfect mix of temples, street food, and modern Tokyo.',
  },
  {
    name: 'James K.',
    location: 'Manchester',
    rating: 5,
    text: 'Used Orbito for our family holiday in Bali. Saved hours of research and the itinerary was genuinely better than anything I could have put together myself.',
  },
  {
    name: 'Priya R.',
    location: 'Edinburgh',
    rating: 5,
    text: 'The AI suggested places I\'d never have found on my own. Our Paris trip was absolutely magical thanks to the personalised recommendations.',
  },
];

const STEPS = [
  { icon: MessageSquare, title: 'Describe your trip', desc: 'Tell the AI where you want to go, for how long, and what you enjoy.' },
  { icon: Sparkles,      title: 'Get your itinerary', desc: 'A full day-by-day plan is generated in seconds, tailored to you.' },
  { icon: CreditCard,    title: 'Book experiences', desc: 'Browse and book tours from Viator directly from your plan.' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/plan', {
      state: query.trim()
        ? { naturalLanguageQuery: query.trim(), autoGenerate: true }
        : undefined,
    });
  };

  const handlePrompt = (prompt) => {
    setQuery(prompt);
    navigate('/plan', { state: { naturalLanguageQuery: prompt, autoGenerate: true } });
  };

  return (
    <>
      <Helmet>
        <title>Orbito — AI Travel Planner & Tour Booking</title>
        <meta name="description" content="Describe your trip in plain English and get a personalised day-by-day itinerary in seconds. Browse and book tours from Viator's global network." />
        <link rel="canonical" href="https://orbitotrip.com" />
        <meta property="og:title" content="Orbito — AI Travel Planner & Tour Booking" />
        <meta property="og:description" content="AI-powered trip planning with real bookable tours from Viator. Free to use." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Orbito",
            "description": "AI-powered travel planning and tour booking platform",
            "applicationCategory": "TravelApplication",
            "operatingSystem": "Web",
            "url": "https://orbitotrip.com",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "2847"
            }
          }
        `}</script>
      </Helmet>

      <div className="bg-white">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#060d1f]">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-35"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
          </div>

          <div className="relative z-10 w-full max-w-4xl mx-auto px-5 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="space-y-6"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                AI-powered trip planning — free forever
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                Plan your perfect<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  trip with AI
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
                Describe any trip in plain English — get a full day-by-day itinerary
                in seconds, with real bookable tours from Viator.
              </p>

              {/* Search */}
              <form onSubmit={handleSubmit} className="pt-2">
                <div className="relative max-w-2xl mx-auto">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl blur opacity-40" />
                  <div className="relative flex items-center bg-white rounded-2xl overflow-hidden shadow-2xl">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Where would you like to go?"
                      className="flex-1 px-6 py-5 text-base md:text-lg bg-transparent border-0 focus:outline-none text-gray-900 placeholder:text-gray-400"
                      autoComplete="off"
                    />
                    <div className="pr-2">
                      <Button
                        type="submit"
                        className="bg-[#0B3D91] hover:bg-[#092C6B] text-white font-semibold px-5 py-3 rounded-xl flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Plan
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Example prompts */}
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePrompt(p)}
                    className="text-xs sm:text-sm bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white/90 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-0 left-0 right-0 z-10 bg-black/40 backdrop-blur-sm border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-wrap justify-center gap-8 text-sm text-white/70 font-medium">
              <span>✦ 50,000+ trips planned</span>
              <span>✦ 500+ destinations</span>
              <span>✦ Powered by Viator</span>
              <span>✦ Free to use</span>
            </div>
          </motion.div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-5 max-w-5xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How it works</h2>
              <p className="text-gray-500 text-lg">Three steps to your perfect journey</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#0B3D91] to-[#1E5BA8] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
                    <step.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="text-xs font-bold text-[#0B3D91] uppercase tracking-widest mb-2">Step {i + 1}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── POPULAR DESTINATIONS ──────────────────────────────────────────── */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-5">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Popular destinations</h2>
                <p className="text-gray-500 text-lg">Start exploring the world's best travel experiences</p>
              </div>
              <Link
                to="/tours"
                className="hidden md:flex items-center gap-1 text-[#0B3D91] font-semibold hover:underline text-sm"
              >
                Browse all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {DESTINATIONS.map((dest, i) => (
                <motion.div
                  key={dest.slug}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <Link
                    to={`/destinations/${dest.slug}`}
                    className="relative block h-44 sm:h-52 rounded-2xl overflow-hidden group"
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className="text-white font-bold text-lg leading-tight">{dest.flag} {dest.name}</p>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore →
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8 md:hidden">
              <Link to="/tours" className="text-[#0B3D91] font-semibold text-sm flex items-center gap-1 justify-center">
                Browse all destinations <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── SOCIAL PROOF ─────────────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-5 max-w-5xl">
            <div className="text-center mb-12">
              <div className="flex justify-center gap-0.5 mb-3">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Loved by travellers</h2>
              <p className="text-gray-500 text-lg">4.9 average · 2,800+ happy trips</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                >
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-5 text-sm">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0B3D91] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
        <section className="py-10 bg-gray-50 border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-green-600" /> Secure payments</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600" /> Verified via Viator</div>
              <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-500" /> Free AI planning</div>
              <div className="flex items-center gap-2"><Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /> 4.9 / 5 rating</div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
        <section className="py-24 bg-[#060d1f] text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B3D91]/30 to-transparent" />
          <div className="relative z-10 container mx-auto px-5 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Ready to explore?</h2>
              <p className="text-white/60 text-lg mb-10 font-light">
                Start planning your next adventure — it takes 30 seconds.
              </p>
              <Button
                onClick={() => navigate('/plan')}
                className="bg-white text-[#0B3D91] hover:bg-blue-50 font-bold px-10 py-4 text-lg rounded-full shadow-lg transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {t('home_cta_get_started')}
              </Button>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
};

export default HomePage;
