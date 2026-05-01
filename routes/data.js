/* ══════════════════════════════════════════
   Route: /api/data
   Timeline, Steps, Roles data endpoints
   ══════════════════════════════════════════ */
const express = require('express');
const router  = express.Router();
const { timelineData, stepsData, rolesData } = require('../data/electionData');

// GET /api/data/timeline
router.get('/timeline', (req, res) => {
  res.json({ timeline: timelineData });
});

// GET /api/data/steps
router.get('/steps', (req, res) => {
  const tab = req.query.tab;
  if (tab && stepsData[tab]) {
    return res.json({ steps: stepsData[tab], tab });
  }
  res.json({ steps: stepsData });
});

// GET /api/data/roles
router.get('/roles', (req, res) => {
  res.json({ roles: rolesData });
});

// GET /api/data/overview  — summary stats
router.get('/overview', (req, res) => {
  res.json({
    stats: {
      timelineStages: timelineData.length,
      voterSteps:     stepsData.voter.length + stepsData.candidate.length + stepsData.observer.length,
      quizQuestions:  10,
      roles:          rolesData.length,
    }
  });
});

module.exports = router;
