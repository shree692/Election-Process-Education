import React, { useState, useEffect, useRef } from 'react';

const ICONS  = ['😅','🤔','📚','👍','🌟','🏆'];
const MSGS   = ['Keep Learning!','Getting There!','Good Effort!','Well Done!','Great Job!','Election Expert!'];
const DESCS  = [
  "Don't worry — every expert started here. Review the guide and try again!",
  "You're on the right track! A little more reading will help.",
  'Solid understanding! Revisit a few sections to boost your score.',
  'You know your stuff! A quick review will make you an expert.',
  'Impressive! You have a strong grasp of the election process.',
  'Outstanding! You clearly understand elections inside and out! 🎉',
];

export default function Quiz() {
  const [questions, setQuestions]   = useState([]);
  const [qIndex, setQIndex]         = useState(0);
  const [score, setScore]           = useState(0);
  const [selected, setSelected]     = useState(null); // {chosen, correct}
  const [explanation, setExplanation] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [scoreSaved, setScoreSaved] = useState(false);
  const [rank, setRank]             = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const ringRef = useRef(null);

  useEffect(() => {
    fetch('/api/quiz/questions').then(r => r.json()).then(d => setQuestions(d.questions));
  }, []);

  const total = questions.length;
  const q     = questions[qIndex];
  const pct   = total ? score / total : 0;
  const idx   = Math.min(Math.floor(pct * 5.99), 5);

  const selectAnswer = async (chosen) => {
    if (selected) return;
    const res  = await fetch(`/api/quiz/answer/${q.id}`);
    const data = await res.json();
    const correct = data.ans;
    setSelected({ chosen, correct });
    setExplanation(data.exp);
    if (chosen === correct) setScore(s => s + 1);
  };

  const next = () => {
    if (qIndex + 1 < total) {
      setQIndex(i => i + 1);
      setSelected(null);
      setExplanation('');
    } else {
      setShowResult(true);
      fetchLeaderboard();
      // ring animation
      setTimeout(() => {
        if (ringRef.current) {
          ringRef.current.style.strokeDashoffset = 314 - pct * 314;
        }
      }, 300);
    }
  };

  const saveScore = async () => {
    if (!playerName.trim()) return;
    const finalScore = selected && selected.chosen === selected.correct ? score : score;
    const res  = await fetch('/api/quiz/score', {
      method: 'POST', headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ name: playerName.trim(), score, total }),
    });
    const data = await res.json();
    setRank(data.rank);
    setScoreSaved(true);
    fetchLeaderboard();
  };

  const fetchLeaderboard = () => {
    fetch('/api/quiz/leaderboard').then(r => r.json()).then(d => setLeaderboard(d.leaderboard));
  };

  const restart = () => {
    setQIndex(0); setScore(0); setSelected(null); setExplanation('');
    setShowResult(false); setPlayerName(''); setScoreSaved(false); setRank(null);
    setLeaderboard([]);
    if (ringRef.current) ringRef.current.style.strokeDashoffset = '314';
  };

  if (!total) return (
    <section className="section quiz-section" id="quiz">
      <div className="container"><div className="section-header">
        <span className="section-tag">🧠 Quiz</span>
        <h2 className="section-title">Test Your Knowledge</h2>
      </div><div className="quiz-wrapper"><p style={{textAlign:'center',color:'var(--text2)'}}>Loading quiz…</p></div></div>
    </section>
  );

  return (
    <section className="section quiz-section" id="quiz">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">🧠 Quiz</span>
          <h2 className="section-title">Test Your Knowledge</h2>
          <p className="section-desc">How well do you understand the election process? Take the quiz to find out!</p>
        </div>
        <div className="quiz-wrapper">
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${(qIndex / total) * 100}%` }} />
          </div>

          {!showResult ? (
            <div className="quiz-card">
              <div className="quiz-meta">
                <span>Question {qIndex + 1} of {total}</span>
                <span>Score: {score}</span>
              </div>
              <div className="quiz-question">{q.q}</div>
              <div className="quiz-options">
                {q.opts.map((opt, i) => {
                  let cls = 'quiz-option';
                  if (selected) {
                    if (i === selected.correct) cls += ' correct';
                    else if (i === selected.chosen && i !== selected.correct) cls += ' wrong';
                  }
                  return (
                    <button key={i} className={cls} onClick={() => selectAnswer(i)} disabled={!!selected}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {explanation && <div className="quiz-explanation">💡 {explanation}</div>}
              <div className="quiz-actions">
                <button className="btn btn-primary" onClick={next} disabled={!selected}>Next →</button>
              </div>
            </div>
          ) : (
            <div className="quiz-result">
              <div className="result-icon">{ICONS[idx]}</div>
              <h3>{MSGS[idx]}</h3>
              <p>{DESCS[idx]}</p>
              <div className="result-score-ring">
                <svg viewBox="0 0 120 120">
                  <defs>
                    <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#6c63ff"/>
                      <stop offset="100%" stopColor="#43e97b"/>
                    </linearGradient>
                  </defs>
                  <circle cx="60" cy="60" r="50" className="ring-bg"/>
                  <circle cx="60" cy="60" r="50" className="ring-fill" ref={ringRef}/>
                </svg>
                <div className="result-score-text">{score}/{total}</div>
              </div>

              {!scoreSaved ? (
                <div className="score-submit-area">
                  <input className="score-input" value={playerName} onChange={e => setPlayerName(e.target.value)}
                    placeholder="Your name for leaderboard" maxLength={30}
                    onKeyDown={e => e.key === 'Enter' && saveScore()} />
                  <button className="btn btn-primary" onClick={saveScore}>Save Score 🏆</button>
                </div>
              ) : (
                <p style={{color:'var(--accent)',fontWeight:600,margin:'12px 0'}}>
                  Saved! You're #{rank} on the leaderboard 🎉
                </p>
              )}

              {leaderboard.length > 0 && (
                <div className="leaderboard">
                  <h4>🏆 Leaderboard – Top 10</h4>
                  <table className="lb-table">
                    <thead><tr><th>#</th><th>Name</th><th>Score</th><th>%</th><th style={{textAlign:'right'}}>Date</th></tr></thead>
                    <tbody>
                      {leaderboard.map((e, i) => (
                        <tr key={i}>
                          <td>{i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</td>
                          <td style={{fontWeight:600}}>{e.name}</td>
                          <td>{e.score}/{e.total}</td>
                          <td>{e.percent}%</td>
                          <td style={{textAlign:'right',color:'var(--text2)'}}>{e.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <button className="btn btn-primary" onClick={restart} style={{marginTop:24}}>Try Again 🔄</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
