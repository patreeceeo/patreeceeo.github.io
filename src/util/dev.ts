

interface Listener {
  (event: Deno.FsEvent): void
}

export async function addProjectSourceModifyListener(listener: Listener) {
  const watcher = Deno.watchFs([Deno.cwd() + "/src"], {recursive: true});
  for await (const event of watcher) {
    if(["create", "modify", "remove"].includes(event.kind)) {
      console.log(`Received ${event.kind} event for ${event.paths.join(", ")}`)
      listener(event)
    }
  }
}
