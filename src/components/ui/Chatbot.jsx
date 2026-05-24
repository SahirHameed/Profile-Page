import React, { useState, useRef, useEffect, useCallback } from 'react';
import { HiX } from 'react-icons/hi';
import { FaRobot, FaPaperPlane, FaFileAlt, FaCode, FaEnvelope } from 'react-icons/fa';
import content from '../../content.json';

const buildResponses = () => {
  const { general, about, experience, projects, skills, education } = content;

  const skillsList = skills.categories.map(c => `**${c.name}:** ${c.items.join(', ')}`).join('\n');
  const expList = experience.items.map(e =>
    `**${e.title}** at ${e.company} (${e.start_date} – ${e.end_date || 'Present'})`
  ).join('\n');
  const projList = projects.items.map(p =>
    `**${p.name}** — ${p.description.slice(0, 80)}...`
  ).join('\n');

  const edu = education.items[0];
  const courseworkList = edu.coursework.join(', ');

  return {
    greeting: {
      text: `Hey! I'm Sahir's digital twin. Ask me anything about his background, skills, or what he's looking for. Or pick a question below!`,
      followups: ['What are your skills?', 'Tell me about your experience', 'Are you open to new roles?'],
      quickActions: [
        { label: 'View Resume', icon: 'file', action: 'link', target: general.resume_url },
        { label: 'Projects', icon: 'code', action: 'scroll', target: 'projects' },
        { label: 'Contact', icon: 'email', action: 'scroll', target: 'contact' }
      ]
    },
    patterns: [
      {
        keywords: ['skill', 'tech', 'stack', 'language', 'framework', 'tool', 'know', 'proficient', 'good at'],
        response: {
          text: `Here's what Sahir works with:\n\n${skillsList}`,
          followups: ['Tell me about your experience', 'What projects have you built?']
        }
      },
      {
        keywords: ['experience', 'work', 'job', 'career', 'role', 'company', 'where have you worked'],
        response: {
          text: `Here's Sahir's professional journey:\n\n${expList}`,
          followups: ['What are your skills?', 'Are you open to new roles?']
        }
      },
      {
        keywords: ['project', 'built', 'made', 'portfolio', 'created', 'develop'],
        response: {
          text: `Some things Sahir has built:\n\n${projList}\n\nCheck out the Projects section for more details and GitHub links!`,
          followups: ['What are your skills?', 'Tell me about your experience']
        }
      },
      {
        keywords: ['open', 'new role', 'opportunity', 'hire', 'hiring', 'looking', 'available', 'relocate', 'remote'],
        response: {
          text: `Sahir is always open to hearing about exciting opportunities! He's currently a Data Engineer at Lockheed Martin, but great conversations can lead anywhere.\n\nBest way to reach out: **${general.email}**`,
          followups: ['What are your skills?', 'What kind of work excites you?']
        }
      },
      {
        keywords: ['education', 'school', 'university', 'degree', 'study', 'college', 'major', 'coursework', 'class'],
        response: {
          text: `Sahir graduated from **${edu.school}** with a **${edu.degree}** (${edu.graduation_date}).\n\n**Relevant Coursework:** ${courseworkList}`,
          followups: ['Tell me about your experience', 'What projects have you built?']
        }
      },
      {
        keywords: ['about', 'who', 'yourself', 'tell me about', 'bio', 'background', 'summary'],
        response: {
          text: about.bio.join('\n\n'),
          followups: ['What are your skills?', 'What kind of work excites you?']
        }
      },
      {
        keywords: ['contact', 'email', 'reach', 'connect', 'talk', 'message', 'linkedin'],
        response: {
          text: `You can reach Sahir at:\n\n📧 **${general.email}**\n💼 **LinkedIn:** linkedin.com/in/SahirHameed\n💻 **GitHub:** github.com/SahirHameed\n\nHe'd love to hear from you!`,
          followups: ['Are you open to new roles?', 'Tell me about your experience']
        }
      },
      {
        keywords: ['excite', 'passion', 'interest', 'love', 'enjoy', 'kind of work', 'motivated'],
        response: {
          text: `Sahir thrives at the intersection of **data engineering, ML, and building tools that matter**. He's passionate about turning complex problems into elegant solutions — whether that's defense systems at Lockheed Martin or AI-powered robots.\n\nOutside of code: working out, anime, and quality time with family and friends.`,
          followups: ['What are your skills?', 'What projects have you built?']
        }
      },
      {
        keywords: ['fit', 'team', 'culture', 'collaborate', 'work style', 'values'],
        response: {
          text: `Sahir is a **curious, self-driven builder** who values:\n\n• Solving real problems over building flashy demos\n• Clear communication and team collaboration\n• Continuous learning — always picking up new tools\n• Ownership — he takes pride in his work from start to finish\n\nHe's the kind of person who'll stay late debugging because the problem is *interesting*, not because someone asked.`,
          followups: ['Tell me about your experience', 'Are you open to new roles?']
        }
      },
      {
        keywords: ['salary', 'money', 'compensation', 'pay', 'rate'],
        response: {
          text: `That's a great conversation to have directly with Sahir! Reach out at **${general.email}** and he'd be happy to discuss.`,
          followups: ['Are you open to new roles?', 'What are your skills?']
        }
      },
      {
        keywords: ['resume', 'cv', 'download'],
        response: {
          text: `You can download Sahir's resume here: [Download Resume](${general.resume_url})`,
          followups: ['Tell me about your experience', 'What are your skills?']
        }
      }
    ],
    fallback: {
      text: `Hmm, I'm not sure about that one! I'm best at answering questions about Sahir's skills, experience, projects, and availability.\n\nTry one of the suggestions below, or reach out directly at **${general.email}**!`,
      followups: ['What are your skills?', 'Tell me about your experience', 'Are you open to new roles?']
    }
  };
};

