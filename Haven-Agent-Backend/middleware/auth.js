const { createSupabaseUserClient } = require('../config/supabase');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const supabase = createSupabaseUserClient(token);
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = data.user;
    req.accessToken = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;