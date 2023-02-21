import {createHash} from "hash"
import { isFilePath, resolvePath } from "~/util.ts";
import { debounce } from "async";

interface Listener {
  (event: Deno.FsEvent): void
}

let listenerCount = 0
let fileModifiedSincePreviousCall = false

export async function addProjectSourceModifyListener(listener: Listener) {
  const watchPath = Deno.cwd() + "/src"
  const watcher = Deno.watchFs([watchPath], {recursive: true});

  const debouncedListener = debounce((event) => {
    console.log(`Received ${event.kind} event for ${event.paths.join(", ")}`)
    listener(event)
  }, 200)

  listenerCount++
  console.log(`Starting listener #${listenerCount} for ${watchPath}`)

  for await (const event of watcher) {
    if(["create", "modify", "remove"].includes(event.kind)) {
      if(["create", "modify"].includes(event.kind)) {
        for(const path of event.paths) {
          if(await isFilePath(path)) {
            fileModifiedSincePreviousCall = true
            await updateContentHash(path)
          }
        }
      }
    }
    if(fileModifiedSincePreviousCall && Date.now()) {
      debouncedListener(event)
    }
    fileModifiedSincePreviousCall = false
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
