import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { MapPin, Star, Phone, MessageCircle, Search, X, Calendar, User, Mail, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const SPECIALTIES = ['City Walks', 'Food & Drink', 'History & Culture', 'Adventure & Trekking', 'Religious & Spiritual', 'Photography', 'Wildlife & Nature', 'Art & Architecture', 'Nightlife', 'Day Trips'];

function StarRating({ rating, size = 'sm' }) {
  const s = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${s} ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

function GuideCard({ guide, onContact, onReview }) {
  const photo = guide.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(guide.full_name)}&background=0B3D91&color=fff&size=200`;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <div className="relative h-44 bg-gradient-to-br from-[#0B3D91]/10 to-[#1E5BA8]/10">
        <img src={photo} alt={guide.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(guide.full_name)}&background=0B3D91&color=fff&size=200`; }} />
        {guide.average_rating > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-gray-800">{Number(guide.average_rating).toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{guide.full_name}</h3>
          <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{guide.location}</span>
          </div>
          {guide.total_reviews > 0 && (
            <div className="flex items-center gap-2 mt-1.5">
              <StarRating rating={guide.average_rating} />
              <span className="text-xs text-gray-500">({guide.total_reviews} review{guide.total_reviews !== 1 ? 's' : ''})</span>
            </div>
          )}
        </div>

        {guide.charges_per_hour && (
          <p className="text-[#0B3D91] font-bold text-sm mb-3">
            ${Number(guide.charges_per_hour).toFixed(0)}<span className="font-normal text-gray-500">/hr</span>
          </p>
        )}

        {guide.description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">{guide.description}</p>
        )}

        {guide.languages?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {guide.languages.slice(0, 4).map((l) => (
              <span key={l} className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{l}</span>
            ))}
          </div>
        )}

        {guide.specialties?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {guide.specialties.slice(0, 3).map((s) => (
              <span key={s} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
            ))}
            {guide.specialties.length > 3 && <span className="text-[11px] text-gray-400">+{guide.specialties.length - 3} more</span>}
          </div>
        )}

        <div className="mt-auto space-y-2">
          <Button onClick={() => onContact(guide)} className="w-full bg-[#25D366] hover:bg-[#1eb85a] text-white font-semibold gap-2">
            <MessageCircle className="w-4 h-4" />
            Contact on WhatsApp
          </Button>
          <Button onClick={() => onReview(guide)} variant="outline" className="w-full text-sm text-gray-600 hover:text-[#0B3D91]">
            Leave a Review
          </Button>
        </div>
      </div>
    </div>
  );
}

function ContactModal({ guide, onClose }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', destination: '', trip_date: '' });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSaving(true);
    try {
      await supabase.from('tour_guide_inquiries').insert({
        guide_id: guide.id,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone || null,
        message: form.message || null,
        trip_destination: form.destination || null,
        trip_date: form.trip_date || null,
      });

      const preText = encodeURIComponent(
        `Hi ${guide.full_name}, I found you on Orbito. I'm visiting ${form.destination || 'your location'} and would love to discuss your guide services.${form.message ? '\n\n' + form.message : ''}`
      );
      const phone = guide.phone_number.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}?text=${preText}`, '_blank');
      onClose();
    } catch {
      toast({ variant: 'destructive', title: 'Something went wrong', description: 'Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-5 border-b">
          <img src={guide.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(guide.full_name)}&background=0B3D91&color=fff`}
            alt={guide.full_name} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="font-bold text-gray-900">{guide.full_name}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{guide.location}</p>
          </div>
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <p className="text-sm text-gray-500">Fill your details — this gets saved so the guide knows who's coming, then we'll open WhatsApp for you.</p>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Your name *" value={form.name} onChange={(e) => set('name', e.target.value)} required />
            <Input placeholder="Email *" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          </div>
          <Input placeholder="Phone (optional)" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <Input placeholder="Where are you visiting?" value={form.destination} onChange={(e) => set('destination', e.target.value)} />
          <Input type="date" value={form.trip_date} onChange={(e) => set('trip_date', e.target.value)} />
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
            rows={3} placeholder="Message for the guide..."
            value={form.message} onChange={(e) => set('message', e.target.value)}
          />
          <Button type="submit" disabled={saving} className="w-full bg-[#25D366] hover:bg-[#1eb85a] text-white font-semibold gap-2">
            <MessageCircle className="w-4 h-4" />
            {saving ? 'Opening WhatsApp…' : 'Open WhatsApp'}
          </Button>
        </form>
      </div>
    </div>
  );
}

