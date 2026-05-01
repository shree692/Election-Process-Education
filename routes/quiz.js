/* ══════════════════════════════════════════
   Route: /api/quiz
   Quiz questions, scoring, leaderboard
   ══════════════════════════════════════════ */
const express  = require('express');
const router   = express.Router();
const { quizData } = require('../data/electionData');

// In-memory leaderboard (resets on server restart)
const leaderboard = [];

// GET /api/quiz/questions  — omit answer index for security
router.get('/questions', (req, res) => {
  const safe = quizData.map(({ id, q, opts, exp }) => ({ id, q, opts, exp }));
  res.json({ questions: safe, total: safe.length });
});

// GET /api/quiz/answer/:id  — reveal answer for a specific question
router.get('/answer/:id', (req, res) => {
  const q = quizData.find(q => q.id === Number(req.params.id));
  if (!q) return res.status(404).json({ error: 'Question not found' });
  res.json({ id: q.id, ans: q.ans, exp: q.exp });
});

// POST /api/quiz/score  — save a score to leaderboard
router.post('/score', (req, res) => {
  const { name, score, total } = req.body;
  if (!name || score === undefined || !total) {
    return res.status(400).json({ error: 'name, score and total are required.' });
  }
  const entry = {
    name: String(name).trim().substring(0, 30),
    score: Math.min(Number(score), Number(total)),
    total: Number(total),
    percent: Math.round((score / total) * 100),
    date: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
  };
  leaderboard.push(entry);
  leaderboard.sort((a, b) => b.score - a.score || b.percent - a.percent);
  if (leaderboard.length > 100) leaderboard.length = 100; // cap at 100
  res.json({ message: 'Score saved!', entry, rank: leaderboard.indexOf(entry) + 1 });
});

// GET /api/quiz/leaderboard  — top 10 scores
router.get('/leaderboard', (req, res) => {
  res.json({ leaderboard: leaderboard.slice(0, 10) });
});

module.exports = router;
