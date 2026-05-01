/* ══════════════════════════════════════════
   ElectEd – app.js  (API-connected frontend)
   ══════════════════════════════════════════ */

const API = ''; // Same origin — no prefix needed

/* ── THEME TOGGLE ── */
const html     = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');

function setTheme(t) {
  html.setAttribute('data-theme', t);
  localStorage.setItem('elected-theme', t);
}
themeBtn.addEventListener('click', () => {
  setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});
const saved = localStorage.getItem('elected-theme');
if (saved) setTheme(saved);

/* ── HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('.nav-link').forEach(l =>
  l.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ── NAVBAR SCROLL ── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.boxShadow =
    window.scrollY > 10 ? '0 2px 24px rgba(0,0,0,.2)' : 'none';
});

/* ── SCROLL ANIMATIONS ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.animate-fade-up').forEach(el => observer.observe(el));

/* ── COUNTER ANIMATION ── */
function animateCount(el, target) {
  let cur = 0;
  const step = Math.ceil(target / 30);
  const timer = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur + '+';
    if (cur >= target) clearInterval(timer);
  }, 40);
}
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(el => animateCount(el, +el.dataset.count));
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ── PARTICLES ── */
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('span');
    const size = Math.random() * 4 + 2;
    p.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;
      background:rgba(108,99,255,${Math.random() * 0.5 + 0.1});
      left:${Math.random() * 100}%;top:${Math.random() * 100}%;
      animation:float ${4 + Math.random() * 6}s ease-in-out infinite;
      animation-delay:${Math.random() * 4}s;`;
    container.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `@keyframes float{0%,100%{transform:translateY(0) scale(1);opacity:.6}50%{transform:translateY(-24px) scale(1.2);opacity:1}}`;
  document.head.appendChild(style);
})();

/* ══════════════════════════════════════════
   HELPER: fade-in observer for dynamically added cards
   ══════════════════════════════════════════ */
function observeFadeIn(el, delay = 0) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity .5s ease ${delay}ms, transform .5s ease ${delay}ms`;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  obs.observe(el);
}

/* ══════════════════════════════════════════
   TIMELINE  –  fetch from /api/data/timeline
   ══════════════════════════════════════════ */
async function loadTimeline() {
  const track = document.getElementById('timeline-track');
  try {
    const res  = await fetch(`${API}/api/data/timeline`);
    const data = await res.json();
    data.timeline.forEach((item, i) => {
      const div   = document.createElement('div');
      div.className = 'tl-item';
      const isOdd = i % 2 === 0;
      div.innerHTML = `
        ${isOdd ? '' : '<div class="tl-spacer"></div>'}
        <div class="tl-card">
          <span class="tl-date">${item.date}</span>
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
        </div>
        <div class="tl-dot">${item.icon}</div>
        ${isOdd ? '<div class="tl-spacer"></div>' : ''}
      `;
      track.appendChild(div);
      observeFadeIn(div.querySelector('.tl-card'), i * 80);
    });
  } catch {
    track.innerHTML = '<p style="text-align:center;color:var(--text2)">Could not load timeline. Is the server running?</p>';
  }
}
loadTimeline();

/* ══════════════════════════════════════════
   STEPS  –  fetch from /api/data/steps?tab=
   ══════════════════════════════════════════ */
async function renderSteps(tab) {
  const content = document.getElementById('steps-content');
  content.innerHTML = '<p style="text-align:center;color:var(--text2);padding:20px">Loading…</p>';
  try {
    const res  = await fetch(`${API}/api/data/steps?tab=${tab}`);
    const data = await res.json();
    content.innerHTML = '';
    data.steps.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'step-card';
      card.innerHTML = `
        <div class="step-num">${i + 1}</div>
        <div class="step-body"><h4>${s.title}</h4><p>${s.desc}</p></div>
      `;
      content.appendChild(card);
      observeFadeIn(card, i * 80);
    });
  } catch {
    content.innerHTML = '<p style="text-align:center;color:var(--text2)">Could not load steps.</p>';
  }
}

renderSteps('voter');
document.querySelectorAll('.steps-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.steps-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderSteps(btn.dataset.tab);
  });
});

/* ══════════════════════════════════════════
   ROLES  –  fetch from /api/data/roles
   ══════════════════════════════════════════ */
async function loadRoles() {
  const grid = document.getElementById('roles-grid');
  try {
    const res  = await fetch(`${API}/api/data/roles`);
    const data = await res.json();
    data.roles.forEach((r, i) => {
      const card = document.createElement('div');
      card.className = 'role-card';
      card.innerHTML = `<span class="role-emoji">${r.emoji}</span><h3>${r.title}</h3><p>${r.desc}</p>`;
      grid.appendChild(card);
      observeFadeIn(card, i * 60);
    });
  } catch {
    grid.innerHTML = '<p style="color:var(--text2)">Could not load roles.</p>';
  }
}
loadRoles();

/* ══════════════════════════════════════════
   QUIZ  –  fetch questions from /api/quiz/questions
            answers checked via /api/quiz/answer/:id
            scores posted to  /api/quiz/score
   ══════════════════════════════════════════ */
