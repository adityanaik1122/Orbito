import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import {
  BarChart3,
  Calendar,
  CheckCircle,
  CreditCard,
  Eye,
  FileText,
  Loader2,
  MapPin,
  PoundSterling,
  RefreshCw,
  Settings,
  ShoppingBag,
  Users,
  XCircle,
  AlertCircle,
  Clock,
  Newspaper,
  Link2,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { apiService } from '@/services/api';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const STATUS_CONFIG = {
  live: { label: 'Live', class: 'bg-green-100 text-green-800' },
  pending_review: { label: 'Pending Review', class: 'bg-yellow-100 text-yellow-800' },
  draft: { label: 'Draft', class: 'bg-gray-100 text-gray-700' },
  rejected: { label: 'Rejected', class: 'bg-red-100 text-red-800' },
};

const sections = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'tours', label: 'Tours', icon: ShoppingBag },
  { id: 'affiliate', label: 'Affiliate Tours', icon: Link2 },
  { id: 'operators', label: 'Tour Operators', icon: FileText },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'bookings', label: 'Bookings', icon: CreditCard },
  { id: 'blog', label: 'Blog', icon: Newspaper },
  { id: 'tour-guides', label: 'Tour Guides', icon: Users },
];

const defaultBadgeOverrides = {
  featured: false,
  best_seller: false,
  top_rated: false,
  free_cancellation: false,
  instant_confirmation: false,
  great_value: false,
};

const parseBadgeOverrides = (tour) => {
  const raw = tour.badge_overrides || tour.badges || null;
  if (!raw) return { ...defaultBadgeOverrides, featured: !!tour.featured, instant_confirmation: !!tour.instant_confirmation };
  if (typeof raw === 'string') {
    try {
      return { ...defaultBadgeOverrides, ...JSON.parse(raw) };
    } catch {
      return { ...defaultBadgeOverrides, featured: !!tour.featured, instant_confirmation: !!tour.instant_confirmation };
    }
  }
  return { ...defaultBadgeOverrides, ...raw, featured: !!tour.featured, instant_confirmation: !!tour.instant_confirmation };
};

// ── Blog section (self-contained) ────────────────────────────────────────────
const BLOG_SOURCES = [
  'Nomadic Matt', 'The Points Guy', 'Atlas Obscura', 'Adventurous Kate',
  'Travel + Leisure', 'Condé Nast Traveler', 'The Blonde Abroad', 'TravelAwaits',
];

