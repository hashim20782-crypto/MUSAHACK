import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

export function ThemeToggle({ variant = 'default', compact = false, className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const isCompact = compact || variant === 'compact';

  const handleClick = (e) => {
    const knob = e.currentTarget.querySelector('.pill-knob');
    if (knob) {
      knob.style.willChange = 'transform';
      const onEnd = (evt) => {
        if (evt.propertyName === 'transform') {
          knob.style.willChange = 'auto';
          knob.removeEventListener('transitionend', onEnd);
        }
      };
      knob.addEventListener('transitionend', onEnd);
    }
    toggleTheme();
  };

  const pillSwitch = (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      data-theme-state={isDark ? 'dark' : 'light'}
      onClick={handleClick}
      className={`pill-switch ${isCompact ? 'pill-compact' : ''} ${variant !== 'sidebar' ? className : ''}`}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Light Track Layer (Smooth opacity crossfade) */}
      <span className="pill-track pill-track-light" aria-hidden="true" />
      {/* Dark Track Layer (Smooth opacity crossfade) */}
      <span className="pill-track pill-track-dark" aria-hidden="true" />

      {/* Stars on the LEFT (visible in dark mode, twinkling) */}
      <svg viewBox="0 0 20 12" className="pill-stars" fill="none" aria-hidden="true">
        <g className="pill-stars-twinkle">
          {/* Larger sparkle star */}
          <path
            d="M5 1 C5 3 3.5 4.5 1.5 4.5 C3.5 4.5 5 6 5 8 C5 6 6.5 4.5 8.5 4.5 C6.5 4.5 5 3 5 1 Z"
            fill="#ffffff"
          />
          {/* Smaller sparkle star */}
          <path
            d="M15 5.5 C15 7 13.8 8 12.5 8 C13.8 8 15 9 15 10.5 C15 9 16.2 8 17.5 8 C16.2 8 15 7 15 5.5 Z"
            fill="#ffffff"
          />
          {/* Small dash between them */}
          <line x1="9.5" y1="6.5" x2="11.5" y2="6.5" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        </g>
      </svg>

      {/* Cloud on the RIGHT (visible in light mode) */}
      <svg viewBox="0 0 20 12" className="pill-cloud" fill="none" aria-hidden="true">
        <path
          d="M4.5 11h11a2.5 2.5 0 0 0 .5-4.9A3.8 3.8 0 0 0 8.5 4 3 3 0 0 0 4.2 7.8 2.5 2.5 0 0 0 4.5 11z"
          fill="#f3f1ff"
        />
      </svg>

      {/* Sliding Knob (Sun on Left, Moon on Right) */}
      <div className="pill-knob">
        {/* Sun Face (Light mode) */}
        <div className="pill-sun-face" aria-hidden="true" />

        {/* Moon Face with Craters (Dark mode) */}
        <div className="pill-moon-face" aria-hidden="true">
          <div
            className="pill-crater"
            style={{ top: '22%', left: '22%', width: '22%', height: '22%' }}
          />
          <div
            className="pill-crater"
            style={{ top: '48%', left: '56%', width: '28%', height: '28%' }}
          />
          <div
            className="pill-crater"
            style={{ top: '64%', left: '24%', width: '16%', height: '16%' }}
          />
        </div>
      </div>
    </button>
  );

  if (variant === 'sidebar') {
    return (
      <div className={`theme-toggle-sidebar-row ${className}`}>
        <span className="theme-toggle-label" style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--nav-text)' }}>
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
        {pillSwitch}
      </div>
    );
  }

  return pillSwitch;
}
