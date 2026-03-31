const { supabase } = require('../config/supabase');
const logger = require('../utils/logger');

async function saveItinerary({ userId, title, destinationCity, destinationCountry, startDate, endDate, days }) {
  if (!supabase) {
    throw new Error('Supabase is not initialized. Check SUPABASE_URL and SUPABASE_ANON_KEY.');
  }

  const itineraryData = {
    user_id: userId,
    title,
    destination_city: destinationCity,
    destination_country: destinationCountry,
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