let questions = [], qIndex = 0, score = 0, answered = false;

async function initQuiz() {
  try {
    const res  = await fetch(`${API}/api/quiz/questions`);
    const data = await res.json();
    questions  = data.questions;
    loadQuestion();
  } catch {
    document.getElementById('quiz-question').textContent = 'Could not load quiz. Is the server running?';
  }
}

function loadQuestion() {
  if (!questions.length) return;
  const q = questions[qIndex];
  document.getElementById('quiz-counter').textContent    = `Question ${qIndex + 1} of ${questions.length}`;
  document.getElementById('quiz-score-live').textContent = `Score: ${score}`;
  document.getElementById('quiz-question').textContent   = q.q;
  document.getElementById('quiz-explanation').classList.add('hidden');
  document.getElementById('quiz-next-btn').disabled = true;
  document.getElementById('quiz-progress-fill').style.width = `${(qIndex / questions.length) * 100}%`;

  const opts = document.getElementById('quiz-options');
  opts.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn     = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.id          = `opt-${i}`;
    btn.addEventListener('click', () => selectAnswer(i, q.id));
    opts.appendChild(btn);
  });
  answered = false;
}

async function selectAnswer(chosen, questionId) {
  if (answered) return;
  answered = true;
  const opts = document.querySelectorAll('.quiz-option');
  opts.forEach(b => b.disabled = true);

  try {
    const res  = await fetch(`${API}/api/quiz/answer/${questionId}`);
    const data = await res.json();
    const correct = data.ans;

    opts[correct].classList.add('correct');
    if (chosen !== correct) opts[chosen].classList.add('wrong');
    else score++;

    document.getElementById('quiz-score-live').textContent = `Score: ${score}`;
    const exp = document.getElementById('quiz-explanation');
    exp.textContent = '💡 ' + data.exp;
    exp.classList.remove('hidden');
    document.getElementById('quiz-next-btn').disabled = false;
  } catch {
    document.getElementById('quiz-next-btn').disabled = false;
  }
}

document.getElementById('quiz-next-btn').addEventListener('click', () => {
  qIndex++;
  if (qIndex < questions.length) loadQuestion();
  else showResult();
});

async function showResult() {
  document.getElementById('quiz-card').classList.add('hidden');
  const resultEl = document.getElementById('quiz-result');
  resultEl.classList.remove('hidden');

  const pct  = score / questions.length;
  const icons = ['😅','🤔','📚','👍','🌟','🏆'];
  const msgs  = ['Keep Learning!','Getting There!','Good Effort!','Well Done!','Great Job!','Election Expert!'];
  const descs = [
    "Don't worry — every expert started here. Review the guide and try again!",
    "You're on the right track! A little more reading will help.",
    'Solid understanding! Revisit a few sections to boost your score.',
    'You know your stuff! A quick review will make you an expert.',
    'Impressive! You have a strong grasp of the election process.',
    'Outstanding! You clearly understand elections inside and out! 🎉',
  ];
  const idx = Math.min(Math.floor(pct * 5.99), 5);
  document.getElementById('result-icon').textContent    = icons[idx];
  document.getElementById('result-title').textContent   = msgs[idx];
  document.getElementById('result-desc').textContent    = descs[idx];
  document.getElementById('result-score-text').textContent = `${score}/${questions.length}`;

  // Ring animation
  const circumference = 2 * Math.PI * 50;
  const svg = document.getElementById('result-ring-svg');
  if (!svg.querySelector('defs')) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
    defs.innerHTML = `<linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6c63ff"/><stop offset="100%" stop-color="#43e97b"/></linearGradient>`;
    svg.prepend(defs);
  }
  setTimeout(() => {
    document.getElementById('ring-fill').style.strokeDashoffset = circumference - pct * circumference;
  }, 300);

  // Show name input + submit score
  showScoreSubmit();

  // Load leaderboard
  loadLeaderboard();
}

function showScoreSubmit() {
  const resultEl = document.getElementById('quiz-result');
  if (document.getElementById('score-submit-area')) return;
  const area = document.createElement('div');
  area.id    = 'score-submit-area';
  area.style.cssText = 'margin:16px 0;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;';
  area.innerHTML = `
    <input id="player-name" type="text" placeholder="Your name for leaderboard" maxlength="30"
      style="padding:10px 16px;border-radius:999px;border:1px solid var(--border);
             background:var(--bg2);color:var(--text);font-size:.9rem;outline:none;font-family:inherit;min-width:200px;"/>
    <button id="submit-score-btn" class="btn btn-primary" style="padding:10px 20px;">
      Save Score 🏆
    </button>
  `;
  resultEl.insertBefore(area, document.getElementById('quiz-restart-btn'));
  document.getElementById('submit-score-btn').addEventListener('click', submitScore);
}

async function submitScore() {
  const name  = (document.getElementById('player-name').value || '').trim();
  if (!name) { document.getElementById('player-name').focus(); return; }
  try {
    const res  = await fetch(`${API}/api/quiz/score`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, score, total: questions.length }),
    });
    const data = await res.json();
    document.getElementById('submit-score-btn').textContent = `Saved! You're #${data.rank} 🎉`;
    document.getElementById('submit-score-btn').disabled    = true;
    loadLeaderboard();
  } catch { /* silent */ }
}

