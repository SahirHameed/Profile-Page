const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TEX_PATH = path.join(__dirname, '..', 'resume', 'resume.tex');
const CONTENT_PATH = path.join(__dirname, '..', 'src', 'content.json');
const PDF_DEST = path.join(__dirname, '..', 'public', 'assets', 'Sahir_Hameed_Resume.pdf');

const tex = fs.readFileSync(TEX_PATH, 'utf8');
const content = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));

// --- LaTeX unescape ---
function unlatex(str) {
  return str
    .replace(/\\textbackslash\{\}/g, '\\')
    .replace(/\\textasciitilde\{\}/g, '~')
    .replace(/\\textasciicircum\{\}/g, '^')
    .replace(/\\([&%$#_{}])/g, '$1')
    .replace(/\\textsuperscript\{([^}]*)\}/g, '$1')
    .replace(/\\emph\{([^}]*)\}/g, '$1')
    .replace(/\\textbf\{([^}]*)\}/g, '$1')
    .replace(/---/g, '—')
    .replace(/--/g, '–')
    .replace(/~/g, ' ')
    .trim();
}

// --- Split by commas, ignoring commas inside parentheses ---
function splitOutsideParens(str) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const ch of str) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);
  return parts;
}

// --- Extract brace-delimited arguments ---
// Handles nested braces correctly
function extractBraceArgs(str, count) {
  const args = [];
  let pos = 0;
  for (let i = 0; i < count; i++) {
    // Find next opening brace
    while (pos < str.length && str[pos] !== '{') pos++;
    if (pos >= str.length) break;
    // Match balanced braces
    let depth = 0;
    let start = pos;
    while (pos < str.length) {
      if (str[pos] === '{') depth++;
      else if (str[pos] === '}') { depth--; if (depth === 0) break; }
      pos++;
    }
    args.push(str.slice(start + 1, pos));
    pos++;
  }
  return args;
}

// --- Extract section content between \section{Name} markers ---
function extractSection(tex, sectionName) {
  const escaped = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `\\\\section\\{${escaped}\\}([\\s\\S]*?)(?=\\\\section\\{|\\\\end\\{document\\}|%---+\\s*$)`,
    'm'
  );
  const match = tex.match(pattern);
  return match ? match[1] : '';
}

// --- Parse Education ---
function parseEducation(tex) {
  const section = extractSection(tex, 'Education');
  const items = [];
  const subheadingRe = /\\resumeSubheading\s*\n?\s*(\{[\s\S]*?\})\s*(\{[\s\S]*?\})\s*\n?\s*(\{[\s\S]*?\})\s*(\{[\s\S]*?\})/g;

  let match;
  while ((match = subheadingRe.exec(section)) !== null) {
    const fullMatch = match[0];
    const args = extractBraceArgs(fullMatch, 4);
    const school = unlatex(args[0]);
    const location = unlatex(args[1]);
    const degree = unlatex(args[2]);
    const graduationDate = unlatex(args[3]);

    // Look for coursework in resumeItems after this subheading
    const afterPos = match.index + fullMatch.length;
    const restOfSection = section.slice(afterPos);
    const nextSubheading = restOfSection.search(/\\resumeSubheading/);
    const itemBlock = nextSubheading >= 0 ? restOfSection.slice(0, nextSubheading) : restOfSection;

    let coursework = [];
    const courseworkMatch = itemBlock.match(/Relevant Coursework:\s*\}?\s*([\s\S]*?)(?:\}|\n\s*\\resumeItemListEnd)/);
    if (courseworkMatch) {
      coursework = courseworkMatch[1]
        .replace(/\}.*$/, '')
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
    }

    items.push({ school, degree, graduation_date: graduationDate, location, coursework });
  }
  return { items };
}

// --- Parse Experience ---
function parseExperience(tex) {
  const section = extractSection(tex, 'Experience');
  const items = [];

  // Split by \resumeSubheading
  const parts = section.split(/(?=\\resumeSubheading\b)/);

  for (const part of parts) {
    if (!part.includes('\\resumeSubheading')) continue;

    const args = extractBraceArgs(part, 4);
    if (args.length < 4) continue;

    const company = unlatex(args[0]);
    const location = unlatex(args[1]);
    const title = unlatex(args[2]);
    const dateStr = unlatex(args[3]);

    // Parse date range
    const dateParts = dateStr.split(/\s*[-–—]+\s*/);
    const startDate = dateParts[0]?.trim() || '';
    const endDateRaw = dateParts[1]?.trim() || null;
    const isCurrent = endDateRaw?.toLowerCase() === 'present';
    const endDate = isCurrent ? null : endDateRaw;

    // Extract bullet items
    const description = [];
    const itemRe = /\\resumeItem\{([\s\S]*?)\}\s*(?=\\resumeItem|\\resumeItemListEnd|$)/g;
    let itemMatch;
    while ((itemMatch = itemRe.exec(part)) !== null) {
      description.push(unlatex(itemMatch[1]));
    }

    // Extract technologies from description context (keep existing if available)
    const existingExp = content.experience?.items?.find(
      (e) => e.company === company && e.title === title
    );
    const technologies = existingExp?.technologies || [];

    items.push({
      company,
      location,
      title,
      type: existingExp?.type || 'Full-time',
      start_date: startDate,
      end_date: endDate,
      is_current: isCurrent,
      description,
      technologies,
    });
  }
  return items;
}

