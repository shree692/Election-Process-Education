import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#overview', label: 'Overview' },
    { href: '#timeline', label: 'Timeline' },
    { href: '#steps',    label: 'Steps' },
    { href: '#roles',    label: 'Roles' },
    { href: '#quiz',     label: 'Quiz' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-inner">
        <a href="#hero" className="nav-logo">
          <span className="logo-icon">🗳️</span>
          <span className="logo-text">ElectEd</span>
        </a>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="nav-link" onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#assistant" className="nav-link nav-cta" onClick={() => setMenuOpen(false)}>
              Ask AI
            </a>
          </li>
        </ul>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="theme-icon sun">☀️</span>
            <span className="theme-icon moon">🌙</span>
            <span className="toggle-knob" />
          </button>
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
