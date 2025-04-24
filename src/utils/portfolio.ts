import { getCollection } from 'astro:content';

export async function getPortfolio() {
  return await getCollection('portfolio');
}
