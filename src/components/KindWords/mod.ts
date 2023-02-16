import { renderTemplateFile, TemplateData, useStyleSheet } from "~/util.ts";

export interface KindWordsProps extends TemplateData {
  photo: string;
  name: string;
  distinction: string;
  quote: string;
  href: string;
}

export const KindWords = (props: KindWordsProps) => {
  useStyleSheet("./style.css", import.meta)
  return renderTemplateFile("./template.html", props, import.meta);
};
