// controllers/userController.js - Extract business logic dari routes  
const { supabase } = require('../config/supabase');
const { validateUser, userRegisterSchema, userLoginSchema } = require('../schemas/userSchema');

const userController = {
  // GET all users
  getAllUsers: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(data || []);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST create new user (Register)
  createUser: async (req, res) => {
    try {
      const { username, password, email } = req.body;

      // Validate input against schema
      const validation = validateUser(req.body, userRegisterSchema);
      if (!validation.valid) {
        return res.status(400).json({ error: 'Validation failed', details: validation.errors });
      }

      // Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (existingUser) {
        return res.status(400).json({ error: 'Username sudah terdaftar' });
      }

      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert([{ username, password, email }])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        id: data.id,
        username: data.username,
        email: data.email,
        created_at: data.created_at
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // POST login user
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validate input against schema
      const validation = validateUser(req.body, userLoginSchema);
      if (!validation.valid) {
        return res.status(400).json({ error: 'Validation failed', details: validation.errors });
      }

      // Query user from database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !user) {
        return res.status(401).json({ error: 'Username atau password salah' });
      }

      // Check password (simple comparison, in production use bcrypt)
      if (user.password !== password) {
        return res.status(401).json({ error: 'Username atau password salah' });
      }

      // Return success with user data
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET user by ID
  getUserById: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT update user
  updateUser: async (req, res) => {
    try {
      const { name, email } = req.body;

      const { data, error } = await supabase
        .from('users')
        .update({ name, email })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // DELETE user
  deleteUser: async (req, res) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', req.params.id);

      if (error) throw error;

      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = userController;