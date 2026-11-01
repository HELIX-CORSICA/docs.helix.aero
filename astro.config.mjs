// docs.helix.aero : Astro Starlight, servi en statique chez o2switch (helix-infra, deploy-docs.yml).
// Les pages MDX restent à la racine du dépôt (anglais) et sous fr/ ; la navigation se lit dans docs.json (src/sidebar.ts).
import { appendFileSync, cpSync, existsSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import AutoImport from 'astro-auto-import';
import { home } from './src/nav.ts';

// Composants de l'ancienne syntaxe Mintlify, utilisables dans les MDX sans import.
const mintlify = ['Card', 'CardGroup', 'Steps', 'Step', 'Tabs', 'Tab', 'Note', 'Tip', 'Warning', 'Info', 'Frame', 'Accordion', 'AccordionGroup'];

// Après le build : captures de images/ (appelées en /images/… comme chez Mintlify) copiées dans le site, et redirections 301
// d'Apache vers la première page de chaque langue dans docs.json, anciennes adresses Mintlify (introduction, quickstart, guides/…) comprises.
const apres = {
  name: 'images-et-redirections',
  hooks: {
    'astro:build:done': ({ dir }) => {
      if (existsSync('images')) cpSync('images', new URL('images/', dir), { recursive: true });
      appendFileSync(new URL('.htaccess', dir), [
        `RedirectMatch 301 ^/(introduction|quickstart|guides(/.*)?)?/?$ /${home('en')}/`,
        `RedirectMatch 301 ^/fr/(introduction|quickstart|guides(/.*)?)?/?$ /${home('fr')}/`,
        '',
      ].join('\n'));
    },
  },
};

export default defineConfig({
  site: 'https://docs.helix.aero',
  redirects: { '/': `/${home('en')}/`, '/fr/': `/${home('fr')}/` },
  integrations: [
    starlight({
      title: 'HELIX Flight Planner',
      logo: { src: './src/assets/aero-degrade.svg', alt: 'Helix Aero', replacesTitle: true },
      favicon: '/favicon.svg',
      head: [
        { tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico', sizes: '32x32' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
        { tag: 'link', attrs: { rel: 'preload', href: '/fonts/Rubik-VariableFont_wght.woff2', as: 'font', type: 'font/woff2', crossorigin: '' } },
        { tag: 'link', attrs: { rel: 'preload', href: '/fonts/Manrope-VariableFont_wght.woff2', as: 'font', type: 'font/woff2', crossorigin: '' } },
      ],
      defaultLocale: 'root',
      locales: { root: { label: 'English', lang: 'en' }, fr: { label: 'Français', lang: 'fr' } },
      customCss: ['./src/styles/helix.css'],
      routeMiddleware: './src/sidebar.ts',
      components: {
        Header: './src/components/Header.astro',
        MobileMenuFooter: './src/components/MobileMenuFooter.astro',
        ThemeProvider: './src/components/ThemeProvider.astro',
        ThemeSelect: './src/components/Empty.astro',
      },
    }),
    // après Starlight : c'est lui qui ajoute l'intégration MDX, que l'auto-import doit trouver
    AutoImport({ imports: mintlify.map((c) => `./src/components/mintlify/${c}.astro`) }),
    apres,
  ],
});
