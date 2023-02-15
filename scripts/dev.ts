#!/usr/bin/env -S deno run --allow-write --allow-read --allow-run --allow-env

import { render } from "~/render.ts";

await render()

const server = Deno.run({
  cmd: ["deno", "run", "--allow-read", "--allow-net", "--allow-env", "--allow-write","--allow-run", "./scripts/server.ts", "/docs"],
  env: {
    ENV: "dev"
  }
})
await server.status()
