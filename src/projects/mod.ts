import { renderTemplateFile, TemplateData } from "~/util/template.ts"
import { ProjectGridProps } from "~/components/ProjectGrid/mod.ts"
import { HeroHeader } from "~/components/HeroHeader/mod.ts"


export const NotMario = {
  Project: NotMarioProject,
  imageUrl: "/static/images/amoirio.png",
  heading: "<s>mario</s>",
  subheading: "Playing with ECS, classic game mechanics and lore",
}

function NotMarioProject() {
  const props = {
    header: HeroHeader({
      headerHtml: `<h1>${NotMario.heading}</h1><h2 class='uppercase'>${NotMario.subheading}</h2>`,
      imageUrl: NotMario.imageUrl,
      filter: "opacity(0.66)"
    }),
  }
  return renderTemplateFile("./notmario.html", props, import.meta)
}


export const LoopyFruits = {
  Project: LoopyFruitsProject,
  imageUrl: "/static/images/loopyfruits.gif",
  heading: "loopy fruits",
  subheading: "Playing with music theory, netcode and FP",
}

function LoopyFruitsProject() {
  return renderTemplateFile("./loopyfruits.html", projectsData.items[1], import.meta)
}

export const projectsData: ProjectGridProps = {
  items: [
    {
      href: "/project/notmario",
      imageUrl: NotMario.imageUrl,
      heading: NotMario.heading,
      subheading: NotMario.subheading,
      imageTitle: "screenshot of game"
    },
    {
      href: "/project/loopyfruits",
      imageUrl: LoopyFruits.imageUrl,
      heading: LoopyFruits.heading,
      subheading: LoopyFruits.subheading,
      imageTitle: "screencap"
    }
  ],
}