async function loadLeaderboard() {
  let board = document.getElementById('leaderboard-area');
  if (!board) {
    board    = document.createElement('div');
    board.id = 'leaderboard-area';
    board.style.cssText = 'margin-top:24px;text-align:left;';
    document.getElementById('quiz-result').appendChild(board);
  }
  try {
    const res  = await fetch(`${API}/api/quiz/leaderboard`);
    const data = await res.json();
    if (!data.leaderboard.length) {
      board.innerHTML = '<p style="text-align:center;color:var(--text2);font-size:.85rem">Be the first on the leaderboard!</p>';
      return;
    }
    board.innerHTML = `
      <h4 style="font-family:var(--font2);font-weight:700;margin-bottom:12px;text-align:center;">🏆 Leaderboard – Top 10</h4>
      <table style="width:100%;border-collapse:collapse;font-size:.85rem;">
        <thead>
          <tr style="color:var(--text2);border-bottom:1px solid var(--border);">
            <th style="padding:8px 4px;text-align:left;">#</th>
            <th style="padding:8px 4px;text-align:left;">Name</th>
            <th style="padding:8px 4px;text-align:center;">Score</th>
            <th style="padding:8px 4px;text-align:center;">%</th>
            <th style="padding:8px 4px;text-align:right;">Date</th>
          </tr>
        </thead>
        <tbody>
          ${data.leaderboard.map((e, i) => `
            <tr style="border-bottom:1px solid var(--border);">
              <td style="padding:8px 4px;">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
              <td style="padding:8px 4px;font-weight:600;">${e.name}</td>
              <td style="padding:8px 4px;text-align:center;">${e.score}/${e.total}</td>
              <td style="padding:8px 4px;text-align:center;color:var(--accent);">${e.percent}%</td>
              <td style="padding:8px 4px;text-align:right;color:var(--text2);">${e.date}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  } catch { /* silent */ }
}

document.getElementById('quiz-restart-btn').addEventListener('click', () => {
  qIndex = 0; score = 0;
  document.getElementById('quiz-result').classList.add('hidden');
  document.getElementById('quiz-card').classList.remove('hidden');
  document.getElementById('ring-fill').style.strokeDashoffset = '314';
  const sub = document.getElementById('score-submit-area');
  if (sub) sub.remove();
  const lb = document.getElementById('leaderboard-area');
  if (lb) lb.remove();
  loadQuestion();
});

initQuiz();

/* ══════════════════════════════════════════
   AI ASSISTANT  –  POST /api/chat
   ══════════════════════════════════════════ */
function formatBotText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" style="color:var(--accent)">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^/, '<p>').replace(/$/, '</p>');
}

function addBubble(text, role, isHtml = false) {
  const win   = document.getElementById('chat-window');
  const wrap  = document.createElement('div');
  wrap.className = `chat-bubble ${role}`;
  const avatar = role === 'bot' ? '🤖' : '👤';
  const body   = role === 'bot'
    ? (isHtml ? text : formatBotText(text))
    : `<p>${text}</p>`;
  wrap.innerHTML = `<div class="bubble-avatar">${avatar}</div><div class="bubble-body">${body}</div>`;
  wrap.style.opacity   = '0';
  wrap.style.transform = 'translateY(10px)';
  win.appendChild(wrap);
  setTimeout(() => {
    wrap.style.transition = 'opacity .3s ease, transform .3s ease';
    wrap.style.opacity    = '1';
    wrap.style.transform  = 'translateY(0)';
  }, 20);
  win.scrollTop = win.scrollHeight;
}

function addTyping() {
  const win  = document.getElementById('chat-window');
  const wrap = document.createElement('div');
  wrap.className = 'chat-bubble bot';
  wrap.id        = 'typing-indicator';
  wrap.innerHTML = `<div class="bubble-avatar">🤖</div>
    <div class="bubble-body">
      <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>`;
  win.appendChild(wrap);
  win.scrollTop = win.scrollHeight;
}

async function handleSend(text) {
  const msg = text.trim();
  if (!msg) return;
  addBubble(msg, 'user');
  document.getElementById('chat-input').value = '';
  addTyping();
  try {
    const res  = await fetch(`${API}/api/chat`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ message: msg }),
    });
    const data = await res.json();
    document.getElementById('typing-indicator')?.remove();
    addBubble(data.reply || 'Sorry, I could not find an answer.', 'bot');
  } catch {
    document.getElementById('typing-indicator')?.remove();
    addBubble('⚠️ Could not reach the server. Make sure the backend is running (`node server.js`).', 'bot');
  }
}

document.getElementById('send-btn').addEventListener('click', () =>
  handleSend(document.getElementById('chat-input').value)
);
document.getElementById('chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSend(e.target.value);
});
document.querySelectorAll('.chip').forEach(chip =>
  chip.addEventListener('click', () => handleSend(chip.dataset.q))
);
