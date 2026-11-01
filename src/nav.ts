import { readFileSync } from 'node:fs';

// Navigation de docs.json (format Mintlify) : une arborescence par langue, groupes de pages.
export const nav = JSON.parse(readFileSync('docs.json', 'utf8')).navigation.languages as {
  language: string;
  tabs: { groups: { group: string; pages: string[] }[] }[];
}[];

// « dossier/index » dans docs.json = page dossier/index.mdx, dont l'id Astro est « dossier ».
export const pageId = (page: string) => page.replace(/\/?index$/, '');

// Accueil d'une langue : sa première page dans docs.json.
export const home = (language: string) => pageId((nav.find((l) => l.language === language) ?? nav[0]).tabs[0].groups[0].pages[0]);
