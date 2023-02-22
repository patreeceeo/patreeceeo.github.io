import { KindWords, KindWordsProps } from "~/components/KindWords/mod.ts";
import { renderTemplateFile, useStyleSheet } from "~/util.ts";
import { HeroHeader } from "~/components/HeroHeader/mod.ts";
import { ProjectGrid, ProjectGridProps } from "~/components/ProjectGrid/mod.ts";
import { NotMario, LoopyFruits } from "~/projects/mod.ts";

const kindWords: Array<KindWordsProps> = [
  {
    photo: "images/Aidan.webp",
    name: "Aidan Caruso",
    distinction: "Engineer & Technical Artist, Mappa Labs, 2023",
    quote: `
        <p>
        Patrick got me on my feet with some new technologies: Code reviews from him were informative, being detail-oriented but without missing the bigger picture, which really optimized what I had wrote. In-line with code reviews he helped set up an efficient Github workflow that streamlined our development process. All around, he was a substantial help to both myself and our project.
        </p>
    `,
    href: "https://lonedevr.com/"
  },
  {
    photo: "images/MikeDavis.jpeg",
    name: "Mike Davis",
    distinction: "Senior Engineer, Constant Contact, 2014",
    quote: `
        <p>
        Patrick is both an incredibly skilled and intelligent engineer (not to mention person in general). He strives for high code quality and ensures the bar is held high for his teammates too. His experience and insight makes him a great addition to any team. I would happily work with Patrick again.
        </p>
    `,
    href: "https://www.linkedin.com/in/himcdavis"
  },
];

export const projectsGridProps: ProjectGridProps = {
  items: [
    NotMario.project,
    LoopyFruits.project
  ],
}

useStyleSheet('./style.css', import.meta)

export async function Home () {
  return renderTemplateFile("./template.html", {
    header: HeroHeader({
      headerHtml: "<h1 class=\"color-hi\">codebaser<wbr/>.net</h1>",
      imageUrl: "/static/images/consider-lillies-bw-postur.png",
      filter: "brightness(0.75)"
    }),
    kindWords: (await Promise.all(kindWords.map(KindWords))).join(""),
    projects: ProjectGrid(projectsGridProps)
  }, import.meta);
}
