// controllers/calculatorController.js
const { supabase } = require('../config/supabase');

const calculatorController = {
  // Get API status
  getStatus: (req, res) => {
    res.json({ message: 'Calculator API is running' });
  },

  // Get calculation history for a user
  getHistory: async (req, res) => {
    try {
      const { user_id } = req.query;

      if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const { data, error } = await supabase
        .from('calculator_history')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('❌ Supabase query error:', error);
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json(data);
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      res.status(500).json({ error: 'Unexpected error' });
    }
  },

  // Delete calculation history for a user
  deleteHistory: async (req, res) => {
    try {
      const { user_id } = req.query;

      if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const { error } = await supabase
        .from('calculator_history')
        .delete()
        .eq('user_id', user_id);

      if (error) {
        console.error('❌ Supabase delete error:', error);
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ message: 'History cleared successfully' });
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      res.status(500).json({ error: 'Unexpected error' });
    }
  },

  // Save calculation history
  saveHistory: async (req, res) => {
    try {
      const { user_id, expression, result } = req.body;

      if (!user_id || !expression || result === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { data, error } = await supabase
        .from('calculator_history')
        .insert([{ user_id, expression, result }]);

      if (error) {
        console.error('❌ Supabase insert error:', error);
        return res.status(500).json({ error: error.message });
      }

      console.log('✅ History saved to Supabase:', data);
      res.status(200).json({ message: 'History saved successfully', data });
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      res.status(500).json({ error: 'Unexpected error' });
    }
  }
};

module.exports = calculatorController;