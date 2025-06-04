// This schema defines the structure for portfolio content items.
import { z, defineCollection } from 'astro:content';

const portfolio = defineCollection({
  schema: ({image}) => z.object({
    title: z.string(),
    image: image(),
    sortOrder: z.number().optional(),
  }),
});

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
  }),
});

export const collections = { portfolio, blog };
