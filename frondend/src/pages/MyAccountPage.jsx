import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, MapPin, Calendar, Heart, Trash2, Edit, Star, Loader2, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const MyAccountPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    location: '',
    joinDate: ''
  });
  const [itineraries, setItineraries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setIsLoadingData(true);
    try {
        // Fetch Profile
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
             console.error('Error fetching profile:', profileError);
        }

        if (profileData) {
            setProfile({
                name: profileData.full_name || '',
                email: profileData.email || user.email,
                location: profileData.location || '',
                joinDate: profileData.join_date || new Date().toISOString()
            });
        } else {
            // Fallback if profile doesn't exist yet
             setProfile({
                name: user.user_metadata?.full_name || '',
                email: user.email,
                location: '',
                joinDate: user.created_at || new Date().toISOString()
            });
        }

        // Fetch Itineraries
        const { data: itinerariesData, error: itinerariesError } = await supabase
            .from('itineraries')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (itinerariesError) throw itinerariesError;
        
        // Transform data if needed (dates are stored as strings usually in JSON responses, but DB returns specific types)
        const formattedItineraries = itinerariesData.map(it => ({
            ...it,
            startDate: it.start_date,
            endDate: it.end_date
        }));
        
        setItineraries(formattedItineraries);

        // Fetch Favorites
        const { data: favoritesData, error: favoritesError } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (favoritesError) throw favoritesError;
        setFavorites(favoritesData);

    } catch (error) {
        console.error('Error loading account data:', error);
        toast({
            variant: "destructive",
            title: "Error loading data",
            description: "Failed to load your profile information."
        });
    } finally {
        setIsLoadingData(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                full_name: profile.name,
                email: profile.email,
                location: profile.location,
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

        if (error) throw error;

        toast({
            title: "Profile Updated! ✨",
            description: "Your changes have been saved successfully"
        });
    } catch (error) {
        console.error('Error saving profile:', error);
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not save profile changes."
        });
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeleteItinerary = async (id) => {
    try {
        const { error } = await supabase
            .from('itineraries')
            .delete()
            .eq('id', id);

        if (error) throw error;

        setItineraries(itineraries.filter(item => item.id !== id));
        toast({
            title: "Trip Deleted",
            description: "Your itinerary has been removed"
        });
    } catch (error) {
        console.error('Error deleting itinerary:', error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete itinerary."
        });
    }
  };

  const removeFavorite = async (id) => {
    try {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('id', id);

        if (error) throw error;

        setFavorites(favorites.filter(fav => fav.id !== id));
        toast({
            title: "Removed from Favorites"
        });
    } catch (error) {
        console.error('Error removing favorite:', error);
        toast({ variant: "destructive", title: "Error removing favorite" });
    }
  };

  const getInitials = () => {
    return profile.name
      ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase()
      : user?.email?.[0].toUpperCase() || 'U';
  };

  if (authLoading || isLoadingData) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <Loader2 className="w-8 h-8 animate-spin text-[#0B3D91]" />
          </div>
      );
  }

  return (
    <>
      <Helmet>
        <title>My Account - Orbito</title>
        <meta name="description" content="Manage your profile, trips, and favorites" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-gradient-to-br from-[#0B3D91] to-[#1E5BA8] text-white text-3xl font-bold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-[#0B3D91] mb-1">{profile.name || user?.email}</h1>
                  <p className="text-gray-600">Member since {new Date(profile.joinDate).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center px-6 py-3 bg-blue-50/50 rounded-xl">
                    <div className="text-2xl font-bold text-[#0B3D91]">{itineraries.length}</div>
                    <div className="text-sm text-gray-600">Trips</div>
                  </div>
                  <div className="text-center px-6 py-3 bg-blue-50/50 rounded-xl">
                    <div className="text-2xl font-bold text-[#0B3D91]">{favorites.length}</div>
                    <div className="text-sm text-gray-600">Favorites</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="trips" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl p-1 shadow-sm mb-6 h-auto">
                <TabsTrigger value="trips" className="py-3 data-[state=active]:bg-[#0B3D91] data-[state=active]:text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">My Trips</span>
                  <span className="sm:hidden">Trips</span>
                </TabsTrigger>
                <TabsTrigger value="favorites" className="py-3 data-[state=active]:bg-[#0B3D91] data-[state=active]:text-white">
                  <Heart className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Favorites</span>
                  <span className="sm:hidden">Favs</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="py-3 data-[state=active]:bg-[#0B3D91] data-[state=active]:text-white">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
              </TabsList>

              {/* My Trips Tab */}
              <TabsContent value="trips">
                {itineraries.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <Calendar className="w-16 h-16 text-[#0B3D91]/20 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#0B3D91] mb-2">No trips yet</h3>
                    <p className="text-gray-600 mb-6">Start planning your first adventure!</p>
                    <Button
                      onClick={() => navigate('/plan')}
                      className="bg-[#0B3D91] hover:bg-[#092C6B] text-white"
                    >
                      Create Your First Trip
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {itineraries.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                        onClick={() => navigate(`/itinerary/${item.id}`)}
                      >
                        <div className="relative h-48 bg-gradient-to-br from-[#0B3D91]/10 to-[#0B3D91]/20">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <MapPin className="w-16 h-16 text-[#0B3D91]/40" />
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-[#0B3D91] mb-2">{item.title || 'Untitled Trip'}</h3>
                          <p className="text-gray-600 mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {item.destination || 'No destination'}
                          </p>
                          {item.startDate && item.endDate && (
                            <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                            </p>
                          )}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-600">{item.activities?.length || 0} activities</span>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate('/plan');
                                }}
                                className="text-gray-600 hover:text-[#0B3D91]"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteItinerary(item.id);
                                }}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites">
                {favorites.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <Heart className="w-16 h-16 text-[#0B3D91]/20 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#0B3D91] mb-2">No favorites yet</h3>
                    <p className="text-gray-600 mb-6">Start exploring and save your favorite places!</p>
                    <Button
                      onClick={() => navigate('/plan')}
                      className="bg-[#0B3D91] hover:bg-[#092C6B] text-white"
                    >
                      Explore Destinations
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((spot, index) => (
                      <motion.div
                        key={spot.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all"
                      >
                        <div className="relative h-48 bg-gradient-to-br from-[#0B3D91]/10 to-[#0B3D91]/20">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Star className="w-16 h-16 text-[#0B3D91]/40" />
                          </div>
                          <button
                            onClick={() => removeFavorite(spot.id)}
                            className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                          >
                            <Heart className="w-5 h-5 text-[#0B3D91] fill-[#0B3D91]" />
                          </button>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-[#0B3D91] mb-1">{spot.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{spot.type}</p>
                          <div className="flex items-center gap-1 text-[#0B3D91]">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-semibold text-gray-900">{spot.rating}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-[#0B3D91] mb-6">Profile Settings</h2>
                  <div className="space-y-6 max-w-2xl">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2 mb-2 text-gray-700">
                        <User className="w-4 h-4" /> Full Name
                      </Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="Enter your name"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-gray-700">
                        <Mail className="w-4 h-4" /> Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="h-12 bg-gray-50 text-gray-500"
                      />
                      <p className="text-xs text-gray-400 mt-1">Email cannot be changed directly.</p>
                    </div>
                    <div>
                      <Label htmlFor="location" className="flex items-center gap-2 mb-2 text-gray-700">
                        <MapPin className="w-4 h-4" /> Location
                      </Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder="City, Country"
                        className="h-12"
                      />
                    </div>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="w-full bg-[#0B3D91] hover:bg-[#092C6B] text-white h-12"
                    >
                      {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MyAccountPage;