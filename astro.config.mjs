import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://notebooks.civontology.com',
  base: '/',
  output: 'static',

  integrations: [
    starlight({
      title: 'Civontology Notebook',
      description: 'A digital garden of notes on civontology',
      logo: {
        src: './src/assets/logo.svg',
      },
      social: {
        github: 'https://github.com/labsbytir/civontology-notebooks',
        discord: 'https://discord.gg/cRFFHYye7t',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Welcome', slug: 'index' },
            { label: 'Community Forum', slug: 'forum' },
          ],
        },
        {
          label: 'Notes',
          autogenerate: { directory: 'notes' },
        },
        {
          label: 'Discussions',
          autogenerate: { directory: 'discussions' },
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
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
