/**
 * Geocoding Controller
 * Proxies geocoding requests to avoid CORS issues
 */

async function geocodeLocation(req, res) {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required' });
    }

    // Call Nominatim API from backend (no CORS issues)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
      {
        headers: {
          'User-Agent': 'Orbito Travel App (contact@orbitotrip.com)'
        }
      }
    );

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Nominatim returned non-JSON response:', await response.text());
      return res.json({
        success: false,
        message: 'Geocoding service temporarily unavailable'
      });
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      res.json({
        success: true,
        coordinates: {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          displayName: data[0].display_name
        }
      });
    } else {
      res.json({
        success: false,
        message: 'Location not found'
      });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Geocoding failed',
      message: error.message 
    });
  }
}

module.exports = {
  geocodeLocation
};
