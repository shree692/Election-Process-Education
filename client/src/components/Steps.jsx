import React, { useState, useEffect } from 'react';
import { apiUrl } from '../api';

const tabs = [
  { key: 'voter',     label: '👤 Voter' },
  { key: 'candidate', label: '🏅 Candidate' },
  { key: 'observer',  label: '👁️ Observer' },
];

export default function Steps() {
  const [activeTab, setActiveTab] = useState('voter');
  const [steps, setSteps]         = useState([]);

  useEffect(() => {
    fetch(apiUrl(`/api/data/steps?tab=${activeTab}`))
      .then(r => r.json())
      .then(d => setSteps(d.steps))
      .catch(() => setSteps([]));
  }, [activeTab]);

  return (
    <section className="section steps-section" id="steps">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">📋 Steps</span>
          <h2 className="section-title">How to Participate</h2>
          <p className="section-desc">From registering as a voter to casting your ballot — here's your complete participation guide.</p>
        </div>
        <div className="steps-tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`steps-tab ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="steps-content">
          {steps.map((s, i) => (
            <div key={i} className="step-card" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="step-num">{i + 1}</div>
              <div className="step-body">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
