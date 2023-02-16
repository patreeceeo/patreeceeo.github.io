import { LinkStruct, _getStyleSheets } from "../internal/build_state.ts"
import { readTextFileFromModule } from "../util.ts"

const templateSlotRE = /\$\{(.*?)\}/g

export type TemplateValue = string | number
export type AsyncTemplateData = Record<string, Promise<TemplateValue> | TemplateValue>
export type TemplateData = Record<string, TemplateValue>

export const SPECIAL_SLOT_SYTLESHEETS = Symbol("StyleSheets")

export async function renderTemplate(template: string, data: AsyncTemplateData) {
  const derivedData = {
    $styleSheetLinks: renderLinks(_getStyleSheets())
  }
  const resolvedData: TemplateData = {}
  for(const key in data) {
    resolvedData[key] = await data[key]
  }
  Object.assign(resolvedData, derivedData)
  return renderTemplateBasic(template, resolvedData)
}

export async function renderTemplateFile(path: string, data: AsyncTemplateData, importMeta: ImportMeta) {
  const template = await readTextFileFromModule(path, importMeta);
  return await renderTemplate(template, data)
}

function renderTemplateBasic(template: string, data: TemplateData) {
  return template.replaceAll(templateSlotRE, replaceTemplateSlot)

  function replaceTemplateSlot(_: string, slotName: string) {
    return data[slotName]?.toString()
  }
}

function renderLinks(links: Array<LinkStruct>) {
  return links.map(({rel, href}) => {
    return `<link rel="${rel}" href="${href}">`
  }).join("\n")
}

