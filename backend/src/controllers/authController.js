// controllers/authController.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const authController = {
  // Register user (Optional - Supabase biasanya handle di frontend)
  register: async (req, res) => {
    try {
      const { email, password, full_name } = req.body;
      
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { full_name }
      });

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      res.json({ 
        success: true, 
        message: 'User registered successfully',
        user: data.user 
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Verify user session
  verifySession: async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ success: false, message: 'Invalid session' });
      }

      req.user = user; // Attach user to request
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Refresh token
  refreshToken: async (req, res) => {
    try {
      const { refresh_token } = req.body;
      
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token
      });

      if (error) {
        return res.status(401).json({ success: false, message: error.message });
      }

      res.json({ success: true, session: data.session });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = authController;