const matchResponse = (input, responses) => {
  const lower = input.toLowerCase();
  for (const pattern of responses.patterns) {
    if (pattern.keywords.some(kw => lower.includes(kw))) {
      return pattern.response;
    }
  }
  return responses.fallback;
};

const renderMessageText = (text) => {
  return text.split('\n').map((line, j) => (
    <span key={j}>
      {line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/).map((part, k) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={k}>{part.slice(2, -2)}</strong>;
        }
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          return <a key={k} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="chatbot__link">{linkMatch[1]}</a>;
        }
        return part;
      })}
      {j < text.split('\n').length - 1 && <br />}
    </span>
  ));
};

const QuickActionIcon = ({ icon }) => {
  switch (icon) {
    case 'file': return <FaFileAlt size={14} />;
    case 'code': return <FaCode size={14} />;
    case 'email': return <FaEnvelope size={14} />;
    default: return null;
  }
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const responses = useRef(buildResponses()).current;

  // Lock body scroll on mobile when chatbot is open
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Handle iOS keyboard resize
  useEffect(() => {
    if (!isOpen || !window.visualViewport) return;

    const handleResize = () => {
      const isMobile = window.matchMedia('(max-width: 640px)').matches;
      if (!isMobile) return;
      const chatEl = document.querySelector('.chatbot--open');
      if (chatEl) {
        chatEl.style.height = `${window.visualViewport.height}px`;
      }
    };

    window.visualViewport.addEventListener('resize', handleResize);
    return () => window.visualViewport.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: 'bot', ...responses.greeting }]);
    }
  }, [isOpen, messages.length, responses.greeting]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const matched = matchResponse(text, responses);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', ...matched }]);
    }, 600 + Math.random() * 800);
  }, [responses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleFollowup = (q) => {
    sendMessage(q);
  };

  const handleQuickAction = (action) => {
    if (action.action === 'link') {
      window.open(action.target, '_blank');
    } else if (action.action === 'scroll') {
      setIsOpen(false);
      setTimeout(() => {
        const el = document.getElementById(action.target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  return (
    <>
      {/* Floating Toggle */}
      <button
        className={`chatbot-toggle ${isOpen ? 'chatbot-toggle--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat with Sahir's AI"
      >
        {isOpen ? <HiX size={22} /> : <FaRobot size={22} />}
        {!isOpen && <span className="chatbot-toggle__badge">Ask me anything</span>}
      </button>

      {/* Chat Window */}
      <div className={`chatbot ${isOpen ? 'chatbot--open' : ''}`}>
        <div className="chatbot__header">
          <div className="chatbot__header-info">
            <div className="chatbot__avatar">
              <FaRobot />
            </div>
            <div>
              <div className="chatbot__header-name">Ask Sahir</div>
              <div className="chatbot__header-status">
                <span className="chatbot__status-dot" />
                Always online
              </div>
            </div>
          </div>
          <button className="chatbot__close" onClick={() => setIsOpen(false)}>
            <HiX size={18} />
          </button>
        </div>

        <div className="chatbot__messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot__msg chatbot__msg--${msg.sender}`}>
              {msg.sender === 'bot' && (
                <div className="chatbot__msg-avatar"><FaRobot size={12} /></div>
              )}
              <div className="chatbot__msg-bubble">
                <div className="chatbot__msg-text">
                  {renderMessageText(msg.text)}
                </div>
                {msg.quickActions && (
                  <div className="chatbot__quick-actions">
                    {msg.quickActions.map((action, j) => (
                      <button
                        key={j}
                        className="chatbot__quick-action"
                        onClick={() => handleQuickAction(action)}
                      >
                        <QuickActionIcon icon={action.icon} />
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
                {msg.followups && (
                  <div className="chatbot__followups">
                    {msg.followups.map((q, j) => (
                      <button
                        key={j}
                        className="chatbot__followup"
                        onClick={() => handleFollowup(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chatbot__msg chatbot__msg--bot">
              <div className="chatbot__msg-avatar"><FaRobot size={12} /></div>
              <div className="chatbot__msg-bubble chatbot__msg-bubble--typing">
                <span className="chatbot__typing-dot" />
                <span className="chatbot__typing-dot" />
                <span className="chatbot__typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot__input-area" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="chatbot__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about skills, experience, projects..."
            disabled={isTyping}
          />
          <button type="submit" className="chatbot__send" disabled={!input.trim() || isTyping}>
            <FaPaperPlane size={14} />
          </button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;
