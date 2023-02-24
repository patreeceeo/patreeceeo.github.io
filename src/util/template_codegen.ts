import { TemplateData, TemplateDataCollection } from "~/util/template.ts";

const loopStartRE = /^\s*<!--\s*#map (.+?) (.*?)\s*-->$/g;
const loopEndRE = /^\s*<!--\s*\/map (.+?) (.*?)\s*-->$/g;

/* BEGIN Templates */
let $renderBody: void;
let linesOut: Array<string>;
let $context: void;
function renderTemplateTemplate() {
  $context;
  $renderBody;
  return linesOut.join("\n");
}

let $items: TemplateDataCollection;
let $loopBody: void;
function loopAppendLinesOut() {
  const __items__ = $items instanceof Array ? $items : $items ? [$items] : [];
  for (const $item of __items__) {
    $loopBody;
  }
}
function appendLinesOut(line: string) {
  linesOut.push(line);
}
/* END Templates */

export function generateTemplateCode(template: string, data: TemplateData) {
  const linesIn = template.split(/\r\n?|\n/);
  const renderBodyLines = [
    `const linesOut = []`,
    appendLinesOut.toString(),
    ...generateLines(linesIn, data),
  ];

  return renderJsIife(renderTemplateTemplate, {
    $renderBody: renderBodyLines.join(";\n"),
    $context: renderJsContext(data),
  });
}


function generateLines(linesIn: Array<string>, data: TemplateData) {
  const renderBodyLines = [];
  const loops = findLoops(linesIn);
  let lineIndex = 0;
  while (lineIndex < linesIn.length) {
    const line = linesIn[lineIndex];
    const loop = loops.byLine[lineIndex];

    renderBodyLines.push(`appendLinesOut(${renderJsString(line)})`);

    if (loop) {
      if (loop.endLineIndex < Infinity) {
        const loopBodyLength = loop.endLineIndex - lineIndex - 1;
        const loopBodyLines = linesIn.slice(lineIndex + 1, loop.endLineIndex);
        const loopBodyLinesExpanded = generateLines(loopBodyLines, data);
        const loopCode = renderJsIife(loopAppendLinesOut, {
          ...loop.identifiers,
          $loopBody: loopBodyLinesExpanded.join(";\n"),
        });
        renderBodyLines.push(loopCode);
        lineIndex += loopBodyLength;
      } else {
        throw new Error(
          `Template contains unterminated loop. L${
            lineIndex + 1
          }: ${line.trim()}`
        );
      }
    }
    lineIndex++;
  }
  return renderBodyLines;
}

function renderJs(jsTemplate: string, params: Record<string, string>) {
  const jsTemplateParamRE = /\$[^\{].+?\b/g;
  let result = jsTemplate;
  result = jsTemplate.replaceAll(jsTemplateParamRE, (paramName: string) => {
    if (params[paramName]) {
      return params[paramName];
    } else {
      throw new Error(`No replacement for js param ${paramName}`);
    }
  });
  return result;
}

function renderJsString(str: string) {
  return `\`${str.replaceAll(/`/g, "\\`").trim()}\``;
}

function renderJsIife(fn: () => void, params: Record<string, string>) {
  return `(${renderJs(fn.toString(), params)})()`;
}
function renderJsContext(context: TemplateData) {
  const linesOut: Array<string> = [];
  for (const [name, value] of Object.entries(context)) {
    linesOut.push(`const ${name} = ${JSON.stringify(value)}`);
  }
  return linesOut.join(";\n");
}


interface LoopInfo {
  identifiers: { $items: string; $item: string };
  endLineIndex: number;
}
function findLoops(templateLines: Array<string>) {
  const result = {
    byLine: [] as Array<LoopInfo>,
  };
  const stack = [] as Array<{ start: number; expressionId: string }>;
  const expressionMap = {} as Record<string, { start: number }>;
  for (const [lineIndex, line] of templateLines.entries()) {
    const starts = loopStartRE.exec(line);
    loopStartRE.lastIndex = 0;
    const ends = loopEndRE.exec(line);
    loopEndRE.lastIndex = 0;
    const [_, $items, $item] = starts || ends || [];
    const expressionId = `${$items}:${$item}`;
    if (starts) {
      result.byLine[lineIndex] = {
        identifiers: {
          $items,
          // defaults to "item" if not specified
          $item: $item ? $item : "__undefined__"
        },
        endLineIndex: Infinity,
      };
      expressionMap[expressionId] = { start: lineIndex };
      stack.push({ start: lineIndex, expressionId });
    }
    if (ends) {
      const pairInfo = stack.pop();
      if (pairInfo && pairInfo.expressionId === expressionId) {
        const start = expressionMap[expressionId].start;
        result.byLine[start].endLineIndex = lineIndex;
      } else {
        throw new Error(
          `Template contains unbalanced branch. L${
            lineIndex + 1
          }: ${line.trim()}`
        );
      }
    }
  }

  return result;
}
