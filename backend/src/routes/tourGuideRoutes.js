const express = require('express');
const { sendNotification } = require('../services/emailService');
const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'adityanaik817@gmail.com';

function guideCard(rows) {
  return `<table style="width:100%;border-collapse:collapse">${rows}</table>`;
}
function row(label, value) {
  return `<tr><td style="padding:8px 0;color:#6b7280;width:130px;vertical-align:top">${label}</td><td style="padding:8px 0;font-weight:600">${value || '—'}</td></tr>`;
}

// POST /api/tour-guides/notify-registration  — email admin when a guide signs up
router.post('/notify-registration', async (req, res) => {
  try {
    const { guide } = req.body;
    if (!guide) return res.status(400).json({ error: 'guide data required' });

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:linear-gradient(135deg,#0B3D91,#1E5BA8);color:white;padding:24px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="margin:0;font-size:22px">New Tour Guide Registration</h1>
          <p style="margin:8px 0 0;opacity:.9">Pending your approval on Orbito</p>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none">
          ${guideCard(
            row('Name', guide.full_name) +
            row('Email', guide.email) +
            row('Phone', guide.phone_number) +
            row('Location', guide.location) +
            row('Rate', guide.charges_per_hour ? `$${guide.charges_per_hour}/hr` : '—') +
            row('Languages', (guide.languages || []).join(', ')) +
            row('Specialties', (guide.specialties || []).join(', '))
          )}
          <p style="margin-top:16px;color:#374151">${guide.description || ''}</p>
          <div style="text-align:center;margin-top:24px">
            <a href="https://www.orbitotrip.com/admin"
               style="background:#0B3D91;color:white;padding:12px 32px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block">
              Review in Admin Panel →
            </a>
          </div>
        </div>
        <div style="text-align:center;padding:16px;color:#9ca3af;font-size:12px">© ${new Date().getFullYear()} Orbito</div>
      </div>`;

    await sendNotification(
      ADMIN_EMAIL,
      `New Tour Guide Registration: ${guide.full_name} — Pending Approval`,
      html
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tour-guides/notify-status  — email guide when admin approves or rejects
router.post('/notify-status', async (req, res) => {
  try {
    const { email, name, status, rejectionReason } = req.body;
    if (!email || !status) return res.status(400).json({ error: 'email and status required' });

    const approved = status === 'approved';
    const accentColor = approved ? '#059669' : '#dc2626';
    const subject = approved
      ? 'Congratulations! Your Orbito Tour Guide profile is approved 🎉'
      : 'Update on your Orbito Tour Guide application';

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:${accentColor};color:white;padding:24px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="margin:0;font-size:22px">${approved ? '🎉 You\'re Approved!' : 'Application Update'}</h1>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none">
          <p>Hi ${name},</p>
          ${approved
            ? `<p>Great news! Your tour guide profile on Orbito has been <strong>approved</strong>. Your profile is now live and travellers can find and contact you directly via WhatsApp.</p>
               <div style="text-align:center;margin-top:24px">
                 <a href="https://www.orbitotrip.com/tour-guide-dashboard"
                    style="background:#0B3D91;color:white;padding:12px 32px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block">
                   Go to Your Dashboard →
                 </a>
               </div>`
            : `<p>We reviewed your tour guide application and unfortunately it has been <strong>declined</strong> at this time.</p>
               ${rejectionReason
                 ? `<div style="background:#fef2f2;border:1px solid #fecaca;padding:12px 16px;border-radius:8px;margin:16px 0">
                      <strong>Reason:</strong> ${rejectionReason}
                    </div>`
                 : ''}
               <p>You're welcome to re-apply after addressing the feedback above.</p>`
          }
          <p style="margin-top:24px">Best regards,<br><strong>The Orbito Team</strong></p>
        </div>
        <div style="text-align:center;padding:16px;color:#9ca3af;font-size:12px">© ${new Date().getFullYear()} Orbito</div>
      </div>`;

    await sendNotification(email, subject, html);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
