const {
  createSupabaseAdminClient,
  createSupabasePublicClient,
  createSupabaseUserClient,
} = require('../config/supabase');

const getProfileByUserId = async (supabaseAdmin, userId) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, phone')
    .eq('id', userId)
    .single();

  if (error) {
    return null;
  }

  return data;
};

// Register a new user (email confirmation enabled in Supabase Auth settings)
exports.register = async (req, res) => {
  try {
    console.log('Register request headers:', req.headers);
    console.log('Register request raw body:', req.body);
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      console.log('Missing fields:', { fullName, email, phone, password });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const supabasePublic = createSupabasePublicClient();
    const supabaseAdmin = createSupabaseAdminClient();

    const { data, error } = await supabasePublic.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.SUPABASE_AUTH_REDIRECT_URL,
      },
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!data?.user?.id) {
      return res.status(500).json({ message: 'Failed to create user' });
    }

    // Ensure profile exists (if trigger is set up, this is a no-op)
    await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          id: data.user.id,
          full_name: fullName,
          phone,
        },
        { onConflict: 'id' }
      );

    // Ensure onboarding row exists
    await supabaseAdmin
      .from('onboarding')
      .upsert({ user_id: data.user.id }, { onConflict: 'user_id' });

    // Email confirmation flow: session may be null until confirmed
    const accessToken = data.session?.access_token || null;

    res.status(201).json({
      message: 'Registration successful. Please confirm your email to continue.',
      token: accessToken,
      emailConfirmationRequired: true,
      user: {
        id: data.user.id,
        fullName,
        email,
        phone,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    const supabasePublic = createSupabasePublicClient();
    const supabaseAdmin = createSupabaseAdminClient();

    const { data, error } = await supabasePublic.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ message: error.message });
    }

    if (!data?.session?.access_token || !data?.user?.id) {
      return res.status(401).json({ message: 'Login failed' });
    }

    const profile = await getProfileByUserId(supabaseAdmin, data.user.id);

    res.json({
      message: 'Login successful',
      token: data.session.access_token,
      user: {
        id: data.user.id,
        fullName: profile?.full_name || '',
        email: data.user.email,
        phone: profile?.phone || '',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Update password (requires valid access token)
exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const supabaseUser = createSupabaseUserClient(req.accessToken);
    const { data, error } = await supabaseUser.auth.updateUser({ password });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({ message: 'Password updated successfully', user: data.user });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error updating password' });
  }
};

// Get current user (requires valid access token)
exports.getCurrentUser = async (req, res) => {
  try {
    const supabaseAdmin = createSupabaseAdminClient();
    const profile = await getProfileByUserId(supabaseAdmin, req.user.id);

    res.json({
      id: req.user.id,
      email: req.user.email,
      fullName: profile?.full_name || '',
      phone: profile?.phone || '',
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};