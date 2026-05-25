# Terminal Portfolio

A terminal-themed personal portfolio built with React. Features a dark UI styled like a developer terminal, complete with a command palette, chatbot, animated background, and a LaTeX resume that auto-syncs to the site.

**Live**: [sahirhameed.com](https://sahirhameed.com)

---

## Features

- **Terminal UI** -- entire site wrapped in a terminal chrome with traffic light dots, sticky navbar, and monospace styling
- **JSON-driven content** -- all site content lives in a single `src/content.json` file. Edit one file, the whole site updates
- **LaTeX resume sync** -- write your resume in `resume/resume.tex`, and a script parses it into `content.json` + compiles the PDF automatically
- **Command palette** -- `Cmd+K` / `Ctrl+K` to search and navigate sections
- **Chatbot** -- interactive chat widget in the corner
- **Konami code** -- enter the Konami code for a Matrix rain easter egg
- **Live terminal** -- expandable terminal panel with interactive commands
- **Scroll animations** -- subtle fade-in animations via `react-awesome-reveal`
- **Dark theme** -- dark base with orange/coral accents, fully customizable via CSS variables
- **Responsive** -- mobile-first design with breakpoints at 640px and 768px
- **GitHub stats** -- fetches and displays high-level GitHub profile stats

## Quick Start

```bash
# Clone the repo
git clone https://github.com/SahirHameed/Profile-Page.git
cd Profile-Page

# Install dependencies
npm install

# Start dev server
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Making It Yours

### 1. Update Content

All content is in **`src/content.json`**. Open it and replace with your own info:

| Section | What to change |
|---------|---------------|
| `general` | Name, email, social links, resume URL |
| `hero` | Greeting, tagline, floating cards |
| `about` | Bio, portrait image URL, highlights |
| `experience.items` | Work history (newest first) |
| `projects.items` | Project cards |
| `skills.categories` | Skill groups and items |
| `contact` | Contact CTA text and email |
| `footer` | Copyright name, tagline |

#### Adding a new job

Add to the top of the `experience.items` array:

```json
{
  "company": "Your Company",
  "location": "City, State",
  "title": "Your Title",
  "type": "Full-time",
  "start_date": "January 2025",
  "end_date": null,
  "is_current": true,
  "description": ["What you did", "Another thing you did"],
  "technologies": ["React", "Python"]
}
```

#### Adding a new project

Add to `projects.items`:

```json
{
  "name": "Project Name",
  "description": "What it does",
  "technologies": ["Tech1", "Tech2"],
  "links": { "github": "https://github.com/...", "live": null },
  "featured": true,
  "date": "2025"
}
```

### 2. Update Resume (Optional)

If you want the LaTeX resume integration:

1. Edit `resume/resume.tex` with your info
2. Run `npm run resume:pdf` to compile the PDF and sync content to `content.json`

**Requirements**: `pdflatex` must be installed locally (via [TeX Live](https://tug.org/texlive/) or [MacTeX](https://tug.org/mactex/)).

If you don't want LaTeX, just manually edit `content.json` and replace the PDF at `public/assets/Sahir_Hameed_Resume.pdf`.

### 3. Update Colors

Edit `src/styles/variables.css` to change the color scheme:

```css
--dark-bg: #0D0D0D;          /* Page background */
--dark-surface: #1A1A1A;      /* Card backgrounds */
--accent-primary: #FF6B35;    /* Primary accent (orange) */
--accent-secondary: #FF8C42;  /* Hover accent (coral) */
```

### 4. Update Social Links

In `content.json` under `general.social_links`:

```json
"social_links": {
  "github": "https://github.com/yourusername",
  "linkedin": "https://linkedin.com/in/yourusername",
  "website": "https://yoursite.com",
  "email": "you@email.com"
}
```

The navbar automatically renders icons for each link.

### 5. Update GitHub Stats

In `src/components/sections/GitHubActivity.jsx`, change the username:

```js
const USERNAME = 'YourGitHubUsername';
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx           # Sticky nav with mobile menu
│   │   └── Footer.jsx           # Footer with social links
│   ├── sections/
│   │   ├── Hero.jsx             # Intro section
│   │   ├── About.jsx            # Bio and highlights
│   │   ├── Experience.jsx       # Work history timeline
│   │   ├── Projects.jsx         # Project cards
│   │   ├── Skills.jsx           # Skills by category
│   │   ├── GitHubActivity.jsx   # GitHub profile stats
│   │   └── Contact.jsx          # Contact CTA
│   └── ui/
│       ├── TerminalBlock.jsx    # Terminal-style section wrapper
│       ├── CommandPalette.jsx   # Cmd+K search
│       ├── Chatbot.jsx          # Chat widget
│       ├── LiveTerminal.jsx     # Interactive terminal panel
│       ├── MatrixRain.jsx       # Konami code easter egg
│       ├── AnimatedBackground.jsx
│       ├── BackToTop.jsx
│       ├── ThemeToggle.jsx
│       ├── Button.jsx
│       ├── SectionHeader.jsx
│       ├── SkillBadge.jsx
│       └── TechTag.jsx
├── styles/
│   ├── variables.css            # Design tokens
│   ├── base.css                 # Reset and globals
│   ├── animations.css           # Keyframes
│   ├── components.css           # Component styles
│   ├── sections.css             # Section styles
│   └── features.css             # Feature-specific styles
├── content.json                 # All site content
├── App.js                       # Main app with routing
└── index.js                     # Entry point

resume/
└── resume.tex                   # LaTeX resume (source of truth)

scripts/
└── sync-resume.js               # Parses .tex → content.json + compiles PDF

.github/workflows/
└── generate-resume.yml          # Auto-compiles resume on push to main
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server at localhost:3000 |
| `npm run build` | Production build to `/build` |
| `npm test` | Run tests |
| `npm run resume:sync` | Sync `resume.tex` → `content.json` (no PDF) |
| `npm run resume:pdf` | Sync + compile PDF |

## Deployment

### Vercel (recommended)

1. Import the repo on [vercel.com](https://vercel.com)
2. It auto-detects Create React App -- no config needed
3. Pushes to `main` trigger automatic deploys

### Netlify

1. Connect repo on [netlify.com](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `build`
4. The `public/_redirects` file handles SPA routing

## Resume Auto-Sync

A GitHub Action (`.github/workflows/generate-resume.yml`) runs on every push to `main`. It:

1. Installs LaTeX
2. Runs `node scripts/sync-resume.js --pdf`
3. Commits the updated PDF and `content.json` back to the repo

This keeps the downloadable resume and site content in sync with your `.tex` file automatically.

For local development, a git pre-commit hook does the same thing before each commit (requires `pdflatex` installed locally).

## Tech Stack

- **React 18** with Create React App
- **React Router 6** for routing
- **react-awesome-reveal** for scroll animations
- **react-icons** for icon sets (FontAwesome, Heroicons)
- **CSS custom properties** for theming
- **LaTeX** for resume (optional)

## License

MIT
