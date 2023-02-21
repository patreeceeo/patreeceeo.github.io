import { renderTemplateFile, TemplateData } from "~/util/template.ts";

export interface ProjectGridItem extends TemplateData {
  href: string
  imageTitle: string
  subheading: string
  imageUrl: string
}

export interface ProjectGridProps {
  items: Array<ProjectGridItem>
}

export function Item(props: ProjectGridItem) {
  return renderTemplateFile("./item.html", props, import.meta)
}

export async function ProjectGrid (props: ProjectGridProps) {
  return renderTemplateFile("./grid.html", {
    // TODO make a helper for this pattern or support collections in templates
    items: (await Promise.all(props.items.map(Item))).join("")
  }, import.meta);
}
