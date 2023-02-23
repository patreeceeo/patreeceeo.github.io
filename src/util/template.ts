import { LinkStruct, _getStyleSheets } from "~/internal/build_state.ts";
import { readTextFileFromModule, resolvePath } from "~/util.ts";

const slotRE = /\$\{(.*?)\}/g;
const loopElementSlotRE = /\$\{itemOf: (.*?)\}/g;
const multStartRE = /^\s*<!--\s*\*\:(.*?)\s*-->$/g;
const multEndRE = /^\s*<!--\s*\/\:(.*?)\s*-->$/g;

export type TemplateValueScalar = string | number;
export type TemplateValue = TemplateValueScalar | Array<TemplateValueScalar>;
export type AsyncTemplateData = Record<
  string,
  Promise<TemplateValue> | TemplateValue
>;
export type TemplateData = Record<string, TemplateValue>;

export const SPECIAL_SLOT_SYTLESHEETS = Symbol("StyleSheets");

export async function renderTemplate(
  template: string,
  data: AsyncTemplateData
) {
  const derivedData = {
    $styleSheetLinks: renderLinks(_getStyleSheets()),
  };
  const resolvedData: TemplateData = {};
  for (const key in data) {
    resolvedData[key] = await data[key];
  }
  Object.assign(resolvedData, derivedData);
  return evaluateSlots(evaluateBranches(template, resolvedData), resolvedData);
}

let _currentTemplateFile: string | null = null
export async function renderTemplateFile(
  path: string,
  data: AsyncTemplateData,
  importMeta: ImportMeta,
) {
  const template = await readTextFileFromModule(path, importMeta);
  // TODO
  _currentTemplateFile = resolvePath(path, importMeta)
  const result = await renderTemplate(template, data);
  _currentTemplateFile = null
  return result
}

function countLoops(expressionValue: TemplateValue | Array<TemplateValue> ): number {
  return expressionValue instanceof Array ? expressionValue.length : expressionValue ? 1 : 0
}

function evaluateBranches(template: string, data: TemplateData) {
  const branches = findBranches(template),
    linesIn = template.split(/\r\n?|\n/),
    linesOut = [] as Array<string>
  let inputIndex = 0

  while(inputIndex < linesIn.length) {
    const branch = branches.byLine[inputIndex]
    if(branch?.isStart) {
      const expressionValue = evaluateVariable(data, branch.expressionId)
      const loopMax = countLoops(expressionValue)
      const branchEnd = branches.byExpression[branch.expressionId].inst[branch.instIndex].end
      const loopBody = linesIn.slice(inputIndex + 1, branchEnd)
      if(branchEnd < Infinity) {
        linesOut.push(linesIn[inputIndex])
        for(let loopCount = 0; loopCount < loopMax; loopCount++) {
          linesOut.push(...loopBody.map((line) => evaluateLoopSlots(line, data, loopCount)))
        }
        inputIndex = branchEnd
      } else {
        throw new Error(`Template contains unterminated branch. ${_currentTemplateFile} L${inputIndex+1}: ${linesIn[inputIndex].trim()}`)
      }
    }
    linesOut.push(linesIn[inputIndex])
    inputIndex++
  }

  return linesOut.join("\n")
}

function findBranches(template: string) {
  const result = {
    byLine: [] as Array<{expressionId: string, isStart: boolean, instIndex: number}>,
    byExpression: {} as Record<string, {inst: Array<{start: number, end: number}>}>,
  }
  const stack = [] as Array<{start: number, expressionId: string, instIndex: number}>;
  for (const [lineIndex, line] of template.split(/\r\n?|\n/).entries()) {
    const starts = multStartRE.exec(line);
    multStartRE.lastIndex = 0
    const ends = multEndRE.exec(line);
    multEndRE.lastIndex = 0
    if (starts) {
      const expressionId = starts[1]
      const expressionInfo = result.byExpression[expressionId] ||= {inst: []}
      const instIndex = expressionInfo.inst.length
      result.byLine[lineIndex] = {expressionId, isStart: true, instIndex}
      expressionInfo.inst.push({ start: lineIndex, end: Infinity});
      stack.push({start: lineIndex, expressionId, instIndex});
    }
    if (ends) {
      const expressionId = ends[1]
      const pairInfo = stack.pop()
      if(pairInfo && pairInfo.expressionId === expressionId) {
        const expressionInfo = result.byExpression[expressionId] ||= {inst: []}
        const instItem = expressionInfo.inst[pairInfo?.instIndex]
        result.byLine[lineIndex] = {expressionId, isStart: false, instIndex: pairInfo.instIndex}
        instItem.end = lineIndex
      } else {
        throw new Error(`Template contains unbalanced branch. ${_currentTemplateFile} L${lineIndex+1}: ${ends[0].trim()}`)
      }
    }
  }
  return result;
}

function evaluateSlots(template: string, data: TemplateData) {
  return template.replaceAll(slotRE, replacer);

  function replacer(_: string, slotName: string) {
    return "" + evaluateVariable(data, slotName)
  }
}

function evaluateLoopSlots(template: string, data: TemplateData, loopIndex: number) {
  return template.replaceAll(loopElementSlotRE, replacer);

  function replacer(_: string, slotName: string) {
    return "" + evaluateArrayLookup(data, slotName, loopIndex)
  }
}

function evaluateVariable(context: TemplateData, varName: string) {
  if(!(varName in context)) {
    console.warn(`WARN: Template "${_currentTemplateFile}" contains unbound variable "${varName}"`)
  }
  return context[varName];
}

function evaluateArrayLookup(context: TemplateData, varName: string, index: number) {
  if(!(varName in context)) {
    console.warn(`WARN: Template "${_currentTemplateFile}" contains unbound variable "${varName}"`)
  }
  return context[varName][index]
}

function renderLinks(links: Array<LinkStruct>) {
  return links
    .map(({ rel, href }) => {
      return `<link rel="${rel}" href="${href}">`;
    })
    .join("\n");
}
