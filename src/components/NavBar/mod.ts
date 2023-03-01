import { renderTemplateFile } from "~/util/template.ts";
import { useStyleSheet } from "~/util.ts";

interface NavItem {
  html: string;
}

export interface NavBarProps {
  links: Array<NavItem>;
}

useStyleSheet("./NavBar.css", import.meta);

const linkedIn = {
  style: `
  height: 100%;
  width: 1em;
  `,
  href: 'https://www.linkedin.com/in/patrick-lee-canfield/'
};

export function NavBar() {
  const props: NavBarProps = {
    links: [
      { html: `<a href="/">home</a>` },
      { html: `<a href="/#blog">blog</a>` },
      { html: `<a href="/#projects">projects</a>` },
      { html: `<a href="/#refs">refs</a>` },
      { html: `<a href="${linkedIn.href}"><img src="/static/images/linkedin.svg" alt="linkedin logo" title="my linkedin" style="${linkedIn.style}"></a>` },
    ],
  };
  return renderTemplateFile("./NavBar.html", props, import.meta);
}
