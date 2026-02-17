
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { format, addDays, differenceInDays } from 'date-fns';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar as CalendarIcon, MapPin, Plus, Sparkles, ArrowLeft, Save, Share2, Clock, DollarSign, Map as MapIcon, Filter, Trash2, GripVertical, Coffee, Loader2, Link2, Printer, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Reorder, motion } from 'framer-motion';
import MapView from '@/components/MapView';
import { attractions } from '@/data/attractions';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import ItineraryPrintView from '@/components/ItineraryPrintView';
import { apiService } from '@/services/api';

const PlanTourPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  
  // -- State --
  const [tripDetails, setTripDetails] = useState({
    title: 'My Awesome Adventure',
    destination: 'London',
    startDate: undefined,
    endDate: undefined,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // -- Add Activity Modal State --
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [activitySearch, setActivitySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // -- Edit Activity Modal State --
  const [isEditActivityOpen, setIsEditActivityOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingDayIndex, setEditingDayIndex] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    time: '',
    estTime: '',
    cost: '',
    notes: ''
  });

  // -- Drag State --
  const [draggedAttraction, setDraggedAttraction] = useState(null);
  const [draggedActivity, setDraggedActivity] = useState(null);
  const [dropTargetDay, setDropTargetDay] = useState(null);

  // -- Derived State --
  const availableCities = ['London', 'Paris', 'Amsterdam', 'Dubai', 'Prague', 'Edinburgh', 'Barcelona', 'Rome', 'New York', 'Tokyo'];

  // Handle Location State (Pre-select destination and natural language query)
  useEffect(() => {
    if (location.state?.destination) {
      setTripDetails(prev => ({
        ...prev,
        destination: location.state.destination
      }));
    }
    
    // Pre-fill AI prompt and parse natural language query
    if (location.state?.naturalLanguageQuery) {
      const query = location.state.naturalLanguageQuery;
      setAiPrompt(query);
      
      // Parse the query to extract trip details
      parseNaturalLanguageQuery(query);
    }
  }, [location.state]);

  // Auto-generate itinerary when trip details are complete from natural language query
  useEffect(() => {
    // Only auto-generate if we came from homepage with a query and have all required details
    if (location.state?.naturalLanguageQuery && 
        location.state?.autoGenerate && // Add explicit flag to control auto-generation
        tripDetails.destination && 
        tripDetails.startDate && 
        tripDetails.endDate &&
        !isGenerating &&
        itinerary.length === 0) {
      
      // Small delay to let the UI update first
      const timer = setTimeout(() => {
        handleAiSuggest();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [tripDetails.destination, tripDetails.startDate, tripDetails.endDate]);

  // Parse natural language query to extract trip details (with state updates)
  const parseNaturalLanguageQuery = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Extract destination (improved patterns)
    let extractedDestination = null;
    
    // Try multiple patterns
    const patterns = [
      /(?:trip\s+to|going\s+to|visit|explore|in)\s+([a-z]+(?:\s+[a-z]+)?)/i,
      /^([a-z]+(?:\s+[a-z]+)?)\s+(?:trip|adventure|vacation)/i,
      /(?:to|in)\s+([a-z]+)/i,
    ];
    
    for (const pattern of patterns) {
      const match = query.match(pattern);
      if (match && match[1]) {
        // Capitalize first letter of each word
        extractedDestination = match[1]
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        break;
      }
    }
    
    // If no pattern matched, try to find a capitalized word (likely a place name)
    if (!extractedDestination) {
      const capitalizedMatch = query.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/);
      if (capitalizedMatch) {
        extractedDestination = capitalizedMatch[1];
      }
    }
    
    // Extract duration (days/weeks)
    let startDate = null;
    let endDate = null;
    
    const daysMatch = lowerQuery.match(/(\d+)\s*days?/);
    const weeksMatch = lowerQuery.match(/(\d+)\s*weeks?/);
    const weekendMatch = lowerQuery.match(/weekend/);
    
    if (daysMatch) {
      const days = parseInt(daysMatch[1]);
      startDate = new Date();
      startDate.setDate(startDate.getDate() + 7); // Start next week
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + days - 1);
    } else if (weeksMatch) {
      const weeks = parseInt(weeksMatch[1]);
      startDate = new Date();
      startDate.setDate(startDate.getDate() + 7);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (weeks * 7) - 1);
    } else if (weekendMatch) {
      startDate = new Date();
      startDate.setDate(startDate.getDate() + 7);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 2);
    }
    // Removed: else block that was setting default 3 days
    // Now dates will only be set if user explicitly mentions duration
    
    // Update trip details with extracted information
    setTripDetails(prev => ({
      ...prev,
      destination: extractedDestination || prev.destination,
      startDate: startDate || prev.startDate,
      endDate: endDate || prev.endDate,
      title: extractedDestination ? `${extractedDestination} Adventure` : prev.title
    }));
  };

  // Parse natural language query synchronously (returns values without state updates)
  const parseNaturalLanguageQuerySync = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Extract destination (improved patterns)
    let extractedDestination = null;
    
    // Try multiple patterns
    const patterns = [
      /(?:trip\s+to|going\s+to|visit|explore|plan.*to|plan.*for)\s+([a-z]+(?:\s+[a-z]+)?)/i,
      /^([a-z]+(?:\s+[a-z]+)?)\s+(?:trip|adventure|vacation|for)/i,
      /(?:to|in)\s+([a-z]+)/i,
    ];
    
    for (const pattern of patterns) {
      const match = query.match(pattern);
      if (match && match[1]) {
        // Capitalize first letter of each word
        extractedDestination = match[1]
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        break;
      }
    }
    
    // If no pattern matched, try to find a capitalized word (likely a place name)
    if (!extractedDestination) {
      const capitalizedMatch = query.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/);
      if (capitalizedMatch) {
        extractedDestination = capitalizedMatch[1];
      }
    }
    
    // Extract duration (days/weeks)
    let startDate = null;
    let endDate = null;
    
    const daysMatch = lowerQuery.match(/(\d+)\s*days?/);
    const weeksMatch = lowerQuery.match(/(\d+)\s*weeks?/);
    const weekendMatch = lowerQuery.match(/weekend/);
    
    if (daysMatch) {
      const days = parseInt(daysMatch[1]);
      startDate = new Date();
      startDate.setDate(startDate.getDate() + 7); // Start next week
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + days - 1);
    } else if (weeksMatch) {
      const weeks = parseInt(weeksMatch[1]);
      startDate = new Date();
      startDate.setDate(startDate.getDate() + 7);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (weeks * 7) - 1);
    } else if (weekendMatch) {
      startDate = new Date();
      startDate.setDate(startDate.getDate() + 7);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 2);
    }
    
    // Return extracted values
    return {
      destination: extractedDestination,
      startDate: startDate,
      endDate: endDate
    };
  };

  // Initialize itinerary days when dates change
  useEffect(() => {
    if (tripDetails.startDate && tripDetails.endDate) {
      const start = new Date(tripDetails.startDate);
      const end = new Date(tripDetails.endDate);
      const dayCount = differenceInDays(end, start) + 1;
      
      if (dayCount > 0) {
        setItinerary(prev => {
          const newItinerary = [];
          for (let i = 0; i < dayCount; i++) {
            const date = addDays(start, i);
            const dateStr = format(date, 'yyyy-MM-dd');
            const existingDay = prev.find(d => d.date === dateStr);
            newItinerary.push(existingDay || {
              id: `day-${i}`,
              date: dateStr,
              items: []
            });
          }
          return newItinerary;
        });
      }
    }
  }, [tripDetails.startDate, tripDetails.endDate]);

  // -- Handlers --

  // const handleAiSuggest = async () => {
  //   if (!aiPrompt.trim()) {
  //     toast({
  //       title: "Please enter a prompt",
  //       description: "Tell the AI what you'd like help with.",
  //       variant: "destructive"
  //     });
  //     return;
  //   }

  //   if (!tripDetails.startDate || !tripDetails.endDate) {
  //     toast({
  //       title: "Dates Required",
  //       description: "Please select start and end dates for your trip first.",
  //       variant: "destructive"
  //     });
  //     return;
  //   }

  //   setIsAiLoading(true);
  //   const userPrompt = aiPrompt;
  //   setAiPrompt(''); // Clear input immediately for better UX

  //   try {
  //     const response = await apiService.aiSuggest(
  //       userPrompt,
  //       tripDetails,
  //       itinerary
  //     );

  //     // Handle different types of AI responses
  //     if (response.suggestions && Array.isArray(response.suggestions)) {
  //       // AI returned specific activity suggestions
  //       const newItinerary = [...itinerary];
        
  //       response.suggestions.forEach(suggestion => {
  //         const dayIndex = suggestion.dayIndex !== undefined 
  //           ? suggestion.dayIndex 
  //           : Math.floor(Math.random() * itinerary.length);
          
  //         if (dayIndex >= 0 && dayIndex < newItinerary.length) {
  //           const newItem = {
  //             id: Date.now() + Math.random(),
  //             type: suggestion.type || 'custom',
  //             name: suggestion.name || suggestion.title || 'AI Suggested Activity',
  //             location: suggestion.location || tripDetails.destination,
  //             coordinates: suggestion.coordinates || null,
  //             image: suggestion.image || null,
  //             estTime: suggestion.estTime || suggestion.duration || '1 hour',
  //             cost: suggestion.cost || 'Varies',
  //             time: suggestion.time || '',
  //             notes: suggestion.notes || suggestion.description || '',
  //             openingHours: suggestion.openingHours || null
  //           };
            
  //           newItinerary[dayIndex].items.push(newItem);
  //         }
  //       });
        
  //       setItinerary(newItinerary);
        
  //       toast({
  //         title: "AI Suggestions Added! ✨",
  //         description: `Added ${response.suggestions.length} suggestion(s) to your itinerary.`,
  //       });
  //     } else if (response.updatedItinerary && Array.isArray(response.updatedItinerary)) {
  //       // AI returned a complete updated itinerary
  //       setItinerary(response.updatedItinerary);
        
  //       toast({
  //         title: "Itinerary Updated! ✨",
  //         description: response.message || "Your itinerary has been optimized by AI.",
  //       });
  //     } else if (response.message) {
  //       // AI returned a message/advice
  //       toast({
  //         title: "AI Response 🤖",
  //         description: response.message,
  //       });
  //     } else {
  //       toast({
  //         title: "AI Response Received",
  //         description: "Check your itinerary for updates.",
  //       });
  //     }
  //   } catch (error) {
  //     console.error('AI Suggestion Error:', error);
  //     toast({
  //       variant: "destructive",
  //       title: "AI Request Failed",
  //       description: error.message || "Could not process your request. Please try again.",
  //     });
  //     // Restore prompt on error
  //     setAiPrompt(userPrompt);
  //   } finally {
  //     setIsAiLoading(false);
  //   }
  // };

  const handleAiSuggest = async () => {
    // Don't parse from prompt if it's empty
    if (!aiPrompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Tell the AI what you'd like help with.",
        variant: "destructive"
      });
      return;
    }

    // Parse the AI prompt to extract destination and dates
    const parsed = parseNaturalLanguageQuerySync(aiPrompt);
    
    // Use parsed values if available, otherwise keep existing form values
    const destination = parsed.destination || tripDetails.destination;
    const startDate = parsed.startDate || tripDetails.startDate;
    const endDate = parsed.endDate || tripDetails.endDate;
    
    // Only update form fields if we actually extracted something from the prompt
    if (parsed.destination || parsed.startDate || parsed.endDate) {
      setTripDetails(prev => ({
        ...prev,
        destination: parsed.destination || prev.destination,
        startDate: parsed.startDate || prev.startDate,
        endDate: parsed.endDate || prev.endDate,
        title: parsed.destination ? `${parsed.destination} Adventure` : prev.title
      }));
    }
    
    // Check if we have all required information
    if (!destination || !startDate || !endDate) {
      toast({
        title: "Missing Information",
        description: "Please provide destination and dates in your prompt (e.g., 'Plan a trip to Paris for 5 days') or fill in the form fields above.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      toast({
        title: "AI is Planning Your Trip! 🤖✨",
        description: "This may take 10-20 seconds...",
      });

      const response = await apiService.generateItinerary({
        destination: destination,
        startDate: startDate,
        endDate: endDate,
        preferences: aiPrompt
      });

      if (response.success && response.itinerary) {
        const generatedDays = response.itinerary.days.map((day, index) => ({
          id: `ai-day-${Date.now()}-${index}`,
          date: day.date,
          items: day.items.map(item => ({
            id: Date.now() + Math.random(),
            ...item
          }))
        }));

        setItinerary(generatedDays);
        
        // Always update destination from AI response to ensure it's properly formatted
        if (response.itinerary.destination) {
          setTripDetails(prev => ({
            ...prev,
            destination: response.itinerary.destination,
            title: `${response.itinerary.destination} Adventure`
          }));
        }
        
        toast({
          title: "Itinerary Generated! 🎉",
          description: `Created ${generatedDays.length}-day plan for ${response.itinerary.destination || destination}`,
        });
      }

    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || "Could not generate itinerary. Please try again.",
      });
    } finally {
      setIsGenerating(false);
      setAiPrompt('');
    }
  };

  const handleSavePlan = async () => {
    if (authLoading) return;

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save your itinerary.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!tripDetails.startDate || !tripDetails.endDate) {
      toast({
        title: "Dates Required",
        description: "Please select start and end dates for your trip.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
        const allActivities = itinerary.flatMap(day => day.items);
        
        const tripData = {
          title: tripDetails.title,
          destination: tripDetails.destination,
          startDate: format(new Date(tripDetails.startDate), 'yyyy-MM-dd'),
          endDate: format(new Date(tripDetails.endDate), 'yyyy-MM-dd'),
          days: itinerary,
          activities: allActivities
        };

        console.log('Attempting to save itinerary:', tripData);

        const response = await apiService.saveItinerary(tripData);

        console.log('Save response:', response);

        if (response.success) {
          toast({
            title: "Plan Saved! 🎉",
            description: "Your trip has been saved to your profile.",
          });
        }

    } catch (error) {
        console.error('Error saving trip:', error);
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: error.message || "Could not save your trip. Please try again."
        });
    } finally {
        setIsSaving(false);
    }
  };

  const handleShareItinerary = async () => {
    if (authLoading) return;

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to share your itinerary.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!tripDetails.startDate || !tripDetails.endDate) {
      toast({
        title: "Dates Required",
        description: "Please complete your trip dates before sharing.",
        variant: "destructive"
      });
      return;
    }

    setIsSharing(true);

    try {
      const shareId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const allActivities = itinerary.flatMap(day => day.items);
      
      const tripData = {
        user_id: user.id,
        title: tripDetails.title,
        destination: tripDetails.destination,
        start_date: format(new Date(tripDetails.startDate), 'yyyy-MM-dd'),
        end_date: format(new Date(tripDetails.endDate), 'yyyy-MM-dd'),
        days: itinerary,
        activities: allActivities,
        share_id: shareId,
        is_public: true,
        shared_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('itineraries')
        .insert([tripData]);

      if (error) throw error;

      const shareUrl = `${window.location.origin}/itinerary/share/${shareId}`;
      await navigator.clipboard.writeText(shareUrl);

      toast({
        title: "Link Copied! 🎉",
        description: "Shareable link has been copied to your clipboard.",
      });

    } catch (error) {
      console.error('Error sharing itinerary:', error);
      toast({
        variant: "destructive",
        title: "Share Failed",
        description: error.message || "Could not create shareable link."
      });
    } finally {
      setIsSharing(false);
    }
  };

  const openAddActivity = (dayIndex) => {
    setSelectedDayIndex(dayIndex);
    setIsAddActivityOpen(true);
    setActivitySearch('');
    setSelectedCategory('All');
  };

  const addActivityToDay = (attraction, dayIndex = selectedDayIndex) => {
    if (dayIndex === null) return;

    const newItem = {
      id: Date.now(),
      type: 'attraction',
      name: attraction.title,
      location: attraction.location,
      coordinates: attraction.coordinates,
      image: attraction.image,
      estTime: attraction.estTime,
      cost: attraction.price,
      openingHours: attraction.openingHours,
      time: '10:00',
      notes: ''
    };

    setItinerary(prev => {
      const newItinerary = [...prev];
      newItinerary[dayIndex].items.push(newItem);
      return newItinerary;
    });

    toast({
      title: "Activity Added! ✨",
      description: `${attraction.title} added to Day ${dayIndex + 1}`
    });
  };

  const addCustomActivity = () => {
     if (selectedDayIndex === null) return;
      const newItem = {
      id: Date.now(),
      type: 'custom',
      name: activitySearch || 'New Activity',
      location: tripDetails.destination,
      estTime: '1 hour',
      cost: 'Varies',
      time: '12:00',
      notes: ''
    };
    
    setItinerary(prev => {
      const newItinerary = [...prev];
      newItinerary[selectedDayIndex].items.push(newItem);
      return newItinerary;
    });
    
    setIsAddActivityOpen(false);
    toast({ title: "Custom Activity Added" });
  };
  
  const addBreak = (dayIndex) => {
      const newItem = {
          id: Date.now(),
          type: 'break',
          name: 'Coffee Break / Travel',
          estTime: '30m',
          time: '',
      };
      
       setItinerary(prev => {
        const newItinerary = [...prev];
        newItinerary[dayIndex].items.push(newItem);
        return newItinerary;
      });
  };

  const removeActivity = (dayIndex, itemId) => {
    setItinerary(prev => {
      const newItinerary = [...prev];
      newItinerary[dayIndex].items = newItinerary[dayIndex].items.filter(i => i.id !== itemId);
      return newItinerary;
    });
  };

  // -- Edit Activity Functions --
  const openEditActivity = (item, dayIndex) => {
    setEditingActivity(item);
    setEditingDayIndex(dayIndex);
    setEditForm({
      name: item.name || '',
      location: item.location || tripDetails.destination,
      time: item.time || '',
      estTime: item.estTime || '',
      cost: item.cost || '',
      notes: item.notes || ''
    });
    setIsEditActivityOpen(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const saveEditedActivity = () => {
    if (!editingActivity || editingDayIndex === null) return;

    setItinerary(prev => {
      const newItinerary = [...prev];
      const itemIndex = newItinerary[editingDayIndex].items.findIndex(i => i.id === editingActivity.id);
      
      if (itemIndex !== -1) {
        newItinerary[editingDayIndex].items[itemIndex] = {
          ...newItinerary[editingDayIndex].items[itemIndex],
          name: editForm.name,
          location: editForm.location,
          time: editForm.time,
          estTime: editForm.estTime,
          cost: editForm.cost,
          notes: editForm.notes
        };
      }
      
      return newItinerary;
    });

    setIsEditActivityOpen(false);
    setEditingActivity(null);
    setEditingDayIndex(null);
    
    toast({
      title: "Activity Updated! ✓",
      description: "Your changes have been saved.",
    });
  };

  // -- Drag Handlers --

  // Internal Reorder (within same list)
  const handleReorder = (dayIndex, newOrder) => {
    setItinerary(prev => {
      const newItinerary = [...prev];
      newItinerary[dayIndex].items = newOrder;
      return newItinerary;
    });
  };

  // Suggestion Dragging
  const handleAttractionDragStart = (attraction) => {
    setDraggedAttraction(attraction);
    setDraggedActivity(null);
  };

  const handleAttractionDragEnd = () => {
    setDraggedAttraction(null);
    setDropTargetDay(null);
  };

  // Activity Cross-Day Dragging (HTML5)
  const handleActivityDragStart = (e, item, sourceDayIndex) => {
    // Set data for drop
    setDraggedActivity({ item, sourceDayIndex });
    setDraggedAttraction(null);
    
    // Create drag image if needed, or default is fine
    // Note: Reorder component handles its own drag for sorting, so we attach this to a specific handle or the card itself
    // if we want cross-list.
  };

  const handleDayDragOver = (e, dayIndex) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent bubbling issues
    if (draggedAttraction || (draggedActivity && draggedActivity.sourceDayIndex !== dayIndex)) {
        setDropTargetDay(dayIndex);
    }
  };

  const handleDayDrop = (dayIndex) => {
    // Case 1: Dragging from Suggestions
    if (draggedAttraction) {
      addActivityToDay(draggedAttraction, dayIndex);
      setDraggedAttraction(null);
      setDropTargetDay(null);
      return;
    }

    // Case 2: Dragging Activity between Days
    if (draggedActivity) {
      const { item, sourceDayIndex } = draggedActivity;
      
      if (sourceDayIndex !== dayIndex) {
        setItinerary(prev => {
          const newItinerary = [...prev];
          // Remove from source
          newItinerary[sourceDayIndex].items = newItinerary[sourceDayIndex].items.filter(i => i.id !== item.id);
          // Add to target
          newItinerary[dayIndex].items = [...newItinerary[dayIndex].items, item];
          return newItinerary;
        });
        toast({
            title: "Activity Moved 🔄",
            description: `Moved "${item.name}" to Day ${dayIndex + 1}`
        });
      }
      setDraggedActivity(null);
      setDropTargetDay(null);
    }
  };

  // Filter attractions for the modal
  const filteredAttractions = attractions.filter(a => {
    const matchesCity = a.location === tripDetails.destination;
    const matchesSearch = a.title.toLowerCase().includes(activitySearch.toLowerCase()) || 
                          a.tags.some(t => t.toLowerCase().includes(activitySearch.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || a.tags.some(t => t === selectedCategory);
    return matchesCity && matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Plan Your {tripDetails.destination} Trip - Orbito</title>
      </Helmet>

      <div className="min-h-screen bg-[#F8F9FC] pb-20 font-sans">
        
        {/* Sticky Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 px-4 lg:px-8 py-3 shadow-sm">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
              <div className="flex-1 sm:flex-none">
                 <h1 className="text-lg font-bold text-[#0B3D91] truncate leading-tight">{tripDetails.title}</h1>
                 <p className="text-xs text-gray-500 font-medium">{tripDetails.destination} • {itinerary.length} Days</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 sm:flex-none text-gray-600"
                  onClick={() => setIsPrintViewOpen(true)}
                  disabled={itinerary.length === 0}
                >
                    <Printer className="w-4 h-4 mr-2" /> Print
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 sm:flex-none text-gray-600"
                  onClick={handleShareItinerary}
                  disabled={isSharing || itinerary.length === 0}
                >
                    {isSharing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Link2 className="w-4 h-4 mr-2" />}
                    Share
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 sm:flex-none bg-[#0B3D91] hover:bg-[#092C6B] text-white shadow-md"
                  onClick={handleSavePlan}
                  disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {isSaving ? 'Saving...' : 'Save'}
                </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-6 space-y-6">
            
            {/* AI Assistant Section */}
            <div className="bg-gradient-to-r from-[#0B3D91] to-[#1E5BA8] rounded-2xl p-6 shadow-lg text-white">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                        <Sparkles className="w-6 h-6 text-yellow-300" />
                    </div>
                    <div className="flex-1">
                        <h2 className="font-bold text-lg mb-1">Orbito AI Assistant</h2>
                        <p className="text-blue-100 text-sm mb-4">Need inspiration? Ask me to "Add a romantic dinner on Day 2" or "Optimize my route".</p>
                        <div className="flex gap-3">
                            <Input 
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAiSuggest()}
                                placeholder="Tell AI what to help you with..." 
                                className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20 text-base h-12"
                            />
                            <Button 
                                onClick={handleAiSuggest} 
                                disabled={isGenerating}
                                className="bg-white text-[#0B3D91] hover:bg-blue-50 font-bold px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Ask AI
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                
                {/* Left Column: Details & Itinerary */}
                <div className="lg:col-span-7 space-y-6">
                    
                    {/* Trip Details Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-[#0B3D91] flex items-center justify-center text-xs">1</span>
                            Trip Details
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Destination City</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input 
                                        value={tripDetails.destination} 
                                        onChange={(e) => setTripDetails({...tripDetails, destination: e.target.value})}
                                        placeholder="Enter any city (e.g., Rishikesh, Ladakh, Tokyo...)"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Trip Title</Label>
                                <Input 
                                    value={tripDetails.title}
                                    onChange={(e) => setTripDetails({...tripDetails, title: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !tripDetails.startDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {tripDetails.startDate ? format(new Date(tripDetails.startDate), "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white z-[9999]" align="start">
                                        <Calendar mode="single" selected={tripDetails.startDate} onSelect={(d) => setTripDetails({...tripDetails, startDate: d})} initialFocus className="bg-white" />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !tripDetails.endDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {tripDetails.endDate ? format(new Date(tripDetails.endDate), "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white z-[9999]" align="start">
                                        <Calendar mode="single" selected={tripDetails.endDate} onSelect={(d) => setTripDetails({...tripDetails, endDate: d})} initialFocus className="bg-white" />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        
                        {/* Generate Itinerary Button */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <Button 
                                onClick={handleAiSuggest}
                                disabled={!tripDetails.destination || !tripDetails.startDate || !tripDetails.endDate || isGenerating}
                                className="w-full bg-[#0B3D91] hover:bg-[#092C6B] text-white font-bold py-6 text-base shadow-md hover:shadow-lg transition-all"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Generating Your Itinerary...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Generate AI Itinerary
                                    </>
                                )}
                            </Button>
                            {(!tripDetails.destination || !tripDetails.startDate || !tripDetails.endDate) && (
                                <p className="text-xs text-gray-500 text-center mt-2">
                                    Please fill in destination and dates to generate itinerary
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Itinerary Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm min-h-[500px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-[#0B3D91] flex items-center justify-center text-xs">2</span>
                                Itinerary
                            </h3>
                            {itinerary.length > 0 && (
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{itinerary.length} Days Planned</span>
                            )}
                        </div>

                        {itinerary.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No dates selected yet.</p>
                                <p className="text-sm text-gray-400">Pick your start and end dates above to begin planning.</p>
                            </div>
                        ) : (
                            <div className="space-y-8 relative">
                                {itinerary.map((day, dayIndex) => (
                                    <div 
                                      key={day.id} 
                                      className={cn(
                                        "relative pl-8 border-l-2 border-blue-100 last:border-transparent pb-8 last:pb-0 transition-all rounded-lg",
                                        dropTargetDay === dayIndex && "border-[#0B3D91] border-l-4 bg-blue-50/50"
                                      )}
                                      onDragOver={(e) => handleDayDragOver(e, dayIndex)}
                                      onDrop={() => handleDayDrop(dayIndex)}
                                      onDragLeave={() => setDropTargetDay(null)}
                                    >
                                        <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-[#0B3D91] border-4 border-white shadow-sm z-10"></div>
                                        
                                        <div className="flex items-baseline justify-between mb-4">
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-900">Day {dayIndex + 1}</h4>
                                                <p className="text-sm text-gray-500">{format(new Date(day.date), 'EEEE, MMMM do')}</p>
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="h-8 text-[#0B3D91] border-blue-200 hover:bg-blue-50"
                                                onClick={() => openAddActivity(dayIndex)}
                                            >
                                                <Plus className="w-3 h-3 mr-1.5" /> Add Activity
                                            </Button>
                                        </div>

                                        {/* Drop Zone Indicator */}
                                        {dropTargetDay === dayIndex && (draggedAttraction || draggedActivity) && (
                                          <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mb-4 p-6 border-2 border-dashed border-[#0B3D91] bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl text-center shadow-inner"
                                          >
                                            <div className="flex items-center justify-center gap-2 text-[#0B3D91] font-bold text-sm">
                                              <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                              >
                                                ↓
                                              </motion.div>
                                              Drop here to add {draggedAttraction ? `"${draggedAttraction.title}"` : 'activity'} to Day {dayIndex + 1}
                                              <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                              >
                                                ↓
                                              </motion.div>
                                            </div>
                                          </motion.div>
                                        )}

                                        {/* Day Activities with Reorder */}
                                        <Reorder.Group 
                                          axis="y" 
                                          values={day.items} 
                                          onReorder={(newOrder) => handleReorder(dayIndex, newOrder)}
                                          className="space-y-3"
                                        >
                                            {day.items.length === 0 ? (
                                                 <div className="p-4 rounded-lg bg-gray-50 border border-dashed border-gray-200 text-center">
                                                    <p className="text-xs text-gray-400 italic">No activities planned for this day.</p>
                                                    <Button variant="link" size="sm" onClick={() => openAddActivity(dayIndex)} className="text-[#0B3D91] h-auto p-0 text-xs">Browse attractions</Button>
                                                 </div>
                                            ) : (
                                                day.items.map((item) => (
                                                    <Reorder.Item 
                                                      key={item.id} 
                                                      value={item}
                                                      className={cn(
                                                        "group relative flex items-start gap-3 p-4 rounded-xl border transition-all hover:shadow-lg bg-white",
                                                        item.type === 'break' ? 'bg-orange-50/50 border-orange-200' : 'border-gray-200 hover:border-[#0B3D91]/30'
                                                      )}
                                                      whileDrag={{ 
                                                        scale: 1.05, 
                                                        opacity: 0.9, 
                                                        zIndex: 100,
                                                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                                        rotate: 2
                                                      }}
                                                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                    >
                                                        {/* Reorder Grip Handle */}
                                                        <div className="flex-shrink-0 pt-1 touch-none cursor-grab active:cursor-grabbing">
                                                          <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-[#0B3D91] transition-colors" />
                                                        </div>

                                                        {/* Draggable Wrapper for Cross-Day Move (HTML5 Drag) */}
                                                        <div 
                                                          className="flex-1 flex gap-3 min-w-0" 
                                                          draggable="true"
                                                          onDragStart={(e) => {
                                                            handleActivityDragStart(e, item, dayIndex);
                                                            e.currentTarget.style.opacity = '0.5';
                                                          }}
                                                          onDragEnd={(e) => {
                                                            e.currentTarget.style.opacity = '1';
                                                          }}
                                                        >
                                                            {item.image && item.type !== 'break' ? (
                                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0 ring-2 ring-gray-100 group-hover:ring-[#0B3D91]/20 transition-all">
                                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                                </div>
                                                            ) : (
                                                                <div className={cn(
                                                                  "w-16 h-16 rounded-lg flex items-center justify-center shrink-0 transition-all",
                                                                  item.type === 'break' 
                                                                    ? 'bg-orange-100 text-orange-600 group-hover:bg-orange-200' 
                                                                    : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                                                                )}>
                                                                    {item.type === 'break' ? <Coffee className="w-6 h-6"/> : <MapPin className="w-6 h-6"/>}
                                                                </div>
                                                            )}
                                                            
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start">
                                                                    <h5 className="font-bold text-gray-900 truncate pr-2 group-hover:text-[#0B3D91] transition-colors">{item.name}</h5>
                                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <Button 
                                                                          size="icon" 
                                                                          variant="ghost" 
                                                                          className="h-7 w-7 text-blue-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg" 
                                                                          onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            openEditActivity(item, dayIndex);
                                                                          }}
                                                                        >
                                                                            <Edit className="w-3.5 h-3.5" />
                                                                        </Button>
                                                                        <Button 
                                                                          size="icon" 
                                                                          variant="ghost" 
                                                                          className="h-7 w-7 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg" 
                                                                          onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            removeActivity(dayIndex, item.id);
                                                                          }}
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
                                                                    {item.time && (
                                                                        <div className="flex items-center gap-1 bg-[#0B3D91]/10 px-2 py-1 rounded-md text-[#0B3D91] font-medium">
                                                                            <Clock className="w-3 h-3" /> {item.time}
                                                                        </div>
                                                                    )}
                                                                    {item.estTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {item.estTime}</span>}
                                                                    {item.cost && <span className="flex items-center gap-0.5 font-medium"><DollarSign className="w-3 h-3"/> {item.cost}</span>}
                                                                </div>
                                                                {item.location && item.location !== tripDetails.destination && (
                                                                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                                    <MapPin className="w-3 h-3"/> {item.location}
                                                                  </p>
                                                                )}
                                                                {item.openingHours && <p className="text-xs text-gray-400 mt-1">Open: {item.openingHours}</p>}
                                                            </div>
                                                        </div>
                                                    </Reorder.Item>
                                                ))
                                            )}
                                        </Reorder.Group>
                                        
                                        <div className="flex justify-center pt-2">
                                            <Button variant="ghost" size="sm" onClick={() => addBreak(dayIndex)} className="text-xs text-gray-400 hover:text-gray-600 h-6">
                                                <Plus className="w-3 h-3 mr-1" /> Add Break / Travel
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Map & Suggestions */}
                <div className="lg:col-span-5 space-y-6 sticky top-24 h-fit">
                    
                    {/* Itinerary Map */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-80 relative z-0">
                        <MapView destination={tripDetails.destination} activities={itinerary} />
                        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-lg border border-white/50 shadow-sm text-xs text-gray-600 z-[1000]">
                            Showing {itinerary.reduce((acc, day) => acc + day.items.length, 0)} activities in {tripDetails.destination}
                        </div>
                    </div>

                    {/* Suggestions Section - Draggable */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">Recommended for You</h3>
                            <Button size="sm" variant="ghost" onClick={handleAiSuggest} className="text-[#0B3D91] hover:bg-blue-50 text-xs">
                                <Sparkles className="w-3 h-3 mr-1" /> Refresh
                            </Button>
                        </div>
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-3">
                                {attractions.filter(a => a.location === tripDetails.destination).length > 0 ? (
                                    attractions.filter(a => a.location === tripDetails.destination).map(suggestion => (
                                        <motion.div 
                                          key={suggestion.id} 
                                          className="flex gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all cursor-grab active:cursor-grabbing border-2 border-transparent hover:border-[#0B3D91]/20 hover:shadow-md group"
                                          draggable
                                          onDragStart={(e) => {
                                            handleAttractionDragStart(suggestion);
                                            e.currentTarget.style.opacity = '0.5';
                                          }}
                                          onDragEnd={(e) => {
                                            handleAttractionDragEnd();
                                            e.currentTarget.style.opacity = '1';
                                          }}
                                          whileHover={{ scale: 1.02, x: 4 }}
                                          whileTap={{ scale: 0.98 }}
                                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        >
                                            <GripVertical className="w-5 h-5 text-gray-300 self-center opacity-0 group-hover:opacity-100 group-hover:text-[#0B3D91] transition-all" />
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0 ring-2 ring-gray-100 group-hover:ring-[#0B3D91]/30 transition-all">
                                                <img src={suggestion.image} alt={suggestion.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-gray-900 truncate group-hover:text-[#0B3D91] transition-colors">{suggestion.title}</h4>
                                                <div className="flex gap-2 text-xs text-gray-500 mt-1">
                                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-medium">{suggestion.tags[0]}</span>
                                                    <span className="flex items-center gap-0.5 font-medium"><DollarSign className="w-3 h-3"/> {suggestion.price}</span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                  Drag to any day to add
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 text-sm py-8">
                                        No recommendations found for {tripDetails.destination} yet.
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>

        {/* Add Activity Dialog */}
        <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
            <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2 border-b border-gray-100">
                    <DialogTitle>Add Activity to Day {selectedDayIndex !== null ? selectedDayIndex + 1 : ''}</DialogTitle>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <div className="relative flex-1">
                            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <Input 
                                placeholder="Search attractions..." 
                                className="pl-9" 
                                value={activitySearch}
                                onChange={(e) => setActivitySearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                           <Button 
                                variant={selectedCategory === 'All' ? 'default' : 'outline'} 
                                size="sm" 
                                onClick={() => setSelectedCategory('All')}
                                className={selectedCategory === 'All' ? 'bg-[#0B3D91]' : ''}
                            >
                                All
                           </Button>
                           {['Landmark', 'Museum', 'History', 'Food'].map(cat => (
                               <Button 
                                    key={cat}
                                    variant={selectedCategory === cat ? 'default' : 'outline'} 
                                    size="sm" 
                                    onClick={() => setSelectedCategory(cat)}
                                    className={selectedCategory === cat ? 'bg-[#0B3D91]' : ''}
                               >
                                    {cat}
                               </Button>
                           ))}
                        </div>
                    </div>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div 
                            className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#0B3D91] hover:bg-blue-50 transition-all min-h-[200px]"
                            onClick={addCustomActivity}
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#0B3D91] mb-3">
                                <Plus className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-gray-900">Custom Activity</h4>
                            <p className="text-sm text-gray-500 mt-1">Add your own restaurant, reservation, or unique stop.</p>
                        </div>

                        {filteredAttractions.map(attraction => (
                            <div key={attraction.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col">
                                <div className="h-32 bg-gray-200 relative">
                                    <img src={attraction.image} alt={attraction.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded text-xs font-bold text-gray-800">
                                        {attraction.rating} ★
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-900 text-sm line-clamp-2">{attraction.title}</h4>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{attraction.description}</p>
                                    
                                    <div className="mt-auto space-y-2">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Clock className="w-3 h-3" /> {attraction.estTime}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <DollarSign className="w-3 h-3" /> {attraction.price}
                                        </div>
                                        <Button 
                                            className="w-full mt-3 bg-[#0B3D91] hover:bg-[#092C6B] text-white h-8 text-xs"
                                            onClick={() => addActivityToDay(attraction)}
                                        >
                                            Add to Itinerary
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        {/* Edit Activity Dialog */}
        <Dialog open={isEditActivityOpen} onOpenChange={setIsEditActivityOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Activity</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Activity Name</Label>
                        <Input 
                            value={editForm.name}
                            onChange={(e) => handleEditFormChange('name', e.target.value)}
                            placeholder="e.g., Visit Eiffel Tower"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Location</Label>
                        <Input 
                            value={editForm.location}
                            onChange={(e) => handleEditFormChange('location', e.target.value)}
                            placeholder="e.g., Paris"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Input 
                                type="time"
                                value={editForm.time}
                                onChange={(e) => handleEditFormChange('time', e.target.value)}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input 
                                value={editForm.estTime}
                                onChange={(e) => handleEditFormChange('estTime', e.target.value)}
                                placeholder="e.g., 2 hours"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Cost</Label>
                        <Input 
                            value={editForm.cost}
                            onChange={(e) => handleEditFormChange('cost', e.target.value)}
                            placeholder="e.g., $25 or Free"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Input 
                            value={editForm.notes}
                            onChange={(e) => handleEditFormChange('notes', e.target.value)}
                            placeholder="Add any additional notes..."
                        />
                    </div>
                </div>
                
                <div className="flex justify-end gap-3">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsEditActivityOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button 
                        className="bg-[#0B3D91] hover:bg-[#092C6B] text-white"
                        onClick={saveEditedActivity}
                    >
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        {/* Print View Modal */}
        <ItineraryPrintView 
          isOpen={isPrintViewOpen}
          onClose={() => setIsPrintViewOpen(false)}
          itinerary={itinerary}
          tripDetails={tripDetails}
        />
      </div>
    </>
  );
};

export default PlanTourPage;
