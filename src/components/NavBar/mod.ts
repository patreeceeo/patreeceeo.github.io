import { renderTemplateFile } from "~/util/template.ts";
import { useStyleSheet } from "~/util.ts";

interface Link {
  href: string,
  children: string
}

export interface NavBarProps {
  links: Array<Link>
}

useStyleSheet('./NavBar.css', import.meta)

export function NavBar () {
  const props: NavBarProps = {
    links: [
      {href:"", children: "home"},
      {href:"", children: "blog"},
      {href:"", children: "work"},
      {href:"", children: "connect"},
    ]
  }
  return renderTemplateFile("./NavBar.html", {
    links: props.links
  }, import.meta);
}
