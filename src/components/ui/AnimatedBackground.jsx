import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="claude-bg" aria-hidden="true">
      {/* Soft floating orbs — warm coral atmosphere */}
      <div className="claude-bg__orb claude-bg__orb--1" />
      <div className="claude-bg__orb claude-bg__orb--2" />
      <div className="claude-bg__orb claude-bg__orb--3" />

      {/* Decorative geometric accents */}
      <div className="claude-bg__shape claude-bg__shape--ring" />
      <div className="claude-bg__shape claude-bg__shape--diamond" />
      <div className="claude-bg__shape claude-bg__shape--dot-cluster" />

      {/* Anthropic spike mark accent */}
      <svg className="claude-bg__spike" viewBox="0 0 40 40" fill="none">
        <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <line x1="5.86" y1="5.86" x2="34.14" y2="34.14" stroke="currentColor" strokeWidth="1.5" />
        <line x1="34.14" y1="5.86" x2="5.86" y2="34.14" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

export default AnimatedBackground;
