const { supabase } = require('../config/supabase');
const { sendNotification } = require('../services/emailService');
const logger = require('../utils/logger');

// ── Operator Applications ─────────────────────────────────────────────────────

async function getApplications(req, res) {
  try {
    const { status } = req.query; // optional filter: pending | approved | rejected

    let query = supabase
      .from('operator_applications')
      .select('*, profiles:user_id(email, full_name)')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, applications: data });
  } catch (err) {
    logger.error('getApplications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
}

async function approveApplication(req, res) {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    // Fetch application to get user_id and email
    const { data: app, error: fetchErr } = await supabase
      .from('operator_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !app) return res.status(404).json({ error: 'Application not found' });
    if (app.status !== 'pending') return res.status(400).json({ error: 'Application already reviewed' });

    // Promote user to operator role
    const { error: roleErr } = await supabase
      .from('profiles')
      .update({ role: 'operator' })
      .eq('id', app.user_id);

    if (roleErr) throw roleErr;

    // Mark application approved
    const { error: appErr } = await supabase
      .from('operator_applications')
      .update({ status: 'approved', reviewed_by: adminId, reviewed_at: new Date().toISOString() })
      .eq('id', id);

    if (appErr) throw appErr;

    // Send approval email
    sendNotification(
      app.contact_email,
      'Welcome to Orbito — Your Operator Account is Approved!',
      `<p>Hi ${app.contact_name},</p>
       <p>Your application to list experiences on Orbito has been approved!</p>
       <p>You can now log in and start creating your tours from your <strong>Operator Dashboard</strong>.</p>
       <p>Welcome aboard!<br><strong>The Orbito Team</strong></p>`
    ).catch((e) => logger.error('Approval email failed:', e));

    logger.success(`Operator application ${id} approved — user ${app.user_id} promoted`);
    res.json({ success: true, message: 'Application approved' });
  } catch (err) {
    logger.error('approveApplication error:', err);
    res.status(500).json({ error: 'Failed to approve application' });
  }
}

async function rejectApplication(req, res) {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const { reason } = req.body;

    const { data: app, error: fetchErr } = await supabase
      .from('operator_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !app) return res.status(404).json({ error: 'Application not found' });

    const { error } = await supabase
      .from('operator_applications')
      .update({
        status: 'rejected',
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
        rejection_reason: reason || null,
      })
      .eq('id', id);

    if (error) throw error;

    sendNotification(
      app.contact_email,
      'Update on your Orbito operator application',
      `<p>Hi ${app.contact_name},</p>
       <p>Thank you for applying to list experiences on Orbito.</p>
       <p>After reviewing your application, we're unable to approve it at this time.</p>
       ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
       <p>You're welcome to re-apply in the future.<br><strong>The Orbito Team</strong></p>`
    ).catch((e) => logger.error('Rejection email failed:', e));

    res.json({ success: true, message: 'Application rejected' });
  } catch (err) {
    logger.error('rejectApplication error:', err);
    res.status(500).json({ error: 'Failed to reject application' });
  }
}

// ── Tour Listing Approval ─────────────────────────────────────────────────────

async function getPendingTours(req, res) {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select('*, profiles:operator_id(email, full_name)')
      .eq('listing_status', 'pending_review')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, tours: data });
  } catch (err) {
    logger.error('getPendingTours error:', err);
    res.status(500).json({ error: 'Failed to fetch pending tours' });
  }
}

async function approveTour(req, res) {
  try {
    const { id } = req.params;

    const { data: tour, error: fetchErr } = await supabase
      .from('tours')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !tour) return res.status(404).json({ error: 'Tour not found' });

    const { error } = await supabase
      .from('tours')
      .update({ listing_status: 'live', is_active: true })
      .eq('id', id);

    if (error) throw error;

    logger.success(`Tour ${id} approved and set to live`);
    res.json({ success: true, message: 'Tour approved and now live' });
  } catch (err) {
    logger.error('approveTour error:', err);
    res.status(500).json({ error: 'Failed to approve tour' });
  }
}

async function rejectTour(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const { error } = await supabase
      .from('tours')
      .update({ listing_status: 'rejected' })
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Tour rejected' });
  } catch (err) {
    logger.error('rejectTour error:', err);
    res.status(500).json({ error: 'Failed to reject tour' });
  }
}

module.exports = {
  getApplications,
  approveApplication,
  rejectApplication,
  getPendingTours,
  approveTour,
  rejectTour,
};
