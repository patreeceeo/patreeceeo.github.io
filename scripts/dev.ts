#!/usr/bin/env -S deno run --allow-write --allow-read --allow-run --allow-env

const process = Deno.run({
  cmd: ["deno", "run", "--allow-read", "--allow-net", "--allow-env", "--allow-write", "--allow-run", "./scripts/server.ts", "/docs"],
  env: {
    ENV: "dev"
  },
});
await process.status()

