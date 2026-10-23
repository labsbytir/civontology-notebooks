import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import starlightLlmsTxt from 'starlight-llms-txt';
import robotsTxt from 'astro-robots-txt';
import starlightThemeVintage from 'starlight-theme-vintage';
import compress from 'astro-compress';
import { githubStats } from 'starlight-github-stats';

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
      
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Welcome', slug: 'index' },
            { label: 'Community Forum', slug: 'forum' },
          ],
        },
        {
          label: '📚 Notes',
          items: [
            { autogenerate: { directory: 'sections' } },
          ],
        },
        {
          label: '💻 Developers',
          items: [
            { autogenerate: { directory: 'developers' } },
          ],
        },
      ],
      
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
