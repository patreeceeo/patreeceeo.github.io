import { readTextFileFromModule, renderTemplate } from "~/util.ts";
import { HeroHeader } from "~/components/HeroHeader/mod.ts";

const template = await readTextFileFromModule('./post.html', import.meta)
export const Post = () => {
  return renderTemplate(template, {
    header: HeroHeader({
      imageUrl: "/static/images/deno_news.png",
      headerHtml: `
        <h1>Discovering Deno</h1>
        `,
      meta: `
        <p>last updated
        <time datetime="2023-02-09">2023, February 9th</time>
        </p>
        `,
      height: "18rem",
      imageCaption: "Deno reading deno.news by <a href=\"#Duncan\">Duncan</a>. <a href=\"https://deno.land/artwork\">More fantastic Deno artwork</a>"
    })
  })
};
