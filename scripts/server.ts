#!/usr/bin/env -S deno run --allow-read --allow-net --allow-env --allow-write --allow-run

import { serve } from "http";
import { extname } from "path";
import { contentType as getContentType } from "media_types";

const ROOT = `${Deno.cwd()}${Deno.args[0] || ""}`;
const STATIC_PATH = "/static";
let indexHtml = await Deno.readFile(`${ROOT}/index.html`);

const notFoundHtml = "404: Not found :(";

let liveSocket: WebSocket;
if (Deno.env.get("ENV") === "dev") {
  const { addProjectSourceModifyListener, loadModule } = await import("~/util.ts");

  addProjectSourceModifyListener(async () => {
    // TODO debounce and other optimizations
    const { render } = await loadModule(`~/render.ts`, import.meta);
    try {
      await render();
    } catch (e) {
      console.error(`Caught error while rendering ${e}`)
    }

    indexHtml = await Deno.readFile(`${ROOT}/index.html`);

    if (liveSocket?.readyState === liveSocket?.OPEN) {
      liveSocket.send(JSON.stringify({ type: "resourceUpdate" }));
    }
  });
}

await serve(async (request) => {
  const url = new URL(request.url);
  const assetPath = `${ROOT}${url.pathname}`;
  const assetContentType = getContentType(extname(url.pathname));
  const htmlPath = `${ROOT}${url.pathname}/index.html`;
  if (url.pathname === "/") {
    return htmlResponse(indexHtml);
  }

  if (url.pathname === "/liveSocket") {
    console.log("liveSocket requested!");
    const { socket, response } = Deno.upgradeWebSocket(request);
    socket.onopen = () => {
      console.log("liveSocket open!");
    };
    liveSocket = socket;
    return response;
  }

  if (url.pathname === "/robots.txt") {
    return new Response(`User-agent: *
Allow: /
`);
  }

  if (
    url.pathname.startsWith(STATIC_PATH) &&
    (await isFilePath(assetPath)) &&
    assetContentType
  ) {
    const content = await Deno.readFile(assetPath);
    return new Response(content, {
      headers: {
        "content-type": assetContentType,
      },
    });
  }

  if (await isFilePath(htmlPath)) {
    const html = await Deno.readFile(htmlPath);
    return htmlResponse(html);
  }

  return htmlResponse(notFoundHtml);
});

// TODO DRY once it's possible to import internally defined stuff in Deno Deploy
async function isFilePath(path: string) {
  try {
    const info = await Deno.lstat(path);
    return info.isFile;
  } catch {
    return false;
  }
}

function htmlResponse(html: BodyInit) {
  return new Response(html, {
    headers: {
      "content-type": "text/html",
    },
  });
}
