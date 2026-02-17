const { supabase } = require('../config/supabase');

async function saveItinerary({ userId, title, destination, startDate, endDate, days, activities }) {
  if (!supabase) {
    throw new Error('Supabase is not initialized. Check SUPABASE_URL and SUPABASE_ANON_KEY.');
  }

  // Use RPC call to bypass schema cache issue
  // This directly calls a PostgreSQL function
  try {
    const { data, error } = await supabase.rpc('insert_itinerary', {
      p_user_id: userId,
      p_title: title,
      p_destination: destination,
      p_start_date: startDate,
      p_end_date: endDate,
      p_days: days,
      p_activities: activities || []
    });

    if (error) throw error;
    return { data, error: null };
  } catch (rpcError) {
    // Fallback to regular insert without activities if RPC doesn't exist
    console.log('RPC not available, using regular insert without activities');
    
    const itineraryData = {
      user_id: userId,
      title,
      destination,
      start_date: startDate,
      end_date: endDate,
      days,
    };

    const { data, error } = await supabase
      .from('itineraries')
      .insert([itineraryData])
      .select();

    return { data, error };
  }
}

async function getItinerariesByUser(userId) {
  if (!supabase) {
    throw new Error('Supabase is not initialized. Check SUPABASE_URL and SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

module.exports = {
  saveItinerary,
  getItinerariesByUser,
};
