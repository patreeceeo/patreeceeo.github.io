
import { readTextFileFromModule } from "~/util.ts";
import { HeroHeader } from "~/components/HeroHeader/mod.ts";
import { renderTemplate } from "~/util/template.ts";
import { Project } from "~/projects/types.ts";

export const post: Project = {
  href: 'post/persistent_http',
  heading: "Smelling the Roses",
  subheading: "Using persistent HTTP connections for async page updates",
  previewCaption: "A lazy Python curled around a computer",
  previewAssetUrl: "/static/images/smelling_roses.png",
  previewType: "img"
}

const template = await readTextFileFromModule('./post.html', import.meta)
export const Post = () => {
  return renderTemplate(template, {
    header: HeroHeader({
      imageUrl: post.previewAssetUrl,
      headerHtml: `<h1>${post.heading}</h1><h2>${post.subheading}</h2>`,
      filter: "sepia(1) opacity(0.3)"
    })
  })
};