// --- Parse Projects ---
function parseProjects(tex) {
  const section = extractSection(tex, 'Projects');
  const items = [];

  const parts = section.split(/(?=\\resumeProjectHeading\b)/);

  for (const part of parts) {
    if (!part.includes('\\resumeProjectHeading')) continue;

    // Extract the two arguments of \resumeProjectHeading
    const args = extractBraceArgs(part, 2);
    if (args.length < 2) continue;

    const heading = args[0];
    const date = unlatex(args[1]);

    // Parse name and technologies from heading
    // Format: \textbf{Name} $|$ \emph{tech1, tech2}
    const nameMatch = heading.match(/\\textbf\{([^}]+)\}/);
    const techMatch = heading.match(/\\emph\{([^}]*)\}/);

    const name = nameMatch ? unlatex(nameMatch[1]) : unlatex(heading);
    const technologies = techMatch
      ? techMatch[1].split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    // Extract bullet items
    const description = [];
    const itemRe = /\\resumeItem\{([\s\S]*?)\}\s*(?=\\resumeItem|\\resumeItemListEnd|$)/g;
    let itemMatch;
    while ((itemMatch = itemRe.exec(part)) !== null) {
      description.push(unlatex(itemMatch[1]));
    }

    // Check existing project for extra fields
    const existingProj = content.projects?.items?.find((p) => p.name === name);

    items.push({
      name,
      description: description.join(' '),
      technologies,
      links: existingProj?.links || { github: null, live: null },
      featured: true,
      date,
    });
  }

  // Keep non-featured projects from content.json that aren't in the resume
  const nonFeatured = (content.projects?.items || []).filter((p) => !p.featured);
  return [...items, ...nonFeatured];
}

// --- Parse Skills ---
function parseSkills(tex) {
  // Try both "Skills" and "Technical Skills" section names
  let section = extractSection(tex, 'Skills');
  if (!section.trim()) section = extractSection(tex, 'Technical Skills');
  const categories = [];

  // Match \textbf{Category}{: item1, item2, ...}
  // Also handle \textbf{Category \& More}{: items}
  const skillRe = /\\textbf\{([^}]+)\}\{:\s*([^}]+)\}/g;
  let match;
  while ((match = skillRe.exec(section)) !== null) {
    const name = unlatex(match[1]);
    // Split by commas but not inside parentheses
    const items = splitOutsideParens(match[2]).map((s) => unlatex(s.trim())).filter(Boolean);
    categories.push({ name, items });
  }
  return { categories };
}

// --- Parse Header for general info ---
function parseHeader(tex) {
  const headerMatch = tex.match(/\\begin\{center\}([\s\S]*?)\\end\{center\}/);
  if (!headerMatch) return {};

  const header = headerMatch[1];
  const updates = {};

  // Extract name
  const nameMatch = header.match(/\\scshape\s+([^}]+)\}/);
  if (nameMatch) {
    const parts = nameMatch[1].trim().split(/\s+/);
    updates.first_name = parts[0];
    updates.last_name = parts.slice(1).join(' ');
  }

  // Extract email
  const emailMatch = header.match(/\\href\{mailto:([^}]+)\}/);
  if (emailMatch) updates.email = emailMatch[1];

  // Extract location - text between $|$ markers that isn't a link
  const locationMatch = header.match(/\$\|\$\s*\n?\s*([^$\\]+?)\s*\$\|\$/);
  if (locationMatch) updates.location = locationMatch[1].trim();

  // Extract LinkedIn
  const linkedinMatch = header.match(/\\href\{(https:\/\/(?:www\.)?linkedin\.com\/in\/[^}]+)\}/);
  if (linkedinMatch) updates.linkedin = linkedinMatch[1];

  // Extract GitHub
  const githubMatch = header.match(/\\href\{(https:\/\/github\.com\/[^}]+)\}/);
  if (githubMatch) updates.github = githubMatch[1];

  return updates;
}

// --- Ensure required keys exist ---
if (!content.general.social_links) content.general.social_links = {};
if (!content.general.resume_url) content.general.resume_url = '/assets/Sahir_Hameed_Resume.pdf';
if (!content.experience) content.experience = {};
if (!content.experience.items) content.experience.items = [];
if (!content.projects) content.projects = {};
if (!content.projects.items) content.projects.items = [];
if (!content.skills) content.skills = {};
if (!content.contact) content.contact = {};

// --- Apply parsed data to content.json ---
const header = parseHeader(tex);

if (header.first_name) content.general.first_name = header.first_name;
if (header.last_name) content.general.last_name = header.last_name;
if (header.email) {
  content.general.email = header.email;
  content.general.social_links.email = header.email;
  if (content.contact) content.contact.email = header.email;
}
if (header.location) content.general.location = header.location;
if (header.linkedin) content.general.social_links.linkedin = header.linkedin;
if (header.github) content.general.social_links.github = header.github;

content.education = parseEducation(tex);
content.experience.items = parseExperience(tex);
content.projects.items = parseProjects(tex);
content.skills = { ...content.skills, ...parseSkills(tex) };

fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2) + '\n');
console.log('Synced content.json from resume.tex');

// --- Compile PDF ---
if (process.argv.includes('--pdf')) {
  try {
    const resumeDir = path.join(__dirname, '..', 'resume');
    execSync('pdflatex -interaction=nonstopmode -output-directory=. resume.tex', {
      cwd: resumeDir,
      stdio: 'pipe',
    });
    execSync('pdflatex -interaction=nonstopmode -output-directory=. resume.tex', {
      cwd: resumeDir,
      stdio: 'pipe',
    });

    const pdfSrc = path.join(resumeDir, 'resume.pdf');
    fs.copyFileSync(pdfSrc, PDF_DEST);
    console.log('PDF copied to:', PDF_DEST);

    // Clean up aux files
    ['resume.aux', 'resume.log', 'resume.out'].forEach((f) => {
      const fp = path.join(resumeDir, f);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    });
  } catch (err) {
    console.error('pdflatex failed. Is texlive installed?');
    console.error(err.stderr?.toString() || err.message);
    process.exit(1);
  }
}
