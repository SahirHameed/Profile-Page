import React, { useState, useEffect } from 'react';
import { Fade } from 'react-awesome-reveal';
import TerminalBlock from '../ui/TerminalBlock';

const USERNAME = 'SahirHameed';

const timeAgo = (dateStr) => {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

const GitHubActivity = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cached = sessionStorage.getItem('gh_stats');
    if (cached) {
      try {
        setStats(JSON.parse(cached));
        setLoading(false);
        return;
      } catch {}
    }

    Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`).then(r => {
        if (!r.ok) throw new Error(`GitHub API: ${r.status}`);
        return r.json();
      }),
      fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`).then(r => {
        if (!r.ok) throw new Error(`GitHub API: ${r.status}`);
        return r.json();
      }),
    ])
      .then(([user, repos]) => {
        const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

        // Aggregate languages
        const langCount = {};
        repos.forEach(r => {
          if (r.language) {
            langCount[r.language] = (langCount[r.language] || 0) + 1;
          }
        });
        const topLangs = Object.entries(langCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([lang]) => lang);

        const lastPush = repos.length > 0 ? repos[0].pushed_at : null;

        const result = {
          publicRepos: user.public_repos,
          followers: user.followers,
          totalStars,
          topLanguages: topLangs,
          lastActive: lastPush,
        };

        setStats(result);
        sessionStorage.setItem('gh_stats', JSON.stringify(result));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <TerminalBlock command="git log --stat" id="activity">
      {loading && (
        <div className="github-activity__loading">
          Fetching from github.com/{USERNAME}...
        </div>
      )}

      {error && (
        <div className="github-activity__error">
          Unable to fetch stats — <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noopener noreferrer">view on GitHub</a>
        </div>
      )}

      {!loading && !error && stats && (
        <Fade triggerOnce cascade damping={0.08}>
          <div className="github-activity__stats">
            <div className="github-activity__stat-row">
              <span className="github-activity__stat-label">public repos</span>
              <span className="github-activity__stat-value--accent">{stats.publicRepos}</span>
            </div>
            <div className="github-activity__stat-row">
              <span className="github-activity__stat-label">total stars</span>
              <span className="github-activity__stat-value--accent">{stats.totalStars}</span>
            </div>
            <div className="github-activity__stat-row">
              <span className="github-activity__stat-label">followers</span>
              <span className="github-activity__stat-value">{stats.followers}</span>
            </div>
            <div className="github-activity__stat-row">
              <span className="github-activity__stat-label">top languages</span>
              <span className="github-activity__stat-value">{stats.topLanguages.join(', ')}</span>
            </div>
            {stats.lastActive && (
              <div className="github-activity__stat-row">
                <span className="github-activity__stat-label">last active</span>
                <span className="github-activity__stat-value">{timeAgo(stats.lastActive)}</span>
              </div>
            )}
          </div>
        </Fade>
      )}
    </TerminalBlock>
  );
};

export default GitHubActivity;
