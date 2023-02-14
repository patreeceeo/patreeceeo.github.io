#!/usr/bin/env -S deno run --allow-read --allow-net

import { serve } from "http";
import { extname } from "path";
import { contentType as getContentType } from "media_types"

const ROOT = `${Deno.cwd()}/docs`
const STATIC_PATH = '/static'
const indexHtml = await Deno.readFile(`${ROOT}/index.html`);

const notFoundHtml = "404: Not found"

serve(async (request) => {
  const url = new URL(request.url)
  const assetPath = `${ROOT}${url.pathname}`
  const assetContentType = getContentType(extname(url.pathname))
  const htmlPath = `${ROOT}${url.pathname}/index.html`
  if(url.pathname === "/") {
    return htmlResponse(indexHtml)
  }

  if(url.pathname.startsWith(STATIC_PATH) && await isFile(assetPath) && assetContentType) {
    const content = await Deno.readFile(assetPath)
    return new Response(content, {
      headers: {
        "content-type": assetContentType
      }
    })
  }

  if(await isFile(htmlPath)) {
    const html = await Deno.readFile(htmlPath)
    return htmlResponse(html)
  }

  return htmlResponse(notFoundHtml)
});

async function isFile(path: string) {
  try {
  const info = await Deno.lstat(path)
  return info.isFile
  } catch {
    return false
  }
}

function htmlResponse(html: BodyInit) {
  return new Response(html, {
    headers: {
      "content-type": "text/html",
    },
  });
}
