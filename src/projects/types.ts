import { TemplateData } from "~/util/template.ts"

export interface Project extends TemplateData {
  href: string
  heading: string
  subheading: string
  imageTitle: string
  imageUrl: string
}
