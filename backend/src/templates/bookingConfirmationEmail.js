/**
 * Booking Confirmation Email Template
 */

function generateBookingConfirmationHTML(bookingData, tourData, userData) {
  const { booking_reference, tour_date, num_adults, num_children, total_amount } = bookingData;
  const { title, destination, duration, meeting_point } = tourData;
  const { name, email } = userData;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
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
    .booking-ref {
      background: #f3f4f6;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }
    .booking-ref strong {
      font-size: 24px;
      color: #0B3D91;
    }
    .details {
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-label {
      font-weight: 600;
      color: #6b7280;
    }
    .detail-value {
      color: #111827;
    }
    .highlight-box {
      background: #dbeafe;
      border-left: 4px solid #0B3D91;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
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
    <h1>🎉 Booking Confirmed!</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Your adventure awaits</p>
  </div>
  
  <div class="content">
    <p>Hi ${name},</p>
    
    <p>Great news! Your booking has been confirmed. We're excited to have you join us!</p>
    
    <div class="booking-ref">
      <p style="margin: 0 0 5px 0; color: #6b7280;">Booking Reference</p>
      <strong>${booking_reference}</strong>
    </div>
    
    <h2 style="color: #0B3D91; margin-top: 30px;">Tour Details</h2>
    <div class="details">
      <div class="detail-row">
        <span class="detail-label">Tour</span>
        <span class="detail-value">${title}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Destination</span>
        <span class="detail-value">${destination}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date</span>
        <span class="detail-value">${new Date(tour_date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Duration</span>
        <span class="detail-value">${duration}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Participants</span>
        <span class="detail-value">${num_adults} Adult${num_adults > 1 ? 's' : ''}${num_children > 0 ? `, ${num_children} Child${num_children > 1 ? 'ren' : ''}` : ''}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Total Amount</span>
        <span class="detail-value"><strong>£${parseFloat(total_amount).toFixed(2)}</strong></span>
      </div>
    </div>
    
    <div class="highlight-box">
      <strong>📍 Meeting Point:</strong><br>
      ${meeting_point || 'Details will be sent 24 hours before your tour'}
    </div>
    
    <h2 style="color: #0B3D91;">What's Next?</h2>
    <ul style="line-height: 1.8;">
      <li>You'll receive a reminder email 24 hours before your tour</li>
      <li>Please arrive 15 minutes before the start time</li>
      <li>Bring your booking reference (${booking_reference})</li>
      <li>Check the weather and dress appropriately</li>
    </ul>
    
    <div style="text-align: center;">
      <a href="https://www.orbitotrip.com/bookings" class="button">View My Bookings</a>
    </div>
    
    <p style="margin-top: 30px;">If you have any questions, feel free to reply to this email or contact our support team.</p>
    
    <p>Safe travels!<br>
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

function generateBookingConfirmationText(bookingData, tourData, userData) {
  const { booking_reference, tour_date, num_adults, num_children, total_amount } = bookingData;
  const { title, destination, duration, meeting_point } = tourData;
  const { name } = userData;

  return `
Hi ${name},

Great news! Your booking has been confirmed. We're excited to have you join us!

BOOKING REFERENCE: ${booking_reference}

TOUR DETAILS:
- Tour: ${title}
- Destination: ${destination}
- Date: ${new Date(tour_date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
- Duration: ${duration}
- Participants: ${num_adults} Adult${num_adults > 1 ? 's' : ''}${num_children > 0 ? `, ${num_children} Child${num_children > 1 ? 'ren' : ''}` : ''}
- Total Amount: £${parseFloat(total_amount).toFixed(2)}

MEETING POINT:
${meeting_point || 'Details will be sent 24 hours before your tour'}

WHAT'S NEXT?
- You'll receive a reminder email 24 hours before your tour
- Please arrive 15 minutes before the start time
- Bring your booking reference (${booking_reference})
- Check the weather and dress appropriately

View your booking: https://www.orbitotrip.com/bookings

If you have any questions, feel free to reply to this email.

Safe travels!
The Orbito Team

© ${new Date().getFullYear()} Orbito Trip Planner
  `;
}

module.exports = {
  generateBookingConfirmationHTML,
  generateBookingConfirmationText
};
