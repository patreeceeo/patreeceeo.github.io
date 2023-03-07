import { KindWords, KindWordsProps } from "~/components/KindWords/mod.ts";
import { renderTemplateFile, useStyleSheet } from "~/util.ts";
import { ProjectGrid, ProjectGridProps } from "~/components/ProjectGrid/mod.ts";
import { NotMario, LoopyFruits } from "~/projects/mod.ts";
import * as Posts from "~/posts/mod.ts";

const kindWords: Array<KindWordsProps> = [
  {
    photo: 'images/liam.norris.jpg',
    name: 'Liam Norris',
    distinction: 'Senior Software Engineer',
    quote: `
      <p>
      Patrick is a master across a wide range of full-stack frameworks. His focus and attention to detail while we worked together at Synack, Inc were incredibly noteworthy. As early employees there, we built much of the company’s nascent functionality that the founders have since used to raise >$100M of venture capital funding with. The depth of Patrick’s front end (UI/UX) expertise is driven not only by the fearlessness that he dives into unfamiliar technologies with but also his talent as an illustrator. Pay attention to what Patrick has to say: he is a calming voice of sharp intellect.
    </p>
        `,
    href: "http://www.thoughtcodex.com/",

  },
  {
    photo: "images/Aidan.webp",
    name: "Aidan Caruso",
    distinction: "Engineer & Technical Artist",
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
    distinction: "Technical Product Leader & Entrepreneur",
    quote: `
        <p>
        Patrick is both an incredibly skilled and intelligent engineer (not to mention person in general). He strives for high code quality and ensures the bar is held high for his teammates too. His experience and insight makes him a great addition to any team. I would happily work with Patrick again.
        </p>
    `,
    href: "https://www.linkedin.com/in/himcdavis"
  },
];

export const postGridProps: ProjectGridProps = {
  items: [
    Posts.Deno.post,
    Posts.PersistHttp.post
  ],
}

export const projectsGridProps: ProjectGridProps = {
  items: [
    NotMario.project,
    LoopyFruits.project
  ],
}

useStyleSheet('./style.css', import.meta)

export async function Home () {
  return renderTemplateFile("./template.html", {
    kindWords: (await Promise.all(kindWords.map(KindWords))).join(""),
    posts: ProjectGrid(postGridProps),
    projects: ProjectGrid(projectsGridProps)
  }, import.meta);
}
