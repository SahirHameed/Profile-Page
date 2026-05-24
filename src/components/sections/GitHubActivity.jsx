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

const formatEvent = (event) => {
  const repo = event.repo?.name?.replace(`${USERNAME}/`, '') || event.repo?.name;

  switch (event.type) {
    case 'PushEvent': {
      const commits = event.payload?.commits || [];
      const msg = commits.length > 0 ? commits[0].message.split('\n')[0] : 'pushed code';
      return { type: 'push', repo, detail: msg, count: commits.length };
    }
    case 'CreateEvent':
      return { type: 'create', repo, detail: `created ${event.payload?.ref_type || 'repo'}${event.payload?.ref ? ` "${event.payload.ref}"` : ''}` };
    case 'WatchEvent':
      return { type: 'star', repo, detail: 'starred' };
    case 'ForkEvent':
      return { type: 'fork', repo, detail: 'forked' };
    case 'PullRequestEvent':
      return { type: 'pr', repo, detail: `${event.payload?.action} PR: ${event.payload?.pull_request?.title || ''}` };
    case 'IssuesEvent':
      return { type: 'issue', repo, detail: `${event.payload?.action} issue: ${event.payload?.issue?.title || ''}` };
    case 'DeleteEvent':
      return { type: 'delete', repo, detail: `deleted ${event.payload?.ref_type} "${event.payload?.ref}"` };
    default:
      return { type: event.type.replace('Event', '').toLowerCase(), repo, detail: '' };
  }
};

const GitHubActivity = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cached = sessionStorage.getItem('gh_events');
    if (cached) {
      try {
        setEvents(JSON.parse(cached));
        setLoading(false);
        return;
      } catch {}
    }

    fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=8`)
      .then(res => {
        if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const formatted = data.map(e => ({
          ...formatEvent(e),
          time: e.created_at,
          id: e.id,
        }));
        setEvents(formatted);
        sessionStorage.setItem('gh_events', JSON.stringify(formatted));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <TerminalBlock command="git fetch --contributions" id="activity">
      {loading && (
        <div className="github-activity__loading">
          Fetching from github.com/{USERNAME}...
        </div>
      )}

      {error && (
        <div className="github-activity__error">
          Unable to fetch activity — <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noopener noreferrer">view on GitHub</a>
        </div>
      )}

      {!loading && !error && (
        <Fade triggerOnce cascade damping={0.06}>
          {events.map((event) => (
            <div key={event.id} className="github-activity__event">
              <div className="github-activity__event-header">
                <div>
                  <span className="github-activity__event-type">{event.type}</span>
                  {' '}
                  <span className="github-activity__event-repo">{event.repo}</span>
                </div>
                <span className="github-activity__event-time">{timeAgo(event.time)}</span>
              </div>
              {event.detail && (
                <div className="github-activity__event-detail">
                  {event.type === 'push' && event.count > 1
                    ? `${event.count} commits — ${event.detail}`
                    : event.detail
                  }
                </div>
              )}
            </div>
          ))}
        </Fade>
      )}
    </TerminalBlock>
  );
};

export default GitHubActivity;