const BlogSection = () => {
  const { toast } = useToast();
  const [fetching, setFetching] = useState(false);
  const [stats, setStats] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const loadStats = async () => {
    const { count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    setStats({ total: count ?? 0 });
  };

  useEffect(() => {
    loadStats().catch(() => {});
  }, []);

  const handleFetch = async () => {
    setFetching(true);
    try {
      const result = await apiService.adminFetchBlog();
      setLastResult(result);
      toast({
        title: 'Blog updated',
        description: `${result.inserted} new articles added, ${result.skipped} already existed.`,
      });
      await loadStats();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Fetch failed', description: err.message });
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats + trigger */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Blog Management</CardTitle>
          <Button onClick={handleFetch} disabled={fetching} className="bg-[#0B3D91] hover:bg-[#092C6B]">
            {fetching
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Fetching…</>
              : <><RefreshCw className="w-4 h-4 mr-2" /> Fetch Latest Articles</>}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-[#0B3D91]">{stats?.total ?? '—'}</p>
              <p className="text-sm text-gray-500 mt-1">Articles in database</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-[#0B3D91]">{BLOG_SOURCES.length}</p>
              <p className="text-sm text-gray-500 mt-1">Active sources</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">{lastResult ? `+${lastResult.inserted}` : '—'}</p>
              <p className="text-sm text-gray-500 mt-1">Added this run</p>
            </div>
          </div>

          {lastResult && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-800 mb-4">
              Last run: <strong>{lastResult.inserted}</strong> new articles added · <strong>{lastResult.skipped}</strong> duplicates skipped · {lastResult.total_fetched} total fetched
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Connected travel blog sources</p>
            <div className="flex flex-wrap gap-2">
              {BLOG_SOURCES.map((src) => (
                <span key={src} className="bg-blue-50 text-[#0B3D91] text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
                  {src}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>How the scheduler works</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <p>The <strong>Fetch Latest Articles</strong> button above pulls fresh posts from all 8 travel blogs right now. For fully automatic daily updates, set up one of these free schedulers:</p>
          <div className="space-y-2">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-semibold text-gray-800 mb-1">Option 1 — cron-job.org (easiest, free)</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>Go to <span className="font-mono text-xs bg-white px-1 py-0.5 rounded border">cron-job.org</span> → create free account</li>
                <li>New cronjob → URL: <span className="font-mono text-xs bg-white px-1 py-0.5 rounded border">POST https://your-backend.com/api/jobs/fetch-blog</span></li>
                <li>Add header: <span className="font-mono text-xs bg-white px-1 py-0.5 rounded border">x-cron-secret: YOUR_CRON_SECRET</span></li>
                <li>Schedule: daily at 7:00 AM</li>
              </ol>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-semibold text-gray-800 mb-1">Option 2 — GitHub Actions (free, in your repo)</p>
              <p className="text-gray-600 text-xs font-mono bg-white p-2 rounded border whitespace-pre">{`on:
  schedule:
    - cron: '0 7 * * *'
jobs:
  fetch-blog:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -X POST https://your-backend.com/api/jobs/fetch-blog \\
            -H "x-cron-secret: \${{ secrets.CRON_SECRET }}"`}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">Set <span className="font-mono">CRON_SECRET</span> in your backend environment variables to protect the endpoint.</p>
        </CardContent>
      </Card>
    </div>
  );
};

// ── Affiliate Tours section ───────────────────────────────────────────────────
const FALLBACK_TOUR_IMG = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80';

const EMPTY_FORM = {
  title: '', description: '', destination_city: '', country: '',
  image_url: '', viator_url: '', duration: '', category: '',
};

// ── Tour Guides Admin Section ─────────────────────────────────────────────────
const API_URL_TG = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const GUIDE_STATUS_CONFIG = {
  pending:  { label: 'Pending',  class: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Approved', class: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', class: 'bg-red-100 text-red-800' },
};

const TourGuidesAdminSection = () => {
  const { toast } = useToast();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectDialog, setRejectDialog] = useState(null);
  const [acting, setActing] = useState(false);

  const fetchGuides = async () => {
    const { data } = await supabase.from('tour_guide_profiles').select('*').order('created_at', { ascending: false });
    setGuides(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchGuides(); }, []);

  const pendingCount = guides.filter((g) => g.status === 'pending').length;

  const filtered = filter === 'all' ? guides : guides.filter((g) => g.status === filter);

  const updateStatus = async (guide, status, rejectionReason = null) => {
    setActing(true);
    try {
      const update = { status };
      if (rejectionReason) update.rejection_reason = rejectionReason;
      const { error } = await supabase.from('tour_guide_profiles').update(update).eq('id', guide.id);
      if (error) throw error;

      // Email the guide
      fetch(`${API_URL_TG}/tour-guides/notify-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: guide.email, name: guide.full_name, status, rejectionReason }),
      }).catch(() => {});

      toast({ title: `Guide ${status}`, description: `${guide.full_name} has been ${status}.` });
      setRejectDialog(null);
      setRejectReason('');
      setSelected(null);
      fetchGuides();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Update failed', description: err.message });
    } finally {
      setActing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tour Guides</h2>
          {pendingCount > 0 && <p className="text-sm text-yellow-700 mt-0.5">{pendingCount} pending approval</p>}
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border transition-colors ${filter === f ? 'bg-[#0B3D91] text-white border-[#0B3D91]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0B3D91]'}`}>
              {f}{f === 'pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-7 h-7 border-4 border-[#0B3D91] border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No {filter !== 'all' ? filter : ''} guides found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((g) => (
            <div key={g.id} className="bg-white border rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-4">
                <img
                  src={g.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(g.full_name)}&background=0B3D91&color=fff&size=80`}
                  alt={g.full_name} className="w-14 h-14 rounded-full object-cover shrink-0"
                  onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(g.full_name)}&background=0B3D91&color=fff`; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-bold text-gray-900">{g.full_name}</p>
                      <p className="text-sm text-gray-500">{g.email} · {g.phone_number}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />{g.location}
                        {g.charges_per_hour && <span className="ml-2">${g.charges_per_hour}/hr</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${GUIDE_STATUS_CONFIG[g.status]?.class || 'bg-gray-100 text-gray-700'}`}>
                        {GUIDE_STATUS_CONFIG[g.status]?.label || g.status}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(g.created_at).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                  {g.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{g.description}</p>}
                  {(g.languages?.length > 0 || g.specialties?.length > 0) && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(g.languages || []).slice(0, 3).map((l) => <span key={l} className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{l}</span>)}
                      {(g.specialties || []).slice(0, 3).map((s) => <span key={s} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>)}
                    </div>
                  )}
                  {g.rejection_reason && <p className="text-xs text-red-600 mt-1 bg-red-50 px-2 py-1 rounded"><strong>Rejection reason:</strong> {g.rejection_reason}</p>}
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t flex-wrap">
                {g.status !== 'approved' && (
                  <Button size="sm" onClick={() => updateStatus(g, 'approved')} disabled={acting}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </Button>
                )}
                {g.status !== 'rejected' && (
                  <Button size="sm" variant="outline" onClick={() => setRejectDialog(g)} disabled={acting}
                    className="text-red-600 border-red-200 hover:bg-red-50 text-xs gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </Button>
                )}
                {g.status !== 'pending' && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(g, 'pending')} disabled={acting}
                    className="text-yellow-700 border-yellow-200 hover:bg-yellow-50 text-xs">
                    Set Pending
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject reason dialog */}
      <Dialog open={!!rejectDialog} onOpenChange={(open) => { if (!open) { setRejectDialog(null); setRejectReason(''); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Reject Guide — {rejectDialog?.full_name}</DialogTitle></DialogHeader>
          <div className="py-3">
            <p className="text-sm text-gray-600 mb-3">Optionally explain why (this will be emailed to the guide):</p>
            <textarea className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30"
              rows={4} placeholder="Reason for rejection…"
              value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setRejectDialog(null); setRejectReason(''); }}>Cancel</Button>
            <Button onClick={() => updateStatus(rejectDialog, 'rejected', rejectReason || null)} disabled={acting}
              className="bg-red-600 hover:bg-red-700 text-white">
              {acting ? 'Rejecting…' : 'Reject Guide'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AffiliateSection = () => {
  const { toast } = useToast();
  const [affiliateTours, setAffiliateTours] = useState([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchAffiliate = async () => {
    const { data } = await supabase
      .from('affiliate_tours')
      .select('*')
      .order('created_at', { ascending: false });
    setAffiliateTours(data || []);
    setLoadingTours(false);
  };

  useEffect(() => { fetchAffiliate(); }, []);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleAutoFill = async () => {
    if (!form.viator_url) {
      toast({ variant: 'destructive', title: 'Paste a Viator URL first' });
      return;
    }
    setAutoFilling(true);
    try {
      const res = await apiService.get(`/admin/fetch-tour-meta?url=${encodeURIComponent(form.viator_url)}`);
      if (res.error) throw new Error(res.error);
      setForm((f) => ({
        ...f,
        title: res.title || f.title,
        description: res.description || f.description,
        image_url: res.image_url || f.image_url,
        destination_city: res.city || f.destination_city,
        country: res.country || f.country,
      }));
      toast({ title: 'Auto-filled!', description: 'Check the fields and add the price before saving.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Auto-fill failed', description: err.message });
    } finally {
      setAutoFilling(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.viator_url || !form.destination_city || !form.country) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Title, Viator URL, City and Country are required.' });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('affiliate_tours').insert(form);
    setSaving(false);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Tour added!', description: `${form.title} is now live on the tours page.` });
      setForm(EMPTY_FORM);
      fetchAffiliate();
    }
  };

  const handleDelete = async (id) => {
    await supabase.from('affiliate_tours').delete().eq('id', id);
    fetchAffiliate();
    toast({ title: 'Deleted' });
  };

  const handleToggle = async (id, current) => {
    await supabase.from('affiliate_tours').update({ is_active: !current }).eq('id', id);
    fetchAffiliate();
  };

  const activeCount = affiliateTours.filter((t) => t.is_active).length;
  const countries = [...new Set(affiliateTours.map((t) => t.country).filter(Boolean))].sort();

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Tours', value: affiliateTours.length },
          { label: 'Active / Visible', value: activeCount },
          { label: 'Countries', value: countries.length },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-5 text-center">
              <p className="text-3xl font-bold text-[#0B3D91]">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add form */}
      <Card>
        <CardHeader><CardTitle>Add Affiliate Tour</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Title *</label>
              <Input placeholder="Skip-the-line Colosseum Tour" value={form.title} onChange={(e) => set('title', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Viator URL *</label>
              <div className="flex gap-2">
                <Input placeholder="https://www.viator.com/tours/London/..." value={form.viator_url} onChange={(e) => set('viator_url', e.target.value)} />
                <Button type="button" variant="outline" onClick={handleAutoFill} disabled={autoFilling} className="shrink-0">
                  {autoFilling ? <Loader2 className="w-4 h-4 animate-spin" /> : '✨ Auto-fill'}
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">City *</label>
              <Input placeholder="Rome" value={form.destination_city} onChange={(e) => set('destination_city', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Country *</label>
              <Input placeholder="Italy" value={form.country} onChange={(e) => set('country', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Image URL</label>
              <Input placeholder="https://images.unsplash.com/..." value={form.image_url} onChange={(e) => set('image_url', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Duration</label>
              <Input placeholder="3 hours" value={form.duration} onChange={(e) => set('duration', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Category</label>
              <Input placeholder="City Tours, Food & Drink, Adventure..." value={form.category} onChange={(e) => set('category', e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Description</label>
            <Input placeholder="Short description shown on the card" value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-[#0B3D91] hover:bg-[#092C6B]">
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : 'Add Tour'}
          </Button>
        </CardContent>
      </Card>

      {/* Existing tours */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Affiliate Tours ({affiliateTours.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTours ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#0B3D91]" /></div>
          ) : affiliateTours.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">No affiliate tours yet. Add your first one above.</p>
          ) : (
            <div className="space-y-3">
              {affiliateTours.map((t) => (
                <div key={t.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                  <img
                    src={t.image_url || FALLBACK_TOUR_IMG}
                    alt={t.title}
                    className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = FALLBACK_TOUR_IMG; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{t.title}</p>
                    <p className="text-xs text-gray-500">
                      {t.destination_city}, {t.country}
                      {t.category && ` · ${t.category}`}
                      {t.duration && ` · ${t.duration}`}
                      {t.price_from && ` · From ${t.currency} ${t.price_from}`}
                    </p>
                    <a href={t.viator_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0B3D91] hover:underline flex items-center gap-1 mt-0.5">
                      <ExternalLink className="w-3 h-3" /> View on Viator
                    </a>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {t.is_active ? 'Active' : 'Hidden'}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleToggle(t.id, t.is_active)} className="text-xs h-7">
                      {t.is_active ? 'Hide' : 'Show'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 h-7 w-7 p-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const AdminDashboardPage = () => {
  const { profile } = useAuth();
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [tours, setTours] = useState([]);
  const [providers, setProviders] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [pendingAdminTours, setPendingAdminTours] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [operatorDetail, setOperatorDetail] = useState({ tours: [], bookings: [], loading: false });

  const [tourSearch, setTourSearch] = useState('');
  const [filters, setFilters] = useState({
    country: 'all',
    startDate: '',
    endDate: '',
  });
  const [badgeEdits, setBadgeEdits] = useState({});
  const [editingTourId, setEditingTourId] = useState(null);
  const [tourForm, setTourForm] = useState({
    title: '',
    city: '',
    country: '',
    description: '',
    category: '',
    price_amount: '',
    price_currency: 'USD',
    duration_minutes: '',
    source: '',
    main_image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSavingTour, setIsSavingTour] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tours' }, () => fetchDashboardData(true))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchDashboardData(true))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchDashboardData(true))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => fetchDashboardData(true))
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    if (silent) setRefreshing(true);

    try {
      const toursRes = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      const suppliersRes = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      const bookingsRes = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      const paymentsRes = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      // Try RPC (SECURITY DEFINER — bypasses RLS so admin can see all users)
      let clientsData = [];
      const rpcRes = await supabase.rpc('get_admin_clients');
      if (rpcRes.error) {
        console.warn('get_admin_clients RPC error — run setup-operator-marketplace.sql in Supabase:', rpcRes.error.message);
      }
      if (rpcRes.data && rpcRes.data.length > 0) {
        clientsData = rpcRes.data;
      } else {
        // Fallback: direct profiles query (may only show own row if RLS is strict)
        const fallback = await supabase
          .from('profiles')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(500);
        clientsData = fallback.data || [];
      }

      const toursData = toursRes.data || [];
      const providerData = suppliersRes.data || [];

      setTours(toursData);
      setProviders(providerData);
      setProfiles(clientsData);
      setBookings(bookingsRes.data || []);
      setPayments(paymentsRes.data || []);

      // Load operator marketplace data (non-blocking)
      try {
        const [appsRes, pendingToursRes] = await Promise.allSettled([
          supabase.from('operator_applications').select('*').order('created_at', { ascending: false }),
          supabase.from('tours').select('*').eq('listing_status', 'pending_review').order('created_at', { ascending: false }),
        ]);
        if (appsRes.status === 'fulfilled') setApplications(appsRes.value.data || []);
        if (pendingToursRes.status === 'fulfilled') setPendingAdminTours(pendingToursRes.value.data || []);
      } catch { /* non-critical */ }

      const nextEdits = {};
      toursData.forEach((tour) => {
        nextEdits[tour.id] = parseBadgeOverrides(tour);
      });
      setBadgeEdits(nextEdits);
    } catch (error) {
      console.error('Dashboard fetch failed:', error);
      toast({
        variant: 'destructive',
        title: 'Dashboard error',
        description: 'Could not load admin data. Please refresh.'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const dateInRange = (value) => {
    if (!value) return true;
    const created = new Date(value);
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      if (created < start) return false;
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      if (created > end) return false;
    }
    return true;
  };

  const filteredClients = useMemo(() => {
    return profiles.filter((client) => {
      if (!dateInRange(client.created_at)) return false;
      if (filters.country !== 'all' && client.country !== filters.country) return false;
      return true;
    });
  }, [profiles, filters]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (!dateInRange(booking.created_at)) return false;
      if (filters.country !== 'all' && booking.country !== filters.country) return false;
      return true;
    });
  }, [bookings, filters]);

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      if (tourSearch && !(tour.title || '').toLowerCase().includes(tourSearch.toLowerCase())) return false;
      if (filters.country !== 'all' && tour.country !== filters.country) return false;
      return true;
    });
  }, [tours, tourSearch, filters]);

  const countries = useMemo(() => {
    const values = new Set(['all']);
    profiles.forEach((client) => client.country && values.add(client.country));
    tours.forEach((tour) => tour.country && values.add(tour.country));
    return Array.from(values);
  }, [profiles, tours]);

  const totalRevenue = useMemo(() => {
    const paymentTotal = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    if (paymentTotal > 0) return paymentTotal;
    return bookings.reduce((sum, booking) => sum + Number(booking.total_amount || booking.total_price_amount || 0), 0);
  }, [payments, bookings]);

  const totalSoldTours = useMemo(() => {
    return bookings.filter((booking) => ['confirmed', 'paid', 'completed'].includes((booking.status || booking.booking_status || '').toLowerCase())).length;
  }, [bookings]);

  const operatorStats = useMemo(() => {
    return providers.map((provider) => {
      const providerId = provider.id;
      const providerTours = tours.filter((tour) => tour.provider_id === providerId || tour.supplier_id === providerId);
      const providerBookings = bookings.filter((booking) => booking.provider_id === providerId || booking.supplier_id === providerId);
      return {
        ...provider,
        toursCount: providerTours.length,
        bookingsCount: providerBookings.length,
      };
    });
  }, [providers, tours, bookings]);

  const summaryCards = [
    { label: 'Total Clients', value: profiles.length, icon: Users },
    { label: 'Total Tours', value: tours.length, icon: ShoppingBag },
    { label: 'Total Bookings', value: bookings.length, icon: Calendar },
    { label: 'Total Sold Tours', value: totalSoldTours, icon: CheckCircle },
    { label: 'Total Revenue', value: `£${totalRevenue.toFixed(2)}`, icon: CreditCard },
  ];

  const monthlyChartData = useMemo(() => {
    const map = new Map();
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      map.set(key, { month: label, revenue: 0, bookings: 0 });
    }
    bookings.forEach((b) => {
      if (!b.created_at) return;
      const d = new Date(b.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (map.has(key)) {
        const entry = map.get(key);
        entry.bookings += 1;
        entry.revenue += Number(b.total_amount || b.total_price_amount || 0);
      }
    });
    return Array.from(map.values());
  }, [bookings]);

  const handleBadgeToggle = (tourId, field) => {
    setBadgeEdits((prev) => ({
      ...prev,
      [tourId]: {
        ...prev[tourId],
        [field]: !prev[tourId]?.[field],
      },
    }));
  };

  const handleSaveBadges = async (tour) => {
    const overrides = badgeEdits[tour.id] || parseBadgeOverrides(tour);
    try {
      const { error } = await supabase
        .from('tours')
        .update({
          featured: overrides.featured,
          instant_confirmation: overrides.instant_confirmation,
          badge_overrides: overrides,
        })
        .eq('id', tour.id);

      if (error) throw error;

      toast({
        title: 'Badges updated',
        description: `${tour.title} badges saved successfully.`
      });
    } catch (error) {
      console.error('Badge update error:', error);
      toast({
        variant: 'destructive',
        title: 'Badge update failed',
        description: error.message || 'Please ensure badge_overrides column exists.'
      });
    }
  };
  const TOUR_BUCKET = 'tour-images';

  const resetTourForm = () => {
    setEditingTourId(null);
    setTourForm({
      title: '',
      city: '',
      country: '',
      description: '',
      category: '',
      price_amount: '',
      price_currency: 'USD',
      duration_minutes: '',
      source: '',
      main_image: ''
    });
    setImageFile(null);
    setImagePreview('');
  };

  const handleEditTour = (tour) => {
    setEditingTourId(tour.id);
    setTourForm({
      title: tour.title || '',
      city: tour.city || tour.destination_city || '',
      country: tour.country || tour.destination_country || '',
      description: tour.description || '',
      category: tour.category || '',
      price_amount: tour.price_amount ?? tour.price_adult ?? '',
      price_currency: tour.price_currency || tour.currency || 'USD',
      duration_minutes: tour.duration_minutes || tour.duration_minutes === 0 ? tour.duration_minutes : '',
      source: tour.source || tour.provider || '',
      main_image: tour.main_image || tour.image || ''
    });
    setImageFile(null);
    setImagePreview(tour.main_image || tour.image || '');
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const uploadTourImage = async () => {
    if (!imageFile) return tourForm.main_image || '';
    setIsUploadingImage(true);
    try {
      const fileExt = imageFile.name.split('.').pop() || 'jpg';
      const fileName = `tour-${editingTourId || Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error } = await supabase.storage.from(TOUR_BUCKET).upload(fileName, imageFile, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from(TOUR_BUCKET).getPublicUrl(fileName);
      return data?.publicUrl || '';
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteTour = async (tourId) => {
    const confirmDelete = window.confirm('Delete this tour? This action cannot be undone.');
    if (!confirmDelete) return;
    try {
      const { error } = await supabase.from('tours').delete().eq('id', tourId);
      if (error) throw error;
      setTours((prev) => prev.filter((tour) => tour.id !== tourId));
      toast({ title: 'Tour deleted' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Delete failed', description: error.message });
    }
  };

  const handleTourSubmit = async (event) => {
    event.preventDefault();
    if (!tourForm.title || !tourForm.city || !tourForm.country) {
      toast({ variant: 'destructive', title: 'Missing required fields', description: 'Title, city, and country are required.' });
      return;
    }
    setIsSavingTour(true);
    try {
      const imageUrl = await uploadTourImage();
      const payload = {
        title: tourForm.title,
        city: tourForm.city,
        country: tourForm.country,
        destination_city: tourForm.city,
        destination_country: tourForm.country,
        description: tourForm.description || null,
        category: tourForm.category || null,
        price_amount: tourForm.price_amount ? Number(tourForm.price_amount) : null,
        price_currency: tourForm.price_currency || 'USD',
        duration_minutes: tourForm.duration_minutes ? Number(tourForm.duration_minutes) : null,
        source: tourForm.source || null,
        main_image: imageUrl || tourForm.main_image || null,
      };

      if (editingTourId) {
        const { error } = await supabase.from('tours').update(payload).eq('id', editingTourId);
        if (error) throw error;
        toast({ title: 'Tour updated' });
      } else {
        const { error } = await supabase.from('tours').insert(payload);
        if (error) throw error;
        toast({ title: 'Tour created' });
      }
      resetTourForm();
      fetchDashboardData(true);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Save failed', description: error.message || 'Check storage bucket and permissions.' });
    } finally {
      setIsSavingTour(false);
    }
  };

  const handleApproveApplication = async (id) => {
    setActionLoading(id);
    try {
      const { error } = await supabase.rpc('approve_operator_application', { app_id: id });
      if (error) throw error;
      toast({ title: 'Approved', description: 'Operator account activated' });
      setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: 'approved' } : a));
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectApplication = async (id) => {
    const reason = window.prompt('Rejection reason (optional):');
    if (reason === null) return;
    setActionLoading(id);
    try {
      const { error } = await supabase.rpc('reject_operator_application', { app_id: id, reject_reason: reason || null });
      if (error) throw error;
      toast({ title: 'Rejected', description: 'Application rejected' });
      setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: 'rejected' } : a));
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveTour = async (id) => {
    setActionLoading(id);
    try {
      const { error } = await supabase.rpc('approve_operator_tour', { tour_id: id });
      if (error) throw error;
      toast({ title: 'Tour approved', description: 'Now live on the marketplace' });
      setPendingAdminTours((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectTour = async (id) => {
    setActionLoading(id);
    try {
      const { error } = await supabase.rpc('reject_operator_tour', { tour_id: id });
      if (error) throw error;
      toast({ title: 'Tour rejected' });
      setPendingAdminTours((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const loadOperatorDetail = async (app) => {
    setSelectedOperator(app);
    setOperatorDetail({ tours: [], bookings: [], loading: true });
    try {
      const { data: opTours } = await supabase
        .from('tours')
        .select('*')
        .eq('operator_id', app.user_id)
        .order('created_at', { ascending: false });

      const tourIds = (opTours || []).map((t) => t.id);
      let opBookings = [];
      if (tourIds.length > 0) {
        const { data: bkgs } = await supabase
          .from('bookings')
          .select('*')
          .in('tour_id', tourIds)
          .order('created_at', { ascending: false });
        opBookings = bkgs || [];
      }

      const totalRevenue = opBookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
      setOperatorDetail({
        tours: opTours || [],
        bookings: opBookings,
        totalRevenue,
        operatorEarnings: totalRevenue * 0.85,
        loading: false,
      });
    } catch {
      setOperatorDetail({ tours: [], bookings: [], loading: false });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0B3D91]" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Orbito</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="w-full lg:w-64 bg-white border border-gray-200 rounded-2xl p-4 h-fit sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#0B3D91] text-white flex items-center justify-center font-bold">
                  O
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Admin Panel</p>
                  <p className="text-xs text-gray-500">{profile?.email || 'admin'}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        isActive ? 'bg-[#0B3D91] text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 p-3 rounded-xl bg-slate-50 text-xs text-gray-500 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Realtime sync enabled
              </div>
            </aside>

            <main className="flex-1 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#0B3D91]">{sections.find((s) => s.id === activeSection)?.label}</h1>
                  <p className="text-sm text-gray-500">Manage tours, operators, and clients in real time.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => fetchDashboardData(true)}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
                  </Button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-wrap gap-4 items-end">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Country</label>
                  <Select value={filters.country} onValueChange={(value) => setFilters((prev) => ({ ...prev, country: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country === 'all' ? 'All countries' : country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Start date</label>
                  <Input type="date" value={filters.startDate} onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))} />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">End date</label>
                  <Input type="date" value={filters.endDate} onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))} />
                </div>
                <Button variant="outline" onClick={() => setFilters({ country: 'all', startDate: '', endDate: '' })}>
                  Clear filters
                </Button>
              </div>

              {activeSection === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                    {summaryCards.map((card) => {
                      const Icon = card.icon;
                      return (
                        <Card key={card.label}>
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm text-gray-600">{card.label}</CardTitle>
                            <Icon className="w-4 h-4 text-gray-400" />
                          </CardHeader>
                                              <CardContent>
                      
                            <div className="text-2xl font-bold text-[#0B3D91]">{card.value}</div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Revenue (last 12 months)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                          <AreaChart data={monthlyChartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0B3D91" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#0B3D91" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `£${v}`} width={55} />
                            <Tooltip formatter={(v) => [`£${v.toFixed(2)}`, 'Revenue']} />
                            <Area type="monotone" dataKey="revenue" stroke="#0B3D91" strokeWidth={2} fill="url(#revGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Bookings (last 12 months)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart data={monthlyChartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} width={35} />
                            <Tooltip formatter={(v) => [v, 'Bookings']} />
                            <Bar dataKey="bookings" fill="#0B3D91" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Bookings</CardTitle>
                    </CardHeader>
                                        <CardContent>
                      
                      <div className="space-y-3">
                        {filteredBookings.slice(0, 6).map((booking) => (
                          <div key={booking.id} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-none">
                            <div>
                              <p className="font-semibold text-gray-900">{booking.tour_title || 'Tour booking'}</p>
                              <p className="text-xs text-gray-500">{format(new Date(booking.created_at), 'PPp')}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">£{Number(booking.total_amount || booking.total_price_amount || 0).toFixed(2)}</p>
                              <Badge className="bg-slate-100 text-slate-600">{booking.status || booking.booking_status || 'pending'}</Badge>
                            </div>
                          </div>
                        ))}
                        {filteredBookings.length === 0 && <p className="text-sm text-gray-500">No bookings found.</p>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'tours' && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <CardTitle>Tour Management</CardTitle>
                      <Input
                        placeholder="Search tours"
                        value={tourSearch}
                        onChange={(e) => setTourSearch(e.target.value)}
                        className="md:max-w-xs"
                      />
                    </CardHeader>
                      <form onSubmit={handleTourSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs text-gray-500">Title *</label>
                          <Input value={tourForm.title} onChange={(e) => setTourForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Tour title" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">City *</label>
                          <Input value={tourForm.city} onChange={(e) => setTourForm((prev) => ({ ...prev, city: e.target.value }))} placeholder="City" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Country *</label>
                          <Input value={tourForm.country} onChange={(e) => setTourForm((prev) => ({ ...prev, country: e.target.value }))} placeholder="Country" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Category</label>
                          <Input value={tourForm.category} onChange={(e) => setTourForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="e.g., Cultural" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Price Amount</label>
                          <Input type="number" value={tourForm.price_amount} onChange={(e) => setTourForm((prev) => ({ ...prev, price_amount: e.target.value }))} placeholder="120" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Currency</label>
                          <Input value={tourForm.price_currency} onChange={(e) => setTourForm((prev) => ({ ...prev, price_currency: e.target.value }))} placeholder="USD" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Duration (minutes)</label>
                          <Input type="number" value={tourForm.duration_minutes} onChange={(e) => setTourForm((prev) => ({ ...prev, duration_minutes: e.target.value }))} placeholder="180" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Source</label>
                          <Input value={tourForm.source} onChange={(e) => setTourForm((prev) => ({ ...prev, source: e.target.value }))} placeholder="premium-tours" />
                        </div>
                        <div className="md:col-span-2 xl:col-span-3">
                          <label className="text-xs text-gray-500">Description</label>
                          <textarea value={tourForm.description} onChange={(e) => setTourForm((prev) => ({ ...prev, description: e.target.value }))} className="w-full min-h-[90px] rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Short summary" />
                        </div>
                        <div className="md:col-span-2 xl:col-span-3">
                          <label className="text-xs text-gray-500">Main Image</label>
                          <div className="flex flex-wrap items-center gap-4">
                            <Input type="file" accept="image/*" onChange={handleImageSelect} />
                            {imagePreview && (
                              <img src={imagePreview} alt="Preview" className="h-16 w-24 rounded-md object-cover border" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Uploads to Supabase bucket: tour-images</p>
                        </div>
                        <div className="md:col-span-2 xl:col-span-3 flex flex-wrap gap-3">
                          <Button type="submit" disabled={isSavingTour || isUploadingImage}>
                            {isSavingTour ? 'Saving…' : editingTourId ? 'Update Tour' : 'Create Tour'}
                          </Button>
                          <Button type="button" variant="outline" onClick={resetTourForm}>Clear</Button>
                        </div>
                      </form>
                                        <CardContent>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="text-xs text-gray-500 border-b">
                            <tr>
                              <th className="text-left py-2">Tour</th>
                              <th className="text-left py-2">City</th>
                              <th className="text-left py-2">Country</th>
                              <th className="text-left py-2">Price</th>
                              <th className="text-left py-2">Badges</th>
                              <th className="text-left py-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {filteredTours.map((tour) => (
                              <tr key={tour.id}>
                                <td className="py-3">
                                  <p className="font-semibold text-gray-900">{tour.title}</p>
                                  <p className="text-xs text-gray-500">{tour.source || tour.provider || 'Direct'}</p>
                                </td>
                                <td className="py-3">{tour.city || tour.destination_city || '-'}</td>
                                <td className="py-3">{tour.country || tour.destination_country || '-'}</td>
                                <td className="py-3">£{Number(tour.price_amount || tour.price_adult || 0).toFixed(2)}</td>
                                <td className="py-3">
                                  <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(badgeEdits[tour.id] || defaultBadgeOverrides).map(([key, value]) => (
                                      <label key={key} className="flex items-center gap-2 text-xs text-gray-600">
                                        <Checkbox
                                          checked={!!value}
                                          onCheckedChange={() => handleBadgeToggle(tour.id, key)}
                                        />
                                        {key.replace('_', ' ')}
                                      </label>
                                    ))}
                                  </div>
                                </td>
                                <td className="py-3">
                                  <div className="flex flex-wrap gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleEditTour(tour)}>Edit</Button>
                                    <Button size="sm" onClick={() => handleSaveBadges(tour)}>Save Badges</Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDeleteTour(tour.id)}>Delete</Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {filteredTours.length === 0 && <p className="text-sm text-gray-500 py-6">No tours found.</p>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'operators' && (
                <div className="space-y-6">
                  {/* Pending Applications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Pending Applications
                        {applications.filter((a) => a.status === 'pending').length > 0 && (
                          <Badge className="bg-yellow-100 text-yellow-800 ml-2">
                            {applications.filter((a) => a.status === 'pending').length} pending
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {applications.filter((a) => a.status === 'pending').length === 0 ? (
                        <p className="text-sm text-gray-500 py-4">No pending applications.</p>
                      ) : (
                        <div className="space-y-3">
                          {applications.filter((a) => a.status === 'pending').map((app) => (
                            <div key={app.id} className="flex items-start justify-between p-4 border rounded-lg bg-yellow-50">
                              <div className="space-y-1">
                                <p className="font-semibold text-gray-900">{app.company_name}</p>
                                <p className="text-sm text-gray-600">{app.contact_name} · {app.contact_email}</p>
                                {app.website && <p className="text-xs text-blue-600">{app.website}</p>}
                                {app.tour_types?.length > 0 && (
                                  <div className="flex gap-1 flex-wrap mt-1">
                                    {app.tour_types.map((t) => <Badge key={t} className="text-xs bg-white border">{t}</Badge>)}
                                  </div>
                                )}
                                {app.description && <p className="text-xs text-gray-500 mt-1 max-w-md line-clamp-2">{app.description}</p>}
                              </div>
                              <div className="flex gap-2 ml-4 shrink-0">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  disabled={actionLoading === app.id}
                                  onClick={() => handleApproveApplication(app.id)}
                                >
                                  {actionLoading === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-1" />Approve</>}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-300 text-red-600 hover:bg-red-50"
                                  disabled={actionLoading === app.id}
                                  onClick={() => handleRejectApplication(app.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />Reject
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Tours Awaiting Approval */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Tours Awaiting Approval
                        {pendingAdminTours.length > 0 && (
                          <Badge className="bg-yellow-100 text-yellow-800 ml-2">{pendingAdminTours.length}</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {pendingAdminTours.length === 0 ? (
                        <p className="text-sm text-gray-500 py-4">No tours pending review.</p>
                      ) : (
                        <div className="space-y-3">
                          {pendingAdminTours.map((tour) => (
                            <div key={tour.id} className="flex items-start justify-between p-4 border rounded-lg">
                              <div className="space-y-1">
                                <p className="font-semibold text-gray-900">{tour.title}</p>
                                <p className="text-sm text-gray-600">{tour.destination} · £{tour.price_adult}</p>
                                <p className="text-xs text-gray-500">
                                  By: {tour.profiles?.full_name || tour.profiles?.email || 'Operator'}
                                  {tour.category && ` · ${tour.category}`}
                                  {tour.duration_hours && ` · ${tour.duration_hours}h`}
                                </p>
                                {tour.description && <p className="text-xs text-gray-500 max-w-md line-clamp-2">{tour.description}</p>}
                              </div>
                              <div className="flex gap-2 ml-4 shrink-0">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  disabled={actionLoading === tour.id}
                                  onClick={() => handleApproveTour(tour.id)}
                                >
                                  {actionLoading === tour.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-1" />Approve</>}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-300 text-red-600 hover:bg-red-50"
                                  disabled={actionLoading === tour.id}
                                  onClick={() => handleRejectTour(tour.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />Reject
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Active Operators table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Active Operators
                        <Badge className="bg-green-100 text-green-800 ml-2">
                          {applications.filter((a) => a.status === 'approved').length} active
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="text-xs text-gray-500 border-b">
                            <tr>
                              <th className="text-left py-2">Company</th>
                              <th className="text-left py-2">Contact</th>
                              <th className="text-left py-2">Email</th>
                              <th className="text-left py-2">Tour Types</th>
                              <th className="text-left py-2">Approved</th>
                              <th className="text-left py-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {applications.filter((a) => a.status === 'approved').map((app) => (
                              <tr key={app.id}>
                                <td className="py-3 font-semibold text-gray-900">{app.company_name}</td>
                                <td className="py-3">{app.contact_name}</td>
                                <td className="py-3 text-gray-500">{app.contact_email}</td>
                                <td className="py-3">
                                  <div className="flex gap-1 flex-wrap">
                                    {(app.tour_types || []).slice(0, 2).map((t) => (
                                      <Badge key={t} className="text-xs bg-blue-50 text-blue-700 border-blue-100">{t}</Badge>
                                    ))}
                                    {(app.tour_types || []).length > 2 && (
                                      <Badge className="text-xs bg-gray-100 text-gray-600">+{app.tour_types.length - 2}</Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 text-gray-500 text-xs">
                                  {app.reviewed_at ? format(new Date(app.reviewed_at), 'dd MMM yyyy') : '-'}
                                </td>
                                <td className="py-3">
                                  <Button size="sm" variant="outline" onClick={() => loadOperatorDetail(app)}>
                                    <Eye className="w-3.5 h-3.5 mr-1" /> View
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {applications.filter((a) => a.status === 'approved').length === 0 && (
                          <p className="text-sm text-gray-500 py-6">No approved operators yet.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'clients' && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Client Database</CardTitle>
                    <span className="text-sm text-gray-500">{filteredClients.length} clients</span>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="text-xs text-gray-500 border-b">
                          <tr>
                            <th className="text-left py-2">Name</th>
                            <th className="text-left py-2">Email</th>
                            <th className="text-left py-2">Country</th>
                            <th className="text-left py-2">Role</th>
                            <th className="text-left py-2">Joined</th>
                            <th className="text-left py-2">Last Sign In</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredClients.map((client) => (
                            <tr key={client.id} className="hover:bg-gray-50">
                              <td className="py-3 font-semibold text-gray-900">
                                {client.full_name || <span className="text-gray-400 font-normal">No name</span>}
                              </td>
                              <td className="py-3 text-gray-600">{client.email || '-'}</td>
                              <td className="py-3">{client.country || '-'}</td>
                              <td className="py-3">
                                <Badge className={
                                  client.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                  client.role === 'operator' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-600'
                                }>
                                  {client.role || 'customer'}
                                </Badge>
                              </td>
                              <td className="py-3 text-gray-500">{client.created_at ? format(new Date(client.created_at), 'PP') : '-'}</td>
                              <td className="py-3 text-gray-500">{client.last_sign_in_at ? format(new Date(client.last_sign_in_at), 'PP') : 'Never'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {filteredClients.length === 0 && <p className="text-sm text-gray-500 py-6">No clients match the filters.</p>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'bookings' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Bookings</CardTitle>
                  </CardHeader>
                                      <CardContent>
                      
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="text-xs text-gray-500 border-b">
                          <tr>
                            <th className="text-left py-2">Tour</th>
                            <th className="text-left py-2">Customer</th>
                            <th className="text-left py-2">Status</th>
                            <th className="text-left py-2">Amount</th>
                            <th className="text-left py-2">Created</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredBookings.map((booking) => (
                            <tr key={booking.id}>
                              <td className="py-3 font-semibold text-gray-900">{booking.tour_title || 'Tour booking'}</td>
                              <td className="py-3 text-gray-500">{booking.customer_email || booking.email || 'Unknown'}</td>
                              <td className="py-3">
                                <Badge className="bg-slate-100 text-slate-600">{booking.status || booking.booking_status || 'pending'}</Badge>
                              </td>
                              <td className="py-3">£{Number(booking.total_amount || booking.total_price_amount || 0).toFixed(2)}</td>
                              <td className="py-3 text-gray-500">{booking.created_at ? format(new Date(booking.created_at), 'PP') : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {filteredBookings.length === 0 && <p className="text-sm text-gray-500 py-6">No bookings match the filters.</p>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'blog' && (
                <BlogSection />
              )}
              {activeSection === 'affiliate' && (
                <AffiliateSection />
              )}
              {activeSection === 'tour-guides' && (
                <TourGuidesAdminSection />
              )}
            </main>
          </div>
        </div>
      </div>

      {/* ── Operator Detail Dialog ── */}
      <Dialog open={!!selectedOperator} onOpenChange={(open) => !open && setSelectedOperator(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedOperator?.company_name}</DialogTitle>
          </DialogHeader>

          {operatorDetail.loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#0B3D91]" />
            </div>
          ) : selectedOperator && (
            <div className="space-y-6 pt-2">

              {/* Company info grid */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Contact Person</p>
                  <p className="font-medium text-gray-900">{selectedOperator.contact_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Email</p>
                  <p className="font-medium text-gray-900">{selectedOperator.contact_email}</p>
                </div>
                {selectedOperator.contact_phone && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                    <p className="font-medium text-gray-900">{selectedOperator.contact_phone}</p>
                  </div>
                )}
                {selectedOperator.website && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Website</p>
                    <a href={selectedOperator.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">{selectedOperator.website}</a>
                  </div>
                )}
                {selectedOperator.years_in_business && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Years in Business</p>
                    <p className="font-medium text-gray-900">{selectedOperator.years_in_business}</p>
                  </div>
                )}
                {selectedOperator.operating_locations?.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 mb-0.5">Operating Locations</p>
                    <p className="font-medium text-gray-900">{selectedOperator.operating_locations.join(', ')}</p>
                  </div>
                )}
                {selectedOperator.tour_types?.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 mb-1">Tour Types</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedOperator.tour_types.map((t) => (
                        <Badge key={t} className="text-xs bg-white border">{t}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedOperator.description && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 mb-0.5">About</p>
                    <p className="text-gray-700">{selectedOperator.description}</p>
                  </div>
                )}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#0B3D91]">{operatorDetail.tours.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Tours Listed</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">{operatorDetail.bookings.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Total Bookings</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-700">£{(operatorDetail.operatorEarnings || 0).toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">Operator Earnings (85%)</p>
                </div>
              </div>

              {/* Tours */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tours ({operatorDetail.tours.length})</h3>
                {operatorDetail.tours.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center border rounded-lg">No tours submitted yet.</p>
                ) : (
                  <div className="space-y-2">
                    {operatorDetail.tours.map((tour) => {
                      const sc = STATUS_CONFIG[tour.listing_status] || STATUS_CONFIG.draft;
                      return (
                        <div key={tour.id} className="flex items-center justify-between p-3 border rounded-lg text-sm hover:bg-gray-50">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{tour.title}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                              <MapPin className="w-3 h-3" />{tour.destination || tour.city}
                              <PoundSterling className="w-3 h-3 ml-1" />{tour.price_adult}
                              {tour.duration_hours && <><Clock className="w-3 h-3 ml-1" />{tour.duration_hours}h</>}
                            </p>
                          </div>
                          <Badge className={`ml-3 shrink-0 ${sc.class}`}>{sc.label}</Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent bookings */}
              {operatorDetail.bookings.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Recent Bookings ({operatorDetail.bookings.length})
                    <span className="text-sm font-normal text-gray-500 ml-2">· Total revenue: £{(operatorDetail.totalRevenue || 0).toFixed(2)}</span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-xs text-gray-500 border-b">
                        <tr>
                          <th className="text-left py-2">Tour</th>
                          <th className="text-left py-2">Customer</th>
                          <th className="text-left py-2">Tour Date</th>
                          <th className="text-right py-2">Amount</th>
                          <th className="text-left py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {operatorDetail.bookings.slice(0, 10).map((b) => (
                          <tr key={b.id} className="hover:bg-gray-50">
                            <td className="py-2 pr-3 max-w-[160px] truncate">{b.tour_title || '—'}</td>
                            <td className="py-2 pr-3 text-gray-500">{b.customer_name || b.customer_email || '—'}</td>
                            <td className="py-2 pr-3 text-gray-500 text-xs">{b.tour_date ? format(new Date(b.tour_date), 'dd MMM yyyy') : '—'}</td>
                            <td className="py-2 pr-3 text-right font-medium">£{parseFloat(b.total_amount || 0).toFixed(2)}</td>
                            <td className="py-2">
                              <Badge className={
                                b.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                b.booking_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>{b.booking_status}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDashboardPage;
