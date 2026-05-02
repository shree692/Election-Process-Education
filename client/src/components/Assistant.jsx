import React, { useState, useRef, useEffect } from 'react';
import { apiUrl } from '../api';

const CHIPS = [
  { label: 'Register to vote',  q: 'How do I register to vote?' },
  { label: 'Election Day',      q: 'What happens on election day?' },
  { label: 'Constituencies',    q: 'What is a constituency?' },
  { label: 'Vote Counting',     q: 'How are votes counted?' },
  { label: 'About EVM',         q: 'What is EVM?' },
];

function formatText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" style="color:var(--accent)">$1</a>')
    .split('\n\n').map((p, i) => `<p key="${i}">${p.replace(/\n/g,'<br/>')}</p>`).join('');
}

export default function Assistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const windowRef = useRef(null);

  useEffect(() => {
    if (windowRef.current) windowRef.current.scrollTop = windowRef.current.scrollHeight;
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const msg = text.trim();
    if (!msg) return;
    setInput('');
    setMessages(m => [...m, { role:'user', text: msg }]);
    setTyping(true);
    try {
      const res  = await fetch(apiUrl('/api/chat'), {
        method: 'POST', headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setTyping(false);
      setMessages(m => [...m, { role:'bot', text: data.reply }]);
    } catch {
      setTyping(false);
      setMessages(m => [...m, { role:'bot', text: '⚠️ Could not reach the server. Make sure the backend is running.' }]);
    }
  };

  return (
    <section className="section assistant-section" id="assistant">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">🤖 AI Assistant</span>
          <h2 className="section-title">Ask About Elections</h2>
          <p className="section-desc">Got questions? Our AI-powered assistant is here to guide you through anything election-related.</p>
        </div>
        <div className="assistant-wrapper">
          <div className="chat-window" ref={windowRef}>
            {/* Welcome bubble */}
            <div className="chat-bubble bot">
              <div className="bubble-avatar">🤖</div>
              <div className="bubble-body">
                <p>Hello! I'm ElectBot 🗳️ — your election education assistant. Ask me anything about voting, registering, candidates, or how democracy works!</p>
                <div className="quick-chips">
                  {CHIPS.map(c => (
                    <button key={c.label} className="chip" onClick={() => sendMessage(c.q)}>{c.label}</button>
                  ))}
                </div>
              </div>
            </div>

            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                <div className="bubble-avatar">{m.role === 'bot' ? '🤖' : '👤'}</div>
                <div
                  className="bubble-body"
                  dangerouslySetInnerHTML={{ __html: m.role === 'bot' ? formatText(m.text) : `<p>${m.text}</p>` }}
                />
              </div>
            ))}

            {typing && (
              <div className="chat-bubble bot">
                <div className="bubble-avatar">🤖</div>
                <div className="bubble-body">
                  <div className="typing-dots">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Type your question about elections..."
              autoComplete="off"
            />
            <button className="send-btn" onClick={() => sendMessage(input)} aria-label="Send">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
