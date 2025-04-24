import { type DataEntryMap } from "astro:content";

export function getAssociativeCollection<Item extends DataEntryMap[keyof DataEntryMap]>(collection: Item[]) {
  const items = Object.fromEntries(
    collection.map((item) => [item["id"], item])
  );

  return items;
}

