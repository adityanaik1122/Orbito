import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Phone, DollarSign, Star, MessageCircle, Edit2, Save, Upload, Clock, Mail, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const SPECIALTIES = [
  'City Walks', 'Food & Drink', 'History & Culture', 'Adventure & Trekking',
  'Religious & Spiritual', 'Photography', 'Wildlife & Nature',
  'Art & Architecture', 'Nightlife', 'Day Trips',
];

function StatusBanner({ status, rejectionReason }) {
  if (status === 'approved') return (
    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-green-800">
      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
      <div>
        <p className="font-semibold">Your profile is live</p>
        <p className="text-sm text-green-700">Travellers can find and contact you on the <Link to="/tour-guides" className="underline">Tour Guides</Link> page.</p>
      </div>
    </div>
  );
  if (status === 'rejected') return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-800">
      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold">Profile not approved</p>
        {rejectionReason && <p className="text-sm text-red-700 mt-1"><strong>Reason:</strong> {rejectionReason}</p>}
        <p className="text-sm text-red-700 mt-1">Please update your profile and contact support if you believe this is an error.</p>
      </div>
    </div>
  );
  return (
    <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 text-yellow-800">
      <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
      <div>
        <p className="font-semibold">Pending approval</p>
        <p className="text-sm text-yellow-700">We'll review your profile within 24–48 hours and email you once it's approved.</p>
      </div>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

// ── Profile Tab ───────────────────────────────────────────────────────────────
function ProfileTab({ profile, onUpdated }) {
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    full_name: profile.full_name || '',
    phone_number: profile.phone_number || '',
    location: profile.location || '',
    charges_per_hour: profile.charges_per_hour || '',
    description: profile.description || '',
    languages: (profile.languages || []).join(', '),
  });
  const [specialties, setSpecialties] = useState(profile.specialties || []);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(profile.photo_url || null);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const toggleSpecialty = (s) =>
    setSpecialties((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast({ variant: 'destructive', title: 'Image must be under 5 MB' }); return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let photoUrl = profile.photo_url;
      if (photoFile) {
        const ext = photoFile.name.split('.').pop();
        const path = `${profile.id}/profile.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('tour-guide-photos').upload(path, photoFile, { upsert: true });
        if (!uploadErr) {
          const { data: { publicUrl } } = supabase.storage.from('tour-guide-photos').getPublicUrl(path);
          photoUrl = publicUrl;
        }
      }
      const langs = form.languages.split(',').map((l) => l.trim()).filter(Boolean);
      const { error } = await supabase.from('tour_guide_profiles').update({
        full_name: form.full_name.trim(),
        phone_number: form.phone_number.trim(),
        location: form.location.trim(),
        charges_per_hour: form.charges_per_hour ? parseFloat(form.charges_per_hour) : null,
        description: form.description.trim() || null,
        languages: langs,
        specialties,
        photo_url: photoUrl,
      }).eq('id', profile.id);
      if (error) throw error;
      toast({ title: 'Profile updated!' });
      onUpdated();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Save failed', description: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Photo */}
      <div className="flex items-center gap-5">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 cursor-pointer hover:border-[#0B3D91] transition-colors flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}>
          {photoPreview
            ? <img src={photoPreview} alt="profile" className="w-full h-full object-cover" />
            : <div className="flex flex-col items-center justify-center w-full h-full text-gray-400"><Upload className="w-6 h-6" /></div>
          }
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        <div>
          <p className="font-semibold text-gray-900">{profile.full_name}</p>
          <p className="text-sm text-gray-500 mt-0.5">Click photo to change</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
          <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input className="pl-9" value={form.full_name} onChange={(e) => set('full_name', e.target.value)} /></div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">WhatsApp Phone</label>
          <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input className="pl-9" placeholder="+44..." value={form.phone_number} onChange={(e) => set('phone_number', e.target.value)} /></div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Operating Location</label>
          <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input className="pl-9" placeholder="London, UK" value={form.location} onChange={(e) => set('location', e.target.value)} /></div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Charge per Hour ($)</label>
          <div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input type="number" min="0" className="pl-9" value={form.charges_per_hour} onChange={(e) => set('charges_per_hour', e.target.value)} /></div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Languages (comma-separated)</label>
        <Input placeholder="English, Hindi, French…" value={form.languages} onChange={(e) => set('languages', e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">About You</label>
        <textarea className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
          rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-3">Tour Specialties</label>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((s) => (
            <button key={s} type="button" onClick={() => toggleSpecialty(s)}
              className={`px-3 py-1.5 rounded-full text-sm border font-medium transition-colors ${specialties.includes(s) ? 'bg-[#0B3D91] text-white border-[#0B3D91]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0B3D91]'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="bg-[#0B3D91] hover:bg-[#092C6B] text-white font-semibold gap-2">
        <Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save Changes'}
      </Button>
    </div>
  );
}

// ── Inquiries Tab ─────────────────────────────────────────────────────────────
function InquiriesTab({ guideId }) {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('tour_guide_inquiries').select('*').eq('guide_id', guideId).order('created_at', { ascending: false })
      .then(({ data }) => { setInquiries(data || []); setLoading(false); });
  }, [guideId]);

  if (loading) return <div className="flex justify-center py-16"><div className="w-7 h-7 border-4 border-[#0B3D91] border-t-transparent rounded-full animate-spin" /></div>;

  if (!inquiries.length) return (
    <div className="text-center py-16">
      <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500 font-medium">No inquiries yet</p>
      <p className="text-gray-400 text-sm mt-1">When customers contact you via WhatsApp, their details will appear here.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 mb-4">{inquiries.length} inquiry{inquiries.length !== 1 ? 's' : ''}</p>
      {inquiries.map((inq) => (
        <div key={inq.id} className="bg-white border rounded-xl p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#0B3D91]/10 flex items-center justify-center text-[#0B3D91] font-bold text-sm">
                  {inq.customer_name[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{inq.customer_name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" />{inq.customer_email}</p>
                </div>
              </div>
              {inq.customer_phone && <p className="text-sm text-gray-600 flex items-center gap-1.5 mb-1"><Phone className="w-3.5 h-3.5" />{inq.customer_phone}</p>}
              {inq.trip_destination && <p className="text-sm text-gray-600 flex items-center gap-1.5 mb-1"><MapPin className="w-3.5 h-3.5" />Visiting: {inq.trip_destination}</p>}
              {inq.trip_date && <p className="text-sm text-gray-600 flex items-center gap-1.5 mb-1"><Calendar className="w-3.5 h-3.5" />{new Date(inq.trip_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
              {inq.message && <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 mt-2 italic">"{inq.message}"</p>}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-400">{new Date(inq.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              {inq.customer_phone && (
                <a href={`https://wa.me/${inq.customer_phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs bg-[#25D366] text-white px-3 py-1.5 rounded-full font-semibold hover:bg-[#1eb85a]">
                  <MessageCircle className="w-3 h-3" /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Reviews Tab ───────────────────────────────────────────────────────────────
function ReviewsTab({ guideId, averageRating, totalReviews }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('tour_guide_reviews').select('*').eq('guide_id', guideId).order('created_at', { ascending: false })
      .then(({ data }) => { setReviews(data || []); setLoading(false); });
  }, [guideId]);

  if (loading) return <div className="flex justify-center py-16"><div className="w-7 h-7 border-4 border-[#0B3D91] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      {/* Summary */}
      {reviews.length > 0 && (
        <div className="bg-gradient-to-r from-[#0B3D91]/5 to-[#1E5BA8]/5 rounded-xl p-5 mb-6 flex items-center gap-6">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-[#0B3D91]">{Number(averageRating || 0).toFixed(1)}</p>
            <StarRating rating={averageRating || 0} />
            <p className="text-xs text-gray-500 mt-1">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-3">{star}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-6">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!reviews.length ? (
        <div className="text-center py-16">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No reviews yet</p>
          <p className="text-gray-400 text-sm mt-1">Reviews left by customers on your guide profile will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border rounded-xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-[#0B3D91]/10 flex items-center justify-center text-[#0B3D91] font-bold text-xs">
                      {r.reviewer_name[0]?.toUpperCase()}
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{r.reviewer_name}</span>
                    {r.is_verified && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>}
                  </div>
                  <StarRating rating={r.rating} />
                </div>
                <p className="text-xs text-gray-400 shrink-0">{new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              {r.review_text && <p className="text-gray-700 text-sm mt-3 leading-relaxed">"{r.review_text}"</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function TourGuideDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from('tour_guide_profiles').select('*').eq('id', user.id).maybeSingle();
    if (!data) { navigate('/tour-guides/register'); return; }
    setProfile(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) { navigate('/tour-guides/login'); return; }
      fetchProfile();
    }
  }, [user, authLoading]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/tour-guides/login');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0B3D91] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'inquiries', label: 'Inquiries', icon: MessageCircle },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
          <Link to="/"><img src="/logo.svg" alt="ORBITO" className="h-8 w-auto" /></Link>
          <div className="flex items-center gap-3">
            <Link to="/tour-guides" className="text-sm text-gray-500 hover:text-[#0B3D91]">View Public Listing</Link>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="text-sm">Sign Out</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">Guide Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {profile.full_name}</p>
        </div>

        <StatusBanner status={profile.status} rejectionReason={profile.rejection_reason} />

        {/* Tabs */}
        <div className="flex border-b mt-6 mb-6">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === id ? 'border-[#0B3D91] text-[#0B3D91]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && <ProfileTab profile={profile} onUpdated={fetchProfile} />}
        {activeTab === 'inquiries' && <InquiriesTab guideId={profile.id} />}
        {activeTab === 'reviews' && <ReviewsTab guideId={profile.id} averageRating={profile.average_rating} totalReviews={profile.total_reviews} />}
      </div>
    </div>
  );
}
