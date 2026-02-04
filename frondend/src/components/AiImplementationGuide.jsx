import React from 'react';
import { Lightbulb, Route, Database } from 'lucide-react';

const AiImplementationGuide = () => {
    return (
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-6">
            <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Ready to Power Up with AI?</h2>
            <p className="text-center text-white/70">Here's a quick guide on how to integrate real AI features into your planner!</p>
            
            <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 rounded-lg flex items-center justify-center">
                            <Lightbulb className="w-5 h-5 text-purple-300" />
                        </div>
                        <h3 className="text-lg font-semibold">AI Itinerary Generation</h3>
                    </div>
                    <p className="text-sm text-white/60">To build itineraries automatically, we'll need a backend service. <span className="font-bold text-white/80">Supabase Edge Functions</span> are a perfect fit!</p>
                    <ul className="text-sm text-white/60 list-disc pl-5 space-y-1">
                        <li>The user enters a prompt (e.g., "3 days in London for a history buff").</li>
                        <li>The app sends this prompt to a Supabase Edge Function.</li>
                        <li>The function securely calls an AI provider's API (like OpenAI's GPT or Google's Gemini).</li>
                        <li>The AI returns a structured JSON itinerary, which we then display in the UI.</li>
                    </ul>
                </div>

                <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-lg flex items-center justify-center">
                            <Route className="w-5 h-5 text-blue-300" />
                        </div>
                        <h3 className="text-lg font-semibold">Directions & Travel Time</h3>
                    </div>
                    <p className="text-sm text-white/60">For directions, we can use a mapping service API. <span className="font-bold text-white/80">Mapbox</span> or <span className="font-bold text-white/80">Google Maps Platform</span> are great choices.</p>
                     <ul className="text-sm text-white/60 list-disc pl-5 space-y-1">
                        <li>When activities are added, get their geographic coordinates (geocoding).</li>
                        <li>Use the Directions API to request routes (walking, transit, driving) between two points.</li>
                        <li>The API returns travel times, distances, and even route lines to draw on the map.</li>
                    </ul>
                </div>
            </div>
            
            <div className="text-center pt-4">
                <p className="font-semibold text-white/90">Ready to start? Just say the word!</p>
                <p className="text-sm text-white/60">Let me know which feature you'd like to tackle first, and I'll get right on it!</p>
            </div>
        </div>
    );
};

export default AiImplementationGuide;