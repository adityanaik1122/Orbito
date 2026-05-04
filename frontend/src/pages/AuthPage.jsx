import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Mail, Lock, User, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useLocale } from '@/contexts/LocaleContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COUNTRIES } from '@/lib/countries';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();
  const { locale, currency, country, t } = useLocale();
  
  // Get the intended destination from location state, or default to my-account
  const from = location.state?.from?.pathname || '/my-account';
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState('auth'); // 'auth' | 'forgot' | 'reset-password'
  const [newPassword, setNewPassword] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: ''
  });

  // Detect Supabase recovery token in URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setView('reset-password');
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setView('reset-password');
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        throw error;
      }

      // Determine role and redirect accordingly
      let target = from;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Note: profiles table may not have a 'role' column yet
          // This is a placeholder for future role-based routing
          // For now, all users go to the default route
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          // Only check role if the column exists and has data
          if (!profileError && profileData?.role) {
            const role = profileData.role;
            if (role === 'operator') target = '/operator/dashboard';
            else if (role === 'admin') target = '/admin';
          }
        }
      } catch (e) {
        console.error('Error determining user role on login:', e);
        // Continue with default redirect even if role check fails
      }

      toast({
        title: "Welcome back! 👋",
        description: "You have successfully logged in.",
      });
      navigate(target);
    } catch (error) {
      // Error is handled in context, but we catch here to stop loading state if needed
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (formData.password.length < 6) {
        toast({
            variant: "destructive",
            title: "Password too weak",
            description: "Password must be at least 6 characters long."
        });
        setIsLoading(false);
        return;
    }

    try {
      const { data, error } = await signUp(formData.email, formData.password, {
        data: {
          full_name: formData.name,
          country: formData.country || null
        },
        emailRedirectTo: `${window.location.origin}/auth`
      });
      
      if (error) throw error;

      if (data?.user?.id) {
        try {
          await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              country: formData.country || country || null,
              locale: locale || null,
              currency: currency || null,
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' });
        } catch (profileError) {
          console.error('Profile upsert failed:', profileError);
        }
      }

      if (data?.session) {
        toast({
          title: "Welcome! 🎉",
          description: "Your account is ready and you're now signed in.",
        });
        navigate(from);
      } else {
        toast({
          title: "Account created! 🎉",
          description: "Please check your email to confirm your account.",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast({ variant: 'destructive', title: 'Enter your email first', description: 'Type your email in the field above, then click Forgot Password.' });
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setIsLoading(false);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      setView('forgot');
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ variant: 'destructive', title: 'Too short', description: 'Password must be at least 6 characters.' });
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsLoading(false);
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Password updated!', description: 'You can now log in with your new password.' });
      setView('auth');
      setNewPassword('');
      navigate('/login');
    }
  };

  if (view === 'forgot') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-10 px-8 shadow sm:rounded-lg border border-gray-100 text-center">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-500 mb-6">We sent a password reset link to <strong>{formData.email}</strong>. Click the link in the email to set a new password.</p>
            <Button variant="outline" onClick={() => setView('auth')} className="w-full">Back to Login</Button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'reset-password') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-[#0B3D91]">ORBITO</h2>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">Set new password</h2>
          </div>
          <div className="bg-white py-8 px-8 shadow sm:rounded-lg border border-gray-100">
            <form onSubmit={handleSetNewPassword} className="space-y-6">
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="pl-10 pr-10"
                    placeholder="Enter new password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#0B3D91] hover:bg-[#092C6B] text-white" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : 'Update Password'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Login or Sign Up - Orbito</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Button 
            variant="ghost" 
            className="mb-4 text-gray-500 hover:text-[#0B3D91]"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          
          <div className="text-center">
             <h2 className="text-3xl font-extrabold text-[#0B3D91]">
              ORBITO
            </h2>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              {t('auth_welcome_title')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('auth_welcome_sub')}
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">{t('auth_login')}</TabsTrigger>
                <TabsTrigger value="register">{t('auth_signup')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form className="space-y-6" onSubmit={handleLogin}>
                  <div>
                    <Label htmlFor="email">{t('auth_email')}</Label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        required
                        className="pl-10"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="country">{t('auth_country_optional')}</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((countryItem) => (
                          <SelectItem key={countryItem.code} value={countryItem.code}>
                            {countryItem.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="password">{t('auth_password')}</Label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="pl-10 pr-10"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#0B3D91] hover:bg-[#092C6B] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : t('auth_signin')}
                  </Button>
                  
                  <div className="text-center">
                    <Button variant="link" className="text-sm text-[#0B3D91] hover:underline p-0 h-auto" onClick={handleForgotPassword} disabled={isLoading}>
                      Forgot your password?
                    </Button>
                  </div>

                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form className="space-y-6" onSubmit={handleRegister}>
                  <div>
                    <Label htmlFor="name">{t('auth_full_name')}</Label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="name"
                        type="text"
                        required
                        className="pl-10"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">{t('auth_email')}</Label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        required
                        className="pl-10"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">{t('auth_password')}</Label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="pl-10 pr-10"
                        placeholder="Create a password (min 6 chars)"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#0B3D91] hover:bg-[#092C6B] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : t('auth_create_account')}
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
