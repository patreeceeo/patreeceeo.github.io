import { renderTemplateFile } from "~/util/template.ts";
import { Project } from "~/projects/types.ts";
import { useStyleSheet } from "~/util.ts";

export interface ProjectGridProps {
  items: Array<Project>
}

useStyleSheet('./style.css', import.meta)

export function Item(props: Project) {
  return Object.assign(props, {
    get img() {
      return props.previewType === "img"
    },
    get video() {
      return props.previewType === "video"
    }
  })
}

export function ProjectGrid (props: ProjectGridProps) {
  return renderTemplateFile("./grid.html", {
    // TODO make a helper for this pattern or support collections in templates
    items: props.items.map(Item)
  }, import.meta);
}
