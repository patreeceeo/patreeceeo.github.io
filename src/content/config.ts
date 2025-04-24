// This schema defines the structure for portfolio content items.
import { z, defineCollection } from 'astro:content';

const portfolio = defineCollection({
  schema: z.object({
    title: z.string(),
    image: z.string(),
    discussion: z.string(),
  }),
});

export const collections = { portfolio };
