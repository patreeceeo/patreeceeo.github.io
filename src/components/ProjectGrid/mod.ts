import { renderTemplateFile } from "~/util/template.ts";
import { Project } from "~/projects/types.ts";
import { useStyleSheet } from "~/util.ts";

export interface ProjectGridProps {
  items: Array<Project>
}

useStyleSheet('./style.css', import.meta)

export function ProjectGrid (props: ProjectGridProps) {
  return renderTemplateFile("./grid.html", {
    items: props.items
  }, import.meta);
}
