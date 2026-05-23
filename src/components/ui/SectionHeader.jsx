import React from 'react';
import { Fade } from 'react-awesome-reveal';

const SectionHeader = ({ title, subtitle }) => {
  return (
    <Fade triggerOnce direction="up">
      <div className="section-header">
        <div className="section-header__blades">
          <div className="section-header__blade section-header__blade--left" />
          <h2 className="section-header__title">{title}</h2>
          <div className="section-header__blade section-header__blade--right" />
        </div>
        {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
      </div>
    </Fade>
  );
};

export default SectionHeader;
