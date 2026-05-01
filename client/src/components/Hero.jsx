import React, { useEffect, useRef, useState } from 'react';

function useCountUp(target, started) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let cur = 0;
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      setCount(cur);
      if (cur >= target) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [started, target]);
  return count;
}

export default function Hero() {
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    // Particles
    const container = document.getElementById('particles-container');
    if (container && !container.children.length) {
      for (let i = 0; i < 28; i++) {
        const p = document.createElement('span');
        const size = Math.random() * 4 + 2;
        p.className = 'particle';
        p.style.cssText = `width:${size}px;height:${size}px;
          background:rgba(108,99,255,${Math.random()*.5+.1});
          left:${Math.random()*100}%;top:${Math.random()*100}%;
          animation:float ${4+Math.random()*6}s ease-in-out infinite;
          animation-delay:${Math.random()*4}s;`;
        container.appendChild(p);
      }
    }

    // Stats counter trigger
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); }
    }, { threshold: 0.5 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const stages   = useCountUp(8,  statsVisible);
  const guides   = useCountUp(12, statsVisible);
  const questions = useCountUp(10, statsVisible);

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="hero-orb orb-1" />
        <div className="hero-orb orb-2" />
        <div className="hero-orb orb-3" />
        <div className="particles-container" id="particles-container" />
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span>🏛️</span> Democracy Starts With You
        </div>
        <h1 className="hero-title">
          Understand the<br />
          <span className="gradient-text">Election Process</span><br />
          Like Never Before
        </h1>
        <p className="hero-subtitle">
          An interactive guide to timelines, voter registration, polling, and everything you need to participate confidently in democracy.
        </p>
        <div className="hero-actions">
          <a href="#timeline" className="btn btn-primary">
            <span>Explore Timeline</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="#assistant" className="btn btn-ghost">Ask the AI Assistant</a>
        </div>

        <div className="hero-stats" ref={statsRef}>
          <div className="stat-card">
            <span className="stat-num">{stages}+</span>
            <span className="stat-label">Key Stages</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{guides}+</span>
            <span className="stat-label">Step-by-Step Guides</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{questions}+</span>
            <span className="stat-label">Quiz Questions</span>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-dot" />
      </div>
    </section>
  );
}
