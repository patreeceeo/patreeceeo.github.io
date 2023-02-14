#!/usr/bin/env -S deno run --allow-write --allow-read --allow-run
// Based on and inspired by https://github.com/matthewharwood/deno-preact

import { render } from "~/render.ts";

await render()

Deno.run({
  cmd: ["deno", "run", "--allow-read", "--allow-net", "./scripts/prod.ts"]
});

// Clever ways to refresh a chrome browser using deno?
// Listen https://chromedevtools.github.io/devtools-protocol/1-2/Page/#method-reload
// TODO (mh) make debounce this event from building
// TODO (mh) Deno.kill all previous Deno.run commands https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts#Deno.signal
const watcher = Deno.watchFs([Deno.cwd() + "/src"], {recursive: true});
for await (const event of watcher) {
  if(["create", "modify", "remove"].includes(event.kind)) {
    console.log(`Received ${event.kind} event for ${event.paths.join(", ")}`)
    Deno.run({
      cmd: ["deno", "run", "--allow-read", "--allow-write", "./scripts/render.ts"]
    });
  }
}

