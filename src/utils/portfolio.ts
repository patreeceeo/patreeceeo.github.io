import { getCollection } from 'astro:content';

const maxSortOrder = Infinity;

export async function getPortfolio() {
  const items = await getCollection('portfolio');
  items.sort((a, b) => {
    return (a.data.sortOrder ?? maxSortOrder) - (b.data.sortOrder ?? maxSortOrder);
  });
  return items;
}

export async function getPortfolioHighlights() {
  const items = await getPortfolio();
  return items.filter((item) => {
    return item.data.sortOrder !== undefined;
  });
}
