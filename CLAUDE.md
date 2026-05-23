# Portfolio Project - CLAUDE.md

> Reference document for AI assistants working on this project

## Project Overview

Personal portfolio website for **Sahir Hameed** - a Data Engineer Associate at Lockheed Martin, graduated from the University of Texas at Austin with a BS in Computer Science.

**Tagline**: "Full-Stack Developer & ML Enthusiast"
**Live URL**: Deploy to Netlify or Vercel

## Tech Stack

- **Framework**: React 18.2.0
- **Routing**: React Router DOM 6.x
- **Animations**: react-awesome-reveal 4.x (Fade effects)
- **Icons**: react-icons (FontAwesome, Heroicons)
- **Styling**: CSS with custom properties (variables)
- **Build**: Create React App (react-scripts)
- **Deployment**: Netlify (configured with `_redirects`)

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx      # Sticky nav with mobile menu
│   │   └── Footer.jsx      # Site footer with social links
│   ├── sections/
│   │   ├── Hero.jsx        # Bold intro section
│   │   ├── About.jsx       # Bio and highlights
│   │   ├── Experience.jsx  # Timeline of work history
│   │   ├── Projects.jsx    # Project cards grid
│   │   ├── Skills.jsx      # Skills by category
│   │   └── Contact.jsx     # Contact CTA
│   └── ui/
│       ├── Button.jsx      # Reusable button component
│       ├── SectionHeader.jsx
│       ├── SkillBadge.jsx
│       └── TechTag.jsx
├── styles/
│   ├── variables.css       # Design tokens (colors, spacing, typography)
│   ├── base.css            # Reset and global styles
│   ├── animations.css      # Keyframes and animation utilities
│   ├── components.css      # Component styles
│   └── sections.css        # Section-specific styles
├── content.json            # ALL content - single source of truth
├── App.js                  # Main app with routing
└── index.js                # Entry point
```

## Content Management

**All content lives in `/src/content.json`**. To update the site:

1. Edit `content.json` with new information
2. The site automatically reflects changes (hot reload in dev)

### JSON Structure

```javascript
{
  "meta": {},           // Site metadata
  "general": {},        // Name, email, social links, resume URL
  "hero": {},           // Main intro section
  "about": {},          // Bio, portrait, highlights
  "experience": {},     // Work history array
  "projects": {},       // Project items array
  "skills": {},         // Skills categories
  "contact": {},        // Contact section
  "footer": {}          // Footer content
}
```

### Adding New Experience

Add to `experience.items` array (newest first):
```json
{
  "company": "Company Name",
  "location": "City, State",
  "title": "Job Title",
  "type": "Full-time",
  "start_date": "January 2025",
  "end_date": null,
  "is_current": true,
  "description": ["Bullet 1", "Bullet 2"],
  "technologies": ["Tech1", "Tech2"]
}
```

### Adding New Projects

Add to `projects.items` array:
```json
{
  "name": "Project Name",
  "description": "Brief description",
  "technologies": ["Tech1", "Tech2"],
  "links": {
    "github": "https://github.com/...",
    "live": null
  },
  "featured": true,
  "date": "Month Year"
}
```

## Design System

### Color Palette (Orange/Coral Warmth)

```css
/* Dark Base */
--dark-bg: #0D0D0D;
--dark-surface: #1A1A1A;
--dark-elevated: #252525;
--dark-border: #333333;

/* Accents */
--accent-primary: #FF6B35;     /* Primary orange */
--accent-secondary: #FF8C42;   /* Coral for hovers */
--accent-glow: rgba(255, 107, 53, 0.15);

/* Text */
--text-primary: #FFFFFF;
--text-secondary: #E0E0E0;
--text-muted: #9CA3AF;
```

### Animation Guidelines

- Use `react-awesome-reveal` with `Fade` component
- Always set `triggerOnce={true}` for performance
- Use `direction="up"` for most elements
- Stagger with `cascade` and `damping` props
- Keep hover transitions at 0.2-0.3s

### Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 768px
- Desktop: > 768px

## Resume

- Location: `/public/assets/Sahir_Hameed_Resume.pdf`
- Update by replacing the PDF file
- URL configured in `content.json` under `general.resume_url`

## Development Commands

```bash
npm start     # Dev server at localhost:3000
npm run build # Production build to /build
npm test      # Run tests
```

## Deployment

**Netlify** (configured):
1. Push to main branch
2. Netlify auto-deploys from GitHub
3. `public/_redirects` handles SPA routing

## Key Features

1. **JSON-Driven Content**: All content in one file for easy updates
2. **Dark Theme**: Modern dark design with orange accents
3. **Responsive**: Mobile-first with smooth mobile menu
4. **Animations**: Subtle scroll-triggered animations
5. **Resume Integration**: Download button links to PDF
6. **SEO Ready**: Proper meta tags and semantic HTML

## Important Notes

- **DO NOT** hardcode content in components - use `content.json`
- **DO** keep animations subtle (Fade, no bounce)
- **DO** test at 375px, 768px, 1024px widths
- **DO** use CSS custom properties for colors
- Old components in `/src/components/` (Intro.js, etc.) are deprecated

## Owner Information

- **Name**: Sahir Hameed
- **Current Role**: Data Engineer Associate @ Lockheed Martin
- **Education**: BS Computer Science, UT Austin (Graduated 2024)
- **Email**: sahirhameed@utexas.edu
- **GitHub**: https://github.com/SahirHameed
- **LinkedIn**: https://www.linkedin.com/in/SahirHameed
