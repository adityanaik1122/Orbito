/**
 * Email Service
 * Handles all email notifications using Resend
 */

const { resendClient } = require('../config/resend');
const { generateBookingConfirmationHTML, generateBookingConfirmationText } = require('../templates/bookingConfirmationEmail');
const { generateItineraryReminderHTML, generateItineraryReminderText } = require('../templates/itineraryReminderEmail');
const logger = require('../utils/logger');

const FROM_EMAIL = process.env.FROM_EMAIL || 'Orbito <noreply@orbitotrip.com>';

/**
 * Send booking confirmation email
 * @param {Object} bookingData - Booking details
 * @param {Object} tourData - Tour details
 * @param {Object} userData - User details
 * @returns {Promise<Object>} Email send result
 */
async function sendBookingConfirmation(bookingData, tourData, userData) {
  if (!resendClient) {
    console.warn('Resend not configured - skipping email');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const htmlContent = generateBookingConfirmationHTML(bookingData, tourData, userData);
    const textContent = generateBookingConfirmationText(bookingData, tourData, userData);

    const result = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: userData.email,
      subject: `Booking Confirmed: ${tourData.title} - ${bookingData.booking_reference}`,
      html: htmlContent,
      text: textContent,
      tags: [
        { name: 'category', value: 'booking_confirmation' },
        { name: 'booking_ref', value: bookingData.booking_reference }
      ]
    });

    logger.success(' Booking confirmation email sent:', result.id);
    return { success: true, emailId: result.id };
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send itinerary reminder email
 * @param {Object} itineraryData - Itinerary details
 * @param {Object} userData - User details
 * @returns {Promise<Object>} Email send result
 */
async function sendItineraryReminder(itineraryData, userData) {
  if (!resendClient) {
    console.warn('Resend not configured - skipping email');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const htmlContent = generateItineraryReminderHTML(itineraryData, userData);
    const textContent = generateItineraryReminderText(itineraryData, userData);

    const result = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: userData.email,
      subject: `Your ${itineraryData.destination} Trip is Coming Up! 🎉`,
      html: htmlContent,
      text: textContent,
      tags: [
        { name: 'category', value: 'itinerary_reminder' },
        { name: 'destination', value: itineraryData.destination }
      ]
    });

    logger.success(' Itinerary reminder email sent:', result.id);
    return { success: true, emailId: result.id };
  } catch (error) {
    console.error('❌ Error sending itinerary reminder email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send booking cancellation email
 * @param {Object} bookingData - Booking details
 * @param {Object} tourData - Tour details
 * @param {Object} userData - User details
 * @returns {Promise<Object>} Email send result
 */
async function sendBookingCancellation(bookingData, tourData, userData) {
  if (!resendClient) {
    console.warn('Resend not configured - skipping email');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Booking Cancelled</h1>
  </div>
  <div class="content">
    <p>Hi ${userData.name},</p>
    <p>Your booking has been cancelled as requested.</p>
    <p><strong>Booking Reference:</strong> ${bookingData.booking_reference}</p>
    <p><strong>Tour:</strong> ${tourData.title}</p>
    <p><strong>Date:</strong> ${new Date(bookingData.tour_date).toLocaleDateString('en-GB')}</p>
    <p>If you have any questions, please contact our support team.</p>
    <p>We hope to see you again soon!<br><strong>The Orbito Team</strong></p>
  </div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} Orbito Trip Planner</p>
  </div>
</body>
</html>
    `;

    const result = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: userData.email,
      subject: `Booking Cancelled: ${bookingData.booking_reference}`,
      html: htmlContent,
      tags: [
        { name: 'category', value: 'booking_cancellation' }
      ]
    });

    logger.success(' Booking cancellation email sent:', result.id);
    return { success: true, emailId: result.id };
  } catch (error) {
    console.error('❌ Error sending booking cancellation email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send welcome email to new users
 * @param {Object} userData - User details
 * @returns {Promise<Object>} Email send result
 */
async function sendWelcomeEmail(userData) {
  if (!resendClient) {
    console.warn('Resend not configured - skipping email');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0B3D91 0%, #1E5BA8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
    .button { display: inline-block; background: #0B3D91; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Welcome to Orbito! 🎉</h1>
  </div>
  <div class="content">
    <p>Hi ${userData.name || 'there'},</p>
    <p>Welcome to Orbito - your AI-powered travel planning companion!</p>
    <p>We're excited to help you create amazing travel experiences. Here's what you can do:</p>
    <ul>
      <li>✨ Generate personalized itineraries with AI</li>
      <li>🎫 Browse and book tours from top providers</li>
      <li>🗺️ Visualize your trips on interactive maps</li>
      <li>📄 Export itineraries as beautiful PDFs</li>
    </ul>
    <div style="text-align: center;">
      <a href="https://www.orbitotrip.com/plan" class="button">Start Planning Your Trip</a>
    </div>
    <p>If you have any questions, our support team is here to help!</p>
    <p>Happy travels!<br><strong>The Orbito Team</strong></p>
  </div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} Orbito Trip Planner</p>
  </div>
</body>
</html>
    `;

    const result = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: userData.email,
      subject: 'Welcome to Orbito - Start Planning Your Adventure! 🌍',
      html: htmlContent,
      tags: [
        { name: 'category', value: 'welcome' }
      ]
    });

    logger.success(' Welcome email sent:', result.id);
    return { success: true, emailId: result.id };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send generic notification email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content
 * @param {string} textContent - Plain text content (optional)
 * @returns {Promise<Object>} Email send result
 */
async function sendNotification(to, subject, htmlContent, textContent = null) {
  if (!resendClient) {
    console.warn('Resend not configured - skipping email');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const emailData = {
      from: FROM_EMAIL,
      to,
      subject,
      html: htmlContent,
      tags: [
        { name: 'category', value: 'notification' }
      ]
    };

    if (textContent) {
      emailData.text = textContent;
    }

    const result = await resendClient.emails.send(emailData);

    logger.success(' Notification email sent:', result.id);
    return { success: true, emailId: result.id };
  } catch (error) {
    console.error('❌ Error sending notification email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendBookingConfirmation,
  sendItineraryReminder,
  sendBookingCancellation,
  sendWelcomeEmail,
  sendNotification
};
