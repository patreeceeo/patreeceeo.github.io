import { LinkStruct, _getStyleSheets } from "~/internal/build_state.ts"
import { readTextFileFromModule } from "~/util.ts"

const templateSlotRE = /\$\{(.*?)\}/g
const templateBranchStartRE = /^\s*<!-- IF (.*?) -->$/gm
const templateBranchEndRE = /^\s*<!-- FI (.*?) -->$/gm

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
  return evaluateSlots(evaluateBranches(template, resolvedData), resolvedData)
}

export async function renderTemplateFile(path: string, data: AsyncTemplateData, importMeta: ImportMeta) {
  const template = await readTextFileFromModule(path, importMeta);
  return await renderTemplate(template, data)
}

function evaluateBranches(template: string, data: TemplateData) {
  const branches = findBranches(template)
  const lines = template.split(/\r\n?|\n/)
  for(const [key, branch] of Object.entries(branches)) {
    if(!data[key]) {
      lines.splice(branch.start, branch.end - branch.start)
    }
  }
  return lines.join("\n")
}

function findBranches(template: string) {
  const result: Record<string, {start: number, end: number}> = {}
  for(const [lineIndex, line] of template.split(/\r\n?|\n/).entries()) {
    const starts = templateBranchStartRE.exec(line)
    const ends = templateBranchEndRE.exec(line)
    if(starts) {
      result[starts![1]] = {start: lineIndex, end: Infinity}
    }
    if(ends) {
      result[ends![1]].end = lineIndex
    }
  }
  return result
}

function evaluateSlots(template: string, data: TemplateData) {
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

