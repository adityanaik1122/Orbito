import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const handleSession = useCallback(async (session) => {
    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
  
        if (!error) {
          setProfile(data);
        } else {
          // It's normal to have no profile immediately after signup until the trigger finishes
          console.log('Profile loading...'); 
          setProfile(null);
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
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  // ✅ NEW CLEAN SIGNUP FUNCTION
  const signUp = useCallback(async (email, password, options) => {
    console.log("Attempting signup for:", email);

    // 1. Create User (Database Trigger will handle the Profile)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
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

    // If we get here, it worked. The error you saw before is impossible now.
    console.log("✅ Signup successful via Trigger. User ID:", data.user?.id);
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

  const value = useMemo(() => ({
    user,
    session,
    loading,
    profile,
    role: profile?.role || 'customer',
    signUp,
    signIn,
    signOut,
  }), [user, session, loading, profile, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};