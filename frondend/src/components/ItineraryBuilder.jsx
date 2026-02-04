import React from 'react';
import { Reorder } from 'framer-motion';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Trash2, Sparkles, GripVertical, FileUp, Bookmark, Search, TramFront, Car, BugPlay as Walk, DollarSign, StickyNote, Wallet, CalendarDays, ClipboardList } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ItineraryBuilder = ({ itinerary, setItinerary }) => {
  const { toast } = useToast();

  const addActivity = () => {
    setItinerary(prev => ({
      ...prev,
      activities: [...(prev.activities || []), { id: Date.now(), name: '', time: '', location: '', cost: '', notes: '' }]
    }));
  };

  const removeActivity = (id) => {
    setItinerary(prev => ({
      ...prev,
      activities: prev.activities.filter((activity) => activity.id !== id)
    }));
  };

  const updateActivity = (id, field, value) => {
    setItinerary(prev => ({
      ...prev,
      activities: prev.activities.map(activity =>
        activity.id === id ? { ...activity, [field]: value } : activity
      )
    }));
  };
  
  const handleReorder = (newOrder) => {
    setItinerary(prev => ({ ...prev, activities: newOrder }));
  };

  const handleItineraryChange = (field, value) => {
    setItinerary(prev => ({...prev, [field]: value}));
  };

  const handleToastFeature = (title) => {
    toast({
      title: "🚧 Feature Coming Soon",
      description: `${title} is currently under development.`
    });
  };

  const totalCost = itinerary.activities?.reduce((acc, activity) => acc + Number(activity.cost || 0), 0) || 0;

  // Orbito Dark Blue Theme Colors (#0B3D91)
  const themeColors = {
    bgLight: 'bg-[#F0F4FA]',   // Very light blue background for sections/badges
    bgHover: 'bg-[#E1EAF8]',   // Hover state for light backgrounds
    primary: 'bg-[#0B3D91]',   // Main buttons, active states
    primaryHover: 'bg-[#092C6B]', // Hover for main buttons
    text: 'text-[#0B3D91]',    // Headings, icons, strong text
    textSecondary: 'text-[#1E5BA8]', // Less emphasized blue text
    border: 'border-[#E1EAF8]', // Light blue borders
    ring: 'focus:ring-[#0B3D91]'      // Focus rings
  };

  return (
    <div className="space-y-8">
      {/* Trip Details Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 relative z-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className={`w-8 h-8 rounded-lg ${themeColors.bgLight} ${themeColors.text} flex items-center justify-center text-sm`}>01</span>
            Trip Details
        </h2>

        <div className="space-y-6">
            <div className="relative">
                <Label className="text-gray-700 font-semibold mb-2 block ml-1">Where are you going?</Label>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search for attractions, restaurants, landmarks..."
                        className={`pl-12 h-14 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 ${themeColors.ring} rounded-xl text-lg transition-all`}
                        onChange={() => handleToastFeature("Search")}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="title" className="text-gray-700 font-semibold mb-2 block ml-1">Trip Title</Label>
                <Input
                    id="title"
                    value={itinerary.title}
                    onChange={(e) => handleItineraryChange('title', e.target.value)}
                    placeholder="e.g., My London Adventure"
                    className={`h-12 border-gray-200 bg-white rounded-xl focus:ring-2 ${themeColors.ring}`}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label className="text-gray-700 font-semibold mb-2 block ml-1">Start Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal h-12 rounded-xl border-gray-200 hover:bg-gray-50", !itinerary.startDate && "text-muted-foreground")}>
                                <CalendarDays className={`mr-2 h-5 w-5 ${themeColors.text}`} />
                                {itinerary.startDate ? format(new Date(itinerary.startDate), "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        {/* Key Fix: Explicit bg-white and high z-index */}
                        <PopoverContent className="w-auto p-0 bg-white shadow-2xl border border-gray-100 z-[9999] rounded-xl" align="start">
                            <Calendar 
                                mode="single" 
                                selected={itinerary.startDate ? new Date(itinerary.startDate) : undefined} 
                                onSelect={(date) => handleItineraryChange('startDate', date?.toISOString().split('T')[0])} 
                                initialFocus 
                                className="p-3 bg-white rounded-xl"
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <Label className="text-gray-700 font-semibold mb-2 block ml-1">End Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal h-12 rounded-xl border-gray-200 hover:bg-gray-50", !itinerary.endDate && "text-muted-foreground")}>
                                <CalendarDays className={`mr-2 h-5 w-5 ${themeColors.text}`} />
                                {itinerary.endDate ? format(new Date(itinerary.endDate), "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        {/* Key Fix: Explicit bg-white and high z-index */}
                        <PopoverContent className="w-auto p-0 bg-white shadow-2xl border border-gray-100 z-[9999] rounded-xl" align="start">
                            <Calendar 
                                mode="single" 
                                selected={itinerary.endDate ? new Date(itinerary.endDate) : undefined} 
                                onSelect={(date) => handleItineraryChange('endDate', date?.toISOString().split('T')[0])} 
                                initialFocus 
                                className="p-3 bg-white rounded-xl"
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 pb-6">
             <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className={`w-8 h-8 rounded-lg ${themeColors.bgLight} ${themeColors.text} flex items-center justify-center text-sm`}>02</span>
                Activities
            </h2>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button onClick={() => handleToastFeature("AI Suggestion")} variant="outline" className={`flex-1 sm:flex-none border-[#D6E4F5] ${themeColors.text} hover:${themeColors.bgLight} rounded-xl h-10`}>
                <Sparkles className="w-4 h-4 mr-2" />
                AI Suggest
              </Button>
              <Button onClick={addActivity} className={`flex-1 sm:flex-none ${themeColors.primary} hover:${themeColors.primaryHover} text-white rounded-xl h-10 shadow-sm`}>
                <Plus className="w-4 h-4 mr-2" /> Add Activity
              </Button>
            </div>
          </div>
          
          <Reorder.Group axis="y" values={itinerary.activities || []} onReorder={handleReorder} className="space-y-4">
            {(itinerary.activities || []).length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                        <ClipboardList className="w-6 h-6"/>
                    </div>
                    <p className="text-gray-500 font-medium">No activities yet.</p>
                    <p className="text-sm text-gray-400 mb-4">Start adding places to visit or let AI suggest some!</p>
                    <Button onClick={addActivity} variant="link" className={`${themeColors.text}`}>Add your first activity</Button>
                </div>
            )}
            
            {(itinerary.activities || []).map((activity, index) => (
              <Reorder.Item key={activity.id} value={activity} className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                <div className="p-5 pl-2 flex gap-3">
                  <div className="flex flex-col items-center pt-2 cursor-grab active:cursor-grabbing touch-none">
                    <GripVertical className="w-5 h-5 text-gray-300 hover:text-gray-500 transition-colors" />
                    <div className={`w-6 h-6 rounded-full ${themeColors.bgLight} ${themeColors.text} text-xs font-bold flex items-center justify-center mt-3 border border-blue-100`}>
                        {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4 min-w-0">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Label className="sr-only">Activity Name</Label>
                            <Input 
                                value={activity.name} 
                                onChange={(e) => updateActivity(activity.id, 'name', e.target.value)} 
                                placeholder="What are you doing?" 
                                className={`h-11 font-semibold text-lg border-transparent hover:border-gray-200 focus:border-gray-300 ${themeColors.ring} bg-transparent hover:bg-gray-50 focus:bg-white px-0 focus:px-3 transition-all rounded-lg`} 
                            />
                        </div>
                        <div className="flex items-center gap-2 md:w-48">
                             <Input 
                                type="time" 
                                value={activity.time} 
                                onChange={(e) => updateActivity(activity.id, 'time', e.target.value)} 
                                className={`h-10 bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 focus:border-gray-300 ${themeColors.ring} rounded-lg text-sm`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-xs uppercase font-bold">Loc</span>
                             </div>
                             <Input 
                                value={activity.location} 
                                onChange={(e) => updateActivity(activity.id, 'location', e.target.value)} 
                                placeholder="Add location" 
                                className={`pl-12 h-10 bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 focus:border-gray-300 ${themeColors.ring} rounded-lg text-sm`}
                             />
                        </div>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 flex items-center justify-center font-bold">£</span>
                           <Input 
                                type="number" 
                                value={activity.cost} 
                                onChange={(e) => updateActivity(activity.id, 'cost', e.target.value)} 
                                placeholder="0.00" 
                                className={`pl-9 h-10 bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 focus:border-gray-300 ${themeColors.ring} rounded-lg text-sm`}
                           />
                        </div>
                    </div>
                    
                    <Textarea 
                        value={activity.notes} 
                        onChange={(e) => updateActivity(activity.id, 'notes', e.target.value)} 
                        placeholder="Add notes, booking numbers, or details..." 
                        className={`min-h-[60px] bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 focus:border-gray-300 ${themeColors.ring} rounded-lg text-sm resize-none`}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1 pt-1">
                      <Button variant="ghost" size="icon" onClick={() => removeActivity(activity.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleToastFeature("Bookmark")} className={`text-gray-400 hover:${themeColors.text} hover:${themeColors.bgLight} rounded-lg h-8 w-8`}>
                        <Bookmark className="w-4 h-4" />
                      </Button>
                  </div>
                </div>
                
                {/* Connector Line */}
                {index < (itinerary.activities || []).length - 1 && (
                    <div className="absolute left-[21px] bottom-0 w-[2px] h-6 bg-gray-200 -mb-6 z-0"></div>
                )}

                 {/* Travel Time Indicator */}
                {index < (itinerary.activities || []).length - 1 && (
                  <div className="flex justify-center pb-2 pt-1">
                    <div className="bg-gray-50 border border-gray-100 px-3 py-1 rounded-full flex items-center gap-4 text-xs text-gray-500 shadow-sm">
                        <div className={`flex items-center gap-1.5 cursor-pointer hover:${themeColors.text} transition-colors`} onClick={() => handleToastFeature("Transport routes")}><Car size={12}/> 15m</div>
                        <div className="w-px h-3 bg-gray-300"></div>
                        <div className={`flex items-center gap-1.5 cursor-pointer hover:${themeColors.text} transition-colors`} onClick={() => handleToastFeature("Transport routes")}><TramFront size={12}/> 25m</div>
                        <div className="w-px h-3 bg-gray-300"></div>
                        <div className={`flex items-center gap-1.5 cursor-pointer hover:${themeColors.text} transition-colors`} onClick={() => handleToastFeature("Transport routes")}><Walk size={12}/> 45m</div>
                    </div>
                  </div>
                )}
              </Reorder.Item>
            ))}
          </Reorder.Group>
      </div>

      {/* Notes Section */}
       <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 mb-4">
              <StickyNote className={`${themeColors.text}`}/> General Notes
          </h2>
          <Textarea 
            value={itinerary.generalNotes || ''} 
            onChange={e => handleItineraryChange('generalNotes', e.target.value)} 
            placeholder="Packing lists, important contacts, general thoughts..." 
            className={`min-h-[150px] bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 ${themeColors.ring} rounded-xl p-4 text-base leading-relaxed`}
          />
       </div>

      {/* Footer Management Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 bg-gradient-to-br from-[${themeColors.bgLight}] to-[#E6EEF8] rounded-2xl border border-[#E1EAF8] flex justify-between items-center`}>
            <div>
                <p className={`text-sm font-bold text-[#1E5BA8] uppercase tracking-wide mb-1`}>Total Estimated Cost</p>
                <span className={`text-3xl font-extrabold ${themeColors.text}`}>{totalCost.toFixed(2)}€</span>
            </div>
            <div className={`h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm ${themeColors.text}`}>
                <Wallet className="w-6 h-6"/>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button onClick={() => handleToastFeature("File Upload")} variant="outline" className="w-full h-14 justify-start text-gray-700 hover:bg-gray-50 border-gray-200 rounded-xl">
                <FileUp className="w-5 h-5 mr-3 text-gray-400" />
                <span className="font-medium">Upload Files & Documents</span>
            </Button>
             <Button onClick={() => handleToastFeature("Export to PDF")} variant="outline" className="w-full h-14 justify-start text-gray-700 hover:bg-gray-50 border-gray-200 rounded-xl">
                <FileUp className="w-5 h-5 mr-3 text-gray-400" />
                <span className="font-medium">Export as PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ItineraryBuilder);