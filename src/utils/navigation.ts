import type {CollectionEntry} from "astro:content";

export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  imageSrc?: string;
}


export async function getNavigationItems(portfolio: CollectionEntry<"portfolio">[]): Promise<NavigationItem[]> {
  const items = portfolio.map(item => ({
    id: item.slug,
    title: item.data.title,
    href: `/#${item.slug}`,
    imageSrc: item.data.image.src
  }));

  items.push({
    id: "blog",
    title: "Blog",
    href: "/blog",
  });

  items.push({
    id: "resume",
    title: "Resumé",
    href: "/resume.pdf",
  });

  return items;
}
