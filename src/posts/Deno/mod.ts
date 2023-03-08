import { readTextFileFromModule, renderTemplate } from "~/util.ts";
import { HeroHeader } from "~/components/HeroHeader/mod.ts";
import { Project } from "~/projects/types.ts";

export const post: Project = {
  href: "/post/deno",
  heading: "Unearthing Deno",
  subheading: "Yet another article on the new kid on the JavaScript runtime block",
  previewCaption: "Deno reading deno.news",
  previewAssetUrl: "/static/images/deno_news.png",
  previewType: "img"
}

const template = await readTextFileFromModule('./post.html', import.meta)
export const Post = () => {
  return renderTemplate(template, {
    header: HeroHeader({
      imageUrl: post.previewAssetUrl,
      headerHtml: `
        <h1>${post.heading}</h1>
        <h2>${post.subheading}</h2>
        `,
      imageCaption: "Deno reading deno.news by <a href=\"#Duncan\">Duncan</a>. <a href=\"https://deno.land/artwork\">More fantastic Deno artwork</a>",
      filter: "opacity(0.5)"
    })
  })
};
