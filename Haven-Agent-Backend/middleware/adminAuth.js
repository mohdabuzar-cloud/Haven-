const { createSupabaseAdminClient } = require('../config/supabase');

const adminAuth = async (req, res, next) => {
  // For now, we'll use a simple admin check by verifying if the user has admin privileges
  // In a real application, you'd have a more robust admin verification system
  // This could involve checking a role in the user's profile or an admin table
  
  // For demonstration purposes, we'll allow if the token matches a predefined admin token
  // or if the user has an admin flag in their profile
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const supabaseAdmin = createSupabaseAdminClient();
    
    // Get user info using the token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Check if user is admin - in a real scenario, you'd check a role in the user's profile
    // For now, we'll allow if there's an ADMIN_TOKEN environment variable that matches
    if (process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN) {
      req.user = user;
      req.accessToken = token;
      return next();
    }
    
    // Alternative: Check if user has admin role in their profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      return res.status(401).json({ message: 'User profile not found' });
    }
    
    // In a real application, you would check for an 'is_admin' field in the profile
    // For now, we'll just verify that the user exists and let the business logic handle permissions
    req.user = user;
    req.accessToken = token;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = adminAuth;