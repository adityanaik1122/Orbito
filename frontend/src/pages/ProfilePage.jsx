import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, MapPin, BarChart, Share2, Star, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProfilePage = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: 'Traveler',
    email: 'traveler@example.com',
    location: 'Planet Earth',
    joinDate: new Date().toISOString()
  });
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteSpots') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    toast({
      title: "Profile Updated! ✨",
      description: "Your changes have been saved successfully"
    });
  };

  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteSpots', JSON.stringify(updatedFavorites));
    toast({
        title: "Removed from Favorites",
    });
  };

  const getInitials = () => {
    return profile.name
      ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase()
      : 'U';
  };

  return (
    <>
      <Helmet>
        <title>My Profile - Orbito</title>
        <meta name="description" content="Manage your profile and travel preferences." />
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#0B3D91]">
            My Profile
          </h1>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="bg-gradient-to-br from-[#0B3D91] to-[#1E5BA8] text-white text-3xl font-bold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold mb-1 text-[#0B3D91]">{profile.name || 'Travel Enthusiast'}</h2>
                    <p className="text-gray-500">Member since {new Date(profile.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2 mb-2 text-gray-700"><User className="w-4 h-4" /> Full Name</Label>
                    <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Enter your name" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-gray-700"><Mail className="w-4 h-4" /> Email Address</Label>
                    <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="location" className="flex items-center gap-2 mb-2 text-gray-700"><MapPin className="w-4 h-4" /> Location</Label>
                    <Input id="location" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="City, Country" />
                  </div>
                  <Button onClick={handleSaveProfile} className="w-full bg-[#0B3D91] hover:bg-[#092C6B] text-white">Save Changes</Button>
                </div>
              </div>

               <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#0B3D91] flex items-center gap-2"><BarChart className="w-5 h-5"/> Travel Statistics</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="text-3xl font-bold text-[#0B3D91] mb-2">{JSON.parse(localStorage.getItem('itineraries') || '[]').length}</div>
                    <p className="text-gray-600">Itineraries</p>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="text-3xl font-bold text-[#0B3D91] mb-2">{favorites.length}</div>
                    <p className="text-gray-600">Favorites</p>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="text-3xl font-bold text-[#0B3D91] mb-2">0</div>
                    <p className="text-gray-600">Trips Done</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                    <h3 className="text-xl font-bold mb-4 text-[#0B3D91] flex items-center gap-2"><Star className="w-5 h-5 fill-[#0B3D91] text-[#0B3D91]"/> Favorite Spots</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {favorites.length > 0 ? favorites.map(spot => (
                            <div key={spot.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between gap-2">
                                <div>
                                    <p className="font-semibold text-[#0B3D91]">{spot.name}</p>
                                    <p className="text-sm text-gray-500">{spot.type}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeFavorite(spot.id)} className="text-red-500 hover:text-red-400 hover:bg-red-50 shrink-0">
                                    <Trash2 className="w-4 h-4"/>
                                </Button>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center py-4">You haven't favorited any spots yet. Start exploring!</p>
                        )}
                    </div>
                </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProfilePage;