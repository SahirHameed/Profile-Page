import React from 'react';
import { Fade } from 'react-awesome-reveal';
import content from '../../content.json';
import TerminalBlock from '../ui/TerminalBlock';

const About = () => {
  const { about, general } = content;
  if (!about.enable_section) return null;

  return (
    <TerminalBlock command="cat about.json" id={about.section_id}>
      <div className="term-about-grid">
        <div>
          <Fade triggerOnce cascade damping={0.08}>
            <div className="term-json">
              <div className="term-json__brace">{'{'}</div>
              <div className="term-json__field">
                <span className="term-json__key">"role"</span>
                <span className="term-json__colon">: </span>
                <span className="term-json__string">"Data & AI Engineer"</span>
                <span className="term-json__comma">,</span>
              </div>
              <div className="term-json__field">
                <span className="term-json__key">"company"</span>
                <span className="term-json__colon">: </span>
                <span className="term-json__string">"Lockheed Martin"</span>
                <span className="term-json__comma">,</span>
              </div>
              <div className="term-json__field">
                <span className="term-json__key">"education"</span>
                <span className="term-json__colon">: </span>
                <span className="term-json__string">"Bachelor of Science in Computer Science"</span>
                <span className="term-json__comma">,</span>
              </div>
              <div className="term-json__field">
                <span className="term-json__key">"minor"</span>
                <span className="term-json__colon">: </span>
                <span className="term-json__string">"Business"</span>
                <span className="term-json__comma">,</span>
              </div>
              <div className="term-json__field">
                <span className="term-json__key">"university"</span>
                <span className="term-json__colon">: </span>
                <span className="term-json__string">"The University of Texas at Austin"</span>
                <span className="term-json__comma">,</span>
              </div>
              <div className="term-json__field">
                <span className="term-json__key">"location"</span>
                <span className="term-json__colon">: </span>
                <span className="term-json__string">{`"${general.location}"`}</span>
                <span className="term-json__comma">,</span>
              </div>
              <div className="term-json__field">
                <span className="term-json__key">"passion"</span>
                <span className="term-json__colon">: </span>
                <span className="term-json__string">"Building things that matter"</span>
                <span className="term-json__comma">,</span>
              </div>
              <div className="term-json__field">
                <span className="term-json__key">"interests"</span>
                <span className="term-json__colon">: </span>
                <span className="term-json__bracket">[</span>
                <span className="term-json__string">"AI/ML"</span>
                <span className="term-json__comma">, </span>
                <span className="term-json__string">"Full-Stack Dev"</span>
                <span className="term-json__comma">, </span>
                <span className="term-json__string">"Claude"</span>
                <span className="term-json__comma">, </span>
                <span className="term-json__string">"Fitness"</span>
                <span className="term-json__comma">, </span>
                <span className="term-json__string">"Anime"</span>
                
                <span className="term-json__bracket">]</span>
              </div>
              <div className="term-json__brace">{'}'}</div>
            </div>
          </Fade>
        </div>

        <Fade triggerOnce direction="right">
          <div className="term-about-right">
            <img
              src={about.portrait_url}
              alt={`${general.first_name} ${general.last_name}`}
              className="term-about-image"
            />
          </div>
        </Fade>
      </div>
    </TerminalBlock>
  );
};

export default About;
