import React, { useEffect, useRef } from 'react';

const cards = [
  { icon: '📜', title: 'Definition',       text: 'An election is a formal group decision-making process by which a population chooses an individual or multiple individuals to hold public office or endorse a proposal.' },
  { icon: '⚖️', title: 'Why It Matters',   text: 'Elections ensure that those in power are accountable to the people. Every vote shapes policy, public services, national security, and the future of society.' },
  { icon: '🌍', title: 'Types of Elections', text: 'From local municipal elections to national general elections, referendums, and by-elections — each serves a unique democratic purpose.', tags: ['General','Municipal','By-election','Referendum'] },
  { icon: '🏛️', title: 'Governing Bodies', text: 'Independent election commissions oversee elections to ensure fairness, transparency, and impartiality throughout the entire process.' },
];

export default function Overview() {
  const cardRefs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    cardRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section overview" id="overview">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">🗺️ Overview</span>
          <h2 className="section-title">What is an Election?</h2>
          <p className="section-desc">Elections are the cornerstone of democracy — a process by which citizens choose their representatives and shape their government.</p>
        </div>
        <div className="overview-grid">
          {cards.map((c, i) => (
            <div key={c.title} className="overview-card fade-in" ref={el => cardRefs.current[i] = el}>
              <div className="ov-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              {c.tags && (
                <div className="tag-row">
                  {c.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
