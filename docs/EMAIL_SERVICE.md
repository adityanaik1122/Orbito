# Email Service Documentation

## Overview
Complete email notification system using Resend for sending transactional emails to users.

## Features

### Email Types

1. **Booking Confirmation**
   - Sent when a tour booking is confirmed
   - Includes booking reference, tour details, meeting point
   - Professional HTML template with branding

2. **Itinerary Reminder**
   - Sent before trip start date
   - Includes trip overview, checklist, quick tips
   - Encourages users to review their itinerary

3. **Booking Cancellation**
   - Sent when a booking is cancelled
   - Confirms cancellation with booking details

4. **Welcome Email**
   - Sent to new users upon registration
   - Introduces platform features
   - Call-to-action to start planning

5. **Generic Notifications**
   - Flexible template for any notification
   - Custom subject and content

## Setup

### 1. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use resend.dev for testing)
3. Generate an API key from the dashboard

### 2. Configure Environment Variables

Add to `backend/.env`:

```env
# Resend Email Service
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=Orbito <noreply@orbitotrip.com>
```

**For Testing (No Domain Verification Required):**
```env
FROM_EMAIL=Orbito <onboarding@resend.dev>
```

### 3. Verify Installation

The `resend` package is already installed. If you need to reinstall:

```bash
cd backend
npm install resend
```

### 4. Test Email Service

```bash
cd backend
node server.js
```

You should see:
```
✅ Resend email service initialized
```

## Usage

### Send Booking Confirmation

```javascript
const emailService = require('./services/emailService');

const bookingData = {
  booking_reference: 'ORB-12345',
  tour_date: '2026-03-15',
  num_adults: 2,
  num_children: 1,
  total_amount: 150.00
};

const tourData = {
  title: 'London Eye Tour',
  destination: 'London',
  duration: '2 hours',
  meeting_point: 'London Eye, Westminster Bridge Road'
};

const userData = {
  name: 'John Smith',
  email: 'john@example.com'
};

const result = await emailService.sendBookingConfirmation(
  bookingData,
  tourData,
  userData
);

if (result.success) {
  console.log('Email sent:', result.emailId);
}
```

### Send Itinerary Reminder

```javascript
const itineraryData = {
  id: 'uuid',
  title: 'London Adventure',
  destination: 'London',
  start_date: '2026-03-15',
  end_date: '2026-03-20',
  days: [
    { items: [{}, {}] },
    { items: [{}, {}, {}] }
  ]
};

const result = await emailService.sendItineraryReminder(
  itineraryData,
  userData
);
```

### Send Welcome Email

```javascript
const result = await emailService.sendWelcomeEmail({
  name: 'John Smith',
  email: 'john@example.com'
});
```

### Send Custom Notification

```javascript
const result = await emailService.sendNotification(
  'user@example.com',
  'Your Custom Subject',
  '<h1>Custom HTML Content</h1>',
  'Plain text version'
);
```

## Integration Points

### 1. Booking Controller

Add to `backend/src/controllers/tourController.js`:

```javascript
const emailService = require('../services/emailService');

async function createBooking(req, res) {
  // ... existing booking creation code ...
  
  // Send confirmation email
  await emailService.sendBookingConfirmation(
    bookingData,
    tourData,
    userData
  );
  
  res.json({ success: true, booking: data });
}
```

### 2. User Registration

Add to your auth flow:

```javascript
const emailService = require('../services/emailService');

// After user signs up
await emailService.sendWelcomeEmail({
  name: user.name,
  email: user.email
});
```

### 3. Scheduled Reminders

Create a cron job to send reminders:

```javascript
const cron = require('node-cron');
const emailService = require('./services/emailService');

// Run daily at 9 AM
cron.schedule('0 9 * * *', async () => {
  // Find itineraries starting tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const upcomingItineraries = await getItinerariesStartingOn(tomorrow);
  
  for (const itinerary of upcomingItineraries) {
    await emailService.sendItineraryReminder(
      itinerary,
      itinerary.user
    );
  }
});
```

## Email Templates

### Template Structure

All templates follow a consistent structure:
- Header with gradient background
- Content area with white background
- Call-to-action buttons
- Footer with links

### Customization

Edit templates in:
- `backend/src/templates/bookingConfirmationEmail.js`
- `backend/src/templates/itineraryReminderEmail.js`

### Styling

Templates use inline CSS for maximum email client compatibility:
- Responsive design
- Mobile-friendly
- Works in Gmail, Outlook, Apple Mail, etc.

## Testing

### Test with Resend Dev Domain

