const { supabase } = require('../config/supabase');

/**
 * Middleware to verify JWT token from Supabase Auth.
 * Extracts user from the token and attaches to req.user
 */
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header' 
      });
    }

    const token = authHeader.split(' ')[1];

    if (!supabase) {
      console.error('Supabase client not initialized');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Authentication service unavailable' 
      });
    }

    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Auth error:', error?.message);
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid or expired token' 
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Authentication error',
      message: 'Failed to verify authentication' 
    });
  }
}

/**
 * Middleware to check if user has admin role
 * Must be used after requireAuth
 */
async function requireAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Authentication required' 
      });
    }

    // Get user profile with role
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ 
        error: 'Server error',
        message: 'Failed to verify user role' 
      });
    }

    if (!profile || profile.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Admin access required' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ 
      error: 'Authorization error',
      message: 'Failed to verify admin access' 
    });
  }
}

/**
 * Middleware to check if user has operator role
 * Must be used after requireAuth
 */
async function requireOperator(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Authentication required' 
      });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ 
        error: 'Server error',
        message: 'Failed to verify user role' 
      });
    }

    if (!profile || (profile.role !== 'operator' && profile.role !== 'admin')) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Operator access required' 
      });
    }

    req.userRole = profile.role;
    next();
  } catch (error) {
    console.error('Operator middleware error:', error);
    return res.status(500).json({ 
      error: 'Authorization error',
      message: 'Failed to verify operator access' 
    });
  }
}

module.exports = {
  requireAuth,
  requireAdmin,
  requireOperator
};
