import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
  FileText,
  Loader2,
  MapPin,
  RefreshCw,
  Settings,
  ShoppingBag,
  Users,
  XCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { apiService } from '@/services/api';

const sections = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'tours', label: 'Tours', icon: ShoppingBag },
  { id: 'operators', label: 'Tour Operators', icon: FileText },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'bookings', label: 'Bookings', icon: CreditCard },
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

      const providersRes = await supabase
        .from('tour_providers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      const suppliersRes = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      const profilesRes = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

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

      const toursData = toursRes.data || [];
      const providerData = providersRes.data?.length ? providersRes.data : suppliersRes.data || [];

      setTours(toursData);
      setProviders(providerData);
      setProfiles(profilesRes.data || []);
      setBookings(bookingsRes.data || []);
      setPayments(paymentsRes.data || []);

      // Load operator marketplace data (non-blocking)
      try {
        const [appsRes, pendingToursRes] = await Promise.allSettled([
          apiService.getAdminApplications(),
          apiService.getAdminPendingTours(),
        ]);
        if (appsRes.status === 'fulfilled') setApplications(appsRes.value.applications || []);
        if (pendingToursRes.status === 'fulfilled') setPendingAdminTours(pendingToursRes.value.tours || []);
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
      await apiService.approveApplication(id);
      toast({ title: 'Approved', description: 'Operator account activated and email sent' });
      setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: 'approved' } : a));
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectApplication = async (id) => {
    const reason = window.prompt('Rejection reason (optional):');
    if (reason === null) return; // cancelled
    setActionLoading(id);
    try {
      await apiService.rejectApplication(id, reason);
      toast({ title: 'Rejected', description: 'Applicant has been notified' });
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
      await apiService.approveTour(id);
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
      await apiService.rejectTour(id);
      toast({ title: 'Tour rejected' });
      setPendingAdminTours((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setActionLoading(null);
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
                    <CardHeader><CardTitle>Active Operators</CardTitle></CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="text-xs text-gray-500 border-b">
                            <tr>
                              <th className="text-left py-2">Operator</th>
                              <th className="text-left py-2">Email</th>
                              <th className="text-left py-2">Tours</th>
                              <th className="text-left py-2">Bookings</th>
                              <th className="text-left py-2">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {operatorStats.map((operator) => (
                              <tr key={operator.id}>
                                <td className="py-3 font-semibold text-gray-900">{operator.name}</td>
                                <td className="py-3 text-gray-500">{operator.contact_email || operator.email || '-'}</td>
                                <td className="py-3">{operator.toursCount}</td>
                                <td className="py-3">{operator.bookingsCount}</td>
                                <td className="py-3">
                                  <Badge className={operator.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}>
                                    {operator.is_active ? 'Active' : 'Inactive'}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {operatorStats.length === 0 && <p className="text-sm text-gray-500 py-6">No operators yet.</p>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'clients' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Client Database</CardTitle>
                  </CardHeader>
                                      <CardContent>
                      
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="text-xs text-gray-500 border-b">
                          <tr>
                            <th className="text-left py-2">Name</th>
                            <th className="text-left py-2">Email</th>
                            <th className="text-left py-2">Country</th>
                            <th className="text-left py-2">Joined</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredClients.map((client) => (
                            <tr key={client.id}>
                              <td className="py-3 font-semibold text-gray-900">{client.name || 'Unknown'}</td>
                              <td className="py-3 text-gray-500">{client.email}</td>
                              <td className="py-3">{client.country || '-'}</td>
                              <td className="py-3 text-gray-500">{client.created_at ? format(new Date(client.created_at), 'PP') : '-'}</td>
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
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
