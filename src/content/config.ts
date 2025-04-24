// This schema defines the structure for portfolio content items.
import { z, defineCollection } from 'astro:content';

const portfolio = defineCollection({
  schema: ({image}) => z.object({
    title: z.string(),
    image: image(),
    sortOrder: z.number().optional(),
  }),
});

export const collections = { portfolio };
