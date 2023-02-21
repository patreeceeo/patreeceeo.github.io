import { renderTemplateFile } from "~/util/template.ts";
import { Project } from "~/projects/types.ts";

export interface ProjectGridProps {
  items: Array<Project>
}

export function Item(props: Project) {
  return renderTemplateFile("./item.html", props, import.meta)
}

export async function ProjectGrid (props: ProjectGridProps) {
  return renderTemplateFile("./grid.html", {
    // TODO make a helper for this pattern or support collections in templates
    items: (await Promise.all(props.items.map(Item))).join("")
  }, import.meta);
}