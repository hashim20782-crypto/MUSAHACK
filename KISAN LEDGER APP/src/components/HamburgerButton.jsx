import React, { forwardRef } from 'react';

export const HamburgerButton = forwardRef(function HamburgerButton(
  {
    id,
    isOpen,
    isVisible,
    onClick,
    className = ''
  },
  ref
) {
  return (
    <button
      ref={ref}
      id={id}
      type="button"
      onClick={onClick}
      aria-label="Toggle sidebar"
      aria-expanded={isOpen}
      aria-controls="app-sidebar"
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      className={`sidebar-toggle-btn ${isVisible ? 'btn-visible' : 'btn-hidden'} ${className}`}
      title="Toggle sidebar"
    >
      <svg
        className="hamburger-svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <line x1="3" y1="5" x2="17" y2="5" />
        <line x1="3" y1="10" x2="17" y2="10" />
        <line x1="3" y1="15" x2="17" y2="15" />
      </svg>
    </button>
  );
});
