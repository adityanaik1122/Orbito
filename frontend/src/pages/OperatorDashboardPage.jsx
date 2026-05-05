import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  Plus, Edit, Trash2, Calendar, TrendingUp,
  MapPin, Clock, RefreshCw, AlertCircle,
  Loader2, PoundSterling, Lock, Eye, EyeOff
} from 'lucide-react';
import { format } from 'date-fns';

const CATEGORIES = ['Cultural', 'Adventure', 'Food & Drink', 'Sightseeing', 'Nature', 'Water Sports', 'History', 'Wellness', 'Photography', 'Nightlife', 'Family'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const STATUS_CONFIG = {
  live: { label: 'Live', class: 'bg-green-100 text-green-800' },
  pending_review: { label: 'Pending Review', class: 'bg-yellow-100 text-yellow-800' },
  draft: { label: 'Draft', class: 'bg-gray-100 text-gray-700' },
  rejected: { label: 'Rejected', class: 'bg-red-100 text-red-800' },
};

const EMPTY_FORM = {
  title: '', description: '', destination: '', city: '', country: '',
  category: '', duration_hours: '', price_adult: '', price_child: '',
  currency: 'GBP', meeting_point: '', highlights: '', price_includes: '',
  price_excludes: '', cancellation_policy: 'Free cancellation up to 24 hours before.',
  start_times: '', max_group_size: '', main_image: '',
};

export default function OperatorDashboardPage() {
  const { user, profile, role, loading: authLoading, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Login gate state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [earningsSummary, setEarningsSummary] = useState(null);

  const [tourDialogOpen, setTourDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [tourForm, setTourForm] = useState(EMPTY_FORM);
  const [savingTour, setSavingTour] = useState(false);
  const [availableDays, setAvailableDays] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => { if (user) loadAll(); }, [user]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const { data: toursData } = await supabase
        .from('tours')
        .select('*')
        .eq('operator_id', user.id)
        .order('created_at', { ascending: false });

      const toursList = toursData || [];
      setTours(toursList);

      const tourIds = toursList.map((t) => t.id);
      let bookingsList = [];
      if (tourIds.length > 0) {
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*, tours!inner(title)')
          .in('tour_id', tourIds)
          .order('created_at', { ascending: false });
        bookingsList = bookingsData || [];
      }
      setBookings(bookingsList);

      const confirmedBookings = bookingsList.filter((b) =>
        ['confirmed', 'paid', 'completed'].includes((b.booking_status || b.status || '').toLowerCase())
      );
      const totalRevenue = confirmedBookings.reduce((sum, b) =>
        sum + Number(b.total_amount || b.total_price_amount || 0), 0
      );
      const operatorEarned = totalRevenue * 0.85;

      setStats({
        totalTours: toursList.length,
        liveTours: toursList.filter((t) => t.listing_status === 'live').length,
        pendingTours: toursList.filter((t) => t.listing_status === 'pending_review').length,
        totalBookings: confirmedBookings.length,
      });
      setEarningsSummary({ totalEarned: operatorEarned, pendingPayout: operatorEarned, paidOut: 0 });

      try {
        const { data: earningsData } = await supabase
          .from('operator_earnings')
          .select('*')
          .eq('operator_id', user.id)
          .order('created_at', { ascending: false });
        if (earningsData?.length) {
          setEarnings(earningsData);
          const totalEarned = earningsData.reduce((s, r) => s + Number(r.operator_payout || 0), 0);
          const pendingPayout = earningsData
            .filter((r) => r.booking_status === 'confirmed')
            .reduce((s, r) => s + Number(r.operator_payout || 0), 0);
          setEarningsSummary({ totalEarned, pendingPayout, paidOut: totalEarned - pendingPayout });
        }
      } catch { /* operator_earnings table may not exist yet */ }
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load dashboard' });
    } finally {
      setLoading(false);
    }
  };

  // ── Tour form helpers ───────────────────────────────────────────────────────
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `operator-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('tour-images').upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('tour-images').getPublicUrl(fileName);
      setTourForm((f) => ({ ...f, main_image: data.publicUrl }));
    } catch (err) {
      toast({ variant: 'destructive', title: 'Upload failed', description: err.message });
    } finally {
      setImageUploading(false);
    }
  };

  const openCreate = () => {
    setEditingTour(null);
    setTourForm(EMPTY_FORM);
    setAvailableDays([]);
    setTourDialogOpen(true);
  };

  const openEdit = (tour) => {
    setEditingTour(tour);
    setTourForm({
      title: tour.title || '',
      description: tour.description || '',
      destination: tour.destination || '',
      city: tour.city || '',
      country: tour.country || '',
      category: tour.category || '',
      duration_hours: tour.duration_hours || '',
      price_adult: tour.price_adult || '',
      price_child: tour.price_child || '',
      currency: tour.currency || 'GBP',
      meeting_point: tour.meeting_point || '',
      highlights: Array.isArray(tour.highlights) ? tour.highlights.join('\n') : '',
      price_includes: Array.isArray(tour.price_includes) ? tour.price_includes.join('\n') : '',
      price_excludes: Array.isArray(tour.price_excludes) ? tour.price_excludes.join('\n') : '',
      cancellation_policy: tour.cancellation_policy || '',
      start_times: Array.isArray(tour.start_times) ? tour.start_times.join(', ') : '',
      max_group_size: tour.max_group_size || '',
      main_image: tour.main_image || '',
    });
    setAvailableDays(tour.available_days || []);
    setTourDialogOpen(true);
  };

  const toggleDay = (day) =>
    setAvailableDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);

  const setField = (field) => (e) => setTourForm((f) => ({ ...f, [field]: e.target.value }));
  const setSelect = (field) => (val) => setTourForm((f) => ({ ...f, [field]: val }));

  const splitLines = (str) => str.split('\n').map((s) => s.trim()).filter(Boolean);
  const splitCommas = (str) => str.split(',').map((s) => s.trim()).filter(Boolean);

  const handleSaveTour = async (e) => {
    e.preventDefault();
    if (!tourForm.title || !tourForm.destination || !tourForm.price_adult) {
      toast({ variant: 'destructive', title: 'Required fields missing', description: 'Title, destination and price are required' });
      return;
    }

    setSavingTour(true);
    try {
      const base = {
        title: tourForm.title,
        description: tourForm.description || null,
        destination: tourForm.destination,
        city: tourForm.city || tourForm.destination,
        country: tourForm.country || null,
        category: tourForm.category || null,
        duration_hours: tourForm.duration_hours ? parseFloat(tourForm.duration_hours) : null,
        duration_minutes: tourForm.duration_hours ? Math.round(parseFloat(tourForm.duration_hours) * 60) : null,
        price_adult: parseFloat(tourForm.price_adult),
        price_child: tourForm.price_child ? parseFloat(tourForm.price_child) : null,
        currency: tourForm.currency || 'GBP',
        meeting_point: tourForm.meeting_point || null,
        highlights: splitLines(tourForm.highlights),
        price_includes: splitLines(tourForm.price_includes),
        price_excludes: splitLines(tourForm.price_excludes),
        cancellation_policy: tourForm.cancellation_policy || null,
        start_times: splitCommas(tourForm.start_times),
        max_group_size: tourForm.max_group_size ? parseInt(tourForm.max_group_size) : null,
        available_days: availableDays,
        main_image: tourForm.main_image || null,
      };

      if (editingTour) {
        const payload = { ...base };
        if (editingTour.listing_status === 'live') {
          payload.listing_status = 'pending_review';
          payload.is_active = false;
        }
        const { error } = await supabase.from('tours').update(payload).eq('id', editingTour.id);
        if (error) throw error;
        toast({ title: 'Tour updated', description: 'Submitted for re-review' });
      } else {
        const slug = `${tourForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
        const { error } = await supabase.from('tours').insert({
          ...base,
          operator_id: user.id,
          slug,
          listing_status: 'pending_review',
          is_active: false,
          source: 'operator',
        });
        if (error) throw error;
        toast({ title: 'Tour submitted!', description: 'Under review — live within 48hrs once approved' });
      }

      setTourDialogOpen(false);
      loadAll();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Save failed', description: err.message });
    } finally {
      setSavingTour(false);
    }
  };

  const handleDeleteTour = async (tourId) => {
    if (!window.confirm('Delete this tour? This cannot be undone.')) return;
    try {
      const { error } = await supabase.from('tours').delete().eq('id', tourId);
      if (error) throw error;
      toast({ title: 'Tour deleted' });
      setTours((prev) => prev.filter((t) => t.id !== tourId));
    } catch (err) {
      toast({ variant: 'destructive', title: 'Delete failed', description: err.message });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    if (error) {
      toast({ variant: 'destructive', title: 'Login failed', description: error.message });
    }
    setLoginLoading(false);
  };

  // Auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0B3D91]" />
      </div>
    );
  }

  // Not logged in → show operator login form
  if (!user) {
    return (
      <>
        <Helmet><title>Operator Login — Orbito</title></Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0B3D91] mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Operator Dashboard</h1>
              <p className="text-gray-500 mt-1">Sign in with your operator account</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label>Email address</Label>
                  <Input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={loginLoading} className="w-full bg-[#0B3D91] hover:bg-[#092C6B]">
                  {loginLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in…</> : 'Sign In'}
                </Button>
              </form>
              <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500 space-y-2">
                <p>Not an operator yet?{' '}
                  <Link to="/operator/apply" className="text-[#0B3D91] font-semibold hover:underline">Apply to list your tours</Link>
                </p>
                <p>
                  <Link to="/login" className="text-gray-400 hover:text-gray-600 text-xs">Use main login instead</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Logged in but wrong role
  if (role !== 'operator' && role !== 'admin') {
    return (
      <>
        <Helmet><title>Operator Dashboard — Orbito</title></Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-sm border p-10 max-w-md w-full text-center space-y-4">
            <AlertCircle className="w-14 h-14 text-yellow-500 mx-auto" />
            <h2 className="text-xl font-bold text-gray-900">Operator access required</h2>
            <p className="text-gray-600 text-sm">
              Your account (<strong>{user.email}</strong>) is not approved as an operator yet.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Button asChild className="bg-[#0B3D91] hover:bg-[#092C6B]">
                <Link to="/operator/apply">Apply to Become an Operator</Link>
              </Button>
              <Button variant="outline" onClick={async () => { await supabase.auth.signOut(); }}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { label: 'Tours', value: stats?.totalTours ?? tours.length, sub: `${stats?.liveTours ?? 0} live`, icon: MapPin, color: 'text-blue-600' },
    { label: 'Bookings', value: stats?.totalBookings ?? bookings.length, sub: 'confirmed & paid', icon: Calendar, color: 'text-green-600' },
    { label: 'Total Earned', value: `£${(earningsSummary?.totalEarned ?? 0).toFixed(2)}`, sub: '85% of bookings', icon: PoundSterling, color: 'text-green-600' },
    { label: 'Pending Payout', value: `£${(earningsSummary?.pendingPayout ?? 0).toFixed(2)}`, sub: 'next monthly run', icon: TrendingUp, color: 'text-yellow-600' },
  ];

  return (
    <>
      <Helmet><title>Operator Dashboard — Orbito</title></Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Operator Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome, {profile?.full_name || profile?.email}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={loadAll}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
              <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Tour</Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map(({ label, value, sub, icon: Icon, color }) => (
              <Card key={label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-gray-500">{label}</CardTitle>
                  <Icon className={`w-5 h-5 ${color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{value}</div>
                  <p className="text-xs text-gray-500 mt-1">{sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pending review banner */}
          {stats?.pendingTours > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3 text-yellow-800 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>You have <strong>{stats.pendingTours}</strong> tour{stats.pendingTours > 1 ? 's' : ''} awaiting admin review.</span>
            </div>
          )}

          <Tabs defaultValue="tours">
            <TabsList>
              <TabsTrigger value="tours">My Tours</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>

            {/* ── Tours ── */}
            <TabsContent value="tours">
              <Card>
                <CardHeader><CardTitle>My Tours</CardTitle></CardHeader>
                <CardContent>
                  {tours.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No tours yet</p>
                      <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Create Your First Tour</Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tours.map((tour) => {
                        const sc = STATUS_CONFIG[tour.listing_status] || STATUS_CONFIG.draft;
                        return (
                          <div key={tour.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="font-semibold truncate">{tour.title}</h3>
                                <Badge className={sc.class}>{sc.label}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{tour.destination}</span>
                                {tour.duration_hours && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{tour.duration_hours}h</span>}
                                <span className="flex items-center gap-1"><PoundSterling className="w-3.5 h-3.5" />{tour.price_adult}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button variant="outline" size="sm" onClick={() => openEdit(tour)}><Edit className="w-4 h-4" /></Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteTour(tour.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Bookings ── */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader><CardTitle>Bookings on Your Tours</CardTitle></CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No bookings yet</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-gray-600">
                            <th className="py-3 pr-4">Reference</th>
                            <th className="py-3 pr-4">Tour</th>
                            <th className="py-3 pr-4">Customer</th>
                            <th className="py-3 pr-4">Date</th>
                            <th className="py-3 pr-4 text-right">Amount</th>
                            <th className="py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((b) => (
                            <tr key={b.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 pr-4 font-mono text-xs">{b.booking_reference || b.id.slice(0, 8)}</td>
                              <td className="py-3 pr-4">{b.tours?.title || '—'}</td>
                              <td className="py-3 pr-4">{b.customer_name}</td>
                              <td className="py-3 pr-4">{b.tour_date ? format(new Date(b.tour_date), 'dd MMM yyyy') : '—'}</td>
                              <td className="py-3 pr-4 text-right font-medium">£{parseFloat(b.total_amount).toFixed(2)}</td>
                              <td className="py-3">
                                <Badge className={b.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' : b.booking_status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                                  {b.booking_status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Earnings ── */}
            <TabsContent value="earnings">
              {earningsSummary && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-500">Total Earned</p>
                      <p className="text-3xl font-bold text-green-600">£{earningsSummary.totalEarned.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-500">Pending Payout</p>
                      <p className="text-3xl font-bold text-yellow-600">£{earningsSummary.pendingPayout.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-500">Paid Out</p>
                      <p className="text-3xl font-bold text-gray-900">£{earningsSummary.paidOut.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Breakdown</CardTitle>
                  <p className="text-sm text-gray-500">You earn 85% of every booking. Platform fee: 15%.</p>
                </CardHeader>
                <CardContent>
                  {earnings.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No earnings yet — earnings appear once tours are booked and paid.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-gray-600">
                            <th className="py-3 pr-4">Booking</th>
                            <th className="py-3 pr-4">Tour</th>
                            <th className="py-3 pr-4">Date</th>
                            <th className="py-3 pr-4 text-right">Booking Total</th>
                            <th className="py-3 text-right">Your Earnings (85%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {earnings.map((e) => (
                            <tr key={e.booking_id} className="border-b hover:bg-gray-50">
                              <td className="py-3 pr-4 font-mono text-xs">{e.booking_reference}</td>
                              <td className="py-3 pr-4">{e.tour_title}</td>
                              <td className="py-3 pr-4">{e.tour_date ? format(new Date(e.tour_date), 'dd MMM yyyy') : '—'}</td>
                              <td className="py-3 pr-4 text-right">£{parseFloat(e.total_amount).toFixed(2)}</td>
                              <td className="py-3 text-right font-semibold text-green-700">£{parseFloat(e.operator_payout).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ── Create / Edit Tour Dialog ── */}
      <Dialog open={tourDialogOpen} onOpenChange={setTourDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTour ? 'Edit Tour' : 'Create New Tour'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveTour} className="space-y-5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label>Tour Title *</Label>
                <Input value={tourForm.title} onChange={setField('title')} placeholder="Jack the Ripper Walking Tour" required />
              </div>
              <div>
                <Label>Destination *</Label>
                <Input value={tourForm.destination} onChange={setField('destination')} placeholder="London" required />
              </div>
              <div>
                <Label>City</Label>
                <Input value={tourForm.city} onChange={setField('city')} placeholder="London" />
              </div>
              <div>
                <Label>Country</Label>
                <Input value={tourForm.country} onChange={setField('country')} placeholder="United Kingdom" />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={tourForm.category} onValueChange={setSelect('category')}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Duration (hours)</Label>
                <Input type="number" min="0.5" step="0.5" value={tourForm.duration_hours} onChange={setField('duration_hours')} placeholder="3" />
              </div>
              <div>
                <Label>Price per Adult ({tourForm.currency}) *</Label>
                <Input type="number" min="0" step="0.01" value={tourForm.price_adult} onChange={setField('price_adult')} placeholder="45.00" required />
              </div>
              <div>
                <Label>Price per Child</Label>
                <Input type="number" min="0" step="0.01" value={tourForm.price_child} onChange={setField('price_child')} placeholder="25.00" />
              </div>
              <div>
                <Label>Currency</Label>
                <Select value={tourForm.currency} onValueChange={setSelect('currency')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GBP">GBP £</SelectItem>
                    <SelectItem value="USD">USD $</SelectItem>
                    <SelectItem value="EUR">EUR €</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Max Group Size</Label>
                <Input type="number" min="1" value={tourForm.max_group_size} onChange={setField('max_group_size')} placeholder="15" />
              </div>
              <div className="sm:col-span-2">
                <Label>Meeting Point</Label>
                <Input value={tourForm.meeting_point} onChange={setField('meeting_point')} placeholder="Outside Aldgate East station, Exit 2" />
              </div>
              <div className="sm:col-span-2">
                <Label>Start Times (comma-separated)</Label>
                <Input value={tourForm.start_times} onChange={setField('start_times')} placeholder="10:00, 14:00, 18:00" />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Available Days</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      availableDays.includes(day) ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea value={tourForm.description} onChange={setField('description')} rows={3} placeholder="Describe the experience…" />
            </div>
            <div>
              <Label>Highlights (one per line)</Label>
              <Textarea value={tourForm.highlights} onChange={setField('highlights')} rows={3} placeholder="See the Tower of London&#10;Hear true Victorian crime stories&#10;Expert local guide" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>What's Included (one per line)</Label>
                <Textarea value={tourForm.price_includes} onChange={setField('price_includes')} rows={3} placeholder="Expert guide&#10;Entry tickets" />
              </div>
              <div>
                <Label>Not Included (one per line)</Label>
                <Textarea value={tourForm.price_excludes} onChange={setField('price_excludes')} rows={3} placeholder="Food & drinks&#10;Transport" />
              </div>
            </div>
            <div>
              <Label>Cancellation Policy</Label>
              <Input value={tourForm.cancellation_policy} onChange={setField('cancellation_policy')} />
            </div>
            <div>
              <Label>Tour Photo</Label>
              <div className="space-y-2 mt-1">
                <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#0B3D91] transition-colors bg-gray-50">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  {imageUploading ? (
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading…
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">Click to upload a photo</span>
                  )}
                </label>
                {tourForm.main_image && !imageUploading && (
                  <img src={tourForm.main_image} alt="Preview" className="h-36 w-full rounded-lg object-cover border" />
                )}
                <Input value={tourForm.main_image} onChange={setField('main_image')} placeholder="Or paste an image URL…" className="text-xs text-gray-500" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setTourDialogOpen(false)} className="flex-1">Cancel</Button>
              <Button type="submit" disabled={savingTour} className="flex-1">
                {savingTour ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : editingTour ? 'Save Changes' : 'Submit for Review'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
