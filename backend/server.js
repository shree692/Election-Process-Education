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

/* ── Serve React build (production) or legacy HTML ── */
const publicDir = path.join(__dirname, 'public');
const legacyDir = path.join(__dirname);
if (require('fs').existsSync(publicDir)) {
  app.use(express.static(publicDir));
} else {
  app.use(express.static(legacyDir));
}

/* ── API Routes ── */
app.use('/api/chat',  chatRouter);
app.use('/api/quiz',  quizRouter);
app.use('/api/data',  dataRouter);

/* ── Health check ── */
app.get('/api/health', (req, res) => {
  res.json({
    status:  'ok',
    service: 'ElectEd Backend',
    version: '2.0.0',
    mode:    require('fs').existsSync(publicDir) ? 'react' : 'legacy',
    uptime:  Math.floor(process.uptime()) + 's',
    time:    new Date().toISOString(),
  });
});

/* ── Catch-all: serve React SPA for any unknown route ── */
app.get('*', (req, res) => {
  const indexFile = require('fs').existsSync(publicDir)
    ? path.join(publicDir, 'index.html')
    : path.join(legacyDir, 'index.html');
  res.sendFile(indexFile);
});

/* ── Start ── */
app.listen(PORT, () => {
  console.log(`\n  🗳️  ElectEd server running`);
  console.log(`  ➜  Local:   http://localhost:${PORT}`);
  console.log(`  ➜  API:     http://localhost:${PORT}/api/health\n`);
});
