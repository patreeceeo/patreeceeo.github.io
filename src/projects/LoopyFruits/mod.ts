
import { renderTemplateFile } from "~/util/template.ts"
import { Project } from "~/projects/types.ts"

export const project: Project = {
  href: "/project/loopyfruits",
  previewAssetUrl: "/static/images/loopyfruits.mp4",
  previewCaption: "screencap",
  previewType: "video",
  heading: "loopy fruits",
  subheading: "Playing with music theory, netcode and FP",
}

export function Page() {
  return renderTemplateFile("./loopyfruits.html", project, import.meta)
}
