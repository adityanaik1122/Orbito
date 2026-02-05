const { supabase } = require('../config/supabase');

async function saveItinerary({ userId, title, destination, startDate, endDate, days, activities }) {
  if (!supabase) {
    throw new Error('Supabase is not initialized. Check SUPABASE_URL and SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase
    .from('itineraries')
    .insert([
      {
        user_id: userId,
        title,
        destination,
        start_date: startDate,
        end_date: endDate,
        days,
        activities,
      },
    ])
    .select();

  return { data, error };
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
