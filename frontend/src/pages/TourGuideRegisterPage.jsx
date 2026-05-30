import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Upload, X, CheckCircle, MapPin, Phone, DollarSign, User, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const SPECIALTIES = [
  'City Walks', 'Food & Drink', 'History & Culture', 'Adventure & Trekking',
  'Religious & Spiritual', 'Photography', 'Wildlife & Nature',
  'Art & Architecture', 'Nightlife', 'Day Trips',
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function TourGuideRegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    full_name: '', email: '', phone_number: '', password: '', confirm_password: '',
    location: '', charges_per_hour: '', description: '', languages: '',
  });
  const [specialties, setSpecialties] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const toggleSpecialty = (s) => setSpecialties((prev) =>
    prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
  );

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast({ variant: 'destructive', title: 'Image must be under 5 MB' }); return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    if (!form.phone_number.trim()) errs.phone_number = 'Required (include country code, e.g. +44...)';
    if (!form.location.trim()) errs.location = 'Required';
    if (!form.password) errs.password = 'Required';
    if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirm_password) errs.confirm_password = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // 1. Create auth user
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
      });
      if (authErr) throw authErr;
      const userId = authData.user?.id;
      if (!userId) throw new Error('Could not create account');

      // 2. Upload photo if provided
      let photoUrl = null;
      if (photoFile) {
        const ext = photoFile.name.split('.').pop();
        const path = `${userId}/profile.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('tour-guide-photos').upload(path, photoFile, { upsert: true });
        if (!uploadErr) {
          const { data: { publicUrl } } = supabase.storage.from('tour-guide-photos').getPublicUrl(path);
          photoUrl = publicUrl;
        }
      }

      // 3. Insert profile
      const langs = form.languages.split(',').map((l) => l.trim()).filter(Boolean);
      const { error: profileErr } = await supabase.from('tour_guide_profiles').insert({
        id: userId,
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone_number: form.phone_number.trim(),
        location: form.location.trim(),
        charges_per_hour: form.charges_per_hour ? parseFloat(form.charges_per_hour) : null,
        description: form.description.trim() || null,
        languages: langs,
        specialties,
        photo_url: photoUrl,
      });
      if (profileErr) throw profileErr;

      // 4. Notify admin (fire and forget)
      fetch(`${API_URL}/tour-guides/notify-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guide: {
            full_name: form.full_name,
            email: form.email,
            phone_number: form.phone_number,
            location: form.location,
            charges_per_hour: form.charges_per_hour,
            languages: langs,
            specialties,
            description: form.description,
          },
        }),
      }).catch(() => {});

      setDone(true);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Registration failed', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Registration Submitted!</h2>
          <p className="text-gray-600 mb-6">Your tour guide profile is <strong>pending approval</strong>. We'll review it within 24–48 hours and send you an email once it's approved.</p>
          <Link to="/tour-guides">
            <Button className="bg-[#0B3D91] hover:bg-[#092C6B] text-white font-bold px-8">View Tour Guides</Button>
          </Link>
        </div>
      </div>
    );
  }

  const field = (key, label, icon, type = 'text', placeholder = '') => (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
        <Input
          type={type}
          className={`${icon ? 'pl-9' : ''} ${errors[key] ? 'border-red-400' : ''}`}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => { set(key, e.target.value); setErrors((p) => ({ ...p, [key]: '' })); }}
        />
      </div>
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6"><img src="/logo.svg" alt="ORBITO" className="h-10 w-auto mx-auto" /></Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Register as a Tour Guide</h1>
          <p className="text-gray-500">Connect with travellers worldwide. Already have an account? <Link to="/tour-guides/login" className="text-[#0B3D91] font-semibold hover:underline">Sign in</Link></p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">
          {/* Photo */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 cursor-pointer hover:border-[#0B3D91] transition-colors"
              onClick={() => fileInputRef.current?.click()}>
              {photoPreview
                ? <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                : <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-[10px]">Upload</span>
                  </div>
              }
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            <p className="text-xs text-gray-400">Profile photo (max 5 MB). Click to upload.</p>
          </div>

          <div className="border-t pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('full_name', 'Full Name *', <User className="w-4 h-4" />, 'text', 'Jane Smith')}
            {field('email', 'Email *', <Mail className="w-4 h-4" />, 'email', 'you@example.com')}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input type={showPass ? 'text' : 'password'} className={`pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="Min 6 characters" value={form.password}
                  onChange={(e) => { set('password', e.target.value); setErrors((p) => ({ ...p, password: '' })); }} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input type={showConfirm ? 'text' : 'password'} className={`pl-9 pr-10 ${errors.confirm_password ? 'border-red-400' : ''}`}
                  placeholder="Repeat password" value={form.confirm_password}
                  onChange={(e) => { set('confirm_password', e.target.value); setErrors((p) => ({ ...p, confirm_password: '' })); }} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">WhatsApp Phone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input className={`pl-9 ${errors.phone_number ? 'border-red-400' : ''}`}
                  placeholder="+44 7566 215425" value={form.phone_number}
                  onChange={(e) => { set('phone_number', e.target.value); setErrors((p) => ({ ...p, phone_number: '' })); }} />
              </div>
              {errors.phone_number
                ? <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
                : <p className="text-gray-400 text-xs mt-1">Include country code. Used for WhatsApp contact.</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Operating Location *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input className={`pl-9 ${errors.location ? 'border-red-400' : ''}`}
                  placeholder="e.g. London, UK" value={form.location}
                  onChange={(e) => { set('location', e.target.value); setErrors((p) => ({ ...p, location: '' })); }} />
              </div>
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Charge per Hour ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input type="number" min="0" step="0.01" className="pl-9" placeholder="25"
                  value={form.charges_per_hour} onChange={(e) => set('charges_per_hour', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Languages Spoken</label>
              <Input placeholder="English, Hindi, French…" value={form.languages} onChange={(e) => set('languages', e.target.value)} />
              <p className="text-gray-400 text-xs mt-1">Comma-separated</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">About You</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
              rows={4} placeholder="Tell travellers about yourself, your experience, what makes your tours special…"
              value={form.description} onChange={(e) => set('description', e.target.value)} />
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

          <Button type="submit" disabled={loading} className="w-full bg-[#0B3D91] hover:bg-[#092C6B] text-white font-bold py-3 text-base">
            {loading ? 'Creating your profile…' : 'Register as Tour Guide'}
          </Button>

          <p className="text-center text-xs text-gray-400">
            By registering you agree to Orbito's <Link to="/terms" className="underline">Terms of Service</Link>.
            Your profile will be reviewed before going live.
          </p>
        </form>
      </div>
    </div>
  );
}
