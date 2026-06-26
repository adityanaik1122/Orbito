import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { Sparkles, ArrowRight, CheckCircle2, MessageSquare, CreditCard, Shield, MapPin, Clock, ExternalLink, Calendar } from 'lucide-react';

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

const STEPS = [
  { icon: MessageSquare, title: 'Describe your trip', desc: 'Tell the AI where you want to go, for how long, and what you enjoy — in plain English.' },
  { icon: Sparkles,      title: 'Get your itinerary', desc: 'A full day-by-day plan is generated in seconds, tailored to your style and budget.' },
  { icon: CreditCard,    title: 'Book experiences', desc: 'Every activity links to real bookable tours via Viator, straight from your plan.' },
];

const SAMPLE_DAYS = [
  {
    day: 1,
    title: 'Temples & Tradition',
    items: [
      { time: '09:00', name: 'Senso-ji Temple', note: 'Arrive early to beat crowds', duration: '1.5h' },
      { time: '11:00', name: 'Nakamise Street', note: 'Street food & souvenirs', duration: '1h' },
      { time: '14:00', name: 'Ueno Park', note: 'National museums nearby', duration: '2h' },
      { time: '18:00', name: 'Shibuya Crossing', note: 'Golden hour views', duration: '1h' },
    ],
  },
  {
    day: 2,
    title: 'Modern Tokyo',
    items: [
      { time: '10:00', name: 'teamLab Borderless', note: 'Book tickets in advance', duration: '2h' },
      { time: '13:00', name: 'Harajuku & Takeshita St', note: 'Fashion & crepes', duration: '2h' },
      { time: '17:00', name: 'Meiji Shrine', note: 'Peaceful forest walk', duration: '1h' },
      { time: '20:00', name: 'Shinjuku Ramen', note: 'Try Ichiran for solo booths', duration: '1h' },
    ],
  },
  {
    day: 3,
    title: 'Day Trip to Nikko',
    items: [
      { time: '08:00', name: 'Shinkansen to Nikko', note: '2h from Tokyo', duration: '2h' },
      { time: '10:30', name: 'Tosho-gu Shrine', note: 'UNESCO World Heritage', duration: '2h' },
      { time: '13:00', name: 'Kegon Falls', note: 'Stunning 97m waterfall', duration: '1h' },
      { time: '17:00', name: 'Return to Tokyo', note: '', duration: '2h' },
    ],
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Plain English planning',
    desc: 'Just type "5 days in Bali, foodie focus, mid-budget" — the AI handles the rest. No forms, no filters.',
    color: 'from-blue-500 to-[#0B3D91]',
  },
  {
    icon: ExternalLink,
    title: 'Real bookable tours',
    desc: 'Every activity in your plan links to a real tour on Viator. One click from plan to booked.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Calendar,
    title: 'Save, share & edit',
    desc: 'Your itinerary lives online. Share it with travel companions, tweak it anytime, print it for offline.',
    color: 'from-violet-500 to-purple-700',
  },
];

const STATS = [
  { value: 500,  suffix: '+',  label: 'Destinations' },
  { value: 10,   suffix: 'K+', label: 'Itineraries Created' },
  { value: 30,   suffix: 's',  label: 'Avg. Planning Time' },
  { value: 100,  suffix: '%',  label: 'Free Forever' },
];

