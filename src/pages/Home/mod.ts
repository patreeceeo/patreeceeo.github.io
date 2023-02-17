import { KindWords, KindWordsProps } from "~/components/KindWords/mod.ts";
import { renderTemplateFile } from "~/util.ts";
import { HeroHeader } from "~/components/HeroHeader/mod.ts";

const kindWords: Array<KindWordsProps> = [
  {
    photo: "images/Aidan.webp",
    name: "Aidan Caruso",
    distinction: "Software Engineer @ XREngine, formerly at Mappa Labs",
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
    distinction: "Product @ Amazon, formerly Sr SWE @ Constant Contact",
    quote: `
        <p>
        Patrick is both an incredibly skilled and intelligent engineer (not to mention person in general). He strives for high code quality and ensures the bar is held high for his teammates too. His experience and insight makes him a great addition to any team. I would happily work with Patrick again.
        </p>
    `,
    href: "https://www.linkedin.com/in/himcdavis"
  },
];

// TODO link to their websites
export async function Home () {
  return renderTemplateFile("./template.html", {
    header: HeroHeader({
      headerHtml: "<h1 class=\"color-hi\">codebaser<wbr/>.net</h1>",
      imageUrl: "/static/images/consider-lillies-bw-postur.png",
      filter: "brightness(0.75)"
    }),
    kindWords: (await Promise.all(kindWords.map(KindWords))).join("")
  }, import.meta);
}
