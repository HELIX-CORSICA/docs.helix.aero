import { getCollection } from 'astro:content';
import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data';
import { nav, pageId } from './nav';

type SidebarEntry = StarlightRouteData['sidebar'][number];
type SidebarLink = Extract<SidebarEntry, { type: 'link' }>;

// Menu latéral par langue, lu dans docs.json : chaque langue a sa propre arborescence, ce que le menu unique
// de Starlight ne sait pas faire. Libellé d'une page = son titre.
const titles = new Map((await getCollection('docs')).map((e) => [e.id, e.data.title]));

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  const lang = nav.find((l) => l.language === (route.locale ?? 'en')) ?? nav[0];
  const links: SidebarLink[] = [];
  route.sidebar = lang.tabs.flatMap((t) => t.groups).map((g): SidebarEntry => ({
    type: 'group',
    label: g.group,
    collapsed: false,
    badge: undefined,
    entries: g.pages.map(pageId).map((id) => {
      const link: SidebarLink = { type: 'link', label: titles.get(id) ?? id, href: `/${id}/`, isCurrent: id === route.id, badge: undefined, attrs: {} };
      links.push(link);
      return link;
    }),
  }));
  const i = links.findIndex((l) => l.isCurrent);
  route.pagination = { prev: i > 0 ? links[i - 1] : undefined, next: i >= 0 ? links[i + 1] : undefined };
});
