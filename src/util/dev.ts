import {createHash} from "hash"
import { resolvePath } from "../util.ts";

interface Listener {
  (event: Deno.FsEvent): void
}

export async function addProjectSourceModifyListener(listener: Listener) {
  const watchPath = Deno.cwd() + "/src"
  const watcher = Deno.watchFs([watchPath], {recursive: true});
  for await (const event of watcher) {
    if(["create", "modify", "remove"].includes(event.kind)) {
      console.log(`Received ${event.kind} event for ${event.paths.join(", ")}`)
      for(const path of event.paths) {
        await updateContentHash(path)
      }
      listener(event)
    }
  }
}

const contentHashes: Record<string, string> = {}
async function updateContentHash(path: string) {
  const hasher = createHash("md5")
  const buf = await Deno.readFile(path)
  hasher.update(buf)
  const hash = hasher.toString("hex")
  contentHashes[path] = hash
}

export function loadModule(spec: string, importMeta: ImportMeta) {
  const path = resolvePath(spec, importMeta)
  const contentHash = contentHashes[path]
  return import(`${spec}?hash=${contentHash}`)
}
