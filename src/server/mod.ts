import { serve } from "http";
import { extname } from "path";
import { contentType as getContentType } from "media_types";

const ROOT = `${Deno.cwd()}${Deno.args[0] || ""}`;
const STATIC_PATH = "/static";
let indexHtml = await Deno.readFile(`${ROOT}/index.html`);

const notFoundHtml = "404: Not found";

export async function start() {
  let devSocket: WebSocket
  serve(async (request) => {
    const url = new URL(request.url);
    const assetPath = `${ROOT}${url.pathname}`;
    const assetContentType = getContentType(extname(url.pathname));
    const htmlPath = `${ROOT}${url.pathname}/index.html`;
    if (url.pathname === "/") {
      return htmlResponse(indexHtml);
    }

    // TODO isDev fn
    if (Deno.env.get("ENV") === "dev" && url.pathname === "/devSocket") {
      console.log("devSocket requested!")
      const {socket, response} = Deno.upgradeWebSocket(request)
      socket.onopen = () => {
        console.log("devSocket open!")
      }
      devSocket = socket
      return response
    }

    if (
      url.pathname.startsWith(STATIC_PATH) &&
      (await isFile(assetPath)) &&
      assetContentType
    ) {
      const content = await Deno.readFile(assetPath);
      return new Response(content, {
        headers: {
          "content-type": assetContentType,
        },
      });
    }

    if (await isFile(htmlPath)) {
      const html = await Deno.readFile(htmlPath);
      return htmlResponse(html);
    }

    return htmlResponse(notFoundHtml);
  });

  if (Deno.env.get("ENV") === "dev") {

    const { addProjectSourceModifyListener } = await import("~/util.ts")

    addProjectSourceModifyListener(async () => {
      const { render } = await import("~/render.ts");
      await render()

      indexHtml = await Deno.readFile(`${ROOT}/index.html`);

      if(devSocket?.readyState === devSocket?.OPEN) {
        devSocket.send(JSON.stringify({type: "resourceUpdate"}))
      }
    })
  }
}

async function isFile(path: string) {
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
