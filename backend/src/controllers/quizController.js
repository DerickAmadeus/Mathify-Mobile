// controllers/quizController.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const quizController = {
  // Get available quizzes/modules
  getQuizzes: async (req, res) => {
    try {
      const { category, difficulty } = req.query;
      
      let query = supabase
        .from('quizzes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }
      
      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }

      const { data, error } = await query;

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      res.json({ success: true, quizzes: data || [] });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get quiz questions
  getQuizQuestions: async (req, res) => {
    try {
      const { quizId } = req.params;

      // Get quiz details
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (quizError || !quiz) {
        return res.status(404).json({ success: false, message: 'Quiz not found' });
      }

      // Get questions
      const { data: questions, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (questionsError) {
        return res.status(400).json({ success: false, message: questionsError.message });
      }

      res.json({ 
        success: true, 
        quiz,
        questions: questions || []
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Submit quiz attempt
  submitQuizAttempt: async (req, res) => {
    try {
      const { quizId } = req.params;
      const { answers, time_taken } = req.body;
      const userId = req.user.id;

      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Answers array is required' 
        });
      }

      // Get correct answers
      const { data: questions, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('id, correct_answer')
        .eq('quiz_id', quizId);

      if (questionsError) {
        return res.status(400).json({ success: false, message: questionsError.message });
      }

      // Calculate score
      let correctCount = 0;
      const questionMap = {};
      questions.forEach(q => {
        questionMap[q.id] = q.correct_answer;
      });

      answers.forEach(answer => {
        if (questionMap[answer.question_id] === answer.selected_answer) {
          correctCount++;
        }
      });

      const totalQuestions = questions.length;
      const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

      // Save attempt
      const { data: attempt, error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: userId,
          quiz_id: quizId,
          answers: answers,
          score: score,
          time_taken: time_taken || 0,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (attemptError) {
        return res.status(400).json({ success: false, message: attemptError.message });
      }

      res.json({ 
        success: true, 
        attempt,
        score,
        correct_answers: correctCount,
        total_questions: totalQuestions
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get user quiz history
  getQuizHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quizzes (
            title,
            category,
            difficulty
          )
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      res.json({ 
        success: true, 
        history: data || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = quizController;