```javascript
// Use onboarding@resend.dev for testing
const result = await emailService.sendBookingConfirmation(
  bookingData,
  tourData,
  { name: 'Test User', email: 'test@example.com' }
);
```

### Check Resend Dashboard

1. Go to [resend.com/emails](https://resend.com/emails)
2. View sent emails
3. Check delivery status
4. Preview email content

### Test Email Rendering

Use [Litmus](https://litmus.com) or [Email on Acid](https://www.emailonacid.com) to test across email clients.

## Error Handling

The service handles errors gracefully:

```javascript
const result = await emailService.sendBookingConfirmation(...);

if (!result.success) {
  console.error('Email failed:', result.error || result.message);
  // Continue with booking process
  // Email failure shouldn't block the booking
}
```

## Best Practices

### 1. Don't Block on Email Sending

```javascript
// ✅ Good - Don't await
emailService.sendBookingConfirmation(bookingData, tourData, userData)
  .catch(err => console.error('Email error:', err));

// Return response immediately
res.json({ success: true, booking: data });
```

### 2. Use Email Queue (Future Enhancement)

For high volume, use a queue:
```javascript
// Add to queue instead of sending directly
await emailQueue.add('booking-confirmation', {
  bookingData,
  tourData,
  userData
});
```

### 3. Track Email Status

Store email IDs in database:
```javascript
const result = await emailService.sendBookingConfirmation(...);

if (result.success) {
  await supabase
    .from('email_logs')
    .insert({
      email_id: result.emailId,
      type: 'booking_confirmation',
      recipient: userData.email,
      booking_id: bookingData.id
    });
}
```

### 4. Respect User Preferences

Check if user wants emails:
```javascript
if (user.email_notifications_enabled) {
  await emailService.sendBookingConfirmation(...);
}
```

## Monitoring

### Resend Dashboard Metrics

Monitor in Resend dashboard:
- Delivery rate
- Open rate
- Click rate
- Bounce rate
- Spam complaints

### Logging

All email sends are logged:
```
✅ Booking confirmation email sent: re_abc123xyz
❌ Error sending booking confirmation email: Invalid API key
```

## Troubleshooting

### Email Not Sending

**Issue**: No email received

**Solutions**:
1. Check RESEND_API_KEY is set correctly
2. Verify FROM_EMAIL domain is verified in Resend
3. Check spam folder
4. Review Resend dashboard for errors

### Invalid API Key

**Issue**: `Error: Invalid API key`

**Solution**:
```bash
# Check .env file
cat backend/.env | grep RESEND_API_KEY

# Regenerate key in Resend dashboard if needed
```

### Domain Not Verified

**Issue**: `Error: Domain not verified`

**Solution**:
1. Use `onboarding@resend.dev` for testing
2. Or verify your domain in Resend dashboard:
   - Add DNS records
   - Wait for verification
   - Update FROM_EMAIL

### Emails Going to Spam

**Solutions**:
1. Verify domain with SPF, DKIM, DMARC
2. Warm up your domain gradually
3. Avoid spam trigger words
4. Include unsubscribe link
5. Use consistent FROM address

## Rate Limits

Resend free tier limits:
- 100 emails/day
- 3,000 emails/month

Paid plans:
- 50,000+ emails/month
- Higher sending rates
- Dedicated IP (optional)

## Security

### API Key Protection

- ✅ Store in environment variables
- ✅ Never commit to git
- ✅ Rotate keys periodically
- ✅ Use different keys for dev/prod

### Email Content

- ✅ Sanitize user input
- ✅ Escape HTML
- ✅ Validate email addresses
- ✅ Don't include sensitive data

## Future Enhancements

- [ ] Email templates with React Email
- [ ] Email queue with Bull/BullMQ
- [ ] A/B testing for email content
- [ ] Email analytics dashboard
- [ ] Unsubscribe management
- [ ] Email preference center
- [ ] Scheduled email campaigns
- [ ] Email webhooks for tracking
- [ ] Multi-language support
- [ ] SMS notifications integration

## Cost Estimation

**Free Tier**: $0/month
- 100 emails/day
- 3,000 emails/month
- Perfect for testing

**Pro Plan**: $20/month
- 50,000 emails/month
- $1 per additional 1,000 emails
- Dedicated support

**Example Costs**:
- 100 bookings/month = Free
- 1,000 bookings/month = Free
- 5,000 bookings/month = $20/month
- 100,000 bookings/month = $120/month

## Support

- Resend Docs: https://resend.com/docs
- Resend Support: support@resend.com
- Resend Discord: https://resend.com/discord

---

**Status**: ✅ Complete and ready to use  
**Version**: 1.0.0  
**Last Updated**: February 18, 2026
