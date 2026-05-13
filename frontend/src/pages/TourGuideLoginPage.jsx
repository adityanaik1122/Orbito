import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export default function TourGuideLoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;

      const { data: profile } = await supabase
        .from('tour_guide_profiles')
        .select('id, status')
        .eq('id', data.user.id)
        .maybeSingle();

      if (!profile) {
        await supabase.auth.signOut();
        toast({ variant: 'destructive', title: 'No tour guide account found', description: 'Please register first.' });
        return;
      }

      navigate('/tour-guide-dashboard');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Sign in failed', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-[#0B3D91] tracking-tight block mb-6">ORBITO</Link>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Tour Guide Sign In</h1>
          <p className="text-gray-500 text-sm">
            Not a guide yet?{' '}
            <Link to="/tour-guides/register" className="text-[#0B3D91] font-semibold hover:underline">Register here</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-7 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input type="email" className="pl-9" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input type={showPass ? 'text' : 'password'} className="pl-9 pr-10"
                placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-[#0B3D91] hover:bg-[#092C6B] text-white font-bold py-2.5">
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          <Link to="/tour-guides" className="hover:text-[#0B3D91]">← Browse Tour Guides</Link>
        </p>
      </div>
    </div>
  );
}
