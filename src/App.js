import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Section Components
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import GitHubActivity from "./components/sections/GitHubActivity";
import Contact from "./components/sections/Contact";

// UI Components
import AnimatedBackground from "./components/ui/AnimatedBackground";
import Chatbot from "./components/ui/Chatbot";
import BackToTop from "./components/ui/BackToTop";
import CommandPalette from "./components/ui/CommandPalette";
import LiveTerminal from "./components/ui/LiveTerminal";
import MatrixRain from "./components/ui/MatrixRain";

// Hooks
import useKonamiCode from "./hooks/useKonamiCode";
import usePageTitle from "./hooks/usePageTitle";

// Other Pages
import Error404 from "./components/Error404";
import ErrorBoundary from "./components/ErrorBoundary";

// Styles
import "./styles/variables.css";
import "./styles/base.css";
import "./styles/animations.css";
import "./styles/components.css";
import "./styles/sections.css";
import "./styles/features.css";

// Main page component
const MainPage = () => {
  const { activated, dismiss } = useKonamiCode();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  usePageTitle();

  // Listen for custom event to open terminal
  useEffect(() => {
    const handler = () => setIsTerminalOpen(true);
    window.addEventListener('openTerminal', handler);
    return () => window.removeEventListener('openTerminal', handler);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const elementId = hash.replace('#', '');
        const element = document.getElementById(elementId);
        if (element) {
          const navbarHeight = 80;
          const offsetTop = element.offsetTop - navbarHeight;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  }, []);

  return (
    <div className="app">
      <AnimatedBackground />

      {/* Terminal Chrome — wraps the entire site */}
      <div className="terminal-shell">
        {/* Terminal title bar with traffic lights */}
        <div className="terminal-shell__titlebar">
          <div className="terminal-shell__dots">
            <span className="terminal-shell__dot terminal-shell__dot--red" />
            <span className="terminal-shell__dot terminal-shell__dot--yellow" />
            <span className="terminal-shell__dot terminal-shell__dot--green" />
          </div>
          <div className="terminal-shell__title">
            Sahir Hameed's Portfolio
          </div>
          <div className="terminal-shell__status">
            <span className="terminal-shell__status-dot" />
            <span>active</span>
          </div>
        </div>

        {/* Navbar lives inside the terminal */}
        <Navbar />
        <CommandPalette />

        <main className="terminal-shell__body">
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <GitHubActivity />
          <Contact />
        </main>

        <Footer />
      </div>

      <Chatbot />
      <BackToTop />
      <LiveTerminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      <MatrixRain active={activated} onDismiss={dismiss} />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
