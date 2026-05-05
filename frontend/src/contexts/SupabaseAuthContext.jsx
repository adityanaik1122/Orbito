import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { supabase, initialUrlAuthType } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  // Initialise as true immediately if the page loaded with a recovery URL hash
  const [isRecoveryMode, setIsRecoveryMode] = useState(initialUrlAuthType === 'recovery');
  const recoveryModeRef = useRef(initialUrlAuthType === 'recovery');
  
  const handleSession = useCallback(async (session) => {
    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (data) {
          setProfile(data);
        } else {
          // No profile row yet — create a minimal one so queries don't 406
          const { data: created } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' })
            .select()
            .maybeSingle();
          setProfile(created ?? null);
        }
      } catch (err) {
        console.error('Unexpected error loading profile:', err);
        setProfile(null);
      }
    } else {
      setProfile(null);
    }
  
    setLoading(false);
  }, []);

  useEffect(() => {
    // Skip getSession() if we already know this is a recovery page load —
    // it would set loading=false and overwrite state before the event fires.
    if (!recoveryModeRef.current) {
      const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        handleSession(session);
      };
      getSession();
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          recoveryModeRef.current = true;
          setIsRecoveryMode(true);
          setUser(session?.user ?? null);
          setSession(session);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          recoveryModeRef.current = false;
          setIsRecoveryMode(false);
          handleSession(session);
        } else if (!recoveryModeRef.current) {
          // Only update auth state for non-recovery events when not in recovery mode
          handleSession(session);
        } else {
          // In recovery mode: update loading but keep recovery state
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  // ✅ NEW CLEAN SIGNUP FUNCTION
  const signUp = useCallback(async (email, password, options) => {

    const emailRedirectTo = options?.emailRedirectTo || `${window.location.origin}/auth`;

    // 1. Create User (Database Trigger will handle the Profile)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          full_name: options?.data?.full_name,
          ...options?.data 
        }
      }
    });
  
    if (error) {
      console.error("Signup Error:", error);
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
      return { error };
    }

    return { data, error: null };

  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    }
    return { error };
  }, [toast]);

  const setIsRecoveryModeAndRef = useCallback((val) => {
    recoveryModeRef.current = val;
    setIsRecoveryMode(val);
  }, []);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    profile,
    role: profile?.role || 'customer',
    isRecoveryMode,
    setIsRecoveryMode: setIsRecoveryModeAndRef,
    signUp,
    signIn,
    signOut,
  }), [user, session, loading, profile, isRecoveryMode, setIsRecoveryModeAndRef, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
