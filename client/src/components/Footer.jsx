import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:'1.4rem' }}>🗳️</span>
              <span className="logo-text">ElectEd</span>
            </div>
            <p>Empowering citizens through election education.</p>
          </div>
          <div className="footer-links-col">
            <h4>Explore</h4>
            <a href="#overview">Overview</a>
            <a href="#timeline">Timeline</a>
            <a href="#steps">Steps</a>
            <a href="#roles">Roles</a>
            <a href="#quiz">Quiz</a>
          </div>
          <div className="footer-links-col">
            <h4>Resources</h4>
            <a href="#assistant">AI Assistant</a>
            <a href="https://github.com/shree692/Election-Process-Education" target="_blank" rel="noreferrer">GitHub Repo</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 ElectEd. Built for civic education and democratic awareness.</p>
        </div>
      </div>
    </footer>
  );
}
