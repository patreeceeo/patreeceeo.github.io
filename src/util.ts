import htm from "htm";
import { relative, SEP } from "path";
import { h } from "preact";
import { VNode, ComponentType } from "types/preact";
export { renderTemplate, renderTemplateFile } from "~/util/template.ts";
export type { TemplateData } from "~/util/template.ts";
export {
  _useStyleSheet as useStyleSheet,
  _getStaticTargets as getStaticTargets,
} from "~/internal/build_state.ts";
export { addProjectSourceModifyListener, loadModule } from "~/util/dev.ts";

export const htmPreact = htm.bind(h) as (
  strings: TemplateStringsArray,
  ...values: Array<ComponentType>
) => VNode;

export function resolvePath(relativePath: string, moduleMeta: ImportMeta) {
  return new URL(moduleMeta.resolve(relativePath)).pathname;
}

export function getProjectRelativePath(absPath: string) {
  return relative(Deno.cwd(), absPath);
}

export function getStaticUriForSource(
  absPath: string,
  _assetType: "stylesheet"
) {
  const relPath = getProjectRelativePath(absPath);
  return `/static/styles/${relPath.replaceAll(SEP, "-slash-")}`;
}

export function readTextFileFromModule(
  importSpecifier: string,
  moduleMeta: ImportMeta
) {
  const resolvedPath = resolvePath(importSpecifier, moduleMeta);
  return Deno.readTextFile(resolvedPath);
}

export function escapeHtmlString(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("'", "&#39;")
    .replaceAll('"', "&quot;");
}

export async function isFilePath(path: string) {
  try {
    const info = await Deno.lstat(path);
    return info.isFile;
  } catch {
    return false;
  }
}
