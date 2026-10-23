# Civontology Notebooks

A digital garden of notes on civontology, built with **Astro + Starlight**.

🌐 **Live Site:** https://labsbytir.github.io/civontology-notebooks/

## Theme and deployment

- Built with **Astro + Starlight Vintage**, not Quartz.
- Black background by default; the header toggle switches to white and remembers your choice.
- The header stays fixed while scrolling. White and dark Civontology logos alternate with the theme.
- GitHub Pages currently serves this project at `/civontology-notebooks/`. Keep `site` and `base` in `astro.config.mjs` aligned with that URL; using `/` here breaks CSS, scripts, and logos.
- `npm run build` also checks the generated asset paths and forum embed to prevent another unstyled deployment. This check requires Python 3 (available on GitHub's Ubuntu runner).
- The custom domain is not enabled on GitHub Pages yet. When its DNS and Pages configuration are ready, update `site` to `https://notebooks.civontology.com` and `base` to `/`, including homepage links and the asset-check base.

---

## 📝 Quick Start

### Writing Notes in Obsidian

1. **Open the Obsidian vault** at `civontology notebook/`
2. **Create a note** in any folder (or root for standalone)
3. **The plugin auto-adds frontmatter** (or use templates below)
4. **Run publish script:** `~/Documents/Notes/publish-note.sh`
5. **Live in ~1-2 minutes!**

### Auto-Publish (Optional)

```bash
# Install fswatch (one-time)
brew install fswatch

# Start auto-sync (watches for changes)
~/Documents/Notes/auto-sync-obsidian.sh
```

Now every save auto-publishes!

---

## Obsidian Plugin: Civontology Templates

This vault includes a custom plugin with a **publish panel**, templates, and auto-frontmatter.

### Publish Panel (Right Sidebar)

Click the **rocket icon** in the left ribbon to open the publish panel:

- **Publish to Web** button — syncs notes and deploys to GitHub Pages
- **Template buttons** — New Note, New Section, New Draft
- **Quick Links** — Live Site, Community Forum, GitHub Repo, Discussions
- **Publish Log** — real-time output from the publish script

### Commands (Ctrl/Cmd + P)

| Command | What It Does |
|---------|--------------|
| **Open Publish Panel** | Opens the publish panel in the right sidebar |
| **Publish Notebook to Web** | Runs the publish script directly |
| **Create Note with Template** | Creates note with frontmatter |
| **Create Section with Template** | Creates folder + index.md with section frontmatter |
| **Create Hidden Note** | Creates note hidden from sidebar |
| **Insert Note Template** | Inserts template at cursor |
| **Insert Section Template** | Inserts section template at cursor |

### Ribbon Icons
- **Rocket icon** — opens the publish panel

### Auto-Template
When you create a new `.md` file, the plugin auto-adds:
- **Note template** for regular files
- **Section template** for `index.md` in folders

---

## 📋 Templates

### Note Template

```markdown
---
title: My Note Title
description: A brief description
---

# My Note Title

Your content here...
```

### Section Template (Folder)

Create an `index.md` in your folder:

```markdown
---
title: My Section
description: My Section section
sidebar:
  label: "My Custom Label"      # Custom name
  order: 1                     # Sort order (1 = top)
  collapsed: false             # Start expanded (default)
---

# My Section

Welcome to the My Section section.
```

### Hidden Note (Draft)

```markdown
---
title: Draft Notes
description: Work in progress
sidebar:
  hidden: true                 # Hidden from sidebar (still accessible via URL)
---

# Draft Notes

This note won't appear in the sidebar.
```

---

## Folder Structure

Every folder in Obsidian becomes its own **top-level section** in the docs sidebar.
The `Getting Started` folder is **pinned first**.

### Structure

```
civontology notebook/
├── Getting Started/    ← pinned FIRST section
│   ├── Welcome.md
│   ├── Notices.md
│   └── Change Log.md
├── Ontology/           ← own sidebar section
│   ├── index.md        # Landing page (uses section template)
│   ├── definition.md
│   └── classes.md
├── Brand/              ← own sidebar section
│   ├── index.md
│   └── logo.md
├── Developers/         ← own sidebar section
│   ├── index.md
│   ├── api.md
│   └── contributing.md
├── notes/              ← own sidebar section
│   └── test-note.md
└── about.md            ← standalone page (no section)
```

**Result in sidebar:**
```
Getting Started        ← pinned first!
   Community Forum
   Change Log
   Notices
   Welcome
Brand
   Brand
   Logo
Developers
   Developers
   API Documentation
   Contributing
Notes
   Test Note
Ontology
   Ontology
   Classes
   Definition
```

---

## 🎛️ Sidebar Control

Control how folders appear using frontmatter in `index.md`:

| Property | Example | Effect |
|----------|---------|--------|
| `sidebar.label` | `label: "Ontology"` | Custom name |
| `sidebar.order` | `order: 1` | Sort order (1 = top) |
| `sidebar.collapsed` | `collapsed: true` | Start collapsed |
| `sidebar.hidden` | `hidden: true` | Hide from sidebar |

### Examples

**Custom Label:**
```yaml
sidebar:
  label: "Ontology"
```

**Start Collapsed:**
```yaml
sidebar:
  collapsed: true
```

**Control Order:**
```yaml
sidebar:
  order: 1  # Lower = higher in sidebar
```

**Hide from Sidebar:**
```yaml
sidebar:
  hidden: true  # Still accessible via direct URL
```

---

## 🚀 Publishing

### Manual Publish

```bash
# Publish all notes
~/Documents/Notes/publish-note.sh

# Or from this directory:
../../publish-note.sh
```

### What Happens

1. **Folders** → `sections/FolderName/` (sidebar sections)
2. **Developers folder** → `developers/` (separate sidebar group)
3. **Root .md files** → `sections/` (standalone pages)
4. **Auto-adds frontmatter** if missing
5. **Commits & pushes** to GitHub
6. **GitHub Actions** builds & deploys (~1-2 min)

### Check Deployment

https://github.com/labsbytir/civontology-notebooks/actions

---

## 🌐 Live URLs

| URL | Description |
|-----|-------------|
| https://notebooks.civontology.com | Custom domain |
| https://labsbytir.github.io/civontology-notebooks/ | GitHub Pages |
| https://labsbytir.github.io/civontology-notebooks/forum/ | Community Forum |

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build
npm run build
```

---

## 📦 Project Structure

```
civontology-notebooks/
├── .obsidian/                    # Obsidian config + plugin
│   └── plugins/
│       └── civontology-templates/  # Auto-template plugin
├── src/
│   ├── content/docs/
│   │   ├── index.md              # Homepage
│   │   ├── forum.md              # Community forum (Giscus)
│   │   ├── sections/             # Synced from Obsidian folders
│   │   │   ├── Ontology/
│   │   │   ├── Brand/
│   │   │   └── about.md
│   │   └── developers/           # Developers folder (separate!)
│   │       ├── index.md
│   │       ├── api.md
│   │       └── contributing.md
│   ├── components/
│   │   ├── Giscus.astro          # Comments component
│   │   └── PageComments.astro
│   └── styles/
│       └── custom.css            # Black theme + light mode
├── astro.config.mjs
└── package.json
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b my-notes`
3. Add notes to the Obsidian vault
4. Run `publish-note.sh`
5. Open a Pull Request

---

## 📄 License

See the main repo: https://github.com/labsbytir/civontology

---

## 🔌 Integrations

This site uses the following Astro & Starlight integrations:

### Core (Astro)
| Integration | Purpose | Files Generated |
|-------------|---------|-----------------|
| `@astrojs/starlight` | Documentation theme | - |
| `@astrojs/sitemap` | XML sitemap | `sitemap-index.xml`, `sitemap-0.xml` |
| `astro-robots-txt` | robots.txt | `robots.txt` |
| `astro-expressive-code` | Syntax highlighting | Better code blocks |
| `astro-compress` | Asset compression | Smaller HTML/CSS/JS (20-90KB savings) |

### Starlight Plugins
| Plugin | Purpose | Files Generated |
|--------|---------|-----------------|
| `starlight-llms-txt` | LLM-friendly docs | `llms.txt`, `llms-full.txt`, `llms-small.txt` |
| `starlight-github-stats` | GitHub stats in header | Stars, forks, version |

### LLM-Friendly Output

The site generates LLM-friendly files:

- **`/llms.txt`** - Index of all documentation
- **`/llms-full.txt`** - Complete documentation in one file
- **`/llms-small.txt`** - Compact version for token-limited contexts

These files help AI assistants (ChatGPT, Claude, etc.) understand and cite your documentation.

### SEO & Discoverability

- **`/robots.txt`** - Allows all crawlers, links to sitemap
- **`/sitemap-index.xml`** - All pages for search engines
- **Schema.org JSON-LD** - Structured data for rich snippets
- **Open Graph tags** - Social media previews

### Performance

- **Compression**: HTML (-5%), JS (-10-56%), CSS, images, SVG
- **Total savings**: ~110KB per build
- **Pagefind search**: Fast client-side search

---

## 📦 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Astro | 7.4.2 |
| Theme | Starlight | 0.42.6 |
| Content | Markdown + MDX | - |
| Search | Pagefind | Built-in |
| Comments | Giscus | GitHub Discussions |
| Hosting | GitHub Pages | - |
| CI/CD | GitHub Actions | - |
