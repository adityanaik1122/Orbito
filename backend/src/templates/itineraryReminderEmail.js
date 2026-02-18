/**
 * Itinerary Reminder Email Template
 */

function generateItineraryReminderHTML(itineraryData, userData) {
  const { title, destination, start_date, end_date, days } = itineraryData;
  const { name } = userData;

  const daysCount = days?.length || 0;
  const activitiesCount = days?.reduce((sum, day) => sum + (day.items?.length || 0), 0) || 0;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trip Reminder</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #0B3D91 0%, #1E5BA8 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .trip-card {
      background: #f9fafb;
      border: 2px solid #0B3D91;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .trip-title {
      font-size: 24px;
      color: #0B3D91;
      margin: 0 0 10px 0;
    }
    .stats {
      display: flex;
      justify-content: space-around;
      margin: 20px 0;
      padding: 20px;
      background: #dbeafe;
      border-radius: 8px;
    }
    .stat {
      text-align: center;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #0B3D91;
      display: block;
    }
    .stat-label {
      font-size: 14px;
      color: #6b7280;
    }
    .checklist {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .checklist ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .button {
      display: inline-block;
      background: #0B3D91;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: 600;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #6b7280;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>✈️ Your Trip is Coming Up!</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Time to get excited</p>
  </div>
  
  <div class="content">
    <p>Hi ${name},</p>
    
    <p>Your adventure to <strong>${destination}</strong> is just around the corner! We wanted to make sure you have everything you need for an amazing trip.</p>
    
    <div class="trip-card">
      <h2 class="trip-title">${title}</h2>
      <p style="margin: 5px 0; color: #6b7280;">
        📍 ${destination}<br>
        📅 ${new Date(start_date).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })} - ${new Date(end_date).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
    
    <div class="stats">
      <div class="stat">
        <span class="stat-value">${daysCount}</span>
        <span class="stat-label">Days</span>
      </div>
      <div class="stat">
        <span class="stat-value">${activitiesCount}</span>
        <span class="stat-label">Activities</span>
      </div>
    </div>
    
    <div class="checklist">
      <strong>📋 Pre-Trip Checklist:</strong>
      <ul>
        <li>✓ Check your passport and visa requirements</li>
        <li>✓ Review your itinerary and bookings</li>
        <li>✓ Check the weather forecast</li>
        <li>✓ Arrange travel insurance</li>
        <li>✓ Notify your bank about travel dates</li>
        <li>✓ Download offline maps</li>
        <li>✓ Pack essentials and medications</li>
      </ul>
    </div>
    
    <h3 style="color: #0B3D91;">Quick Tips for ${destination}:</h3>
    <ul style="line-height: 1.8;">
      <li>Arrive at meeting points 15 minutes early</li>
      <li>Keep your booking references handy</li>
      <li>Stay hydrated and take breaks</li>
      <li>Capture memories but enjoy the moment</li>
    </ul>
    
    <div style="text-align: center;">
      <a href="https://www.orbitotrip.com/itinerary/${itineraryData.id}" class="button">View Full Itinerary</a>
    </div>
    
    <p style="margin-top: 30px;">Have questions? Our support team is here to help!</p>
    
    <p>Have an incredible trip!<br>
    <strong>The Orbito Team</strong></p>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} Orbito Trip Planner. All rights reserved.</p>
    <p>
      <a href="https://www.orbitotrip.com" style="color: #0B3D91; text-decoration: none;">Visit Website</a> | 
      <a href="https://www.orbitotrip.com/help" style="color: #0B3D91; text-decoration: none;">Help Center</a>
    </p>
  </div>
</body>
</html>
  `;
}

function generateItineraryReminderText(itineraryData, userData) {
  const { title, destination, start_date, end_date, days } = itineraryData;
  const { name } = userData;

  const daysCount = days?.length || 0;
  const activitiesCount = days?.reduce((sum, day) => sum + (day.items?.length || 0), 0) || 0;

  return `
Hi ${name},

Your adventure to ${destination} is just around the corner! We wanted to make sure you have everything you need for an amazing trip.

TRIP DETAILS:
${title}
📍 ${destination}
📅 ${new Date(start_date).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })} - ${new Date(end_date).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}

${daysCount} Days | ${activitiesCount} Activities

PRE-TRIP CHECKLIST:
✓ Check your passport and visa requirements
✓ Review your itinerary and bookings
✓ Check the weather forecast
✓ Arrange travel insurance
✓ Notify your bank about travel dates
✓ Download offline maps
✓ Pack essentials and medications

QUICK TIPS FOR ${destination.toUpperCase()}:
- Arrive at meeting points 15 minutes early
- Keep your booking references handy
- Stay hydrated and take breaks
- Capture memories but enjoy the moment

View your full itinerary: https://www.orbitotrip.com/itinerary/${itineraryData.id}

Have questions? Our support team is here to help!

Have an incredible trip!
The Orbito Team

© ${new Date().getFullYear()} Orbito Trip Planner
  `;
}

module.exports = {
  generateItineraryReminderHTML,
  generateItineraryReminderText
};