function ReviewModal({ guide, onClose }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', rating: 0, text: '' });
  const [hover, setHover] = useState(0);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.rating) return;
    setSaving(true);
    try {
      await supabase.from('tour_guide_reviews').insert({
        guide_id: guide.id,
        reviewer_name: form.name,
        reviewer_email: form.email,
        rating: form.rating,
        review_text: form.text || null,
      });

      // Recalculate guide's average rating
      const { data: reviews } = await supabase.from('tour_guide_reviews').select('rating').eq('guide_id', guide.id);
      if (reviews) {
        const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
        await supabase.from('tour_guide_profiles').update({ average_rating: avg.toFixed(2), total_reviews: reviews.length }).eq('id', guide.id);
      }

      toast({ title: 'Review submitted!', description: 'Thank you for your feedback.' });
      onClose();
    } catch {
      toast({ variant: 'destructive', title: 'Something went wrong' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b">
          <p className="font-bold text-gray-900">Leave a Review for {guide.full_name}</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Your name *" value={form.name} onChange={(e) => set('name', e.target.value)} required />
            <Input placeholder="Email *" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2 font-medium">Your rating *</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`w-8 h-8 cursor-pointer transition-colors ${i <= (hover || form.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                  onClick={() => set('rating', i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} />
              ))}
            </div>
          </div>
          <textarea className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
            rows={4} placeholder="Share your experience with this guide..."
            value={form.text} onChange={(e) => set('text', e.target.value)} />
          <Button type="submit" disabled={saving || !form.rating} className="w-full bg-[#0B3D91] hover:bg-[#092C6B] text-white font-semibold">
            {saving ? 'Submitting…' : 'Submit Review'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function TourGuidesPage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [contactGuide, setContactGuide] = useState(null);
  const [reviewGuide, setReviewGuide] = useState(null);

  useEffect(() => {
    supabase.from('tour_guide_profiles').select('*').eq('status', 'approved').eq('is_active', true)
      .then(({ data }) => { setGuides(data || []); setLoading(false); });
  }, []);

  const filtered = guides.filter((g) => {
    const q = search.toLowerCase();
    const matchSearch = !q || g.full_name.toLowerCase().includes(q) || g.location.toLowerCase().includes(q);
    const matchSpec = !filterSpecialty || (g.specialties || []).includes(filterSpecialty);
    return matchSearch && matchSpec;
  });

  const locations = [...new Set(guides.map((g) => g.location))].sort();

  return (
    <>
      <Helmet>
        <title>Local Tour Guides — Orbito</title>
        <meta name="description" content="Find experienced local tour guides. Contact them directly on WhatsApp and plan your perfect trip." />
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0B3D91] to-[#1E5BA8] text-white py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Find Your Perfect Local Guide</h1>
          <p className="text-white/80 text-lg mb-8">Connect directly with experienced local guides via WhatsApp. No middleman, no hidden fees.</p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              className="pl-12 h-12 text-base rounded-full bg-white text-gray-900 border-0 shadow-lg"
              placeholder="Search by name or location…"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setFilterSpecialty('')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${!filterSpecialty ? 'bg-[#0B3D91] text-white border-[#0B3D91]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0B3D91]'}`}>
            All
          </button>
          {SPECIALTIES.map((s) => (
            <button key={s} onClick={() => setFilterSpecialty(filterSpecialty === s ? '' : s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${filterSpecialty === s ? 'bg-[#0B3D91] text-white border-[#0B3D91]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0B3D91]'}`}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#0B3D91] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-2">No guides found</p>
            <p className="text-gray-400 text-sm">Try a different search or check back soon — more guides are joining daily.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">{filtered.length} guide{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((g) => (
                <GuideCard key={g.id} guide={g} onContact={setContactGuide} onReview={setReviewGuide} />
              ))}
            </div>
          </>
        )}

        {/* CTA banner */}
        <div className="mt-16 bg-gradient-to-r from-[#0B3D91] to-[#1E5BA8] rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Are you a local guide?</h2>
          <p className="text-white/80 mb-5">Join Orbito and connect with thousands of travellers looking for authentic local experiences.</p>
          <Link to="/tour-guides/register">
            <Button className="bg-white text-[#0B3D91] hover:bg-gray-100 font-bold px-8 gap-2">
              Register as a Guide <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {contactGuide && <ContactModal guide={contactGuide} onClose={() => setContactGuide(null)} />}
      {reviewGuide && <ReviewModal guide={reviewGuide} onClose={() => setReviewGuide(null)} />}
    </>
  );
}
