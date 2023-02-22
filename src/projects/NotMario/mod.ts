import { Project } from "~/projects/types.ts"
import { HeroHeader } from "~/components/HeroHeader/mod.ts"
import { renderTemplateFile } from "~/util/template.ts"

export const project: Project = {
  href: "/project/notmario",
  previewAssetUrl: "/static/images/amoirio.png",
  previewCaption: "screenshot of game",
  previewType: "img",
  heading: "<s>mario</s>",
  subheading: "Playing with ECS, classic game mechanics and lore",
}

export function Page() {
  const props = {
    header: HeroHeader({
      headerHtml: `<h1>${project.heading}</h1><h2 class='uppercase'>${project.subheading}</h2>`,
      imageUrl: project.previewAssetUrl,
      filter: "opacity(0.66)"
    }),
  }
  return renderTemplateFile("./template.html", props, import.meta)
}
