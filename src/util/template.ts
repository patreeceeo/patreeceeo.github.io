import { LinkStruct, _getStyleSheets } from "~/internal/build_state.ts";
import { readTextFileFromModule, resolvePath } from "~/util.ts";
import { generateTemplateCode } from "~/util/template_codegen.ts";

export type TemplateValue = ReturnType<typeof JSON.parse>;
export type AsyncTemplateData = Record<
  string,
  Promise<TemplateValue> | TemplateValue
>;
export type TemplateData = Record<string, TemplateValue>;
export type TemplateDataCollection = Array<TemplateValue>;

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
  const jsString = generateTemplateCode(template, resolvedData);
  console.log(jsString);
  return eval(jsString);
}

let _currentTemplateFile: string | null = null;
export async function renderTemplateFile(
  path: string,
  data: AsyncTemplateData,
  importMeta: ImportMeta
) {
  const template = await readTextFileFromModule(path, importMeta);
  // TODO
  _currentTemplateFile = resolvePath(path, importMeta);
  const result = await renderTemplate(template, data);
  _currentTemplateFile = null;
  return result;
}


function renderLinks(links: Array<LinkStruct>) {
  return links
    .map(({ rel, href }) => {
      return `<link rel="${rel}" href="${href}">`;
    })
    .join("\n");
}
