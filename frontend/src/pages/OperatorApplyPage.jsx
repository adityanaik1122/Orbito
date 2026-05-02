import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { apiService } from '@/services/api';
import { CheckCircle, Loader2, Building2, MapPin, Users, Globe } from 'lucide-react';

const TOUR_TYPES = ['Cultural', 'Adventure', 'Food & Drink', 'Sightseeing', 'Nature', 'Water Sports', 'History', 'Wellness', 'Photography', 'Nightlife'];

export default function OperatorApplyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    contact_email: user?.email || '',
    contact_phone: '',
    website: '',
    years_in_business: '',
    description: '',
    operating_locations: '',
  });
  const [selectedTypes, setSelectedTypes] = useState([]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: 'destructive', title: 'Login required', description: 'Please log in to apply' });
      navigate('/login');
      return;
    }
    if (!form.company_name || !form.contact_name || !form.contact_email) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Company name, contact name and email are required' });
      return;
    }

    setSubmitting(true);
    try {
      await apiService.applyAsOperator({
        ...form,
        years_in_business: form.years_in_business ? parseInt(form.years_in_business) : null,
        tour_types: selectedTypes,
        operating_locations: form.operating_locations
          ? form.operating_locations.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      });
      setSubmitted(true);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Submission failed', description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow p-10 max-w-md w-full text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Application submitted!</h2>
          <p className="text-gray-600">
            We'll review your application within <strong>48 hours</strong> and email you at{' '}
            <strong>{form.contact_email}</strong>.
          </p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Become an Operator — Orbito</title></Helmet>

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">List Your Experiences</h1>
            <p className="text-lg text-gray-600">
              Reach thousands of travellers. Orbito handles bookings, payments and marketing — you just run great tours.
            </p>
            <div className="flex justify-center gap-8 mt-6 text-sm text-gray-500">
              <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Zero upfront cost</div>
              <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Global audience</div>
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> 85% earnings</div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Company / Business Name *</Label>
                  <Input value={form.company_name} onChange={set('company_name')} placeholder="London Walks Ltd" required />
                </div>
                <div>
                  <Label>Your Name *</Label>
                  <Input value={form.contact_name} onChange={set('contact_name')} placeholder="Jane Smith" required />
                </div>
                <div>
                  <Label>Business Email *</Label>
                  <Input type="email" value={form.contact_email} onChange={set('contact_email')} placeholder="hello@company.com" required />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={form.contact_phone} onChange={set('contact_phone')} placeholder="+44 7700 900000" />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input value={form.website} onChange={set('website')} placeholder="https://yourcompany.com" />
                </div>
                <div>
                  <Label>Years in Business</Label>
                  <Input type="number" min="0" value={form.years_in_business} onChange={set('years_in_business')} placeholder="5" />
                </div>
              </div>

              <div>
                <Label>Operating Locations</Label>
                <Input
                  value={form.operating_locations}
                  onChange={set('operating_locations')}
                  placeholder="London, Edinburgh, Bath (comma-separated)"
                />
              </div>

              <div>
                <Label className="mb-2 block">Types of Tours You Offer</Label>
                <div className="flex flex-wrap gap-2">
                  {TOUR_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleType(type)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        selectedTypes.includes(type)
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Tell us about your experiences</Label>
                <Textarea
                  value={form.description}
                  onChange={set('description')}
                  placeholder="Describe your tours, what makes them unique, how many years you've been running them..."
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <strong>Platform terms:</strong> Orbito retains a 15% platform fee on each completed booking. You earn 85% of every transaction. Payouts are processed monthly.
              </div>

              <Button type="submit" disabled={submitting} className="w-full py-6 text-base font-semibold">
                {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting…</> : 'Submit Application'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
