import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import starlightLlmsTxt from 'starlight-llms-txt';
import robotsTxt from 'astro-robots-txt';
import starlightThemeVintage from 'starlight-theme-vintage';
import compress from 'astro-compress';
import { githubStats } from 'starlight-github-stats';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

// Every folder in src/content/docs becomes its own top-level sidebar section.
// "getting-started" is pinned first.
const docsDir = join(process.cwd(), 'src/content/docs');
const folders = readdirSync(docsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((name) => name !== 'getting-started')
  .sort((a, b) => a.localeCompare(b));

const slugToLabel = (slug) =>
  slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const sidebar = [
  {
    label: 'Getting Started',
    items: [
      { label: 'Community Forum', slug: 'forum' },
      { autogenerate: { directory: 'getting-started' } },
    ],
  },
  ...folders.map((folder) => ({
    label: slugToLabel(folder),
    items: [{ autogenerate: { directory: folder } }],
  })),
];

// https://astro.build/config
export default defineConfig({
  site: 'https://labsbytir.github.io',
  base: '/civontology-notebooks/',
  output: 'static',

  integrations: [
    starlight({
      title: 'Civontology Notebook',
      description: 'A digital garden of notes on civontology',
      logo: {
        dark: './src/assets/logo-dark.svg',
        light: './src/assets/logo-light.svg',
        alt: 'Civontology Notebook',
        replacesTitle: true,
      },
      components: {
        ThemeProvider: './src/components/ThemeProvider.astro',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/labsbytir/civontology-notebooks' },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/cRFFHYye7t' },
      ],
      
      // Starlight Plugins
      plugins: [
        starlightThemeVintage(),
        starlightLlmsTxt({
          projectName: 'Civontology Notebook',
          description: 'A digital garden of notes on civontology - LLM-friendly documentation',
        }),
        githubStats({
          repo: 'labsbytir/civontology-notebooks',
        }),
      ],
      
      sidebar,
      
      customCss: [
        './src/styles/custom.css',
      ],
      
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
      },
      
      editLink: {
        baseUrl: 'https://github.com/labsbytir/civontology/edit/main/notebooks/src/content/docs/',
      },
    }),
    
    // Other Astro Integrations
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
    
    robotsTxt({
      sitemap: true,
    }),
    
    compress({
      css: true,
      html: true,
      img: true,
      js: true,
      svg: true,
    }),
  ],
});
