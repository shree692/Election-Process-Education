/* ══════════════════════════════════════════
   ElectEd – Express Server
   ══════════════════════════════════════════ */
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const chatRouter = require('./routes/chat');
const quizRouter = require('./routes/quiz');
const dataRouter = require('./routes/data');

const app  = express();
const PORT = process.env.PORT || 5500;

/* ── Middleware ── */
app.use(cors());
app.use(express.json());

/* ── Serve static frontend files ── */
app.use(express.static(path.join(__dirname)));

/* ── API Routes ── */
app.use('/api/chat',  chatRouter);
app.use('/api/quiz',  quizRouter);
app.use('/api/data',  dataRouter);

/* ── Health check ── */
app.get('/api/health', (req, res) => {
  res.json({
    status:  'ok',
    service: 'ElectEd Backend',
    version: '1.0.0',
    uptime:  Math.floor(process.uptime()) + 's',
    time:    new Date().toISOString(),
  });
});

/* ── Catch-all: serve frontend for any unknown route ── */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* ── Start ── */
app.listen(PORT, () => {
  console.log(`\n  🗳️  ElectEd server running`);
  console.log(`  ➜  Local:   http://localhost:${PORT}`);
  console.log(`  ➜  API:     http://localhost:${PORT}/api/health\n`);
});