const StatCounter = ({ value, suffix, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1400;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setCount(Math.floor(eased * value));
          if (p < 1) requestAnimationFrame(tick);
          else setCount(value);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center px-4">
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0B3D91] to-[#0EA5E9] bg-clip-text text-transparent">
        {count}{suffix}
      </div>
      <div className="text-gray-500 text-sm mt-2 font-medium tracking-wide">{label}</div>
    </div>
  );
};

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
        <title>Orbito — AI Itinerary Maker & Tour Booking</title>
        <meta name="description" content="Describe any trip in plain English and get a full day-by-day itinerary in seconds. Book tours from Viator directly from your plan. Free forever." />
        <link rel="canonical" href="https://orbitotrip.com" />
        <meta property="og:title" content="Orbito — AI Itinerary Maker & Tour Booking" />
        <meta property="og:description" content="AI-powered trip planning with real bookable tours from Viator. Free to use." />
        <meta property="og:type" content="website" />
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
                AI itinerary maker — free forever
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                Your trip, planned<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  by AI in seconds
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
                Describe any trip in plain English — get a full day-by-day itinerary
                with real bookable tours from Viator.
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
                      placeholder="e.g. 7 days in Tokyo, foodie and culture"
                      className="flex-1 px-6 py-5 text-base md:text-lg bg-transparent border-0 focus:outline-none text-gray-900 placeholder:text-gray-400"
                      autoComplete="off"
                    />
                    <div className="pr-2">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-[#0B3D91] to-[#0EA5E9] hover:from-[#092C6B] hover:to-[#0284c7] text-white font-semibold px-5 py-3 rounded-xl flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Plan my trip
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

          {/* Feature strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-0 left-0 right-0 z-10 bg-black/40 backdrop-blur-sm border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-wrap justify-center gap-8 text-sm text-white/70 font-medium">
              <span>✦ 500+ destinations</span>
              <span>✦ Powered by Viator</span>
              <span>✦ Free to use</span>
              <span>✦ No account needed</span>
            </div>
          </motion.div>
        </section>

        {/* ── STATS BAR ────────────────────────────────────────────────────── */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="container mx-auto px-5 max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-gray-100">
              {STATS.map((s) => (
                <StatCounter key={s.label} {...s} />
              ))}
            </div>
          </div>
        </section>

        {/* ── ITINERARY PREVIEW ────────────────────────────────────────────── */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-5 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-[#0B3D91]/10 text-[#0B3D91] text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">
                Example output
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                This is what you'll get
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                A complete day-by-day plan — generated in seconds from one sentence.
              </p>
            </motion.div>

            {/* Mock prompt bubble */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center mb-8"
            >
              <div className="flex items-start gap-3 max-w-xl w-full">
                <div className="w-8 h-8 rounded-full bg-[#0B3D91] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  Y
                </div>
                <div className="bg-[#0B3D91] text-white px-5 py-3 rounded-2xl rounded-tl-sm text-sm font-medium shadow-md">
                  "7 days in Tokyo, mix of tradition and modern, foodie focus 🇯🇵"
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                <Sparkles className="w-3.5 h-3.5 text-[#0B3D91]" />
                <span className="text-[#0B3D91] font-semibold">Orbito AI</span>
                <span>generated your 7-day Tokyo itinerary</span>
              </div>
            </motion.div>

            {/* Day cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {SAMPLE_DAYS.map((day, i) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-[#0B3D91] to-[#0EA5E9] px-5 py-4">
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Day {day.day}</p>
                    <p className="text-white font-bold text-lg">{day.title}</p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {day.items.map((item, j) => (
                      <div key={j} className="px-5 py-3 flex items-start gap-3">
                        <span className="text-xs font-mono text-[#0B3D91] font-semibold bg-blue-50 px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0">
                          {item.time}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                          {item.note && <p className="text-xs text-gray-400 mt-0.5 truncate">{item.note}</p>}
                        </div>
                        <span className="ml-auto text-xs text-gray-400 flex-shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{item.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button
                onClick={() => handlePrompt('7 days in Tokyo, mix of tradition and modern 🇯🇵')}
                className="bg-gradient-to-r from-[#0B3D91] to-[#0EA5E9] hover:from-[#092C6B] hover:to-[#0284c7] text-white font-bold px-8 py-4 text-base rounded-full shadow-md"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate my Tokyo itinerary
              </Button>
              <p className="text-sm text-gray-400 mt-3">Or type your own destination above ↑</p>
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-5 max-w-5xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Why Orbito?</h2>
              <p className="text-gray-500 text-lg">The smarter way to plan a trip</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="text-center px-4"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md`}>
                    <f.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section className="py-20 bg-gray-50">
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
                  <div className="w-14 h-14 bg-gradient-to-br from-[#0B3D91] to-[#0EA5E9] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
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
        <section className="py-20 bg-white">
          <div className="container mx-auto px-5">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Popular destinations</h2>
                <p className="text-gray-500 text-lg">Click any city to start building your itinerary</p>
              </div>
              <Link
                to="/destinations"
                className="hidden md:flex items-center gap-1 text-[#0B3D91] font-semibold hover:underline text-sm"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px] lg:auto-rows-[200px]">
              {DESTINATIONS.map((dest, i) => (
                <motion.div
                  key={dest.slug}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className={i === 0 ? 'lg:row-span-2' : ''}
                >
                  <button
                    onClick={() => handlePrompt(`7 days in ${dest.name}, best mix of culture and food`)}
                    className="relative block w-full h-full rounded-2xl overflow-hidden group text-left"
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className={`text-white font-bold leading-tight ${i === 0 ? 'text-2xl' : 'text-lg'}`}>{dest.flag} {dest.name}</p>
                      {i === 0 && <p className="text-white/70 text-xs mt-1">Most popular destination</p>}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Plan trip
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8 md:hidden">
              <Link to="/destinations" className="text-[#0B3D91] font-semibold text-sm flex items-center gap-1 justify-center">
                View all destinations <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── EARLY ADOPTER BANNER ─────────────────────────────────────────── */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-5 max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#0B3D91]/5 to-blue-50 border border-[#0B3D91]/15 rounded-3xl p-10"
            >
              <div className="inline-flex items-center gap-2 bg-[#0B3D91] text-white text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> Early Access
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Be among the first<br />to plan smarter
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                Orbito is brand new. Try the AI itinerary builder today — it's completely free, and your feedback shapes what we build next.
              </p>
              <Button
                onClick={() => navigate('/plan')}
                className="bg-gradient-to-r from-[#0B3D91] to-[#0EA5E9] hover:from-[#092C6B] hover:to-[#0284c7] text-white font-bold px-8 py-4 text-base rounded-full shadow-md"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Try it free — no sign-up needed
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
        <section className="py-10 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-green-600" /> Secure payments</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600" /> Verified via Viator</div>
              <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-500" /> Free AI planning</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-600" /> No sign-up to plan</div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
        <section className="py-24 bg-[#060d1f] text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B3D91]/50 via-[#0EA5E9]/20 to-transparent" />
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
