# docs.helix.aero

Documentation utilisateur de HELIX Flight Planner, servie sur https://docs.helix.aero.

- **Moteur** : Astro Starlight, site statique, aux couleurs de la vitrine helix.aero (`src/styles/helix.css`).
- **Pages** : MDX, en anglais à la racine (`introduction.mdx`, `guides/…`) et en français sous `fr/`.
  Les composants `<Steps>`, `<Step title>`, `<Card title href>`, `<CardGroup cols>`, `<Tabs>`, `<Tab title>`,
  `<Note>`, `<Tip>`, `<Warning>`, `<Info>`, `<Frame caption>`, `<AccordionGroup>` et `<Accordion title>` s'utilisent sans import (`src/components/mintlify/`).
- **Images** : dans `images/` à la racine, appelées en `/images/…` ; copiées dans le site au build.
- **Navigation** : `docs.json` (`navigation.languages[].tabs[].groups[]`), une arborescence par langue.
  Une nouvelle page s'ajoute dans son groupe ; le libellé du menu est le `title` de la page.

## Travailler en local

```sh
npm ci
npm run dev        # http://localhost:4321
npm run build      # dist/
```

## Déploiement

Hébergé chez o2switch, déployé depuis helix-infra :

```sh
bash bascule/deployer-docs.sh [sha]   # défaut : origin/main
```

Le serveur construit le site (Node 22 d'o2switch) et bascule le docroot de façon atomique.
