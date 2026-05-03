const BASE_URL = 'https://www.orbitotrip.com';

function generateReviewRequestHTML(bookingData, tourData) {
  const tourTitle = tourData?.title || bookingData?.tour_title || 'your recent tour';
  const customerName = bookingData?.customer_name || bookingData?.customer_contact?.name || 'there';
  const bookingRef = bookingData?.booking_reference || bookingData?.id || '';
  const reviewUrl = `${BASE_URL}/bookings`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>How was your experience?</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0B3D91 0%,#1E5BA8 100%);padding:36px 40px;text-align:center;">
              <p style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Orbito</p>
              <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.75);font-weight:400;">Your AI Travel Planner</p>
            </td>
          </tr>

          <!-- Stars graphic -->
          <tr>
            <td style="padding:40px 40px 0;text-align:center;">
              <div style="font-size:40px;margin-bottom:16px;">⭐⭐⭐⭐⭐</div>
              <h1 style="margin:0;font-size:26px;font-weight:700;color:#111827;line-height:1.3;">
                How was your experience?
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 40px 32px;">
              <p style="margin:0 0 16px;font-size:16px;color:#374151;line-height:1.6;">
                Hi ${customerName},
              </p>
              <p style="margin:0 0 16px;font-size:16px;color:#374151;line-height:1.6;">
                We hope you had an amazing time on <strong>${tourTitle}</strong>!
              </p>
              <p style="margin:0 0 28px;font-size:16px;color:#374151;line-height:1.6;">
                Your feedback helps other travellers discover the best experiences. It only takes 60 seconds — would you mind leaving a quick review?
              </p>

              <!-- CTA Button -->
              <div style="text-align:center;margin-bottom:32px;">
                <a
                  href="${reviewUrl}"
                  style="display:inline-block;background:#0B3D91;color:#ffffff;font-size:16px;font-weight:700;padding:14px 36px;border-radius:50px;text-decoration:none;letter-spacing:0.3px;"
                >
                  Leave a Review
                </a>
              </div>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;" />

              <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;text-align:center;">
                ${bookingRef ? `Booking reference: <strong>${bookingRef}</strong><br/>` : ''}
                Questions? Reply to this email or visit <a href="${BASE_URL}/contact" style="color:#0B3D91;">orbitotrip.com/contact</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © ${new Date().getFullYear()} Orbito · <a href="${BASE_URL}/unsubscribe" style="color:#9ca3af;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function generateReviewRequestText(bookingData, tourData) {
  const tourTitle = tourData?.title || bookingData?.tour_title || 'your recent tour';
  const customerName = bookingData?.customer_name || bookingData?.customer_contact?.name || 'there';
  const reviewUrl = 'https://www.orbitotrip.com/bookings';

  return `Hi ${customerName},

We hope you had an amazing time on ${tourTitle}!

Your feedback helps other travellers discover the best experiences. Would you mind leaving a quick review?

Leave a review: ${reviewUrl}

Thanks,
The Orbito Team
`;
}

module.exports = { generateReviewRequestHTML, generateReviewRequestText };
