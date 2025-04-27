export function getAssociativeCollection<Item extends {id: string}>(collection: Item[]) {
  const items = Object.fromEntries(
    collection.map((item) => [item.id, item])
  );

  return items;
}

