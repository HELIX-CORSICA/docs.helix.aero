import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Pages à la racine du dépôt (ancienne disposition Mintlify) : anglais à la racine, français sous fr/.
export const collections = {
  docs: defineCollection({
    loader: glob({ base: '.', pattern: ['**/*.{md,mdx}', '!node_modules/**', '!src/**', '!dist/**', '!README.md', '!LICENSE*'] }),
    schema: docsSchema(),
  }),
};
