import React, { useState, useEffect, useRef } from 'react';
import { apiUrl } from '../api';

export default function Timeline() {
  const [items, setItems] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    fetch(apiUrl('/api/data/timeline'))
      .then(r => r.json())
      .then(d => setItems(d.timeline))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (!items.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    cardRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  return (
    <section className="section timeline-section" id="timeline">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">📅 Timeline</span>
          <h2 className="section-title">Election Calendar</h2>
          <p className="section-desc">Follow the chronological journey of an election from announcement to results.</p>
        </div>
        <div className="timeline">
          {items.map((item, i) => (
            <div key={i} className="tl-item">
              {i % 2 === 0 ? null : <div className="tl-spacer" />}
              <div className="tl-card" ref={el => cardRefs.current[i] = el}>
                <span className="tl-date">{item.date}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <div className="tl-dot">{item.icon}</div>
              {i % 2 === 0 ? <div className="tl-spacer" /> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
