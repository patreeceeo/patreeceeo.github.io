// Based on and inspired by https://github.com/matthewharwood/deno-preact

import {
    ensureDir,
    copy as _copy,
} from "fs";
import {getStaticTargets, renderTemplate, loadModule} from '~/util.ts';

const importMeta = import.meta


const pwd = Deno.cwd()
const DIST_DIR = `${pwd}/docs`;

const getStandardTitle = (pageTitle: string) => `${pageTitle} - Patrick Canfield`


export async function render() {
  await ensureDir(DIST_DIR);
  await ensureDir(`${DIST_DIR}/static`);
  await ensureDir(`${DIST_DIR}/scripts`);
  await copy(`${pwd}/src/fonts`, `${DIST_DIR}/static/fonts`);
  await copy(`${pwd}/src/styles`, `${DIST_DIR}/static/styles`);
  await copy(`${pwd}/src/images`, `${DIST_DIR}/static/images`);
  await copy(`${pwd}/scripts/server.ts`, `${DIST_DIR}/scripts/server.ts`);
  await copy(`${pwd}/import_map.json`, `${DIST_DIR}/import_map.json`);

  const documentTemplate = await Deno.readTextFile(`${pwd}/src/html/document.html`)

  const {Home} = await loadModule("~/pages/Home/mod.ts", importMeta)
  const Posts = await loadModule('~/posts/mod.ts', importMeta)
  const Projects = await loadModule('~/projects/mod.ts', importMeta)
  const {NavBar} = await loadModule("~/components/NavBar/mod.ts", importMeta)

  const nav = await NavBar()
  console.log({nav})

  const pages = [
    {filePath: 'index', content: await renderTemplate(documentTemplate, {title: getStandardTitle("home"), content: Home(), nav})},
    {filePath: Posts.Deno.post.href, content: await renderTemplate(documentTemplate, {title: getStandardTitle("Deno"), content: Posts.Deno.Post(), nav})},
    {filePath: Posts.PersistHttp.post.href, content: await renderTemplate(documentTemplate, {title: getStandardTitle("Persistent HTTP"), content: Posts.PersistHttp.Post(), nav})},
    {filePath: Projects.NotMario.project.href, content: await renderTemplate(documentTemplate, {title: getStandardTitle("Not Mario"), content: Projects.NotMario.Page(), nav})},
    {filePath: Projects.LoopyFruits.project.href, content: await renderTemplate(documentTemplate, {title: getStandardTitle("Loopy Fruits"), content: Projects.LoopyFruits.Page(), nav})},
  ];

  for (const target of getStaticTargets()) {
    await copy(target.src, `${DIST_DIR}${target.uri}`)
  }

  for await (const p of pages) {
    if (p.filePath === 'index') {
      await write(`${DIST_DIR}/index.html`, p.content);
    } else {
      const deepDistDir = `${DIST_DIR}/${p.filePath}`;
      await ensureDir(deepDistDir);
      await write(`${deepDistDir}/index.html`, p.content);
    }
  }


  const compileProcess = Deno.run({
    cmd: ["deno", "bundle", "./src/client/mod.ts", "./docs/static/client.js"]
  })
  const compileStatus = await compileProcess.status()

  if(!compileStatus.success) {
    console.log("Failed to compile client. Exit status:", compileStatus.code, "output:", compileProcess.stderr)
  }
}

async function copy(from: string, to: string) {
  console.log(`Copy ${from} to ${to}`)
  await _copy(from, to, {overwrite: true});
}

async function write(path: string, content: string) {
  console.log(`Render ${path}`)
  await Deno.writeTextFile(path, content);
}
