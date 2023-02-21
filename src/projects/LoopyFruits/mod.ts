
import { renderTemplateFile } from "~/util/template.ts"
import { Project } from "~/projects/types.ts"

export const project: Project = {
  href: "/project/loopyfruits",
  imageUrl: "/static/images/loopyfruits.gif",
  heading: "loopy fruits",
  subheading: "Playing with music theory, netcode and FP",
  imageTitle: "screencap"
}

export function Page() {
  return renderTemplateFile("./loopyfruits.html", project, import.meta)
}
